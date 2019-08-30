#!/bin/bash

# this script deploys documentation to gh-pages branch
# you may have to change the npm run script below to match
# your documentation static site generator

# stores git remote url
GIT_URL=$(git config --get remote.origin.url)
echo $GIT_URL

# runs the documentation static site generator script
# you may have to change this line to match your generator
npm run docs:build

# goes into documentation build directory
cd docs_build/

# sets git user.email and user.name
git config --global user.email "circleci@circleci.com"
git config --global user.name "circleci"

# adds all documentation built files to git commit
git init 
git add -A
git commit -m "Update documentation"

# pushes to branch gh-pages
git push -f $GIT_URL master:gh-pages
