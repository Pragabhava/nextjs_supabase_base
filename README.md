# Next.js Project with Supabase Auth and shadcn/ui

A modern web application built with Next.js 15, featuring Supabase authentication, and a responsive layout with navigation components.

## Features

- 🔐 Supabase Authentication (already set up with middleware)
- 🎨 Responsive Navigation Bar with mobile support
- 📱 Collapsible Sidebar
- 🌙 Dark/Light Mode Support via next-themes
- 🔧 TypeScript Configuration (Next.js 15 + React 19)
- 📦 Environment Variables Setup
- 🎯 shadcn/ui Components

## Prerequisites

- Node.js 20.x or later
- pnpm (recommended) or npm package manager
- Supabase account and project

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
├── public/               # Static files
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── auth/         # Authentication pages
│   │   ├── protected/    # Protected routes (require authentication)
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # Shared components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── navigation.tsx
│   │   ├── sidebar.tsx
│   │   └── ...           # Authentication forms & other components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   │   └── supabase/     # Supabase clients and utilities
│   └── middleware.ts     # Authentication middleware
├── .env.local            # Environment variables (you need to create this)
├── components.json       # shadcn/ui configuration
├── next.config.ts        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Project dependencies
```

## Key Directory Explanation

- **/src/app**: Main application directory using the Next.js App Router
- **/src/app/protected**: Routes that require authentication (middleware redirects to login if unauthenticated)
- **/src/app/auth**: Authentication pages (login, signup, password reset)
- **/src/components**: Reusable UI components
- **/src/lib/supabase**: Supabase client configurations for both server and client components

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Pragabhava/nextjs_supabase_base.git my-project
cd my-project
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Set up your environment variables (see above)

4. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

## Using Protected Routes

The repository includes two types of routes:

1. **Public routes**: Accessible to all users (e.g., `/`, `/auth/login`)
2. **Protected routes**: Only accessible to authenticated users (e.g., `/protected/*`)

To create a new protected page:
1. Create a new directory or file under `/src/app/protected/`
2. The middleware will automatically handle authentication checks

Example of a protected page:
```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  
  if (!data?.user) {
    redirect('/auth/login')
  }
  
  return (
    <div>
      <h1>Protected Content</h1>
      <p>Hello, {data.user.email}</p>
    </div>
  )
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.