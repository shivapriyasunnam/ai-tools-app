#!/bin/bash

# 🚀 Play Store Deployment Script for d.ai.ly
# This script automates the deployment process to Google Play Store

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${MAGENTA}🚀 d.ai.ly - Play Store Deployment Script${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Check for uncommitted changes
echo -e "${BLUE}📋 Step 1: Checking for uncommitted changes...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes!${NC}"
    echo ""
    git status -s
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_message
        git add .
        git commit -m "$commit_message"
        echo -e "${GREEN}✅ Changes committed!${NC}"
    else
        echo -e "${RED}❌ Deployment cancelled. Please commit your changes first.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ No uncommitted changes found.${NC}"
fi
echo ""

# Step 2: Push to GitHub
echo -e "${BLUE}📤 Step 2: Pushing to GitHub...${NC}"
git push origin master
echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
echo ""

# Step 3: Increment version
echo -e "${BLUE}📊 Step 3: Checking version...${NC}"
current_version=$(grep -o '"version": "[^"]*"' app.json | sed 's/"version": "\(.*\)"/\1/')
echo -e "${CYAN}Current version: ${YELLOW}$current_version${NC}"
read -p "Keep version $current_version? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter new version (e.g., 1.0.1): " new_version
    # Update version in app.json
    sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" app.json
    echo -e "${GREEN}✅ Version updated to $new_version${NC}"
    git add app.json
    git commit -m "Bump version to $new_version"
    git push origin master
else
    echo -e "${GREEN}✅ Keeping version $current_version${NC}"
fi
echo ""

# Step 4: Build with EAS
echo -e "${BLUE}🏗️  Step 4: Building production APK/AAB with EAS...${NC}"
echo -e "${YELLOW}This will take 10-20 minutes...${NC}"
echo ""
eas build --platform android --profile production --non-interactive
echo ""
echo -e "${GREEN}✅ Build completed!${NC}"
echo ""

# Step 5: Show download instructions
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ BUILD SUCCESSFUL!${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${MAGENTA}📥 Next Steps:${NC}"
echo ""
echo -e "${BLUE}1. Download your AAB file:${NC}"
echo -e "   ${CYAN}• Go to: https://expo.dev/accounts/priyasunnam/projects/daily-ai-app/builds${NC}"
echo -e "   ${CYAN}• Or run: ${YELLOW}eas build:list${NC}"
echo -e "   ${CYAN}• Click the download button for your latest build${NC}"
echo ""
echo -e "${BLUE}2. Upload to Google Play Console:${NC}"
echo -e "   ${CYAN}• Go to: https://play.google.com/console${NC}"
echo -e "   ${CYAN}• Navigate to: Test and release → Production (or Testing)${NC}"
echo -e "   ${CYAN}• Create new release${NC}"
echo -e "   ${CYAN}• Upload the AAB file${NC}"
echo -e "   ${CYAN}• Add release notes${NC}"
echo -e "   ${CYAN}• Submit for review${NC}"
echo ""
echo -e "${BLUE}3. Release Notes Template:${NC}"
echo -e "   ${YELLOW}---${NC}"
echo -e "   ${GREEN}🎉 Version $current_version${NC}"
echo -e "   ${NC}"
echo -e "   ${NC}• Bug fixes and improvements${NC}"
echo -e "   ${NC}• Enhanced bottom navigation for better usability${NC}"
echo -e "   ${YELLOW}---${NC}"
echo ""
echo -e "${GREEN}🎉 Deployment script completed successfully!${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
