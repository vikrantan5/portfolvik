export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      hero_section: {
        Row: {
          id: string
          name: string
          profession: string
          tagline: string
          avatar_url: string
          resume_url: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string
          profession?: string
          tagline?: string
          avatar_url?: string
          resume_url?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          profession?: string
          tagline?: string
          avatar_url?: string
          resume_url?: string
          updated_at?: string
        }
      }
      about_me: {
        Row: {
          id: string
          description: string
          quote: string
          photo_url: string
          updated_at: string
        }
        Insert: {
          id?: string
          description?: string
          quote?: string
          photo_url?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          quote?: string
          photo_url?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          category: string
          skill_name: string
          icon_name: string
          proficiency: number
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          category: string
          skill_name: string
          icon_name?: string
          proficiency?: number
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          category?: string
          skill_name?: string
          icon_name?: string
          proficiency?: number
          order_index?: number
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          tech_stack: string[]
          github_link: string
          live_link: string
          image_url: string
          is_featured: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          tech_stack?: string[]
          github_link?: string
          live_link?: string
          image_url?: string
          is_featured?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          tech_stack?: string[]
          github_link?: string
          live_link?: string
          image_url?: string
          is_featured?: boolean
          order_index?: number
          created_at?: string
        }
      }
      experience: {
        Row: {
          id: string
          company_name: string
          role: string
          duration: string
          achievements: string[]
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          company_name: string
          role: string
          duration: string
          achievements?: string[]
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          role?: string
          duration?: string
          achievements?: string[]
          order_index?: number
          created_at?: string
        }
      }
      education: {
        Row: {
          id: string
          college_name: string
          degree: string
          duration: string
          notes: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          college_name: string
          degree: string
          duration: string
          notes?: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          college_name?: string
          degree?: string
          duration?: string
          notes?: string
          order_index?: number
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          icon_name: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date?: string
          icon_name?: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          icon_name?: string
          order_index?: number
          created_at?: string
        }
      }
      blogs_youtube: {
        Row: {
          id: string
          title: string
          link: string
          thumbnail_url: string
          type: 'blog' | 'youtube'
          published_date: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          link: string
          thumbnail_url?: string
          type: 'blog' | 'youtube'
          published_date?: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          link?: string
          thumbnail_url?: string
          type?: 'blog' | 'youtube'
          published_date?: string
          order_index?: number
          created_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role: string
          feedback: string
          avatar_url: string
          rating: number
          is_visible: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role?: string
          feedback: string
          avatar_url?: string
          rating?: number
          is_visible?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          feedback?: string
          avatar_url?: string
          rating?: number
          is_visible?: boolean
          order_index?: number
          created_at?: string
        }
      }
      contact_info: {
        Row: {
          id: string
          email: string
          phone: string
          location: string
          social_links: Json
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string
          phone?: string
          location?: string
          social_links?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string
          location?: string
          social_links?: Json
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
}
