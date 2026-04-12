import { defineConfig } from "@prisma/config";

export const prismaConfig = defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
