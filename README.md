## Table of Contents

- [About](#screenshots)
- [Setup](#setup)
- [Development](#development)
   - [Tech Stack](#tech-stack)
   - [Requirements](#requirements)
   - [Getting started](#getting-started)
   - [Git](#git)
   - [CI](#ci)
- [Screenshots](#screenshots)
- [Credits](#credits)

# Job-Application

This is a fun project to use my new learned knowledge of graphql and vue's new composition. The tool should help you out to keep track of your applications in a easy and nice way.
- Group applications into folders
- Keep track of each status of a application
- Create Meetings and view them in a calendar view
- Take notes for a application or a meeting with a wyiwyg (what you see is what you get) editor
- Upload all your files in a global, group or application context

## Setup
### Requirements
- A running postgres instance
- Create a database for the application
   - recommended to also use a separate user

### How to run the app
- Pull the images
   - backend: `docker pull ghcr.io/pscldev/job-application/backend:latest`
   - frontend: `docker pull ghcr.io/pscldev/job-application/frontend:latest`
- Set the required envs for both images which you can find in the repositories
   - [backend](https://github.com/PsclDev/job-application-backend/blob/master/..EXAMPLE.env)
   - [frontend](https://github.com/PsclDev/job-application-frontend/blob/master/..EXAMPLE.env)
- Dont miss to bind the ports to be available from outside
   - default backend: 3010
   - default frontend: 80

## Development 
### Tech Stack
The backend is written with NestJs, Apollo, Typeorm and uses postgres as a database. Frontend is based on vite and vue3, used with the composition api and a DDD structure.
For an easy build and deploy process for both there are docker images and github pipelines.

### Requirements

The listed versions are not strictly needed, but tested with.

- `Node v16 or later`
- `Yarn v1` or `Npm v8.5`
- `Postgres`

### Getting started

If you are using `npm` just replace the `yarn` keyword with `npm run`.

The process should apply the same for both repositories

- **`yarn` or `npm i`** _to install dependencies_
- **`npx husky install`** _to install husky_ (should be installed automatically with the first command)
- Set the required Envs based on the `..EXAMPLE.env`, you have to create a `.env` file
- Set the required properties based on the `..EXAMPLE_ormconfig.json` for the typeorm module (Backend only)
- Clone the submodules: `git submodule init` and `git submodule update --remote`
- **`yarn start:dev`** _to run in dev mode_

_`Note to .env: If any env value contains a dollar sign ($) you have to encode that with a backslash (\$)`_

### Git

Husky is used to run two pre-commit hooks. Staged files will be linted and fixed and also commitlint to check the commit-message

Check out `https://github.com/conventional-changelog/commitlint` for more informations

### CI

It will always run some github actions. It will check for new versions based on commit messages and build the docker packages

Docker images will only be build if you `push` or `merge` into master

**Read the comments inside the `.github/workflows/pipeline` file and change the values to your like**

## Screenshots
### Desktop and Tablet
| Light |
| ----- |
| ![](https://job-app.pscl.dev/groups.png) |
| ![](https://job-app.pscl.dev/group.png) |
| ![](https://job-app.pscl.dev/application.png) |
| ![](https://job-app.pscl.dev/meeting.png) |
| ![](https://job-app.pscl.dev/calendar.png) |
| ![](https://job-app.pscl.dev/files.png) |
 
 ## Credits
 Favicon: https://7tv.app/emotes/6144a1e97b14fdf700b9424e