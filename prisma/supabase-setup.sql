-- ============================================
-- Ascension OS - Production Supabase Setup
-- Run this in Supabase Dashboard -> SQL Editor
-- ============================================

-- 1. Enable RLS on all tables
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Attribute" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SubSkill" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AttributeHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SkillNode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Boss" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BossSubtask" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EnemyProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Book" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JournalEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "KnowledgeItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Achievement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAchievement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Title" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserTitle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserIdentity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FutureSelf" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "XpEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StreakRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserReward" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Habit" ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies
-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON "Profile"
  FOR SELECT USING (auth.uid()::text = userId);
CREATE POLICY "Users can update own profile" ON "Profile"
  FOR UPDATE USING (auth.uid()::text = userId);

-- Users can manage their own attributes
CREATE POLICY "Users can manage own attributes" ON "Attribute"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "Attribute".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own quests
CREATE POLICY "Users can manage own quests" ON "Quest"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "Quest".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own bosses
CREATE POLICY "Users can manage own bosses" ON "Boss"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "Boss".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own boss subtasks
CREATE POLICY "Users can manage own boss subtasks" ON "BossSubtask"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Boss" 
      JOIN "Profile" ON "Profile".id = "Boss".profileId 
      WHERE "Boss".id = "BossSubtask".bossId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own enemies
CREATE POLICY "Users can manage own enemies" ON "EnemyProgress"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "EnemyProgress".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own projects
CREATE POLICY "Users can manage own projects" ON "Project"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "Project".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own books
CREATE POLICY "Users can manage own books" ON "Book"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "Book".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own courses
CREATE POLICY "Users can manage own courses" ON "Course"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "Course".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own journal entries
CREATE POLICY "Users can manage own journals" ON "JournalEntry"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "JournalEntry".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own knowledge items
CREATE POLICY "Users can manage own knowledge" ON "KnowledgeItem"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "KnowledgeItem".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can view global achievements
CREATE POLICY "Anyone can view achievements" ON "Achievement"
  FOR SELECT USING (true);

-- Users can manage their own user achievements
CREATE POLICY "Users can manage own user achievements" ON "UserAchievement"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "UserAchievement".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can view global titles
CREATE POLICY "Anyone can view titles" ON "Title"
  FOR SELECT USING (true);

-- Users can manage their own user titles
CREATE POLICY "Users can manage own user titles" ON "UserTitle"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "UserTitle".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own identities
CREATE POLICY "Users can manage own identities" ON "UserIdentity"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "UserIdentity".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own future selves
CREATE POLICY "Users can manage own future selves" ON "FutureSelf"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "FutureSelf".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own XP events
CREATE POLICY "Users can manage own xp events" ON "XpEvent"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "XpEvent".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own streak records
CREATE POLICY "Users can manage own streak records" ON "StreakRecord"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "StreakRecord".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own rewards
CREATE POLICY "Users can manage own rewards" ON "UserReward"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "UserReward".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own notifications
CREATE POLICY "Users can manage own notifications" ON "Notification"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "Notification".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- Users can manage their own habits
CREATE POLICY "Users can manage own habits" ON "Habit"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile" WHERE "Profile".id = "Habit".profileId AND "Profile".userId = auth.uid()::text
    )
  );

-- 3. Create trigger function for updatedAt
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updatedAt
-- Note: These won't error if tables/columns don't exist
DO $$
BEGIN
  -- Profile
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Profile') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_Profile ON "Profile";
    CREATE TRIGGER handle_updated_at_Profile
      BEFORE UPDATE ON "Profile" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- Attribute
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Attribute') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_Attribute ON "Attribute";
    CREATE TRIGGER handle_updated_at_Attribute
      BEFORE UPDATE ON "Attribute" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- SubSkill
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'SubSkill') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_SubSkill ON "SubSkill";
    CREATE TRIGGER handle_updated_at_SubSkill
      BEFORE UPDATE ON "SubSkill" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- Quest
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Quest') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_Quest ON "Quest";
    CREATE TRIGGER handle_updated_at_Quest
      BEFORE UPDATE ON "Quest" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- Boss
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Boss') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_Boss ON "Boss";
    CREATE TRIGGER handle_updated_at_Boss
      BEFORE UPDATE ON "Boss" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- Project
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Project') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_Project ON "Project";
    CREATE TRIGGER handle_updated_at_Project
      BEFORE UPDATE ON "Project" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- Book
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Book') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_Book ON "Book";
    CREATE TRIGGER handle_updated_at_Book
      BEFORE UPDATE ON "Book" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- Course
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Course') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_Course ON "Course";
    CREATE TRIGGER handle_updated_at_Course
      BEFORE UPDATE ON "Course" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- JournalEntry
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'JournalEntry') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_JournalEntry ON "JournalEntry";
    CREATE TRIGGER handle_updated_at_JournalEntry
      BEFORE UPDATE ON "JournalEntry" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- KnowledgeItem
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'KnowledgeItem') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_KnowledgeItem ON "KnowledgeItem";
    CREATE TRIGGER handle_updated_at_KnowledgeItem
      BEFORE UPDATE ON "KnowledgeItem" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- UserIdentity
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'UserIdentity') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_UserIdentity ON "UserIdentity";
    CREATE TRIGGER handle_updated_at_UserIdentity
      BEFORE UPDATE ON "UserIdentity" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- FutureSelf
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'FutureSelf') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_FutureSelf ON "FutureSelf";
    CREATE TRIGGER handle_updated_at_FutureSelf
      BEFORE UPDATE ON "FutureSelf" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- StreakRecord
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'StreakRecord') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_StreakRecord ON "StreakRecord";
    CREATE TRIGGER handle_updated_at_StreakRecord
      BEFORE UPDATE ON "StreakRecord" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  -- Habit
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Habit') THEN
    DROP TRIGGER IF EXISTS handle_updated_at_Habit ON "Habit";
    CREATE TRIGGER handle_updated_at_Habit
      BEFORE UPDATE ON "Habit" FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;

-- 4. Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
