import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const directory = 'dist/assets';
const files = readdirSync(directory).filter((file) => file.endsWith('.js'));
let totalGzip = 0;
let failed = false;
for (const file of files) {
  const code = readFileSync(join(directory, file));
  const gzip = gzipSync(code).length;
  totalGzip += gzip;
  if (code.length > 450 * 1024 || gzip > 150 * 1024) {
    console.error(`Over budget: ${file}: ${code.length} raw / ${gzip} gzip bytes`);
    failed = true;
  }
}
if (files.length === 0 || totalGzip > 400 * 1024) failed = true;
console.log(
  `Production JS: ${files.length} chunks, ${Math.round(totalGzip / 1024)} KiB gzip total; limits 450 KiB raw / 150 KiB gzip per chunk, 400 KiB gzip total.`,
);
if (failed) process.exitCode = 1;
