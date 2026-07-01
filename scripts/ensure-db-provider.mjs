import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const schemaPath = join(process.cwd(), "prisma", "schema.prisma");
const dbUrl = process.env.DATABASE_URL || "";
const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");

let schema = readFileSync(schemaPath, "utf8");

const sqliteProvider = 'provider = "sqlite"';
const postgresProvider = 'provider = "postgresql"';

if (isPostgres) {
  if (schema.includes(sqliteProvider)) {
    schema = schema.replace(sqliteProvider, postgresProvider);
    writeFileSync(schemaPath, schema);
    console.log("Switched Prisma provider to postgresql for production build");
  }
} else {
  if (schema.includes(postgresProvider)) {
    schema = schema.replace(postgresProvider, sqliteProvider);
    writeFileSync(schemaPath, schema);
    console.log("Switched Prisma provider to sqlite for local dev");
  }
}
