/**
 * ============================================================
 * PROFESSIONAL TEST REPORT GENERATOR
 * ============================================================
 * 
 * Generates comprehensive HTML and JSON test reports
 * with detailed element information and test metrics
 * 
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

class TestReportGenerator {
  constructor(testResults) {
    this.testResults = testResults;
    this.reportDir = './test-reports';
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Generate all report formats
   */
  async generateAllReports() {
    // Create report directory
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }

    // Generate different report formats
    await this.generateHTMLReport();
    await this.generateJSONReport();
    await this.generateMarkdownReport();
    await this.generateCSVReport();

    console.log('\nTEST REPORTS GENERATED:');
    console.log(`HTML Report: ${path.join(this.reportDir, `test-report-${this.timestamp}.html`)}`);
    console.log(`JSON Report: ${path.join(this.reportDir, `test-report-${this.timestamp}.json`)}`);
    console.log(`Markdown Report: ${path.join(this.reportDir, `test-report-${this.timestamp}.md`)}`);
    console.log(`CSV Report: ${path.join(this.reportDir, `test-report-${this.timestamp}.csv`)}`);
  }

  /**
   * Generate HTML Report
   */
  async generateHTMLReport() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selenium Test Report - ${this.testResults.testName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        .summary-card h3 {
            font-size: 0.9em;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        .summary-card .value {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
        }
        .summary-card.success .value {
            color: #28a745;
        }
        .summary-card.failed .value {
            color: #dc3545;
        }
        .summary-card.duration .value {
            color: #17a2b8;
        }
        .test-details {
            padding: 30px;
        }
        .test-details h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        .test-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .test-info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        .test-info-item {
            display: flex;
            align-items: center;
        }
        .test-info-item strong {
            min-width: 120px;
            color: #666;
        }
        .step-container {
            margin-bottom: 20px;
        }
        .step {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
        }
        .step:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        .step.success {
            border-left: 5px solid #28a745;
        }
        .step.failed {
            border-left: 5px solid #dc3545;
        }
        .step.pending {
            border-left: 5px solid #ffc107;
        }
        .step-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .step-number {
            font-weight: bold;
            color: #667eea;
            font-size: 1.2em;
        }
        .step-status {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
            text-transform: uppercase;
        }
        .step-status.success {
            background: #d4edda;
            color: #155724;
        }
        .step-status.failed {
            background: #f8d7da;
            color: #721c24;
        }
        .step-status.pending {
            background: #fff3cd;
            color: #856404;
        }
        .step-description {
            font-size: 1.1em;
            margin-bottom: 10px;
            color: #333;
        }
        .step-details {
            font-size: 0.9em;
            color: #666;
            margin-top: 10px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .step-timestamp {
            font-size: 0.85em;
            color: #999;
            margin-top: 5px;
        }
        .screenshot-link {
            display: inline-block;
            margin-top: 10px;
            padding: 8px 15px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 0.9em;
            transition: background 0.3s ease;
        }
        .screenshot-link:hover {
            background: #5568d3;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #e9ecef;
        }
        .progress-bar {
            width: 100%;
            height: 30px;
            background: #e9ecef;
            border-radius: 15px;
            overflow: hidden;
            margin: 20px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            transition: width 0.5s ease;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
            }
            .step:hover {
                transform: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${this.testResults.testName}</h1>
            <p>Automated Selenium Test Execution Report</p>
            <p style="font-size: 0.9em; margin-top: 10px;">Generated: ${new Date(this.testResults.startTime).toLocaleString()}</p>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>Total Steps</h3>
                <div class="value">${this.testResults.steps.length}</div>
            </div>
            <div class="summary-card success">
                <h3>Passed</h3>
                <div class="value">${this.testResults.steps.filter(s => s.status === 'success').length}</div>
            </div>
            <div class="summary-card failed">
                <h3>Failed</h3>
                <div class="value">${this.testResults.steps.filter(s => s.status === 'failed').length}</div>
            </div>
            <div class="summary-card duration">
                <h3>Duration</h3>
                <div class="value">${this.testResults.duration ? this.testResults.duration.toFixed(2) : 'N/A'}s</div>
            </div>
        </div>

        <div class="test-details">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(this.testResults.steps.filter(s => s.status === 'success').length / this.testResults.steps.length * 100).toFixed(1)}%">
                    ${(this.testResults.steps.filter(s => s.status === 'success').length / this.testResults.steps.length * 100).toFixed(1)}% Passed
                </div>
            </div>

            <div class="test-info">
                <h2>Test Configuration</h2>
                <div class="test-info-grid">
                    <div class="test-info-item">
                        <strong>Test User:</strong>
                        <span>${this.testResults.testUser || 'N/A'}</span>
                    </div>
                    <div class="test-info-item">
                        <strong>Frontend URL:</strong>
                        <span>${this.testResults.frontendUrl || 'N/A'}</span>
                    </div>
                    <div class="test-info-item">
                        <strong>Backend URL:</strong>
                        <span>${this.testResults.backendUrl || 'N/A'}</span>
                    </div>
                    <div class="test-info-item">
                        <strong>Browser:</strong>
                        <span>Chrome (Latest)</span>
                    </div>
                    <div class="test-info-item">
                        <strong>Start Time:</strong>
                        <span>${new Date(this.testResults.startTime).toLocaleString()}</span>
                    </div>
                    <div class="test-info-item">
                        <strong>End Time:</strong>
                        <span>${this.testResults.endTime ? new Date(this.testResults.endTime).toLocaleString() : 'N/A'}</span>
                    </div>
                </div>
            </div>

            <h2>Test Steps Execution</h2>
            <div class="step-container">
                ${this.testResults.steps.map(step => `
                <div class="step ${step.status}">
                    <div class="step-header">
                        <div class="step-number">Step ${step.number}</div>
                        <div class="step-status ${step.status}">${step.status}</div>
                    </div>
                    <div class="step-description">${step.description}</div>
                    ${step.details ? `<div class="step-details"><strong>Details:</strong> ${step.details}</div>` : ''}
                    <div class="step-timestamp">Executed at: ${new Date(step.timestamp).toLocaleString()}</div>
                    ${step.completedAt ? `<div class="step-timestamp">Completed at: ${new Date(step.completedAt).toLocaleString()}</div>` : ''}
                </div>
                `).join('')}
            </div>
        </div>

        <div class="footer">
            <p><strong>ELMS - E-Learning Management System</strong></p>
            <p>Automated Testing Framework | Selenium WebDriver</p>
            <p style="margin-top: 10px; font-size: 0.9em;">Report generated on ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>`;

    const filename = path.join(this.reportDir, `test-report-${this.timestamp}.html`);
    fs.writeFileSync(filename, html);
    return filename;
  }

  /**
   * Generate JSON Report
   */
  async generateJSONReport() {
    const jsonReport = {
      testName: this.testResults.testName,
      startTime: this.testResults.startTime,
      endTime: this.testResults.endTime,
      duration: this.testResults.duration,
      success: this.testResults.success,
      error: this.testResults.error,
      configuration: {
        testUser: this.testResults.testUser,
        frontendUrl: this.testResults.frontendUrl,
        backendUrl: this.testResults.backendUrl,
        browser: 'Chrome',
        timeout: this.testResults.timeout
      },
      summary: {
        totalSteps: this.testResults.steps.length,
        passedSteps: this.testResults.steps.filter(s => s.status === 'success').length,
        failedSteps: this.testResults.steps.filter(s => s.status === 'failed').length,
        pendingSteps: this.testResults.steps.filter(s => s.status === 'pending').length,
        successRate: ((this.testResults.steps.filter(s => s.status === 'success').length / this.testResults.steps.length) * 100).toFixed(2) + '%'
      },
      steps: this.testResults.steps.map(step => ({
        number: step.number,
        description: step.description,
        status: step.status,
        details: step.details,
        timestamp: step.timestamp,
        completedAt: step.completedAt,
        duration: step.completedAt ? ((new Date(step.completedAt) - new Date(step.timestamp)) / 1000).toFixed(2) + 's' : null
      })),
      generatedAt: new Date().toISOString()
    };

    const filename = path.join(this.reportDir, `test-report-${this.timestamp}.json`);
    fs.writeFileSync(filename, JSON.stringify(jsonReport, null, 2));
    return filename;
  }

  /**
   * Generate Markdown Report
   */
  async generateMarkdownReport() {
    const successCount = this.testResults.steps.filter(s => s.status === 'success').length;
    const failedCount = this.testResults.steps.filter(s => s.status === 'failed').length;
    const successRate = ((successCount / this.testResults.steps.length) * 100).toFixed(1);

    const md = `# Selenium Test Report

## ${this.testResults.testName}

**Generated:** ${new Date().toLocaleString()}

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Steps | ${this.testResults.steps.length} |
| Passed | ${successCount} |
| Failed | ${failedCount} |
| Success Rate | ${successRate}% |
| Duration | ${this.testResults.duration ? this.testResults.duration.toFixed(2) + 's' : 'N/A'} |
| Status | ${this.testResults.success ? 'PASSED' : 'FAILED'} |

---

## Test Configuration

- **Test User:** ${this.testResults.testUser || 'N/A'}
- **Frontend URL:** ${this.testResults.frontendUrl || 'N/A'}
- **Backend URL:** ${this.testResults.backendUrl || 'N/A'}
- **Browser:** Chrome (Latest)
- **Start Time:** ${new Date(this.testResults.startTime).toLocaleString()}
- **End Time:** ${this.testResults.endTime ? new Date(this.testResults.endTime).toLocaleString() : 'N/A'}

---

## Test Steps Details

${this.testResults.steps.map(step => `
### Step ${step.number}: ${step.description}

- **Status:** ${step.status.toUpperCase()}
- **Timestamp:** ${new Date(step.timestamp).toLocaleString()}
${step.completedAt ? `- **Completed:** ${new Date(step.completedAt).toLocaleString()}` : ''}
${step.details ? `- **Details:** ${step.details}` : ''}

---
`).join('\n')}

## Conclusion

Test execution ${this.testResults.success ? 'completed successfully' : 'failed'}. ${successCount} out of ${this.testResults.steps.length} steps passed.

---

*Report generated by ELMS Automated Testing Framework*
`;

    const filename = path.join(this.reportDir, `test-report-${this.timestamp}.md`);
    fs.writeFileSync(filename, md);
    return filename;
  }

  /**
   * Generate CSV Report
   */
  async generateCSVReport() {
    const headers = ['Step Number', 'Description', 'Status', 'Details', 'Start Time', 'End Time', 'Duration (s)'];
    
    const rows = this.testResults.steps.map(step => {
      const duration = step.completedAt 
        ? ((new Date(step.completedAt) - new Date(step.timestamp)) / 1000).toFixed(2)
        : 'N/A';
      
      return [
        step.number,
        `"${step.description}"`,
        step.status,
        `"${step.details || 'N/A'}"`,
        new Date(step.timestamp).toLocaleString(),
        step.completedAt ? new Date(step.completedAt).toLocaleString() : 'N/A',
        duration
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    const filename = path.join(this.reportDir, `test-report-${this.timestamp}.csv`);
    fs.writeFileSync(filename, csv);
    return filename;
  }
}

module.exports = TestReportGenerator;
