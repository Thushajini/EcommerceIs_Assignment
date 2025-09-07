Ecommerce website
--
A full-stack, secure web application . Built with a React frontend and a Spring Boot backend, featuring secure OIDC authentication with Asgardeo.

🛠️ Tech Stack
--
Frontend: React, Bootstrap, Asgardeo Auth React SDK

Backend: Spring Boot, Spring Security, Spring Data JPA, MySQL

Authentication: Asgardeo (OIDC)

Build Tools: Maven (Backend), npm (Frontend)


⚙️ Configuration & Setup
--
⚠️ Security Notice: This repository contains no sensitive data. You must provide your own credentials and configuration using the methods below.
-
application.properties (Spring Boot):

#spring.datasource.url=${DB_URL}

#spring.datasource.username=${DB_USERNAME}

#spring.datasource.password=${DB_PASSWORD}

#spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

#spring.jpa.hibernate.ddl-auto=update



3. Authentication Setup (Asgardeo)

-
a) Create an Application in Asgardeo

Go to your Asgardeo Console

Navigate to Applications > New Application

Choose Standard-Based Application

Configure:

Authorized Redirect URL: http://localhost:3000

Allowed Grant Types: Authorization Code, Refresh Token
#REACT_APP_ASGARDEO_CLIENT_ID=YOUR_CLIENT_ID_HERE
#REACT_APP_ASGARDEO_BASE_URL=https://api.asgardeo.io/t
#REACT_APP_ASGARDEO_TENANT_NAME=your_tenant_name

🚀 Running the Application
--
Backend (Spring Boot)

cd backend

mvn spring-boot:run


The API will start on http://localhost:8080

Frontend (React)

cd frontend

npm install

npm run dev

The frontend will start on http://localhost:3000

🛡️ Security Features
--
✅ OIDC Authentication with Asgardeo

✅ Environment-based configuration (no hardcoded secrets)

✅ SQL Injection prevention with Prepared Statements

✅ Password hashing with BCrypt

✅ JWT validation on backend

✅ HTTPS-ready configuration