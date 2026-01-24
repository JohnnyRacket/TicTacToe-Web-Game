# Timeline

## 1/21/26 9:10-10pm

- layout some thoughts and plans in the readme
- got a db schema planned out that I am satisfied with, not 100% final

## 1/22/26 3-5pm

- thought more about the ideal project structure after chatting with Long and being told to prioritize code structure and organization
- settled on a monorepo over a more basic 2 folder setup to allow a cleaner package version management and a better shared lib/model solution by creating a shared-types library
- spun up nx monorepo to house backend node/express, frontend react, and a shared model lib
- nx wanted to misbehave, had to diagnose a node version mismatch, lost some time here, but eventually a newer version via nvm and resourcing/restarting the terminal solved.

## 1/23/26 3:00-3:50pm

- worked throught a pretty comprehensive project doc, an execution plan to carry out
- Worked on thinking about edge cases and full effort required to bring to completion, validation, win conditions, board state, etc
- borrowed some ideas from prior art such as online chess
- brainstormed some more fun to have things such as shareable game links, match replays, and a spectator mode (decided no downside to build the foundation to match replays now)

## 1/23/26 4:15-4:55

- set up dockerfiles for FE & backend, and docker-compose to have an integrated local dev environment where I can work with the DB
- set up env file and ignored it for config

## 1/24/26 1:00-2:55

- installed kysely and postgres driver dependencies
- set up config, schema and initial migrations, then added pgadmin to the docker-compose to verify migrations were working
- cleaned up files and and made sure niche code (like why we used a singleton, or what connection string format was) was commented

## 1/24/26 3:10-3:35

- NX gives us a ton of great linting out of the box, but added some personal preference import linting to help keep imports orderly when project start growing
- setup husky to do linting and formatting pre-commit
