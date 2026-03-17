# AGENTS.md - Developer Guide for Agri-ProMIS

This file provides guidance for AI agents and developers working on this codebase.

## Project Overview

Agri-ProMIS is a Next.js 15 application with TypeScript, TailwindCSS, and Supabase integration. It serves as a Project Monitoring and Information System for agricultural programs with role-based access control (Admin and Field Technician roles).

---

## Build, Lint, and Test Commands

### Installation
```bash
npm install
```

### Development
```bash
npm run dev                # Start development server with Turbopack
npm run dev:pwa           # Start dev server with PWA support (HTTPS required)
```

### Build & Production
```bash
npm run build             # Build for production
npm run start             # Start production server
npm run lint              # Run ESLint
```

### Testing
This project has Jest configured but no tests currently exist. To run tests:
```bash
# Run all tests
npm test

# Run a single test file
npx jest path/to/file.test.ts

# Run tests in watch mode
npx jest --watch
```

---

## Architecture Overview

### Frontend Framework
- **Next.js 15** with App Router
- **TypeScript** for type safety (strict mode enabled)
- **TailwindCSS v4** for styling
- **React 19** with Server Components and Client Components pattern

### Backend & Data
- **Supabase** for authentication, database, and realtime features
- **React Query** (`@tanstack/react-query`) for data fetching and caching
- **Server Actions** for mutations (50MB body size limit configured)

### Key Libraries
- `@tanstack/react-table` - Data tables
- `@react-pdf/renderer` - PDF generation
- `leaflet` + `react-leaflet` - Maps
- `zod` - Form validation
- `react-hook-form` - Form handling
- `@radix-ui/*` - UI components
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `zustand` - State management

---

## Code Style Guidelines

### Naming Conventions

**Files:**
- Components: `PascalCase` (e.g., `UserProfile.tsx`)
- Hooks: `camelCase` with `use` prefix (e.g., `useUserProfile.ts`)
- Utils: `camelCase` (e.g., `formatDate.ts`)
- Types: `PascalCase` (e.g., `UserTypes.ts`)

**Functions:**
- Server Actions: `VerbEntityAction` (e.g., `InsertProgramAction`, `SelectAllProgramsAction`)
- Client Hooks: `useVerbEntityHook` (e.g., `useSelectAllProgramsHook`)
- Component Functions: `PascalCase` (e.g., `function UserProfile()`)

**Variables:**
- Use `camelCase` for variables and function parameters
- Use `PascalCase` for types and interfaces
- Use `UPPER_SNAKE_CASE` for constants

### Import Organization

Follow this order:
1. Next.js/React imports
2. Third-party library imports
3. Server actions / hooks imports
4. Internal component imports
5. Type imports
6. Utility imports

Use the `@/*` path alias which maps to the project root:
```typescript
import { createClient } from "@/utils/supabase/client";
import { InsertProgramAction } from "@/app/actions/ProgramAction";
import { ProgramType } from "@/components/types";
```

### TypeScript Guidelines

- **Always enable strict mode** - This project has `strict: true`
- **Define types explicitly** - Avoid `any`, use proper types
- **Use interfaces for object shapes** that may be extended
- **Use type aliases** for unions, intersections, and primitives
- **Export types** that are used across multiple files

Example type definition:
```typescript
export type UserProfileType = {
  id?: string;
  fullname: string;
  email?: string;
  role?: number;
  created_at?: string;
};
```

### Server Actions

- Mark files with `"use server"` at the top
- Use `createClient()` from `@/utils/supabase/server`
- Always handle errors with try-catch or check error objects
- Return typed data consistently
- Log activities using `InsertActivityLogAction`
- Send notifications where appropriate using `NotificationAction`

Example:
```typescript
"use server";

import { createClient } from "@/utils/supabase/server";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";

export async function InsertProgramAction({ program_name, description }: ProgramType) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .insert({ program_name, description })
    .select()
    .single();

  if (error) {
    throw error;
  }

  await InsertActivityLogAction("Created Program", `Program ${program_name} created.`);
  return data;
}
```

### React Query Patterns

- Use stable array-based query keys: `['entity', 'filter', value]`
- Set appropriate `refetchInterval` and `networkMode`
- Use `enabled` to conditionally enable queries
- Use React Query hooks in client components only

Example:
```typescript
export function useSelectProgramByIDHook(programId: string) {
  return useQuery({
    queryKey: ["programById", programId],
    queryFn: async () => await SelectProgramByIdAction(programId),
    enabled: !!programId,
    refetchInterval: 30000,
    networkMode: "online",
  });
}
```

### Component Structure

- Use `"use client"` only when needed (event handlers, hooks, browser APIs)
- Co-locate related files when possible
- Use Radix UI primitives for accessible components
- Use `cn()` from `tailwind-merge` for class merging

### Error Handling

- Always check Supabase error responses
- Throw errors to let calling code handle them
- Use try-catch in client components to show toast errors
- Log meaningful activity messages

### Role-Based Access

- Role `1` = Admin (access `/dashboard/**`)
- Role `2` = Field Technician (access `/field-technician/**`)
- Always check role in middleware before allowing access

### Deletion Behavior

- Most entities use **soft delete** via `deleted_at` column
- Use `SoftDeleteAction` for generic soft deletes
- Check action-specific behavior before changing delete flows

### Supabase Client Usage

- **Client components/hooks**: Use `utils/supabase/client.ts`
- **Server actions/route handlers**: Use `utils/supabase/server.ts`
- **Middleware**: Use `utils/supabase/middleware.ts` for session management

---

## Project Structure

```
app/                    # Next.js App Router pages
  actions/             # Server actions
  api/                 # API routes
  dashboard/           # Admin domain routes
  field-technician/    # Field technician routes
components/            # Reusable UI components
  ui/                  # Base UI components (buttons, inputs, etc.)
  custom/              # Feature-specific components
hooks/                 # Custom React hooks
utils/                 # Utilities and helpers
  supabase/            # Supabase client helpers
public/                # Static assets
data/                  # Static data files
types/                 # Additional type definitions
```

---

## Additional Conventions

### Routes
- Admin pages: `/dashboard/**`
- Field technician pages: `/field-technician/**`
- Authentication: `/login`
- Error pages: `/access-denied`, `/~offline` (PWA)

### PWA Configuration
- Configured in `next.config.ts` using `@ducanh2912/next-pwa`
- Service worker in `worker/index.js`
- Manifest generated by `app/manifest.ts`

### Database
- Schema documented in `schema.sql`
- Types auto-generated in `database.types.ts`
- Use soft deletes where applicable

---

## Copilot Instructions Reference

This project includes `.github/copilot-instructions.md` with additional guidance. When available, consult that file for project-specific details.
