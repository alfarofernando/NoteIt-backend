// migrate.js
const { execSync } = require("child_process");

// Ejecuta la migración de Prisma
execSync("npx prisma migrate deploy", { stdio: "inherit" });
