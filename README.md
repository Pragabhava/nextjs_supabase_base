# Next.js Project with Supabase Auth

A modern web application built with Next.js 14, featuring Supabase authentication, and a responsive layout with navigation components.

![Project Structure](public/project-structure.png)

## Features

- 🔐 Supabase Authentication
- 🎨 Responsive Navigation Bar
- 📱 Collapsible Sidebar
- 🌙 Dark/Light Mode Support
- 🔧 TypeScript Configuration
- 📦 Environment Variables Setup

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Supabase account and project

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## TypeScript Configuration

Ensure you have a `next-env.d.ts` file in your root directory. This file should contain:

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

## Project Structure

```
├── app/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   └── project-structure.png
├── types/
│   └── supabase.ts
├── .env.local
├── next-env.d.ts
└── package.json
```

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## Required Dependencies

```json
{
  "dependencies": {
    "@supabase/auth-helpers-nextjs": "latest",
    "@supabase/supabase-js": "latest",
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x"
  },
  "devDependencies": {
    "@types/node": "20.x",
    "@types/react": "18.x",
    "@types/react-dom": "18.x",
    "typescript": "5.x"
  }
}
```

## Authentication Setup

1. Configure Supabase client:

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

2. Implement authentication in your components:

```typescript
const { data: { user }, error } = await supabase.auth.getUser()
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
