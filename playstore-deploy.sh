#!/bin/bash

# 🚀 Play Store Deployment Script for d.ai.ly
# Usage: ./playstore-deploy.sh [version]
#   No arg → auto-increments patch (e.g. 1.3.2 → 1.3.3)
#   With arg → uses that version (e.g. ./playstore-deploy.sh 1.4.0)
# versionCode is managed automatically by EAS (no manual tracking needed).

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${MAGENTA}🚀 d.ai.ly - Play Store Deployment Script${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ── Step 1: Require a clean working tree ─────────────────────────────────────
echo -e "${BLUE}📋 Step 1: Checking for uncommitted changes...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${RED}❌ Uncommitted changes found. Commit or stash them first:${NC}"
    git status -s
    exit 1
fi
echo -e "${GREEN}✅ Working tree clean.${NC}"
echo ""

# ── Step 2: Resolve version ───────────────────────────────────────────────────
current_version=$(grep -o '"version": "[^"]*"' app.json | sed 's/"version": "\(.*\)"/\1/')

if [[ -n "$1" ]]; then
    new_version="$1"
else
    IFS='.' read -r major minor patch <<< "$current_version"
    new_version="$major.$minor.$((patch + 1))"
fi

echo -e "${BLUE}📊 Step 2: Version  ${YELLOW}$current_version${BLUE} → ${GREEN}$new_version${NC}"
echo -e "${CYAN}   versionCode will auto-increment via EAS (no action needed)${NC}"
echo ""

sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" app.json
git add app.json
git commit -m "Bump version to $new_version"
git push origin master
echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
echo ""

echo -e "${YELLOW}⏳ Waiting 10 seconds for GitHub to sync...${NC}"
sleep 10
echo ""

# ── Step 3: EAS build ─────────────────────────────────────────────────────────
echo -e "${BLUE}🏗️  Step 3: Building production AAB with EAS...${NC}"
echo -e "${YELLOW}   This will take 10-20 minutes...${NC}"
echo ""
npx eas-cli build --platform android --profile production --non-interactive
echo ""
echo -e "${GREEN}✅ Build completed!${NC}"
echo ""

# ── Step 4: Summary ───────────────────────────────────────────────────────────
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ BUILD SUCCESSFUL — v$new_version${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
npx eas-cli build:list --platform android --limit 1 --non-interactive
echo ""
echo -e "${MAGENTA}📥 Next steps:${NC}"
echo -e "   ${CYAN}→ Download AAB: https://expo.dev/accounts/priyasunnam/projects/daily-ai-app/builds${NC}"
echo -e "   ${CYAN}→ Upload to Play Console: https://play.google.com/console${NC}"
echo ""
echo -e "${GREEN}🎉 Done!${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
