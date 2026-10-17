import 'dotenv/config';  // ← Loads .env by default
import { sql } from "@/lib/db";

async function test() {
    const result = await sql`SELECT version()`;
    console.log(result[0]);
}

test();