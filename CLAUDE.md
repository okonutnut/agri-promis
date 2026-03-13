# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Agri-ProMIS is a Next.js 15 application with TypeScript, TailwindCSS, and Supabase integration. It serves as a Project Monitoring and Information System for agricultural programs with role-based access control (Admin and Field Technician roles).

## Common Development Commands

### Development Server
```bash
npm run dev
```
Starts the development server with Turbopack.

### Building
```bash
npm run build
```
Builds the application for production.

### Linting
```bash
npm run lint
```
Runs ESLint to check for code issues.

### Production Server
```bash
npm run start
```
Starts the production server.

## Architecture Overview

### Frontend Framework
- Next.js 15 with App Router
- TypeScript for type safety
- TailwindCSS for styling
- React Server Components and Client Components pattern

### Backend & Authentication
- Supabase for authentication and database
- Role-based access control (role 1 = Admin, role 2 = Field Technician)
- Middleware for route protection and session management

### Key Features
- PWA (Progressive Web App) support
- React Query for data fetching and caching
- Zod for form validation
- React Hook Form for form handling
- TanStack Table for data tables
- React PDF for report generation
- Leaflet for map integration

### Directory Structure
- `app/` - Next.js app router pages and layouts
- `components/` - Reusable UI components
- `utils/` - Utility functions and Supabase integration
- `hooks/` - Custom React hooks
- `public/` - Static assets
- `data/` - Static data files

### Authentication Flow
1. Users authenticate via Google OAuth
2. Middleware checks user session and role
3. Users are redirected based on their role:
   - Role 1 (Admin) → `/dashboard`
   - Role 2 (Field Technician) → `/field-technician/dashboard`
4. Route protection prevents unauthorized access

### Data Management
- Supabase client for browser-side data operations
- React Query for data fetching and caching
- Server actions for mutations with 50MB body size limit

### Reporting Features
- Travel order reports
- Post-activity reports
- Monitoring reports
- PDF generation capabilities
- Draft management system

### Mobile Support
- Responsive design with TailwindCSS
- PWA capabilities for mobile installation
- Mobile-specific layouts and components