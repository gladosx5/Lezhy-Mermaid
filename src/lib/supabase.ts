import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          instagram_handle: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      tattoos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          category: string;
          is_featured: boolean;
          price_range: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tattoos']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tattoos']['Insert']>;
      };
      flashes: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          description: string | null;
          original_price: number | null;
          promo_price: number | null;
          size: string | null;
          placement: string | null;
          status: string;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['flashes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['flashes']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          location: string;
          event_date: string;
          end_date: string | null;
          image_url: string | null;
          is_archived: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      availability: {
        Row: {
          id: string;
          date: string;
          time_slot: string;
          is_available: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['availability']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['availability']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string;
          price: number;
          stock_quantity: number;
          category: string;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          google_review_id: string | null;
          author_name: string;
          author_avatar: string | null;
          rating: number;
          review_text: string | null;
          review_date: string;
          likes_count: number;
          is_featured: boolean;
          is_hidden: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      site_content: {
        Row: {
          id: string;
          section: string;
          key: string;
          value: string | null;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['site_content']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['site_content']['Insert']>;
      };
    };
  };
};
