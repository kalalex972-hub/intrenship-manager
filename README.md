This project is a full-stack internship application management system built with the MERN stack. It is designed to help organizations manage internship recruitment in a structured and professional way. The application supports two main user roles:

- Applicants, who can register, log in, upload their resume, and submit internship applications
- Admins, who can review applications, update statuses, manage users, and view reports

The system is not just a simple form app; it is a complete role-based web platform with authentication, protected routes, file uploads, data validation, and reporting features.

## What this project is for

The main purpose of the project is to streamline the internship application process. Instead of handling applications manually through email or spreadsheets, this system gives the organization a digital workflow where:

- applicants submit their details in one place,
- resumes are uploaded securely,
- admins can review candidates efficiently,
- application progress can be tracked through statuses such as pending, reviewed, accepted, or rejected.

## Main features

### 1. User authentication and role-based access
The project includes a secure authentication system for sign-up, login, and access control. Users are assigned roles such as applicant or admin, and different pages are protected based on that role.

### 2. Applicant workflow
Applicants can:
- create an account,
- log in securely,
- upload a resume,
- fill in academic and personal details,
- submit an internship application,
- view their applications,
- edit or delete applications while they are still pending.

### 3. Admin workflow
Admins can:
- view all submitted applications,
- inspect application details,
- update the status of each application,
- add internal notes if needed,
- manage users,
- access dashboards and reports for better decision-making.

### 4. File handling
The system supports resume uploads for applicants. Uploaded files are stored on the server and served through the backend, making them available for review by admins.

### 5. Reporting and analytics
The admin dashboard includes charts and summary statistics to help visualize application trends, which makes the platform more useful for management and review.

## Technical architecture

### Frontend
The frontend is built with React and Vite, and uses:
- React Router for navigation,
- Tailwind CSS for styling,
- Axios for API requests,
- Chart.js and related libraries for dashboard visualizations.

The main frontend entry and routing logic are defined in App.jsx.

### Backend
The backend is built with Node.js and Express. It provides REST API endpoints for:
- authentication,
- application submission,
- application retrieval and updates,
- admin operations.

The server setup and API routing are handled in server.js.

### Database
The project uses MongoDB through Mongoose. The data models are clearly separated:
- User.js handles users, passwords, roles, and profile data
- Application.js stores internship applications, status, resume path, academic details, and skills

## Project structure summary

- The backend contains the API, database connection, authentication logic, file upload middleware, and controllers.
- The frontend contains the user interface, routes, layouts, pages, and reusable UI components.
- The project is organized so that applicant features and admin features are separated cleanly.

## How the app works

A typical flow looks like this:

1. A user registers or logs in.
2. If they are an applicant, they can submit an internship application.
3. The system validates the input and stores the application in the database.
4. Admins can review the stored applications from the dashboard.
5. The application status is updated based on the review outcome.
6. Applicants can see their application status through the portal.

## Why this project is valuable

This project is a strong example of a real-world full-stack web application because it combines:
- authentication,
- database design,
- protected routes,
- form validation,
- file uploads,
- role-based authorization,
- admin dashboards,
- and a polished frontend experience.

In short, this is a complete internship management platform that simulates how a real recruitment system could work for a company or university.

