# 🚀 Gen AI Job Preparation Platform

> Your Personal AI Interview Coach 🤖

A full-stack AI-powered web application designed to help users prepare for jobs efficiently by analyzing resumes, identifying skill gaps, and generating personalized interview questions.

---

## 📖 Overview

This platform allows users to upload their **resume** and **target job description**, after which it:

- Calculates a **match score**
- Identifies **skill gaps**
- Generates **technical + behavioral interview questions**
- Provides a **personalized roadmap**
- Simulates **HR interview using AI agent (including voice interaction)**
- Generates an **ATS-friendly resume (downloadable PDF)**

---

## ✨ Features

### 🔐 Authentication & Security
- Secure login/signup using **JWT Authentication**
- **Token Blacklisting Implementation** for enhanced security

---

### 📄 Resume Parsing & Analysis
- Upload resume (PDF)
- **Resume Parsing & Skill Extraction Logic**
- Extracts skills, experience, and keywords using AI

---

### 🎯 AI-Based Skill Gap Detection
- Resume vs Job Description comparison
- Calculates **match score**
- Identifies missing skills
- Suggests improvements

---

### 🧠 AI Interview Preparation
- Technical Questions
- Behavioral Questions
- Previous Year HR Interview Questions
- Personalized based on resume + job role

---

### 🤖 AI Interview Agent (Voice Enabled)
- Real-time AI HR Interview simulation
- **Voice-based interaction support**
- Dynamic questioning based on:
  - Resume
  - Target job role

---

### 🗺️ Personalized Roadmap Generator
- Step-by-step roadmap to improve skills
- Industry-relevant recommendations

---

### 📥 ATS-Optimized Resume Generator
- AI-generated resume optimized for ATS systems
- Clean, structured format
- Downloadable as PDF

---

### 📄 Dynamic PDF Generation
- **Puppeteer integration** for generating high-quality resumes
- Ensures professional formatting

---

## 🛠️ Tech Stack Used

### Frontend
- React.js

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- JWT (JSON Web Token)
- Token Blacklisting

### AI Integration
- Gemini API (Google Generative AI)

### PDF Generation
- Puppeteer

---

## 🏗️ System Architecture

- Full Stack Web Application Architecture (MERN-based)
- RESTful API design
- Modular backend structure (MVC pattern)
- Scalable and maintainable codebase

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

# Backend
cd server
```
npm install
```
# Frontend
cd ../client
```
npm install
```


3️⃣ Setup environment variables:-
Create .env file in backend:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
```


# Backend
```
npm run dev
````
# Frontend
```
npm start
```
<img width="1892" height="879" alt="Screenshot 2026-03-28 232927" src="https://github.com/user-attachments/assets/2fcf77ae-983e-40a8-afa9-9b612153930e" />
<img width="1898" height="886" alt="Screenshot 2026-03-28 232910" src="https://github.com/user-attachments/assets/bf2bfc6a-d192-4ccf-8311-f26bab05d2ec" />


<img width="1882" height="875" alt="Screenshot 2026-03-28 232846" src="https://github.com/user-attachments/assets/1b8f289c-dc85-4bbd-aa2c-b892079355c7" />



<img width="1904" height="903" alt="Screenshot 2026-03-29 161430" src="https://github.com/user-attachments/assets/fb8005a1-9ee9-4f60-bd01-f51264bb3cea" />
