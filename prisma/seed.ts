import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log('Starting exact DB seeding for Ascension OS (SQLite version)...');

  // 1. Worlds
  console.log('Seeding worlds...');
  // Note: We use an string constants for Worlds: THE_WEAK, THE_STUDENT, THE_BUILDER, THE_ENGINEER, THE_FOUNDER, THE_VISIONARY, THE_MASTER

  // 3. Setup Default Admin Profile
  const authUserId = "123e4567-e89b-12d3-a456-426614174000"; // Mock UI for now
  
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: authUserId }
  });

  if (!existingProfile) {
    console.log('Creating fresh level 1 player profile...');
    void prisma.profile.create({
      data: {
        userId: authUserId,
        playerName: "Player 1",
        currentTitle: "The Novice",
        hunterRank: "F",
        level: 1,
        currentWorld: "THE_WEAK",
        currentChapter: 1,
        chapterTitle: "Awakening",
        powerScore: 10,
        currentStreak: 0,
        momentum: 0,
        energy: 100,
        attributes: {
          create: [
             { attributeId: "BODY", level: 1, currentXp: 0 },
             { attributeId: "INTELLIGENCE", level: 1, currentXp: 0 },
             { attributeId: "DISCIPLINE", level: 1, currentXp: 0 },
             { attributeId: "WISDOM", level: 1, currentXp: 0 },
             { attributeId: "COMMUNICATION", level: 1, currentXp: 0 },
             { attributeId: "AI_ENGINEERING", level: 1, currentXp: 0 },
             { attributeId: "SOFTWARE_ENGINEERING", level: 1, currentXp: 0 },
             { attributeId: "PRODUCT_BUILDING", level: 1, currentXp: 0 },
             { attributeId: "BUSINESS", level: 1, currentXp: 0 },
             { attributeId: "LEADERSHIP", level: 1, currentXp: 0 },
             { attributeId: "CREATIVITY", level: 1, currentXp: 0 },
             { attributeId: "RELATIONSHIPS", level: 1, currentXp: 0 },
             { attributeId: "FINANCE", level: 1, currentXp: 0 },
             { attributeId: "EMOTIONAL_CONTROL", level: 1, currentXp: 0 }
          ]
        },
        futureSelves: {
          create: {
            vision: "I am ready to transform.",
            alignmentScore: 0
          }
        }
      }
    });

    console.log('Skipping dummy quests and bosses for a fresh start.');
  } else {
    console.log('Database already seeded!');
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
