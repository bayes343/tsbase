# tsbase Quickstart

[![Build status](https://joseph-w-bayes.visualstudio.com/tsbase/_apis/build/status/Test,%20Build,%20Archive)](https://joseph-w-bayes.visualstudio.com/tsbase/_build/latest?definitionId=7)
[![Code coverage](https://img.shields.io/azure-devops/coverage/joseph-w-bayes/50cd9014-db2f-482c-ac28-d707aa30bf98/7.svg)](https://img.shields.io/azure-devops/coverage/joseph-w-bayes/50cd9014-db2f-482c-ac28-d707aa30bf98/7.svg)

The public facing readme is located in the `src` directory.  This readme is intended for maintainers / contributors to tsbase.

## Local Development

### Pre-requisites
- node/npm

### Installation
- run cmd: `npm install`

### Testing
- run cmd: `npm run test` / `karma start`

### Linting
- run cmd: `npm run lint`

### Building
- run cmd `npm run build`

### Publishing
- Update package version based on changes made (minor, major, patch)
- run cmd `npm login`
- run cmd `npm run package`
- run cmd `npm run publish`