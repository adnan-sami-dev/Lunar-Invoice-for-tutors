import 'dotenv/config';
import { sql } from '../lib/db';

async function test() {
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  console.log('Tables:', tables);
}

test();