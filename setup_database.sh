#!/bin/bash

# ELMS Database Setup Script
# Bash script for macOS/Linux to automatically set up the ELMS database

echo "========================================"
echo "   ELMS Database Setup Script"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if MySQL is installed
echo -e "${YELLOW}Checking for MySQL installation...${NC}"
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL not found!${NC}"
    echo ""
    echo -e "${YELLOW}Please install MySQL:${NC}"
    echo "  macOS: brew install mysql"
    echo "  Ubuntu/Debian: sudo apt-get install mysql-server"
    echo "  CentOS/RHEL: sudo yum install mysql-server"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ MySQL found: $(which mysql)${NC}"
echo ""

# Get MySQL credentials
echo -e "${CYAN}Enter MySQL credentials:${NC}"
read -p "MySQL Username (default: root): " username
username=${username:-root}

read -sp "MySQL Password: " password
echo ""
echo ""

# Test connection
echo -e "${YELLOW}Testing MySQL connection...${NC}"
echo "SELECT 1;" | mysql -u "$username" -p"$password" &> /dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to connect to MySQL!${NC}"
    echo -e "${YELLOW}Please check your credentials and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ MySQL connection successful!${NC}"
echo ""

# Confirm database setup
echo -e "${YELLOW}⚠️  WARNING: This will DROP the existing 'elms' database if it exists!${NC}"
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}Setup cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${CYAN}Setting up ELMS database...${NC}"
echo -e "${YELLOW}This may take a minute...${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SQL_FILE="$SCRIPT_DIR/setup_complete_database.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}❌ Setup script not found: $SQL_FILE${NC}"
    exit 1
fi

# Execute the SQL script
mysql -u "$username" -p"$password" < "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   ✅ Database Setup Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${CYAN}Database Details:${NC}"
    echo "  📊 Database Name: elms"
    echo "  👥 Total Users: 31"
    echo "  📚 Total Courses: 8"
    echo "  🎓 Total Sections: 11"
    echo "  📝 Total Assignments: 14"
    echo ""
    echo -e "${CYAN}Default Login Credentials:${NC}"
    echo "  📧 Email: mahealif221031@bscse.uiu.ac.bd"
    echo "  🔑 Password: password123"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "  1. Update .env file with database credentials"
    echo "  2. Run: npm install (in root directory)"
    echo "  3. Run: npm run dev (to start backend)"
    echo "  4. Run: npm run dev (in elms-uiu directory for frontend)"
    echo ""
    echo -e "${CYAN}📖 For detailed setup guide, see: DATABASE_SETUP_GUIDE.md${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Database setup failed!${NC}"
    echo -e "${YELLOW}Please check the error messages above.${NC}"
    echo ""
    exit 1
fi
