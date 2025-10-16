# ELMS Database Setup Script
# PowerShell script to automatically set up the ELMS database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ELMS Database Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is installed
Write-Host "Checking for MySQL installation..." -ForegroundColor Yellow
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue

if (-not $mysqlPath) {
    Write-Host "❌ MySQL not found in PATH!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install MySQL or add it to your PATH variable." -ForegroundColor Yellow
    Write-Host "Common MySQL locations:" -ForegroundColor Yellow
    Write-Host "  - C:\Program Files\MySQL\MySQL Server 8.0\bin" -ForegroundColor Gray
    Write-Host "  - C:\Program Files\MySQL\MySQL Server 5.7\bin" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ MySQL found: $($mysqlPath.Source)" -ForegroundColor Green
Write-Host ""

# Get MySQL credentials
Write-Host "Enter MySQL credentials:" -ForegroundColor Cyan
$username = Read-Host "MySQL Username (default: root)"
if ([string]::IsNullOrWhiteSpace($username)) {
    $username = "root"
}

$password = Read-Host "MySQL Password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

Write-Host ""
Write-Host "Testing MySQL connection..." -ForegroundColor Yellow

# Test connection
$testConnection = "SELECT 1;" | mysql -u $username -p$passwordPlain 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to connect to MySQL!" -ForegroundColor Red
    Write-Host $testConnection -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ MySQL connection successful!" -ForegroundColor Green
Write-Host ""

# Confirm database setup
Write-Host "⚠️  WARNING: This will DROP the existing 'elms' database if it exists!" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Do you want to continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "Setup cancelled." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 0
}

Write-Host ""
Write-Host "Setting up ELMS database..." -ForegroundColor Cyan
Write-Host "This may take a minute..." -ForegroundColor Gray
Write-Host ""

# Run the setup script
$scriptPath = Join-Path $PSScriptRoot "setup_complete_database.sql"

if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ Setup script not found: $scriptPath" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Execute the SQL script
Get-Content $scriptPath | mysql -u $username -p$passwordPlain

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   ✅ Database Setup Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Database Details:" -ForegroundColor Cyan
    Write-Host "  📊 Database Name: elms" -ForegroundColor White
    Write-Host "  👥 Total Users: 31" -ForegroundColor White
    Write-Host "  📚 Total Courses: 8" -ForegroundColor White
    Write-Host "  🎓 Total Sections: 11" -ForegroundColor White
    Write-Host "  📝 Total Assignments: 14" -ForegroundColor White
    Write-Host ""
    Write-Host "Default Login Credentials:" -ForegroundColor Cyan
    Write-Host "  📧 Email: mahealif221031@bscse.uiu.ac.bd" -ForegroundColor White
    Write-Host "  🔑 Password: password123" -ForegroundColor White
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Update .env file with database credentials" -ForegroundColor Gray
    Write-Host "  2. Run: npm install (in root directory)" -ForegroundColor Gray
    Write-Host "  3. Run: npm run dev (to start backend)" -ForegroundColor Gray
    Write-Host "  4. Run: npm run dev (in elms-uiu directory for frontend)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📖 For detailed setup guide, see: DATABASE_SETUP_GUIDE.md" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Database setup failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
    Write-Host ""
}

Read-Host "Press Enter to exit"
