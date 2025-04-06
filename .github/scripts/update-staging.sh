#!/usr/bin/env bash
set -eu

cd staging
git rm -rf .
git checkout HEAD -- .github
cp -r ../out/* .
touch .nojekyll
git config --local user.email "action@github.com"
git config --local user.name "GitHub Action"
git add -A
git commit -F-<<EOF
${COMMIT_MESSAGE}

Reference: ${GITHUB_SHA}
EOF
