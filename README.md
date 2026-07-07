# LeetAptitude Backend

> A production-inspired backend for an aptitude preparation platform that combines structured learning, company-specific assessments, practice sessions, and detailed learning analytics.

This project is being built to learn backend engineering by implementing concepts used in real-world systems rather than limiting the application to CRUD operations. Every feature is designed with scalability, maintainability, and production architecture in mind.

---

# 🚧 Project Status

Current Stage

```
Backend Development (Version 1)
```

Project Progress

| Feature            | Status |
| ------------------ | ------ |
| Database Design    | ✅     |
| REST APIs          | 🚧     |
| Authentication     | 🚧     |
| Repository Pattern | 🚧     |
| Practice Sessions  | 🚧     |
| Analytics          | ⏳     |
| Redis              | ⏳     |
| Background Jobs    | ⏳     |
| AI Features        | ⏳     |

---

# Why This Project?

Most aptitude platforms simply display questions.

LeetAptitude aims to simulate an actual placement preparation workflow.

Instead of only solving questions, users can:

- Learn topic-by-topic
- Practice structured question sets
- Attempt company-specific assessments
- Resume unfinished sessions
- Track detailed progress
- Receive personalized analytics

The backend is intentionally designed to evolve into a production-style system by gradually introducing concepts such as caching, background jobs, event-driven architecture, WebSockets, and AI.

---

# Core Features

## Authentication

- User Registration
- Login
- JWT Authentication
- Protected Routes

---

## Topic Management

Learning follows a hierarchical structure.

```
Topic
    ↓
Subtopic
    ↓
Questions
```

Example

```
Quantitative Aptitude
        ↓
Profit & Loss
```

---

## Question Management

Supports multiple question types.

Current

- MCQ
- Numerical

Future

- Paragraph Based
- Multi Select
- Coding Questions

---

## Practice Sessions

Users can start structured practice sessions.

Features

- Resume Progress
- Question Navigation
- Attempt Tracking
- Practice Mode
- Test Mode

---

## Company Sheets

Placement-style assessments inspired by real companies.

Examples

- TCS NQT
- Infosys
- Accenture
- Capgemini

---

## Progress Analytics

The platform records:

- Practice History
- Current Streak
- Longest Streak
- Topic Progress
- Accuracy
- Heatmap

---

# High-Level Architecture

```
                Client
                   │
                   ▼
          Express REST API
                   │
          Authentication Layer
                   │
          Request Validation
                   │
             Controllers
                   │
              Services
                   │
           Repository Layer
                   │
             Prisma ORM
                   │
             PostgreSQL
```

Future Architecture

```
                    Client
                       │
                 Express API
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   PostgreSQL       Redis         BullMQ
                                       │
                                    Workers
```

---

# System Design

The backend follows a layered architecture.

```
Request

↓

Controller

↓

Service

↓

Repository

↓

Database
```

## Controller

Responsible for

- Request handling
- Authentication
- Validation
- HTTP Responses

---

## Service

Responsible for

- Business Logic
- Aggregation
- Runtime Decisions
- Data Transformation

---

## Repository

Responsible for

- Database Queries
- Filtering
- Pagination
- Prisma Operations

---

# Database Design

Current Models

```
User

Topic

Subtopic

Question

Option

Attempt

PracticeSession

Sheet

SheetQuestion
```

Relationship Overview

```
Topic
   │
   ▼
Subtopic
   │
   ▼
Question
   │
   ▼
Attempt

User
   │
   ▼
PracticeSession

Sheet
   │
   ▼
SheetQuestion
   │
   ▼
Question
```

---

# Current Tech Stack

Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

Development

- JavaScript
- Prisma
- REST APIs

---

# Planned Engineering Features

This project intentionally grows in phases.

## Phase 1

- Authentication
- Topics
- Questions
- Practice Sessions
- Analytics

---

## Phase 2

### Redis

Purpose

Cache frequently requested resources.

Examples

- Topics
- Subtopics
- Company Sheets

---

### BullMQ

Purpose

Move expensive operations into background workers.

Examples

- Heatmap Updates
- Streak Calculation
- Skill Analytics

---

### Scheduled Jobs

Purpose

Execute recurring backend tasks.

Examples

- Weekly Reports
- Leaderboard Reset
- Session Cleanup

---

### Event-Driven Architecture

Example

```
Attempt Submitted

↓

Event

↓

Update Heatmap

Update Skills

Update Analytics

Update Streak
```

Instead of tightly coupling services together, different modules react independently to events.

---

### Rate Limiting

Protect APIs from abuse.

Examples

- Login
- Answer Submission

---

### Logging

Structured application logs using production-grade logging.

---

### Authorization

Support multiple user roles.

```
User

Moderator

Admin
```

---

## Phase 3

### WebSockets

Real-time features

- Live Leaderboards
- Practice Timer
- Notifications

---

### AI Features

Planned integrations

- AI Question Explanation
- Weak Topic Detection
- Personalized Recommendations

---

### Docker

Containerized deployment.

---

### CI/CD

Automated testing and deployment pipelines.

---

# Folder Structure

```
src

├── config/
├── controllers/
├── middleware/
├── repositories/
├── routes/
├── services/
├── prisma/
├── validations/
├── utils/
├── cache/
├── workers/
├── events/
├── sockets/
├── ai/
├── app.js
└── server.js
```

---

# Learning Objectives

This project is not intended to be just another CRUD application.

The objective is to gain practical experience with backend engineering concepts commonly found in production systems.

Concepts explored include:

- Layered Architecture
- Authentication
- Authorization
- Repository Pattern
- Service Layer
- Database Design
- Redis
- Background Jobs
- Event-Driven Systems
- WebSockets
- AI Integration
- Docker
- CI/CD

Each feature will be introduced incrementally, with the goal of understanding not only _how_ it works, but also _why_ it is used in real-world software.

---

# Roadmap

- [x] Database Design
- [ ] Authentication
- [ ] Topics API
- [ ] Subtopics API
- [ ] Questions API
- [ ] Practice Sessions
- [ ] Analytics
- [ ] Redis
- [ ] BullMQ
- [ ] Event-Driven Architecture
- [ ] WebSockets
- [ ] AI Features
- [ ] Docker
- [ ] CI/CD

---

# Contributing

Suggestions, discussions, and improvements are always welcome.

As the project evolves, architectural decisions and implementation details will continue to be documented within the repository.

---

# License

This project is built for educational purposes and backend engineering practice.
