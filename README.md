# NTK Phim – Online Movie Streaming Platform

NTK Phim is a fullstack online movie streaming platform built with a modern, scalable architecture, focusing on performance, security, and user experience.

**Live Demo:** [https://www.ntkiet0908.id.vn/](https://www.ntkiet0908.id.vn/)

## Frontend

TypeScript, Next.js (App Router), Tailwind CSS, Shadcn/UI, Zustand.

## Backend

NestJS, Prisma ORM, PostgreSQL (Supabase).

## Real-time & AI

Socket.io, Google Gemini AI (Generative AI).

## Security & Services

JWT (HttpOnly Cookie), OAuth2 (Passport), Argon2, Brevo (Email Service)

## Key Features

### AI Chatbot & Recommendation System

Integrated Gemini-powered chatbot for natural conversations and personalized movie recommendations based on user intent.

### Authentication & Authorization System

Implemented JWT-based authentication using short-lived Access Tokens and long-lived Refresh Tokens.

Tokens are securely stored in HttpOnly Cookies to mitigate XSS risks.

Implemented automatic token refresh (silent refresh) to maintain seamless user sessions without manual re-authentication.

Supports third-party login via OAuth2 (e.g., Google) using Passport.

Passwords are securely hashed using Argon2 following modern security standards.

Implemented user registration and password recovery using OTP (One-Time Password) delivered via email via Brevo.

### Movie Features

Developed core functionalities of a movie streaming platform such as keyword-based movie search, favorites (wishlist) management, watch history tracking, and other related features.

### User Interface

Fully responsive design across devices.

Modern UI built with Next.js, Tailwind CSS, and Shadcn/UI

### Watch Together Feature(In Progress)

Real-time synchronization of video playback (play, pause, seek).

Live chat between users in the same room.

Powered by Socket.IO for low-latency communication.
