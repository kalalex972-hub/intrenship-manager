// ============================================================
// pages/public/About.jsx — About Page
// ============================================================

import { MdCode, MdStorage, MdSecurity, MdSpeed } from 'react-icons/md';

const TECH_STACK = [
  { name: 'React.js',    role: 'Frontend UI',        color: 'blue' },
  { name: 'Node.js',     role: 'Backend Runtime',    color: 'emerald' },
  { name: 'Express.js',  role: 'REST API',           color: 'gray' },
  { name: 'MongoDB',     role: 'Cloud Database',     color: 'green' },
  { name: 'Tailwind CSS','role': 'Styling',          color: 'cyan' },
  { name: 'JWT',         role: 'Authentication',     color: 'purple' },
  { name: 'Multer',      role: 'File Uploads',       color: 'orange' },
  { name: 'Chart.js',    role: 'Data Visualization', color: 'red' },
];

const colorCls = {
  blue:    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  gray:    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  green:   'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  cyan:    'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
  purple:  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  orange:  'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  red:     'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

const About = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
    {/* Hero */}
    <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About InternHub
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
          A full-stack MERN application built to simplify internship applications
          for students and management for administrators. Designed as a professional
          portfolio project demonstrating modern web development practices.
        </p>
      </div>
    </section>

    {/* Project goals */}
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: MdCode,
              title: 'Built with MERN Stack',
              desc: 'MongoDB Atlas, Express.js, React.js, and Node.js — a modern, scalable full-stack architecture with JWT authentication, role-based access control, and file upload support.',
              color: 'blue',
            },
            {
              icon: MdStorage,
              title: 'Cloud Database',
              desc: 'MongoDB Atlas provides reliable cloud storage with Mongoose ODM for schema validation, indexing, and powerful aggregation pipelines for dashboard analytics.',
              color: 'emerald',
            },
            {
              icon: MdSecurity,
              title: 'Security First',
              desc: 'Passwords hashed with bcrypt (12 rounds), JWT tokens for stateless authentication, protected routes, input validation with express-validator, and file type enforcement.',
              color: 'purple',
            },
            {
              icon: MdSpeed,
              title: 'Production Ready',
              desc: 'Optimized for deployment on Vercel (frontend) and Render (backend). Environment-based configuration, error handling, graceful shutdowns, and code splitting.',
              color: 'amber',
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4
                ${color === 'blue'    ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                ${color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' : ''}
                ${color === 'purple'  ? 'bg-purple-100 dark:bg-purple-900/30' : ''}
                ${color === 'amber'   ? 'bg-amber-100 dark:bg-amber-900/30' : ''}
              `}>
                <Icon className={`text-2xl
                  ${color === 'blue'    ? 'text-blue-600 dark:text-blue-400' : ''}
                  ${color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : ''}
                  ${color === 'purple'  ? 'text-purple-600 dark:text-purple-400' : ''}
                  ${color === 'amber'   ? 'text-amber-600 dark:text-amber-400' : ''}
                `} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Tech Stack */}
    <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
          Technology Stack
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {TECH_STACK.map(({ name, role, color }) => (
            <div
              key={name}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${colorCls[color]}`}
            >
              <span className="font-bold">{name}</span>
              <span className="opacity-60">·</span>
              <span className="opacity-80">{role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
