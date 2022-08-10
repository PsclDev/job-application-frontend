## Table of Contents

- [About](#invoice-app)
- [Feature list](#features)
- [Tech-Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Postman](#postman)
- [Git / Pre-Commit hook](#git)
- [Continuous Integration](#ci)

# Job-Application (wip)

This is a fun project to use my new learned knowledge of graphql. You can track your job applications and get a nice overview of the states of each application.

## Tech Stack

This backend is written with NestJs, Apollo, Typeorm and uses postgres db

## Requirements

The listed versions are not strictly needed, but tested with.

- `Node v16`
- `Yarn v1` or `Npm v8.5`

## Getting Started

If you are using `npm` just replace the `yarn` keyword with `npm run`

- **`yarn` or `npm i`** _to install the backend dependencies_
- **`npx husky install`** _to install husky_
- **`yarn start:dev`** _run the backend_
- Set the required Envs based on the `..EXAMPLE-.env`, you have to create a `.env` file

_`Note to .env: If any env value contains a dollar sign ($) you have to encode that with a backslash (\$)`_

## Git

Husky is used to run two pre-commit hooks. Staged files will be linted and fixed and also commitlint to check the commit-message

Check out `https://github.com/conventional-changelog/commitlint` for more informations

## CI

It will always run some github actions. It will lint, run tests, check for new versions, build docker package and set version of the npm package.

if you `merge` or `push` to `master` branch it will create a new docker image

**Read the comments inside the `.github/workflows/pipeline` file and change the values to your like**
 