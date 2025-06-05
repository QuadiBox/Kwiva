// generate-cors.cjs
require('dotenv').config({ path: '.env.local' });
const fs = require("fs");

const origin = process.env.CORS_ORIGIN;

if (!origin) {
  console.error("❌ CORS_ORIGIN is not defined in your .env file.");
  process.exit(1);
}

const corsRules = [
  {
    origin: [origin],
    method: ["GET", "POST", "PUT"],
    maxAgeSeconds: 3600,
    responseHeader: ["Content-Type"]
  }
];

fs.writeFileSync("cors.json", JSON.stringify(corsRules, null, 2));
console.log(`✅ CORS configuration written for origin: ${origin}`);