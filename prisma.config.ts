import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://postgres.xkiuyiyxewcpdmsjnrnc:NdUJMn6EurWQoGzh6A4mBcd4@aws-0-eu-west-1.pooler.supabase.com:5432/postgres",
  },
});