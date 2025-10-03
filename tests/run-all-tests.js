#!/usr/bin/env node

// 🧪 ELMS Backend - Comprehensive Test Runner
// This script runs all available tests and provides a summary

const { spawn } = require('child_process');
const path = require('path');

class TestRunner {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0
    };
    
    this.tests = [
      {
        name: 'Server Connectivity',
        file: 'test-connection.js',
        description: 'Basic server health and connectivity test',
        category: 'Core'
      },
      {
        name: 'Admin API Comprehensive',
        file: 'test-admin-comprehensive.js',
        description: 'Full admin API test suite with success tracking',
        category: 'Admin'
      },
      {
        name: 'Authentication System',
        file: 'test-auth.js',
        description: 'Complete authentication flow testing',
        category: 'Auth'
      },
      {
        name: 'User Verification',
        file: 'verify-user.js',
        description: 'Check test user existence in database',
        category: 'Debug'
      }
    ];
  }

  async runTest(test) {
    return new Promise((resolve) => {
      console.log(`\n🧪 Running: ${test.name}`);
      console.log(`📄 File: ${test.file}`);
      console.log(`📝 Description: ${test.description}`);
      console.log('─'.repeat(60));
      
      const child = spawn('node', [test.file], {
        cwd: __dirname,
        stdio: 'inherit'
      });

      const timeout = setTimeout(() => {
        child.kill();
        console.log('\n⏰ Test timed out after 30 seconds');
        resolve({ success: false, reason: 'timeout' });
      }, 30000);

      child.on('close', (code) => {
        clearTimeout(timeout);
        const success = code === 0;
        console.log(`\n${success ? '✅' : '❌'} Test ${success ? 'PASSED' : 'FAILED'} (Exit code: ${code})`);
        resolve({ success, reason: success ? 'passed' : 'failed', code });
      });

      child.on('error', (error) => {
        clearTimeout(timeout);
        console.log(`\n💥 Test crashed: ${error.message}`);
        resolve({ success: false, reason: 'crashed', error: error.message });
      });
    });
  }

  async runAllTests() {
    console.log('🚀 ELMS Backend Test Runner');
    console.log('═'.repeat(60));
    console.log(`📊 Total Tests: ${this.tests.length}`);
    console.log(`📁 Test Directory: ${__dirname}`);
    console.log(`⏰ Started: ${new Date().toISOString()}`);
    console.log('═'.repeat(60));

    for (let i = 0; i < this.tests.length; i++) {
      const test = this.tests[i];
      this.results.total++;
      
      console.log(`\n[${i + 1}/${this.tests.length}] ${test.category.toUpperCase()} CATEGORY`);
      
      try {
        const result = await this.runTest(test);
        
        if (result.success) {
          this.results.passed++;
        } else {
          this.results.failed++;
        }
        
        // Add a separator between tests
        console.log('\n' + '═'.repeat(60));
        
      } catch (error) {
        console.log(`💥 Unexpected error running ${test.name}:`, error.message);
        this.results.failed++;
      }
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\n🏁 TEST EXECUTION SUMMARY');
    console.log('═'.repeat(60));
    console.log(`📊 Total Tests Run: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⏭️ Skipped: ${this.results.skipped}`);
    
    const successRate = this.results.total > 0 
      ? ((this.results.passed / this.results.total) * 100).toFixed(1)
      : 0;
    
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log(`⏰ Completed: ${new Date().toISOString()}`);
    
    if (this.results.failed > 0) {
      console.log('\n⚠️ Some tests failed. Check the output above for details.');
      console.log('💡 Common issues:');
      console.log('   • Server not running on port 5000');
      console.log('   • Database connection issues');  
      console.log('   • Missing test data in database');
      console.log('   • Network connectivity problems');
    } else {
      console.log('\n🎉 All tests passed successfully!');
      console.log('✨ Your ELMS Backend is working perfectly!');
    }
    
    console.log('═'.repeat(60));
  }

  async runSingleTest(testName) {
    const test = this.tests.find(t => 
      t.file === testName || 
      t.name.toLowerCase().includes(testName.toLowerCase()) ||
      t.file === `${testName}.js`
    );
    
    if (!test) {
      console.log(`❌ Test not found: ${testName}`);
      console.log('\n📋 Available tests:');
      this.tests.forEach((t, i) => {
        console.log(`   ${i + 1}. ${t.name} (${t.file})`);
      });
      return;
    }
    
    console.log(`🎯 Running single test: ${test.name}`);
    console.log('═'.repeat(60));
    
    this.results.total = 1;
    const result = await this.runTest(test);
    
    if (result.success) {
      this.results.passed = 1;
    } else {
      this.results.failed = 1;
    }
    
    this.printSummary();
  }

  listTests() {
    console.log('📋 Available Tests:');
    console.log('═'.repeat(60));
    
    const categories = [...new Set(this.tests.map(t => t.category))];
    
    categories.forEach(category => {
      console.log(`\n📂 ${category.toUpperCase()} TESTS:`);
      this.tests
        .filter(t => t.category === category)
        .forEach((test, i) => {
          console.log(`   ${test.file}`);
          console.log(`   └─ ${test.description}`);
        });
    });
    
    console.log('\n💡 Usage:');
    console.log('   node run-all-tests.js              # Run all tests');
    console.log('   node run-all-tests.js <test-name>  # Run specific test');
    console.log('   node run-all-tests.js --list       # Show this list');
  }
}

// Main execution
async function main() {
  const runner = new TestRunner();
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    runner.listTests();
    return;
  }
  
  if (args.includes('--list') || args.includes('-l')) {
    runner.listTests();
    return;
  }
  
  if (args.length > 0) {
    // Run specific test
    await runner.runSingleTest(args[0]);
  } else {
    // Run all tests
    await runner.runAllTests();
  }
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled error:', error.message);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n\n⏹️ Test execution interrupted by user');
  process.exit(0);
});

main().catch(error => {
  console.error('💥 Fatal error:', error.message);
  process.exit(1);
});