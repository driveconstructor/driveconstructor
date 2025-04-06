#!/usr/bin/env bash
set -eu

cd staging
git rm -rf .
cp -r ../out/* .
touch .nojekyll
git config --local user.email "action@github.com"
git config --local user.name "GitHub Action"
git add -A
git commit -F-<<EOF
${{ github.event.head_commit.message }}

Reference: ${GITHUB_SHA}
EOF
