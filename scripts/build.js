// Gram Saksham Production Build Runner for Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==============================================');
console.log('  Gram Saksham Unified Production Build');
console.log('==============================================');
console.log('[Build] Current directory:', process.cwd());

const rootDir = process.cwd();
const clientDir = fs.existsSync(path.join(rootDir, 'client')) 
  ? path.join(rootDir, 'client') 
  : rootDir;

console.log('[Build] Client directory resolved to:', clientDir);

console.log('[Build] Step 1: Installing client dependencies...');
execSync('npm install', { cwd: clientDir, stdio: 'inherit' });

console.log('[Build] Step 2: Running Vite build...');
execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });

console.log('[Build] Step 3: Ensuring distribution folders exist in both locations...');
const clientDist = path.join(clientDir, 'dist');
const rootDist = path.join(rootDir, 'dist');

if (fs.existsSync(clientDist)) {
  if (clientDist !== rootDist) {
    fs.cpSync(clientDist, rootDist, { recursive: true });
    console.log('[Build] Synced client/dist to root dist successfully.');
  }
}

console.log('[Build] Build completed successfully with 0 errors!');
