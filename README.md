# ELMS Backend

This project is the backend for the E-Learning Management System (ELMS). It provides the database schema, API endpoints, and business logic to support the ELMS frontend application.

## Features
- User authentication and roles (student, teacher, admin)
- Course and section management
- Enrollment and progress tracking
- Announcements and notifications
- Assignment creation, submission, and grading
- Material uploads (PDF, PPT, video, etc.)
- Calendar events (assignments, exams, meetings)
- Chat rooms and messages (class and AI-powered)
- AI interactions and user context

## Database
- See `database_creation.sql` for the full schema.
- See `ERD.png` for the entity-relationship diagram.

## Project Structure
- `database_creation.sql`: SQL script to create all tables
- `ERD.png`: Entity-relationship diagram
- `api-guide.md`: API design and integration guide

## Getting Started
1. Clone the repository
2. Set up your database using `database_creation.sql`
3. Implement the backend API endpoints (see `api-guide.md`)
4. Connect the backend to your frontend (see the ELMS frontend repo)

