Rentora — Online Rental Contract Booking & Payment System
Rentora is an online rental contract booking and payment system developed to simplify the process of finding, comparing, booking, and managing rental properties. The system brings property discovery, booking, demo payment, digital rental contracts, tenant signing, owner confirmation, and administrative monitoring into a single web application.

Project Team
Name	Roll No.
Chandra Prakash Verma	2500031353
Harshith Sirpuri	2520030572
Sasi Kumar	2520030505
Project Overview
Traditional rental workflows can be fragmented across property listing platforms, communication channels, payment methods, and manually prepared agreements. Rentora provides a structured database-driven workflow that connects these activities.

The application supports three main roles:

Tenant
Owner
Administrator
The implemented rental lifecycle is:

copy


Property Discovery
        |
        v
Property Comparison / Favorites
        |
        v
Booking Creation
        |
        v
Demo Payment
        |
        v
Rental Contract Generation
        |
        v
Tenant Signs Contract
        |
        v
Owner Confirms Agreement
        |
        v
Active Rental Contract
Key Features
Tenant Features
User registration and login
Search and filter rental properties
View detailed property information
Compare properties
Add properties to favorites
Create bookings
Complete the current demo payment workflow
Open and sign digital rental contracts
View booking and contract status
Submit property reviews
Use the Rentora AI assistant
Access map and location information
Owner Features
Owner registration and login
Add rental properties
Update owned property records
Manage property information
View booking requests
View owner-specific earnings
Confirm rental agreements after tenant signing
Administrator Features
Private administrator login
Two-step administrator authentication
View total users
View tenant and owner counts
View property counts
View booking statistics
View successful payment statistics
View contract statistics
View payment revenue
View recent activity records
Technology Stack
Frontend
React 19.1.1
Vite
JavaScript
React Router
Axios
HTML
CSS
Backend
Python 3.13
FastAPI
Uvicorn
REST APIs
JSON
Database
PostgreSQL
SQLAlchemy ORM
Authentication and Authorization
JWT-based authentication
Password hashing using PBKDF2-HMAC-SHA256
Role-based authorization
Development and Testing
Visual Studio Code
Git
GitHub
Postman
FastAPI OpenAPI / Swagger documentation
System Architecture
Rentora follows a layered architecture:

copy


+-----------------------------+
|          User / Client      |
+-------------+---------------+
              |
              v
+-----------------------------+
|       React + Vite          |
|         Frontend            |
+-------------+---------------+
              |
              | REST / JSON APIs
              v
+-----------------------------+
|        FastAPI Backend      |
| Authentication              |
| Authorization               |
| Business Logic              |
| Booking / Payment           |
| Contract Management         |
| Dashboard / AI Assistant    |
+-------------+---------------+
              |
              v
+-----------------------------+
|       SQLAlchemy ORM        |
+-------------+---------------+
              |
              v
+-----------------------------+
|       PostgreSQL DB         |
+-----------------------------+
Database
The project uses PostgreSQL as the primary relational database.

Main database entities include:

users
properties
amenities
property_amenities
bookings
payments
rental_contracts
favorites
reviews
activities
The database uses primary keys, foreign keys, unique constraints, CHECK constraints, and indexes to maintain data integrity and support efficient queries.

Repository Structure
The project is organized into the following main directories:

copy


Rentora/
|
+-- frontend/
|
+-- backend/
|
+-- database/
|   +-- schema.sql
|   +-- seed.sql
|
+-- docs/
|
+-- screenshots/
|
+-- README.md
+-- .gitignore
The exact files and subdirectories may vary slightly depending on the current repository version.

Local Setup
1. Clone the Repository
Bash


git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Rentora
2. Database Setup
Install PostgreSQL and create a database named:

copy


rentora_db
Then execute the database scripts:

copy


database/schema.sql
database/seed.sql
These scripts create the database structure and insert demonstration data.

3. Backend Setup
Open a terminal in the backend directory:

Bash


cd backend
Create a Python virtual environment:

Bash


py -3.13 -m venv .venv
Activate it on Windows:

Bash


.venv\Scripts\Activate.ps1
Install dependencies:

Bash


pip install -r requirements.txt
Create the environment file from the provided example:

Bash


copy .env.example .env
Start the backend:

Bash


python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
Backend address:

copy


http://127.0.0.1:8000
FastAPI API documentation:

copy


http://127.0.0.1:8000/docs
4. Frontend Setup
Open a new terminal:

Bash


cd frontend
Install the required packages:

Bash


npm install
Start the frontend:

Bash


npm run dev
The Vite development server normally runs at:

copy


http://localhost:5173
Environment Configuration
The backend reads configuration values from environment variables.

Important configuration values include:

copy


DATABASE_URL
JWT_SECRET
JWT_EXPIRE_MINUTES
ADMIN_SECOND_PASSWORD
OPENAI_API_KEY
The frontend can use:

copy


VITE_API_BASE_URL
Do not commit the .env file or any real passwords, API keys, database credentials, or other sensitive information to GitHub.

API Testing
FastAPI provides interactive OpenAPI documentation through:

copy


http://127.0.0.1:8000/docs
Postman can also be used to test the REST API.

Important API areas include:

Area	Example Operation	Purpose
Authentication	POST /api/auth/login	User authentication
Properties	GET /api/properties	Retrieve available properties
Properties	POST /api/properties	Create property as owner
Bookings	POST /api/bookings	Create tenant booking
Payments	POST /api/payments	Record demo payment
Contracts	POST /api/contracts/{booking_id}	Create rental contract
Contracts	PATCH /api/contracts/{id}/owner-confirm	Confirm agreement
Dashboard	GET /api/dashboard/admin	Retrieve administrator statistics
Booking, Payment and Contract Workflow
The core workflow is implemented as follows:

copy


Tenant logs in
     |
     v
Searches available property
     |
     v
Creates booking
     |
     v
Demo payment is recorded
     |
     v
Booking becomes CONFIRMED
     |
     v
Rental contract is created
     |
     v
Tenant signs contract
     |
     v
Owner confirms agreement
     |
     v
Contract becomes ACTIVE
The current implementation calculates the booking amount as 10% of the property's monthly rent.

The payment module is a local demonstration workflow and does not process real bank or payment-gateway transactions.

Maps and AI Assistant
The project includes:

Maps
Google Maps search and directions URLs, together with embedded map functionality, are used so that the project can run without requiring a paid mapping API key.

AI Assistant
The Rentora AI endpoint first checks whether an OPENAI_API_KEY is configured. If it is available, the project can use the external AI service. Otherwise, a local Rentora-specific response function handles common questions related to bookings, owners, payments, contracts, maps, and administration.

Security
The project implements:

JWT-based authentication
Password hashing
Role-based authorization
Ownership checks for protected owner operations
Protected backend routes
Database constraints for data integrity
Environment variables for sensitive configuration
Testing
Testing focuses on:

Authentication
Role-based authorization
Property operations
Booking workflow
Payment workflow
Contract workflow
Database constraints
Frontend and backend integration
API responses and error handling
A backend smoke_test.py is also included for basic service verification.

Deployment
The submitted implementation is primarily intended for local execution and academic demonstration.

The documented local deployment uses:

copy


PostgreSQL : rentora_db
Backend    : FastAPI + Uvicorn
Port       : 8000
Frontend   : React + Vite
Port       : 5173
For production deployment, the frontend, backend, and PostgreSQL database can be hosted separately with HTTPS, secure secret management, backups, logging, and monitoring.

Current Limitations
The payment module is a local/demo transaction workflow.
Google Maps support uses URLs and embedded map functionality rather than a fully key-based Maps/Places implementation.
The AI assistant can use a local fallback when an external AI API key is not configured.
The current project is intended mainly for local and academic deployment rather than high-volume production traffic.
Future Enhancements
Possible future improvements include:

Integration with a real payment gateway
E-signature service integration
Advanced property recommendation
Real-time notifications
Document upload and verification
More detailed analytics
Mobile application support
Production cloud deployment
Advanced AI-based rental assistance
Documentation
The complete academic project report contains detailed information about:

Introduction
System requirements
Technology stack
System architecture
Database design
Implementation
Features
Testing
Deployment
Challenges and limitations
Future enhancements
Conclusion
References
Academic Project
This project was developed as an academic full-stack DBMS application demonstrating the integration of frontend development, REST API development, relational database management, authentication, authorization, testing, and system integration.

Contributors
Chandra Prakash Verma — 2500031353

Harshith Sirpuri — 2520030572

Sasi Kumar — 2520030505
