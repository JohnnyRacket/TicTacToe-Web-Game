# Timeline

## 1/21/26 9:10pm-10pm

- layout some thoughts and plans in the readme
- got a db schema planned out that I am satisfied with, not 100% final

## 1/22/26 3pm-5pm

- thought more about the ideal project structure after chatting with Long and being told to prioritize code structure and organization
- settled on a monorepo over a more basic 2 folder setup to allow a cleaner package version management and a better shared lib/model solution by creating a shared-types library
- spun up nx monorepo to house backend node/express, frontend react, and a shared model lib
- nx wanted to misbehave, had to diagnose a node version mismatch, lost some time here, but eventually a newer version via nvm and resourcing/restarting the terminal solved.

## 1/23/26 3:00pm-3:50pm

- worked throught a pretty comprehensive project doc, an execution plan to carry out
- Worked on thinking about edge cases and full effort required to bring to completion, validation, win conditions, board state, etc
- borrowed some ideas from prior art such as online chess
- brainstormed some more fun to have things such as shareable game links, match replays, and a spectator mode (decided no downside to build the foundation to match replays now)

## 1/23/26 4:15pm-4:55pm

- set up dockerfiles for FE & backend, and docker-compose to have an integrated local dev environment where I can work with the DB
- set up env file and ignored it for config

## 1/24/26 1:00pm-2:55pm

- installed kysely and postgres driver dependencies
- set up config, schema and initial migrations, then added pgadmin to the docker-compose to verify migrations were working
- cleaned up files and and made sure niche code (like why we used a singleton, or what connection string format was) was commented

## 1/24/26 3:10pm-3:35pm

- NX gives us a ton of great linting out of the box, but added some personal preference import linting to help keep imports orderly when project start growing
- setup husky to do linting and formatting pre-commit

## 1/24/26 9:00pm-9:30pm

- built out api and domain types in the shared type library
- realizing the lib name "types" might not be perfect if I also want to put business logic in there so that it is portable and not tied to implementation, will probably rename when I embark on that journey
- we now have nice shared types that should work for our BE and FE, might need a few tweaks down the road for unforseen changes, but we have a solid foundation, and are finally ready to embark on building out BE endpoints and unit tests

## 1/24/26 9:40pm-11:35pm

- configured cors middleware and custom error handling middleware, leaned on express docs for best practices, can in the future add logging/observability here
- built out api routes for users, games, leaderboard
- built out user service to decouple data layer from express, added unit tests, and wired up user routes
- added first lib code to share lib, a hexcode color util, more shared business logic can go in here as we build, especially around game rules
- added first application error (vs system errors) for user not found
- this was a solid chunk of work, but now it feels like I am starting to move more quickly and build out the meat and potatoes, with guard-rails and foundations laid out

## 1/25/26 3:45pm-5:15pm (with a small break in the middle for a walk)

- worked on low hanging fruit of fleshing out leaderboard endpoint, added index for db perf
- working on this made me realize my service folder should probably have subdirectory folders in case the project keeps growing. But this launched me into thinking critically about wether I should build these in a feature first structure, i.e. app/features/user -> this has the routes, the service, the tests, and the errors.

```
ill include some thought process here, because I did spend some time thinking on this:
  I see a lot of upside here in dx and organization (and this is my goto structure on FE), but I also see some downside. A lot of what I like doing is restrircting imports across features, and forcing them to use a common lib above them or imported to keep them clean and not become sphagetti, I think the concept of a user exsists in every feature that is not just the user feature, so to a degree it makes slightly less sense, and in that manner I could see an argument against. But I am keeping my models in a shared lib, so I already do have a great place for shared common code/types to go which is making me lean heavily towards feature first layout.
```

- After the above I decided to go with the above structure for primarily dx (hunting down how things are connected in a late term project is brutal), but instead of the term "features" in the files tructure I think I will use api as the parent directory as it feels more descriptive for BE
- moved to feature first project structure and built eslint rule to disallow cross-feature imports, this rule's config ended up being a little tricky to get right
- last step for the backend (pre-integration) will be building out the games endpoints and building game logic into our shared lib

## 1/26/26 2:00pm-2:55pm

- worked on building out game logic in shared lib with comprehensive unit tests, this is the core of our business logic
- by using the shared lib we can leverage isopmorphic js/ts to have the same validation logic running on backend (authoritative) and frontend (potential for predicting the outcome, not needing to wait for backend response to display change)
- added some new types like boardPosition and PlayerSymbol to make the code rely less on any magic strings

## 1/27/26 3:45pm-5:15pm

- built out games service and tests
- a lot of functionality and validation here, will need to integration test this more once frontend is built
- last night brainstormed a cool additional feature to add if I have time, I have been wanting to try/learn more about ai sdk, so building out an llm powered "ask for help" or "optimal move" feature could be very cool, will see how much time I have

## 1/27/26 8:45pm-10:30pm

- set up shadcn and tailwind in frontend to start building ui, shadcn init did not want to play nice with tailwind 4 in our nx monorepo, https://github.com/shadcn-ui/ui/issues/6446, after extended troubleshooting just manually created the components file shadcn init creates
- built out file structure to be feature oriented
- mocked out sidebar, lobby, leaderboard, and game UIs with dummy data
- next step is to wire up react-query hooks for data

## 1/28/26 10:30am-12:30pm

- set up cookie user auth system on frontend
- set up api calls using axios and hooks using react query + react query provider with retry logic
- replaced a lot of the mock ui data with api fetched data
- disabled linting rule around return types for react components
- did some integration testing and validated user cookie auth is working and users are being created without issue

## 1/28/26 1:00pm-2:30pm

- made a game creation modal, fixed up game joining, created and of game modal
- fixed up cookie auth to work with incognito browsers by also leveraging local storage(mostly so I could test, but also to allow any device that doesnt allow cookies to work)
- A lot of various tasks discovered now that I could test games more end to end, fixed up logic around letting x player make a move before another player joins, fixed up buttons not having pointer cursor, fixed up sidebar not being responsive in a way that made sense
- this session was pretty fun since games were working end to end and getting to see that helped motivate me

## 1/28/26/ 3:45-4:15

- wired the leaderboard page with real data
- added a new component to show your stats in comparison to the leaderboard
- created the share link and the ability to join a game if shared the link
- confirmed spactating works, no real changes needed, a spectator simply cant do anything thanks to fe validation but they can watch the game
