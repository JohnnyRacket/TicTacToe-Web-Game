# Key parts of this project:

- Nx Monorepo setup with frontend app, backend app, and types/business logic lib
  - project dependecy visualization
  - shared types library for frontend and backend (easier to maintain, much safer)
  - shared business and validation logic for fe and backend, means you can easily do frontend validation and validate it again on the backend (more secure) without rewriting and re-testing the logic. this opens up doors like frontend optimistic updates since you can trsut the validation will be the same
  - nx unified package management means that dependency version drift between frontend and backend dont become a risk
- Project structure
  - both fe and be projects follow a feature structure as a paradigm, that means colocating all code required to build a specific feature and setting rules so that code doesnt get imported to other features (if it needs to be in both move it to a higher common level).
  - colocating code is a huge dx boost in my experience, not fully felt by a project this small but massively felt when a project is a few years in and you are trying to work on an old feature where its files are scattered across route folders, api folders, type folders, test folders, etc.
- Strong set of linting rules & pre-commit rules
  - Linting is extremely helpful for humans to make sure code always is more uniform, but in the age of ai, linting becomes even more important as llm agents work on code, the more guard-rails you can instill, the more quality output you can attain
  - linting does not just mean formatting in todays age, you can set up rules (or evern build you own) for much more powerful things like not misusing promises in ways that will get you nasty bugs, or not missing parts of a dependency array in a useEffect.
  - pre-commit rules make sure nobody is taking a shortcut and are a great thing, and generally speaking I would say having linting rules without precommit rules enforicing them almost makes the linting pointless
- E2E local environment
  - by using docker-compose and creating dockerfiles for our fe and be, we can fully test our app locally end-to-end, an issue that has plagued many projects I have been on in my professional life
- Testing
  - comprehensive unit testing on what is important and not tests just to have tests helped me build this project one step at a time, having done more than 95% of the work on the backend before the frontend was touched and having it just work.
  - but also importantly these tests will mean even more in the future when making sure no regressions occur
- Backend service/data & api layer
  - we have kept our database specific logic encapsulated in service files decoupled from our http library express endpoints
  - this means we can much more easily swap out either our data layer or our api layer in the future and also server to make sure our api layer is only concerned about api things, handling requests and handling responses and the correct errors for those reponses
- Error handling
  - we build our own application errors so that we can provide meaningful errors
- Frontend data management
  - there is almost no frontend state in our app, it is almost completely netowrk state driven, which in my opinion is a beautiful thing, it makes the frontend much more "functional" and much less imperative, reducing bugs, especially hard to find ones where app state is getting into weird states
  - this is accomplished using widely-used industry standard tools like react-query backed by axios, to help us easily build our network state driven app
- Frontend ui
  - leveraging industry standard tools like tailwind and commonly used libs like shadcn ui, we can build our frontend very quickly and maintain it much easier

To wrap it up I feel that this is not just a tic-tac-toe game, but a good boilerplate for a production ready app

---

# To run this locally

- in the root directory run: `docker-compose up --build`
- in your browser navigate to: `http://localhost:4200/`
- to make another user to test, use incognito or another browser (your user will be persisted across tabs in the same browser via cookies & local storage)

# Screenshots:

Lobby/Home

<img width="829" height="813" alt="Image" src="https://github.com/user-attachments/assets/3b2042e0-0344-4bdb-84be-d389e4d4ca3c" />

Leaderboard

<img width="829" height="812" alt="Image" src="https://github.com/user-attachments/assets/9ead5e49-c9f7-4c49-accf-d2682d5c5774" />

User Customization

<img width="829" height="802" alt="Image" src="https://github.com/user-attachments/assets/feff5628-f427-4758-88e8-7a6915be3e70" />

Create new game

<img width="829" height="808" alt="Image" src="https://github.com/user-attachments/assets/5860657e-ea44-470b-929b-98417f231347" />

Game Board

<img width="890" height="812" alt="Image" src="https://github.com/user-attachments/assets/a73636c5-5dde-428c-98f3-c7bfac7db57c" />

Game Over Dialog

<img width="903" height="813" alt="Image" src="https://github.com/user-attachments/assets/8083406b-b5b3-4e14-b1a4-d2bd5a4ae99c" />

Responsive UI

<img width="333" height="718" alt="Image" src="https://github.com/user-attachments/assets/87baf465-0f2e-48cc-8278-d6645e215a8a" />

# Tic-Tac-Toe Web Game

## Requirements

- User can create a new game board
- Allow two (and only two) players to connect to a game board
- Persist game state on the server
- Follow standard rules for tic-tac-toe (or noughts and crosses)
- Display the game result and persist in the database at the end of the game
- Display a ranking of the top five players and allow players to start a new game

## Technical Stack Requirements

- Frontend - React
- Backend - server of choice (e.g. Node, .NET, Java)
- Database - PostgresSQL

## Project Structure

```
apps/
├── backend/          # Backend application
├── frontend/         # Frontend React application
libs/
├── shares-types/     # Shared models package
```

### API Endpoints

- TODO

## General Plan

- build backend api to spec/requirements testing using mocks
- build frontend statically, host it on the backend
- create a dockerfile for the backend server and stuff the built frontend into it to be hosted
- create a docker-compose to spin up a local db and server for e2e local testing and dev

## Planned tech stack

### Backend

- tsx, express server, kysely typesafe hORM, vitest for testing

### Frontend

- react (with typescript), react query for data fetching, react router for client side routing, find a good fit ui library (shadcn potentially for customization?), plan is to operate largely off network state since we are requiring a joinable session and authoritative server, so initial thoughts are no lib for global state management required, if the need arises use react context.

## Initial thoughts

Based on requirements ill map out what endpoints i forsee needing:

- `/game/create (POST)` - creates a game session (will generate uid for game session)
- `/game/{id}/join (POST)` - join existing game session
- `/game/list (GET)` - list all available game sessions and # of participants (know if full)
- `/game/{id} (GET)` - get current state for a game by id
- `/game/{id} (PUT)` - update game state on an existing game (validate move and err if invalid)
- `/game/{id} (DELETE)` - deletes an existing game
- `/leaderboard (GET)` - get the top 5 players by # wins (elo system probably too much)

For the concept of users, I think oauth/any form of real auth is overkill for this game scenario, so for the sake of time I am deciding to create a more effortless flow where users visiting the site have a user automatically created for them and store the uuid of that user in the cookies, so if they return without clearing their cookies they will pick up where they left off

`/user/create (POST)` - create a user in the db with a uuid, temporary name
`/user/{id} (PUT)` - update user, this will primarily be for setting a name the user desires (and maybe a color for fun?)

initial plan is to build a restful backend with polling as mvp, and explore websockets or SSE if time permits for game-state

# Basic Data Schemas for persistence:

<img width="2972" height="851" alt="Image" src="https://github.com/user-attachments/assets/042ecff1-e415-42a9-81a0-64d0cfa96881" />

---

## Below is NX Autogenerated readme

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/node?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve backend
```

To create a production bundle:

```sh
npx nx build backend
```

To see all available targets to run for a project, run:

```sh
npx nx show project backend
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/node:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/node:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

The above is NX auto-gen, below are my thoughts
