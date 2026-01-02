# Complaint Registration Portal

A full-stack web application that allows users to register complaints online and enables administrators to track, manage, and resolve them efficiently.  
The system is designed to simplify complaint handling with cloud storage, location tracking, and automated email notifications.

## Features

- User registration and login
- Secure complaint submission with category and description
- Image/file upload for complaints using Cloudinary
- Automatic location capture using Geolocation API
- Complaint status tracking (pending, in progress, resolved)
- Admin dashboard for complaint management
- Role-based access control (user / admin)
- Email notifications for complaint updates using Nodemailer
- Responsive user interface

## Tech Stack

### Frontend
- React.js  
- HTML, CSS, JavaScript  
- Axios  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB  

### Cloud & Integrations
- Cloudinary (image and file storage)  
- Geolocation API (location capture)  
- Nodemailer (email notifications)  

### Authentication & Tools
- JWT authentication  
- RESTful APIs  
- Git and GitHub  

## Installation and Setup

1. Clone the repository
git clone https://github.com/your-username/complaint-registration-portal.git

2. Install backend dependencies
cd server
npm install

3. Install frontend dependencies
cd client
npm install

4. Create a `.env` file inside the server folder
 - PORT=5000
 - MONGO_URI=your_mongodb_connection_string
 - JWT_SECRET=your_secret_key
 - CLOUDINARY_CLOUD_NAME=your_cloud_name
 - CLOUDINARY_API_KEY=your_api_key
 - CLOUDINARY_API_SECRET=your_api_secret
 - EMAIL_USER=your_email_address
 - EMAIL_PASS=your_email_password

5. Start the backend server
npm run dev

6. Start the frontend application
npm run dev

The application will run on:
http://localhost:5173

## How It Works

- Users register and log in securely
- Complaints are submitted with description, image proof, and location
- Files are stored in Cloudinary
- Location data is captured using Geolocation API
- Admin reviews and updates complaint status
- Users receive email notifications on status changes

## Future Enhancements

- Advanced admin analytics dashboard
- Complaint priority system
- Email and SMS notifications
- File upload validation and size limits
- Deployment using Docker and cloud platforms

## Learning Outcomes

- Full-stack web application development
- REST API design and integration
- Cloud storage handling using Cloudinary
- Email automation with Nodemailer
- Secure authentication using JWT
- Real-world complaint management workflow
 
