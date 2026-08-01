#!/usr/bin/env node
/**
 * Writes the Play App Signing SHA-256 certificate fingerprint into
 * public/.well-known/assetlinks.json so the Android TWA verifies and runs
 * without a browser URL bar.
 *
 * Get the fingerprint from Play Console:
 *   Release > Setup > App signing > "App signing key certificate" > SHA-256
 *
 * Usage:
 *   node scripts/set-assetlinks-fingerprint.mjs AB:CD:EF:...:12
 *   node scripts/set-assetlinks-fingerprint.mjs AB:CD:... --package app.digitalhygiene.hygi
 */
import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../public/.well-known/assetlinks.json", import.meta.url);
const args = process.argv.slice(2);
const pkgIndex = args.indexOf("--package");
const packageName = pkgIndex === -1 ? null : args[pkgIndex + 1];
const fingerprintArg = args.find((a) => a !== "--package" && a !== packageName);

if (!fingerprintArg) {
  console.error("Missing fingerprint. Usage: node scripts/set-assetlinks-fingerprint.mjs <SHA256>");
  process.exit(1);
}

const fingerprint = fingerprintArg.trim().toUpperCase();
if (!/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(fingerprint)) {
  console.error(
    "Fingerprint must be 32 colon-separated hex byte pairs, e.g. AB:CD:...:12 (got " +
      fingerprint.length +
      " chars).",
  );
  process.exit(1);
}

const statements = JSON.parse(await readFile(FILE, "utf8"));
for (const statement of statements) {
  statement.target.sha256_cert_fingerprints = [fingerprint];
  if (packageName) statement.target.package_name = packageName;
}

await writeFile(FILE, JSON.stringify(statements, null, 2) + "\n");
console.log("Updated public/.well-known/assetlinks.json");
console.log("  package_name:", statements[0].target.package_name);
console.log("  sha256:", fingerprint);
console.log("Republish the site, then reinstall the app to clear the URL bar.");
