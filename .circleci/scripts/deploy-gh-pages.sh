# stores git remote url
GIT_URL=git config --get remote.origin.url

# runs the documentation building script
npm run docs:build

# goes into documentation build directory
cd docs_build/

# adds all documentation built files to git commit
git init 
git add -A
git commit -m "Update documentation"

# pushes to branch gh-pages
git push -f $GIT_URL master:gh-pages