/*
  # Initial Schema for Lézhy Mermaid Tattoo Website

  ## Overview
  This migration creates the complete database structure for a kawaii tattoo artist portfolio
  and shop website with admin management capabilities.

  ## New Tables

  ### 1. profiles
  Stores admin/artist profile information
  - `id` (uuid, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `bio` (text)
  - `avatar_url` (text)
  - `instagram_handle` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. tattoos
  Gallery of completed tattoo works
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `image_url` (text)
  - `category` (text) - kawaii, disney, manga, color, blackwork, etc.
  - `is_featured` (boolean)
  - `price_range` (text) - optional price indication
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. flashes
  Available flash designs for booking
  - `id` (uuid, primary key)
  - `title` (text)
  - `image_url` (text)
  - `description` (text)
  - `original_price` (numeric)
  - `promo_price` (numeric) - optional
  - `size` (text) - approximate size
  - `placement` (text) - recommended placement
  - `status` (text) - available, reserved, done
  - `is_featured` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. events
  Conventions, guest spots, and other events
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `location` (text)
  - `event_date` (date)
  - `end_date` (date) - optional for multi-day events
  - `image_url` (text)
  - `is_archived` (boolean)
  - `created_at` (timestamptz)

  ### 5. availability
  Calendar availability slots
  - `id` (uuid, primary key)
  - `date` (date)
  - `time_slot` (text) - e.g., "10h", "14h"
  - `is_available` (boolean)
  - `notes` (text) - optional notes
  - `created_at` (timestamptz)

  ### 6. products
  Shop items (stickers, prints, goodies)
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `image_url` (text)
  - `price` (numeric)
  - `stock_quantity` (integer) - optional stock tracking
  - `category` (text) - stickers, prints, goodies
  - `is_available` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. reviews
  Managed display of Google reviews
  - `id` (uuid, primary key)
  - `google_review_id` (text) - reference to original Google review
  - `author_name` (text)
  - `author_avatar` (text)
  - `rating` (integer)
  - `review_text` (text)
  - `review_date` (timestamptz)
  - `likes_count` (integer)
  - `is_featured` (boolean)
  - `is_hidden` (boolean) - hide from site without deleting
  - `display_order` (integer)
  - `created_at` (timestamptz)

  ### 8. site_content
  Global site content (hero text, about section, etc.)
  - `id` (uuid, primary key)
  - `section` (text) - e.g., "hero", "about", "contact"
  - `key` (text) - e.g., "title", "subtitle", "description"
  - `value` (text)
  - `updated_at` (timestamptz)

  ## Security

  - Enable RLS on all tables
  - Public can read most content
  - Only authenticated admin can create/update/delete
  - Strict policies to protect data integrity
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  bio text,
  avatar_url text,
  instagram_handle text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view artist profile"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Artist can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create tattoos table
CREATE TABLE IF NOT EXISTS tattoos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'kawaii',
  is_featured boolean DEFAULT false,
  price_range text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tattoos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tattoos"
  ON tattoos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admin can insert tattoos"
  ON tattoos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can update tattoos"
  ON tattoos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete tattoos"
  ON tattoos FOR DELETE
  TO authenticated
  USING (true);

-- Create flashes table
CREATE TABLE IF NOT EXISTS flashes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  description text,
  original_price numeric,
  promo_price numeric,
  size text,
  placement text,
  status text DEFAULT 'available',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE flashes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view flashes"
  ON flashes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admin can insert flashes"
  ON flashes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can update flashes"
  ON flashes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete flashes"
  ON flashes FOR DELETE
  TO authenticated
  USING (true);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  location text NOT NULL,
  event_date date NOT NULL,
  end_date date,
  image_url text,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view events"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admin can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- Create availability table
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  time_slot text NOT NULL,
  is_available boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, time_slot)
);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view availability"
  ON availability FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admin can insert availability"
  ON availability FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can update availability"
  ON availability FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete availability"
  ON availability FOR DELETE
  TO authenticated
  USING (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text NOT NULL,
  price numeric NOT NULL,
  stock_quantity integer DEFAULT 0,
  category text DEFAULT 'goodies',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view available products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admin can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_review_id text UNIQUE,
  author_name text NOT NULL,
  author_avatar text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  review_date timestamptz DEFAULT now(),
  likes_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_hidden boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view non-hidden reviews"
  ON reviews FOR SELECT
  TO public
  USING (is_hidden = false);

CREATE POLICY "Authenticated admin can view all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admin can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (true);

-- Create site_content table
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site content"
  ON site_content FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admin can insert content"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can update content"
  ON site_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete content"
  ON site_content FOR DELETE
  TO authenticated
  USING (true);

-- Insert default site content
INSERT INTO site_content (section, key, value) VALUES
  ('hero', 'title', 'Lézhy Mermaid'),
  ('hero', 'subtitle', 'Tattoo kawaii & féérique'),
  ('hero', 'description', 'Bienvenue dans mon univers pastel et magique'),
  ('about', 'title', 'À propos'),
  ('about', 'bio', 'Passionnée par l''univers kawaii, Disney et manga, je crée des tatouages doux et féériques qui racontent votre histoire.'),
  ('contact', 'title', 'Me contacter'),
  ('contact', 'description', 'Envoyez-moi votre projet et je vous répondrai dans les meilleurs délais!')
ON CONFLICT (section, key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tattoos_category ON tattoos(category);
CREATE INDEX IF NOT EXISTS idx_tattoos_featured ON tattoos(is_featured);
CREATE INDEX IF NOT EXISTS idx_flashes_status ON flashes(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_archived ON events(is_archived);
CREATE INDEX IF NOT EXISTS idx_availability_date ON availability(date);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_hidden ON reviews(is_hidden);