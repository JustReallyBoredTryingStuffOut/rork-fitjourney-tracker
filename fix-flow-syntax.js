#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Enhanced Flow syntax patterns that need to be removed
const flowPatterns = [
  // Remove type annotations from const declarations
  {
    pattern: /const\s+(\w+)\s*:\s*[^=]+=\s*/g,
    replacement: 'const $1 = '
  },
  // Remove type annotations from function parameters
  {
    pattern: /:\s*[^,)]+(?=[,)])/g,
    replacement: ''
  },
  // Remove type assertions at the end of objects
  {
    pattern: /\}\s+as\s+[^;]+;/g,
    replacement: '};'
  },
  // Remove type declarations
  {
    pattern: /type\s+\w+\s*=\s*[^;]+;/g,
    replacement: ''
  },
  // Remove interface declarations
  {
    pattern: /interface\s+\w+\s*\{[^}]*\}/g,
    replacement: ''
  },
  // Remove generic type parameters
  {
    pattern: /<[^>]+>/g,
    replacement: ''
  },
  // Remove optional parameter markers
  {
    pattern: /\?/g,
    replacement: ''
  },
  // Remove Flow pragma comments
  {
    pattern: /\/\*\s*@flow\s*\*\/\s*/g,
    replacement: ''
  },
  // Remove Flow ignore comments
  {
    pattern: /\/\*\s*\$FlowFixMe[^*]*\*\/\s*/g,
    replacement: ''
  },
  // Remove Flow type imports
  {
    pattern: /import\s+type\s+[^;]+;/g,
    replacement: ''
  },
  // Remove Flow type exports
  {
    pattern: /export\s+type\s+[^;]+;/g,
    replacement: ''
  }
];

function fixFlowSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let modified = false;

    // Apply each pattern
    flowPatterns.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findAndFixReactNativeFiles() {
  const reactNativePath = path.join(__dirname, 'node_modules', 'react-native');
  
  if (!fs.existsSync(reactNativePath)) {
    console.log('❌ React Native not found in node_modules');
    return;
  }

  // Find ALL .js files in react-native (not just Libraries)
  const files = glob.sync('node_modules/react-native/**/*.js', {
    ignore: ['**/node_modules/**/node_modules/**']
  });

  console.log(`🔍 Found ${files.length} JavaScript files in React Native...`);

  let fixedCount = 0;
  files.forEach(file => {
    if (fixFlowSyntax(file)) {
      fixedCount++;
    }
  });

  console.log(`\n🎉 Fixed ${fixedCount} files with Flow syntax issues!`);
}

// Run the fix
console.log('🔧 Starting comprehensive Flow syntax fix for React Native files...\n');
findAndFixReactNativeFiles();
console.log('\n✨ Flow syntax fix complete!'); 