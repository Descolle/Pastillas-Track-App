-- EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 👤 PROFILES (reemplaza users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  email VARCHAR(100),
  fecha_nacimiento DATE,
  genero VARCHAR(20),
  plan VARCHAR(10) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 💊 MEDICATIONS
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100),
  dosage VARCHAR(50),
  quantity INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ⏰ SCHEDULES
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  time TIME
);

-- 📅 INTAKES
CREATE TABLE IF NOT EXISTS intakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  date DATE,
  taken BOOLEAN DEFAULT FALSE
);

-- 💳 PAYMENTS (para PRO)
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id TEXT,
  transaction_id TEXT UNIQUE,
  platform TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
