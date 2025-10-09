# Vikrant's Interactive 3D Portfolio

A stunning, modern portfolio website featuring Three.js 3D animations, real-time editing capabilities, and Supabase backend integration.

## Features

- **3D Animated Background**: Beautiful particle effects using Three.js and React Three Fiber
- **Admin Edit Mode**: Secure authentication system with inline editing
- **Dynamic Content**: All portfolio data fetched from Supabase in real-time
- **Responsive Design**: Mobile-first approach with beautiful transitions
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Smooth Animations**: Framer Motion animations throughout
- **Modern Stack**: React, TypeScript, Tailwind CSS, Supabase

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS with custom gradient themes
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Animations**: Framer Motion
- **Backend**: Supabase (Database, Auth, Storage)
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM

## Setup Instructions

### 1. Database Setup

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the entire content from `supabase-schema.sql`
4. Paste and execute in the SQL Editor

### 2. Storage Buckets

Create these storage buckets in Supabase Storage:

- `avatars` - Profile pictures (Public, image/*)
- `resumes` - Resume files (Public, application/pdf)
- `projects` - Project screenshots (Public, image/*)
- `thumbnails` - Blog/video thumbnails (Public, image/*)

For each bucket, set these policies:
- **SELECT**: Anyone can view
- **INSERT/UPDATE/DELETE**: Only authenticated users

### 3. Environment Variables

Your `.env` file should already have:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Admin Authentication

1. In Supabase Dashboard → **Authentication**
2. Create your admin user with email/password
3. Use this account to log into `/admin` on your portfolio

### 5. Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── sections/          # All portfolio sections
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── TimelineSection.tsx
│   │   ├── ContentSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── ContactSection.tsx
│   ├── ThreeBackground.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── contexts/
│   ├── AuthContext.tsx    # Authentication management
│   └── ThemeContext.tsx   # Theme toggle
├── lib/
│   ├── supabase.ts        # Supabase client
│   └── database.types.ts  # TypeScript types
├── pages/
│   ├── Portfolio.tsx      # Main portfolio page
│   └── AdminLogin.tsx     # Admin login page
├── App.tsx                # Main app with routing
└── main.tsx              # Entry point
```

## How It Works

### Public View
Visitors see a beautiful, interactive portfolio with:
- Animated 3D particle background
- Typewriter effect on hero section
- Smooth scroll animations
- Interactive project cards
- Contact form
- Social media links

### Admin Edit Mode
After logging in at `/admin`:
1. Navigate to any section
2. Click the "Edit" button
3. Modify content inline
4. Click "Save" to update instantly
5. Changes reflect in real-time without page reload

## Database Schema

### Tables
- `hero_section` - Name, profession, tagline, avatar
- `about_me` - Description, quote, photo
- `skills` - Skills by category with proficiency
- `projects` - Portfolio projects with tech stack
- `experience` - Work history
- `education` - Academic background
- `achievements` - Awards and accomplishments
- `blogs_youtube` - Blog posts and videos
- `testimonials` - Client feedback
- `contact_info` - Contact details and social links
- `contact_messages` - Messages from visitors

## Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:
```js
colors: {
  primary: { ... }
}
```

### Fonts
The project uses Inter font. Change in `src/index.css`:
```css
@import url('https://fonts.googleapis.com/...');
```

### 3D Background
Customize particle effects in `src/components/ThreeBackground.tsx`

## Deployment

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
npm run build
# Deploy the 'dist' folder
```

## Security

- Row Level Security (RLS) enabled on all tables
- Public users can only read content
- Only authenticated admins can edit
- Contact messages: anyone can send, only admin can read

## Performance

- Lazy loading for images
- React Query caching
- Optimized Three.js rendering
- Code splitting with React Router

## License

MIT License - Feel free to use this for your own portfolio!

---

Built with ❤️ using React.js, Three.js, and Supabase
