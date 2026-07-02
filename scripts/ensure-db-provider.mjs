import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const schemaPath = join(process.cwd(), "prisma", "schema.prisma");
const dbUrl = process.env.DATABASE_URL || "";
const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");

let schema = readFileSync(schemaPath, "utf8");

const sqliteProvider = 'provider = "sqlite"';
const postgresProvider = 'provider = "postgresql"';

let changed = false;
let targetProvider = isPostgres ? "postgresql" : "sqlite";
let currentProvider = schema.includes(postgresProvider) ? "postgresql" : "sqlite";

if (currentProvider !== targetProvider) {
  const from = currentProvider === "sqlite" ? sqliteProvider : postgresProvider;
  const to = targetProvider === "sqlite" ? sqliteProvider : postgresProvider;
  schema = schema.replace(from, to);
  writeFileSync(schemaPath, schema);
  changed = true;
  console.log(`Prisma provider switched: ${currentProvider} -> ${targetProvider}`);
} else {
  console.log(`Prisma provider already correct: ${currentProvider}`);
}

// When switching to postgresql, regenerate Prisma Client so it matches
if (changed && targetProvider === "postgresql") {
  try {
    console.log("Regenerating Prisma Client for postgresql...");
    execSync("npx prisma generate", { stdio: "inherit", cwd: process.cwd() });
    console.log("Prisma Client regenerated.");
  } catch (e) {
    console.error("Warning: prisma generate failed:", e.message || e);
  }
}
