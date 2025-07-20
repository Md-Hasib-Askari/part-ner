# Personal AI Assistant - Design Document

## 1. Project Overview

### 1.1 Objective

To develop a modular, AI-powered personal assistant that automates everyday tasks, improves productivity, enhances digital security, and manages personal routines. The assistant will feature voice interaction, intelligent notifications, and personalized automation to provide real-world value while showcasing advanced technical skills.

### 1.2 Goals

* Solve real-life productivity and organization problems
* Act as a comprehensive showcase project for professional resumes
* Focus on modularity, extensibility, and real-time interactions

### 1.3 Timeline

* **Total Duration**: 6 Months
* **Phases**: Foundation (1-2 months), Automation (2-4 months), Intelligence & Security (5-6 months)

## 2. Tech Stack

* **Backend**: NestJS (Microservices), PostgreSQL, Redis
* **Frontend**: Next.js (TypeScript, TailwindCSS, Zustand)
* **NLP/LLM**: OpenAI API, LangChain, local LLMs via Ollama
* **Voice AI**: Coqui TTS, Vosk STT
* **Automation Tools**: Node-cron, Puppeteer, Home Assistant API, VirusTotal API
* **Deployment**: Docker, Render/Fly.io (Cloud), optional Raspberry Pi/Local setup

## 3. Frontend Design and Architecture

### 3.1 Goals

* Clean, modern, responsive UI
* Real-time updates and state synchronization with backend services
* Modular component-based architecture for maintainability
* Dashboard-first approach with modular views per service

### 3.2 Core Structure

* **Next.js App Router** with server components where needed
* **Zustand** for global state management
* **WebSocket Integration** for real-time notifications and task updates
* **Reusable UI Components** built with **TailwindCSS** and **ShadCN UI**

### 3.3 Main Pages and Views

* **Dashboard**: Overview of all services, quick actions, daily summary
* **Task Manager**: View, create, edit, complete tasks and events
* **Email Reader**: Summarized emails, action suggestions
* **File Organizer**: File activity log, tagging actions
* **Finance Tracker**: Expense logs, subscription alerts, financial summaries
* **Network Monitor**: Outbound connection logs, risk reports
* **Chatbot Interface**: RAG-based assistant chat view
* **Settings**: Configure preferences, API keys, custom routines

### 3.4 UI/UX Focus Areas

* **Responsive Design** for desktop and mobile
* **Light/Dark Mode** support
* **Accessible UI** (WCAG compliant where possible)
* **Minimalist Aesthetic** with efficient use of space

### 3.5 Component Architecture

* **Atoms**: Buttons, inputs, labels
* **Molecules**: Task cards, notification cards, status badges
* **Organisms**: Task lists, email summaries, chat window
* **Templates**: Dashboard layout, full-page wrappers
* **Pages**: Route-specific pages with appropriate templates and organisms

### 3.6 Real-time Data Handling

* **WebSockets (via NestJS Gateway)**: Task updates, notifications
* **SWR/React Query (optional)** for efficient data fetching with caching
* **Optimistic UI** for instant feedback on user actions

### 3.7 Development Strategy

* Component-first development with Storybook
* Unit testing using **Jest + React Testing Library**
* End-to-end testing using **Playwright**
* **CI/CD Pipeline** for automated deployments (Vercel/Render)

## 4. Backend Design and Architecture

### 4.1 Goals

* Scalable, modular backend architecture using **NestJS microservices**
* Efficient real-time communication via **WebSockets**
* Secure and privacy-respecting data management
* Easy integration with external services (emails, APIs, LLMs)

### 4.2 Core Services (Microservices)

* **Task Service**: CRUD for tasks, reminders, and events with cron scheduling
* **Email Service**: Connects to Gmail API, summarizes emails with LLM, triggers notifications
* **File Service**: Monitors file directories, classifies files using AI tagging, organizes folders
* **Finance Service**: Parses SMS/Email for financial transactions and subscription alerts
* **Network Monitor Service**: Periodically checks outbound connections and verifies them via VirusTotal API
* **Voice Service**: Handles TTS (Coqui) and STT (Vosk), processes voice commands
* **Chatbot Service**: RAG-powered chat interface using LangChain and optionally Ollama

### 4.3 Inter-service Communication

* **Redis Pub/Sub** for fast messaging between services
* **HTTP REST APIs** for CRUD operations
* **WebSocket Gateway** for real-time frontend updates

### 4.4 Database Design

* **PostgreSQL** as the primary relational database
* Schemas:

  * `users` - user profiles, preferences
  * `tasks` - task records, event schedules
  * `emails` - email metadata and LLM summaries
  * `files` - file logs and tagging info
  * `expenses` - financial transactions, subscription records
  * `network_logs` - connection records, IP risk status

### 4.5 Background Processing

* **Node-cron** for scheduled tasks (e.g., daily digests)
* **Worker Queues** (BullMQ/Redis) for intensive background jobs (LLM summarization, VirusTotal checks)
* **Retry Mechanisms** for failed job handling

### 4.6 Security Layer

* **OAuth2** integration for email services
* **JWT Authentication + Refresh Tokens** for user sessions
* **Rate Limiting & IP Whitelisting** on public endpoints
* **Data Encryption** at rest and in transit

### 4.7 Testing & CI

* **Unit Tests**: Jest (backend services)
* **Integration Tests**: Supertest
* **End-to-End Tests**: Playwright (API testing)
* **CI Pipeline**: GitHub Actions for automated testing and deployments

## 5. Deployment Strategy

* **Frontend**: Vercel or Render deployment for UI
* **Backend**: Render/Fly.io or Dockerized local setup
* **Database**: PostgreSQL managed instance (Render), optional Docker local instance
* **Optional**: Local Raspberry Pi deployment for full stack self-hosting

## 6. Security Considerations

* Token encryption (JWT + Refresh tokens)
* OAuth2 for Email/Calendar API access
* Rate limiting and IP whitelisting for sensitive endpoints
* Personal data stored locally unless explicitly needed externally

## 7. Deliverables

* Complete GitHub repository with documentation
* Modular codebase following clean architecture principles
* Video demo of real-world use cases
* Optional: Public blog post summarizing project and learnings

## 8. Future Scope (Post 6 Months)

* Self-hosted LLM expansion
* Mobile application (React Native)
* Advanced home automation scenarios
* Simple RPA desktop automation workflows

