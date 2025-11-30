#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n🚀 SOYO Environment Setup\n');

const backendEnvPath = path.join(__dirname, '../backend/.env');
const backendEnvExamplePath = path.join(__dirname, '../backend/.env.example');
const frontendEnvPath = path.join(__dirname, '../frontend/.env');
const frontendEnvExamplePath = path.join(__dirname, '../frontend/.env.example');

// Check and create backend .env
if (!fs.existsSync(backendEnvPath)) {
  if (fs.existsSync(backendEnvExamplePath)) {
    fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
    console.log('✅ Created backend/.env from .env.example');
    console.log('⚠️  Please update backend/.env with your MongoDB URI and JWT secrets\n');
  } else {
    console.log('⚠️  backend/.env.example not found');
  }
} else {
  console.log('✅ backend/.env already exists');
}

// Check and create frontend .env
if (!fs.existsSync(frontendEnvPath)) {
  if (fs.existsSync(frontendEnvExamplePath)) {
    fs.copyFileSync(frontendEnvExamplePath, frontendEnvPath);
    console.log('✅ Created frontend/.env from .env.example\n');
  } else {
    console.log('⚠️  frontend/.env.example not found');
  }
} else {
  console.log('✅ frontend/.env already exists\n');
}

console.log('📝 Next steps:');
console.log('   1. Edit backend/.env with your MongoDB URI');
console.log('   2. Edit backend/.env and set JWT_SECRET and JWT_REFRESH_SECRET');
console.log('   3. Run: npm run dev\n');
