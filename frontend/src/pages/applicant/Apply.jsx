// ============================================================
// pages/applicant/Apply.jsx — Internship Application Form
// React Hook Form, file upload, skills tags, cover letter counter
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  MdSend, MdUploadFile, MdClose, MdAdd, MdSchool,
  MdPhone, MdWork, MdDescription,
} from 'react-icons/md';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import applicationService from '../../services/applicationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { POSITIONS } from '../../utils/constants';
import { buildFormData } from '../../utils/helpers';

const Apply = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [resumeFile, setResumeFile]   = useState(null);
  const [skills, setSkills]           = useState([]);
  const [skillInput, setSkillInput]   = useState('');
  const [resumeError, setResumeError] = useState('');

  const {
    register, handleSubmit, watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      phone:       user?.phone || '',
      university:  '',
      department:  '',
      cgpa:        '',
      position:    '',
      coverLetter: '',
    },
  });

  const coverLetterValue = watch('coverLetter', '');

  // ── Skills management ──────────────────────────────────────
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) { toast.warning('Skill already added.'); return; }
    if (skills.length >= 20) { toast.warning('Maximum 20 skills allowed.'); return; }
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput('');
  };

  const removeSkill = (skill) => setSkills((prev) => prev.filter((s) => s !== skill));

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); }
  };

  // ── Resume validation ──────────────────────────────────────
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setResumeError('Only PDF files are accepted.');
      setResumeFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File too large. Maximum size is 5MB.');
      setResumeFile(null);
      return;
    }
    setResumeError('');
    setResumeFile(file);
  };

  // ── Submit ────────────────────────────────────────────────
  const onSubmit = async (data) => {
    if (!resumeFile) { setResumeError('Resume (PDF) is required.'); return; }

    try {
      const formData = buildFormData({
        ...data,
        skills,
        resume: resumeFile,
      });

      await applicationService.create(formData);
      toast.success('Application submitted successfully! We will review it shortly.');
      navigate('/my-applications');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application.';
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Apply for Internship</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill in all required fields and upload your resume to submit your application.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-6">
          {/* ── Section 1: Contact ──────────────────────────── */}
          <Section title="Contact Information" icon={MdPhone}>
            <div>
              <label className={lbl}>Phone Number <Required /></label>
              <input type="tel" placeholder="+1 234 567 8900" className={inp(!!errors.phone)}
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: { value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, message: 'Invalid phone number' },
                })} />
              {errors.phone && <Error>{errors.phone.message}</Error>}
            </div>
          </Section>

          {/* ── Section 2: Academic ─────────────────────────── */}
          <Section title="Academic Information" icon={MdSchool}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={lbl}>University / Institution <Required /></label>
                <input type="text" placeholder="e.g. MIT" className={inp(!!errors.university)}
                  {...register('university', { required: 'University is required', maxLength: { value: 150, message: 'Too long' } })} />
                {errors.university && <Error>{errors.university.message}</Error>}
              </div>
              <div>
                <label className={lbl}>Department / Major <Required /></label>
                <input type="text" placeholder="e.g. Computer Science" className={inp(!!errors.department)}
                  {...register('department', { required: 'Department is required' })} />
                {errors.department && <Error>{errors.department.message}</Error>}
              </div>
              <div>
                <label className={lbl}>CGPA <Required /></label>
                <input type="number" step="0.01" min="0" max="4" placeholder="3.50" className={inp(!!errors.cgpa)}
                  {...register('cgpa', {
                    required: 'CGPA is required',
                    min: { value: 0, message: 'Must be ≥ 0' },
                    max: { value: 4, message: 'Must be ≤ 4.0' },
                  })} />
                {errors.cgpa && <Error>{errors.cgpa.message}</Error>}
              </div>
            </div>
          </Section>

          {/* ── Section 3: Position + Skills ────────────────── */}
          <Section title="Internship Details" icon={MdWork}>
            <div>
              <label className={lbl}>Position Applied For <Required /></label>
              <select className={inp(!!errors.position)}
                {...register('position', { required: 'Please select a position' })}>
                <option value="">-- Select a position --</option>
                {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.position && <Error>{errors.position.message}</Error>}
            </div>

            {/* Skills */}
            <div>
              <label className={lbl}>Skills <span className="text-gray-400 font-normal text-xs">(optional, up to 20)</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill and press Enter"
                  className={`${inp(false)} flex-1`}
                />
                <button type="button" onClick={addSkill}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex-shrink-0">
                  <MdAdd className="text-xl" />
                </button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30
                      text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                        <MdClose className="text-sm" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {/* ── Section 4: Cover Letter ──────────────────────── */}
          <Section title="Cover Letter" icon={MdDescription}>
            <div>
              <label className={lbl}>
                Cover Letter <Required />
                <span className={`ml-2 text-xs font-normal ${coverLetterValue.length < 100 ? 'text-red-500' : 'text-gray-400'}`}>
                  ({coverLetterValue.length}/2000 — min 100)
                </span>
              </label>
              <textarea
                rows={6}
                placeholder="Write a compelling cover letter explaining why you're interested in this internship and what makes you a great candidate..."
                className={`${inp(!!errors.coverLetter)} resize-none`}
                {...register('coverLetter', {
                  required: 'Cover letter is required',
                  minLength: { value: 100, message: 'Minimum 100 characters' },
                  maxLength: { value: 2000, message: 'Maximum 2000 characters' },
                })}
              />
              {errors.coverLetter && <Error>{errors.coverLetter.message}</Error>}
            </div>
          </Section>

          {/* ── Section 5: Resume Upload ─────────────────────── */}
          <Section title="Resume Upload" icon={MdUploadFile}>
            <div>
              <label className={lbl}>Resume (PDF only, max 5MB) <Required /></label>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer
                ${resumeError ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'}
                ${resumeFile ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                <input type="file" accept=".pdf,application/pdf" onChange={handleResumeChange}
                  className="hidden" id="resume-upload" />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <MdUploadFile className={`text-4xl mx-auto mb-2 ${resumeFile ? 'text-blue-600' : 'text-gray-400'}`} />
                  {resumeFile ? (
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-400">{resumeFile.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB · Click to change
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Click to upload your resume
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PDF only, maximum 5MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
              {resumeError && <Error>{resumeError}</Error>}
            </div>
          </Section>

          {/* Submit */}
          <div className="pt-2">
            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600
                hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
              {isSubmitting
                ? <><LoadingSpinner size="sm" color="white" /> Submitting...</>
                : <><MdSend className="text-xl" /> Submit Application</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-components
const Section = ({ title, icon: Icon, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
        <Icon className="text-blue-600 dark:text-blue-400 text-lg" />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
    </div>
    <div className="space-y-4 pl-10">{children}</div>
  </div>
);

const Required = () => <span className="text-red-500 ml-0.5">*</span>;
const Error = ({ children }) => <p className="mt-1 text-xs text-red-600 dark:text-red-400">{children}</p>;

const lbl = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
const inp = (hasError) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border transition-colors
   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
   placeholder-gray-400 dark:placeholder-gray-500
   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
   ${hasError ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'}`;

export default Apply;
