# 🚀 Gen AI Job Preparation Platform

> Your Personal AI Interview Coach 🤖

A full-stack AI-powered web application designed to help users prepare for jobs efficiently by analyzing resumes, identifying skill gaps, and generating personalized interview questions.

---

## 📖 Overview

This platform allows users to upload their **resume** and **target job description**, after which it:


- Resume & Job Description **Match Score Analysis**
- Identifies **skill gaps**
- Generates **technical + behavioral interview questions**
- Provides a **personalized roadmap**
- **HR interview using AI agent (including voice interaction)**
- Generates an **ATS-friendly resume (downloadable PDF)**
- Resume Parsing & Skill Extraction
- Dynamic PDF Generation using Puppeteer
- Secure **JWT Authentication with Token Blacklisting**
- Real-time communication using WebSockets

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
Screenshot
<img width="1920" height="878" alt="GEN AI 1" src="https://github.com/user-attachments/assets/2988f637-0b89-4b6a-9254-fa0bf8589298" />
<img width="1920" height="878" alt="GEN AI 2" src="https://github.com/user-attachments/assets/ea6eb50e-92a2-4c97-8281-d10e4b412293" />
<img width="1920" height="1700" alt="GEN AI 3" src="https://github.com/user-attachments/assets/6bf02f27-c6eb-437c-af22-736eb5ba9123" />
<img width="1920" height="1431" alt="GEN AI 4" src="https://github.com/user-attachments/assets/661391a9-7f77-4cc3-82fe-49a47f6b1e10" />

<img width="1920" height="878" alt="GEN AI 5" src="https://github.com/user-attachments/assets/0dd26488-74fc-49d9-9091-b58b4a69d7c9" />
