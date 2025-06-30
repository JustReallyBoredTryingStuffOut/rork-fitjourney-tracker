#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing React Native 0.79+ Flow syntax issues...\n');

// Pattern to find all problematic Flow component syntax
const componentPattern = /const\s+(\w+)\s*:\s*component\s*\(\s*([^)]+)\s*\)\s*=\s*React\.forwardRef/g;

// Replacement pattern
const replacementPattern = 'const $1: React.ComponentType<$1Props> = React.forwardRef';

// Files to scan and patch
const patterns = [
  'node_modules/react-native/Libraries/**/*.js',
  'node_modules/react-native/Libraries/**/*.jsx',
  'node_modules/react-native/Libraries/**/*.ts',
  'node_modules/react-native/Libraries/**/*.tsx'
];

let totalFiles = 0;
let patchedFiles = 0;

patterns.forEach(pattern => {
  const files = glob.sync(pattern, { ignore: ['**/node_modules/**/node_modules/**'] });
  
  files.forEach(file => {
    totalFiles++;
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      if (componentPattern.test(content)) {
        console.log(`📝 Patching: ${file}`);
        
        // Apply the replacement
        const newContent = content.replace(componentPattern, replacementPattern);
        
        // Write the patched content back
        fs.writeFileSync(file, newContent, 'utf8');
        patchedFiles++;
      }
    } catch (error) {
      console.log(`⚠️  Error processing ${file}: ${error.message}`);
    }
  });
});

console.log(`\n✅ Patching complete!`);
console.log(`📊 Files scanned: ${totalFiles}`);
console.log(`🔧 Files patched: ${patchedFiles}`);

if (patchedFiles > 0) {
  console.log(`\n🎉 Successfully patched ${patchedFiles} files!`);
  console.log(`💡 You can now run your Xcode build without Flow syntax errors.`);
} else {
  console.log(`\nℹ️  No files needed patching.`);
}

console.log(`\n💡 To re-run this fix after npm install, just run: node fix-flow-syntax.js`); 