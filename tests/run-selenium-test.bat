@echo off
REM ELMS Selenium Test Runner
REM Quick script to run student automation tests

echo ========================================
echo  ELMS Selenium Student Test Runner
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [CHECK] Node.js found: 
node --version
echo.

REM Check if Chrome is running
echo [INFO] Make sure Chrome browser is closed before running tests
echo Press any key to continue...
pause >nul
echo.

REM Check if backend is running
echo [CHECK] Checking if backend is running on port 5000...
curl -s http://localhost:5000/health >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Backend server doesn't appear to be running!
    echo Please start the backend server:
    echo   cd c:\xampp\htdocs\full-elms-backend
    echo   npm run dev
    echo.
    echo Press any key to continue anyway, or Ctrl+C to exit...
    pause >nul
)

REM Check if frontend is running
echo [CHECK] Checking if frontend is running on port 3000...
curl -s http://localhost:3000 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Frontend doesn't appear to be running!
    echo Please start the frontend:
    echo   cd c:\xampp\htdocs\full-elms-backend\elms-uiu
    echo   npm run dev
    echo.
    echo Press any key to continue anyway, or Ctrl+C to exit...
    pause >nul
)

echo.
echo ========================================
echo  Starting Selenium Tests
echo ========================================
echo.

REM Run the Selenium test
cd /d "%~dp0"
node selenium-student-test.js

echo.
echo ========================================
echo  Test Execution Complete
echo ========================================
echo.
echo Check the following for results:
echo - Console output above
echo - Screenshots: tests\screenshots\
echo - Reports: tests\test-reports\
echo.

pause
