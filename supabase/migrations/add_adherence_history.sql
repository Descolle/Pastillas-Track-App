-- 📊 ADHERENCE HISTORY TABLE
-- Track daily medication adherence for historical reporting

CREATE TABLE IF NOT EXISTS adherence_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_medications INT NOT NULL,
  taken_medications INT NOT NULL,
  adherence_percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 📈 INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_adherence_history_user_date ON adherence_history(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_adherence_history_schedule_date ON adherence_history(schedule_id, date DESC);
