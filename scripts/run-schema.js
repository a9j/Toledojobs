#!/usr/bin/env node
/**
 * Run this locally to execute schema.sql against your Supabase database.
 *
 * Usage:
 *   npx supabase db execute --project-ref czevbnnohvlcoseqjjvd < supabase/schema.sql
 *
 * Or, if you have the database password:
 *   node scripts/run-schema.js
 *
 * Requires: SUPABASE_DB_PASSWORD environment variable
 * (Find it in Supabase Dashboard → Settings → Database → Connection string)
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const projectRef = 'czevbnnohvlcoseqjjvd';
const schemaPath = new URL('../supabase/schema.sql', import.meta.url).pathname;

console.log('Reading schema.sql...');
const sql = readFileSync(schemaPath, 'utf-8');

// Split into individual statements for better error reporting
const statements = sql
  .split(/;\s*\n/)
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--'));

console.log(`Found ${statements.length} SQL statements to execute.\n`);

// Try using Supabase CLI
try {
  console.log('Executing via Supabase CLI...');
  execSync(`npx supabase db execute --project-ref ${projectRef} < "${schemaPath}"`, {
    stdio: 'inherit',
    timeout: 60000,
  });
  console.log('\nSchema applied successfully!');
} catch {
  console.error('\nSupabase CLI execution failed.');
  console.error('Please paste supabase/schema.sql into your Supabase SQL Editor:');
  console.error(`  https://supabase.com/dashboard/project/${projectRef}/sql\n`);
  process.exit(1);
}
