import {neon} from '@neondatabase/serverless';

// using pooled connection for queries made during runtime
export const sql = neon(process.env.DATABASE_URL!);             // -> the neon() function returns a query function
                                                                // which we can use as a tagged template literal