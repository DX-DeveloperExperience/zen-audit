#!/bin/bash

# downloads ghr, a tool that will create a release on your github's repository
wget https://github.com/tcnksm/ghr/releases/download/v0.12.0/ghr_v0.12.0_linux_386.tar.gz
tar -zxvf ghr_v0.12.0_linux_386.tar.gz

# gets the version in package.json, update this if you use another package manager
VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

# creates the release and upload it on your Github's repository
ghr_v0.12.0_linux_386/ghr -t ${GITHUB_TOKEN} -u ${CIRCLE_PROJECT_USERNAME} -r ${CIRCLE_PROJECT_REPONAME} -c ${CIRCLE_SHA1} -delete ${VERSION} ./dist/project-starter-cli-v${VERSION}/