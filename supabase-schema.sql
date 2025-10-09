/*
  # Vikrant's Interactive 3D Portfolio - Database Schema

  ## Overview
  Complete database schema for a dynamic, editable portfolio website with admin authentication.

  ## New Tables Created

  1. **hero_section** - Main hero/landing section data
  2. **about_me** - About section content
  3. **skills** - Skills organized by category
  4. **projects** - Portfolio projects with tech stack
  5. **experience** - Work experience timeline
  6. **education** - Educational background
  7. **achievements** - Awards and accomplishments
  8. **blogs_youtube** - Blog posts and YouTube videos
  9. **testimonials** - Client/colleague feedback
  10. **contact_info** - Contact details and social links
  11. **contact_messages** - Messages from visitors

  ## Security Configuration

  - All tables have RLS enabled
  - Public users can read content
  - Only authenticated admin can edit
  - Contact messages: anyone can create, only admin can read
*/

-- =====================================================
-- 1. HERO SECTION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS hero_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Vikrant Singh',
  profession text NOT NULL DEFAULT 'Full Stack Developer',
  tagline text NOT NULL DEFAULT 'Building beautiful, scalable web experiences',
  avatar_url text DEFAULT '',
  resume_url text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;

-- Public can view hero section
CREATE POLICY "Anyone can view hero section"
  ON hero_section FOR SELECT
  USING (true);

-- Only authenticated admin can update
CREATE POLICY "Authenticated users can update hero section"
  ON hero_section FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default hero data
INSERT INTO hero_section (name, profession, tagline)
VALUES (
  'Vikrant Singh',
  'Full Stack Developer & 3D Enthusiast',
  'Crafting immersive digital experiences with React, Three.js, and modern web technologies'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. ABOUT ME TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS about_me (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL DEFAULT '',
  quote text DEFAULT '',
  photo_url text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE about_me ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view about me"
  ON about_me FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update about me"
  ON about_me FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default about data
INSERT INTO about_me (description, quote)
VALUES (
  'I''m a passionate full-stack developer specializing in creating interactive 3D web experiences. With expertise in React, Three.js, and modern backend technologies, I transform ideas into engaging digital realities.',
  '"Code is poetry written in logic." - Vikrant Singh'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. SKILLS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  skill_name text NOT NULL,
  icon_name text DEFAULT 'Code',
  proficiency integer DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample skills
INSERT INTO skills (category, skill_name, icon_name, proficiency, order_index) VALUES
  ('Frontend', 'React.js', 'Atom', 95, 1),
  ('Frontend', 'Three.js', 'Box', 90, 2),
  ('Frontend', 'TypeScript', 'FileCode', 92, 3),
  ('Frontend', 'TailwindCSS', 'Palette', 88, 4),
  ('Backend', 'Node.js', 'Server', 85, 5),
  ('Backend', 'Supabase', 'Database', 90, 6),
  ('Backend', 'PostgreSQL', 'Database', 82, 7),
  ('Tools', 'Git', 'GitBranch', 90, 8),
  ('Tools', 'Figma', 'Figma', 85, 9),
  ('Tools', 'Vercel', 'Rocket', 88, 10)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. PROJECTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  tech_stack text[] DEFAULT '{}',
  github_link text DEFAULT '',
  live_link text DEFAULT '',
  image_url text DEFAULT '',
  is_featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample projects
INSERT INTO projects (title, description, tech_stack, github_link, live_link, is_featured, order_index) VALUES
  (
    'Interactive 3D Portfolio',
    'A stunning portfolio website featuring Three.js animations, real-time editing capabilities, and Supabase backend integration.',
    ARRAY['React', 'Three.js', 'Supabase', 'TailwindCSS', 'Framer Motion'],
    'https://github.com/vikrant',
    'https://vikrant.dev',
    true,
    1
  ),
  (
    'FactDefiner Platform',
    'Educational content platform with video hosting, interactive quizzes, and student management system.',
    ARRAY['React', 'Node.js', 'MongoDB', 'YouTube API'],
    'https://github.com/vikrant/factdefiner',
    'https://factdefiner.com',
    true,
    2
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. EXPERIENCE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  role text NOT NULL,
  duration text NOT NULL,
  achievements text[] DEFAULT '{}',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view experience"
  ON experience FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert experience"
  ON experience FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update experience"
  ON experience FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete experience"
  ON experience FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample experience
INSERT INTO experience (company_name, role, duration, achievements, order_index) VALUES
  (
    'Tech Startup XYZ',
    'Senior Full Stack Developer',
    'Jan 2023 - Present',
    ARRAY[
      'Led development of interactive 3D web applications using Three.js',
      'Reduced page load time by 40% through optimization',
      'Mentored junior developers in React best practices'
    ],
    1
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 6. EDUCATION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_name text NOT NULL,
  degree text NOT NULL,
  duration text NOT NULL,
  notes text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view education"
  ON education FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert education"
  ON education FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update education"
  ON education FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete education"
  ON education FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample education
INSERT INTO education (college_name, degree, duration, notes, order_index) VALUES
  (
    'University of Technology',
    'Bachelor of Computer Science',
    '2019 - 2023',
    'First Class Honors | Focus on Web Technologies and Computer Graphics',
    1
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 7. ACHIEVEMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date text DEFAULT '',
  icon_name text DEFAULT 'Trophy',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update achievements"
  ON achievements FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete achievements"
  ON achievements FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample achievements
INSERT INTO achievements (title, description, date, icon_name, order_index) VALUES
  (
    'Hackathon Winner',
    'First place at National Web Dev Hackathon 2023',
    '2023',
    'Award',
    1
  ),
  (
    'Open Source Contributor',
    'Contributed to 15+ open source projects',
    '2022-2024',
    'Github',
    2
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 8. BLOGS & YOUTUBE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS blogs_youtube (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  link text NOT NULL,
  thumbnail_url text DEFAULT '',
  type text NOT NULL CHECK (type IN ('blog', 'youtube')),
  published_date date DEFAULT CURRENT_DATE,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blogs_youtube ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blogs and videos"
  ON blogs_youtube FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert content"
  ON blogs_youtube FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update content"
  ON blogs_youtube FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete content"
  ON blogs_youtube FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample content
INSERT INTO blogs_youtube (title, link, type, published_date, order_index) VALUES
  (
    'Getting Started with Three.js',
    'https://youtube.com/watch?v=example',
    'youtube',
    '2024-01-15',
    1
  ),
  (
    'React Performance Tips',
    'https://vikrant.dev/blog/react-performance',
    'blog',
    '2024-02-01',
    2
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 9. TESTIMONIALS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text DEFAULT '',
  feedback text NOT NULL,
  avatar_url text DEFAULT '',
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_visible boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible testimonials"
  ON testimonials FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample testimonials
INSERT INTO testimonials (name, role, feedback, rating, order_index) VALUES
  (
    'John Doe',
    'CTO at Tech Corp',
    'Vikrant delivered an exceptional 3D web experience that exceeded our expectations. His attention to detail and technical expertise are outstanding.',
    5,
    1
  ),
  (
    'Sarah Johnson',
    'Product Manager',
    'Working with Vikrant was a pleasure. He transformed our vision into a beautiful, functional reality.',
    5,
    2
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 10. CONTACT INFO TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  social_links jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view contact info"
  ON contact_info FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update contact info"
  ON contact_info FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default contact info
INSERT INTO contact_info (email, phone, location, social_links)
VALUES (
  'vikrant@example.com',
  '+91 XXXXXXXXXX',
  'Mumbai, India',
  '{"github": "https://github.com/vikrant", "linkedin": "https://linkedin.com/in/vikrant", "youtube": "https://youtube.com/@factdefiner", "instagram": "https://instagram.com/vikrant", "twitter": "https://twitter.com/vikrant"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 11. CONTACT MESSAGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text DEFAULT '',
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can send a message
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Only admin can read messages
CREATE POLICY "Authenticated users can view messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- Admin can mark as read
CREATE POLICY "Authenticated users can update messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 12. AUTO-UPDATE TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
DROP TRIGGER IF EXISTS update_hero_section_updated_at ON hero_section;
CREATE TRIGGER update_hero_section_updated_at
  BEFORE UPDATE ON hero_section
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_about_me_updated_at ON about_me;
CREATE TRIGGER update_about_me_updated_at
  BEFORE UPDATE ON about_me
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_info_updated_at ON contact_info;
CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured, order_index);
CREATE INDEX IF NOT EXISTS idx_blogs_youtube_type ON blogs_youtube(type, published_date DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_visible ON testimonials(is_visible, order_index);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read, created_at DESC);

-- =====================================================
-- STORAGE BUCKETS SETUP INSTRUCTIONS
-- =====================================================

/*
  IMPORTANT: After running this SQL, create these Storage Buckets in Supabase:

  1. 'avatars' - For profile pictures
     - Public bucket
     - Allowed file types: image/*

  2. 'resumes' - For resume files
     - Public bucket
     - Allowed file types: application/pdf

  3. 'projects' - For project images
     - Public bucket
     - Allowed file types: image/*

  4. 'thumbnails' - For blog/video thumbnails
     - Public bucket
     - Allowed file types: image/*

  Storage Policies (apply to each bucket):
  - SELECT: Anyone can view files
  - INSERT: Only authenticated users
  - UPDATE: Only authenticated users
  - DELETE: Only authenticated users
*/