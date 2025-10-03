#!/usr/bin/env node

// 🔍 ELMS Backend - Test Path Validator  
// Validates that all test scripts work correctly from the tests folder

const fs = require('fs');
const path = require('path');

class TestPathValidator {
  constructor() {
    this.issues = [];
    this.validated = [];
  }

  async validateTestFiles() {
    console.log('🔍 ELMS Backend - Test Path Validator');
    console.log('═'.repeat(60));
    
    const testDir = __dirname;
    const files = fs.readdirSync(testDir).filter(f => 
      f.endsWith('.js') && 
      f !== 'validate-test-paths.js' && 
      f !== 'run-all-tests.js'
    );
    
    console.log(`📁 Scanning directory: ${testDir}`);
    console.log(`📄 Found ${files.length} test files\n`);
    
    for (const file of files) {
      await this.validateFile(file);
    }
    
    this.printSummary();
  }

  async validateFile(filename) {
    console.log(`🔍 Validating: ${filename}`);
    
    try {
      const filePath = path.join(__dirname, filename);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for common path issues
      const checks = [
        {
          name: 'Relative Path Imports',
          pattern: /require\(['"]\.\.?\//g,
          issue: 'Contains relative imports that may break when run from tests folder'
        },
        {
          name: 'File System Paths',  
          pattern: /['"]\.\.[\/\\]/g,
          issue: 'Contains relative file system paths'
        },
        {
          name: 'Process.cwd() Usage',
          pattern: /process\.cwd\(\)/g,
          issue: 'Uses process.cwd() which depends on execution directory'
        },
        {
          name: '__dirname Usage',
          pattern: /__dirname/g,
          issue: null // This is good for location-independent paths
        }
      ];
      
      let hasIssues = false;
      
      for (const check of checks) {
        const matches = content.match(check.pattern);
        if (matches && check.issue) {
          console.log(`   ⚠️ ${check.name}: ${check.issue}`);
          console.log(`      Found ${matches.length} occurrence(s)`);
          hasIssues = true;
          this.issues.push(`${filename}: ${check.issue}`);
        } else if (matches && !check.issue) {
          console.log(`   ✅ ${check.name}: Good practice detected`);
        }
      }
      
      // Check for hardcoded paths
      const hardcodedPaths = content.match(/['"](C:|\/Users|\/home)[^'"]*['"]/g);
      if (hardcodedPaths) {
        console.log(`   ⚠️ Hardcoded Paths: Found ${hardcodedPaths.length} hardcoded path(s)`);
        hardcodedPaths.forEach(p => console.log(`      - ${p}`));
        hasIssues = true;
        this.issues.push(`${filename}: Contains hardcoded paths`);
      }
      
      // Check API endpoints
      const apiEndpoints = content.match(/(localhost|127\.0\.0\.1):(\d+)/g);
      if (apiEndpoints) {
        console.log(`   ℹ️ API Endpoints: Uses ${[...new Set(apiEndpoints)].join(', ')}`);
      }
      
      if (!hasIssues) {
        console.log(`   ✅ No path issues detected`);
        this.validated.push(filename);
      }
      
    } catch (error) {
      console.log(`   ❌ Error reading file: ${error.message}`);
      this.issues.push(`${filename}: Could not read file - ${error.message}`);
    }
    
    console.log('');
  }

  printSummary() {
    console.log('📊 VALIDATION SUMMARY');
    console.log('═'.repeat(60));
    console.log(`✅ Clean files: ${this.validated.length}`);
    console.log(`⚠️ Files with issues: ${this.issues.length}`);
    
    if (this.validated.length > 0) {
      console.log('\n✅ VALIDATED FILES (No path issues):');
      this.validated.forEach(file => {
        console.log(`   • ${file}`);
      });
    }
    
    if (this.issues.length > 0) {
      console.log('\n⚠️ ISSUES FOUND:');
      this.issues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
      
      console.log('\n💡 RECOMMENDATIONS:');
      console.log('   • Use relative imports carefully or avoid them');
      console.log('   • Use __dirname for location-independent paths');
      console.log('   • Avoid hardcoded absolute paths');
      console.log('   • Test scripts should be portable across environments');
    } else {
      console.log('\n🎉 ALL TEST FILES ARE PATH-SAFE!');
      console.log('✨ All scripts should work correctly from the tests folder');
    }
    
    console.log('\n📝 TESTING RECOMMENDATIONS:');
    console.log('   1. Always run tests from the tests folder:');
    console.log('      cd tests && node script-name.js');
    console.log('   2. Use the test runner for multiple tests:');
    console.log('      cd tests && node run-all-tests.js');
    console.log('   3. Check individual tests with:');
    console.log('      cd tests && node run-all-tests.js <test-name>');
    
    console.log('═'.repeat(60));
  }
}

// Run validation
const validator = new TestPathValidator();
validator.validateTestFiles().catch(error => {
  console.error('💥 Validation failed:', error.message);
  process.exit(1);
});