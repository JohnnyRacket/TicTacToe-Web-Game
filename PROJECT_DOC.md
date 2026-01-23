# Tic-Tac-Toe Web Game - Project Doc

## Overview

This is a rough structure to follow for implementation, init thoughts in an organized enough manner to start working with a solid plan


## Phase 1: Backend Foundation & Database Setup


### 1.1 Database Setup & Migrations

- Install and configure Kysely with PostgreSQL
- Create up migrations for tables:
- `users` table (id, name, color, wins, losses, draws, timestamps)
- `games` table (id, player1_id, player2_id, current_turn, board_state, status, winner_id, timestamps)
- `game_moves` table (id, game_id, player_id, position, move_number, created_at)
- Set up database connection configuration
- Create Kysely db schema types

### 1.2 Shared Types Library

- Create TypeScript types for:
- `User`
- `Game`
- `GameMove` 
- `GameStatus` enum ('waiting', 'in_progress', 'completed', 'abandoned')
- potentially probably more models required, to be updated as working
- Req/Res types for all API endpoints
- Export types from shared library

### 1.3 Express Server Structure

- Set up Express app with middleware (JSON parsing, CORS, error handling)
- Create route structure:
- `/api/user/*` - User routes
- `/api/game/*` - Game routes
- `/api/leaderboard` - Leaderboard route
- Set up environment variable configuration
- Bonus if we have time: Add request logging middleware

## Phase 2: Backend API Implementation

### 2.1 User Endpoints

- `POST /api/user/create` - Create user with UUID, return user with cookie
- `PUT /api/user/:id` - Update user name and color
- Implement cookie management for user identification

### 2.2 Game Logic Utilities

- Create game logic module:
- Board state parser (csv string or json grid)
- Move validation (check turn, position empty, game status)
- Win detection (consider all win conditions, vertical, horizontal, diagonal)
- Draw detection (board full, no winner)
- Unit tests for game logic

### 2.3 Game Endpoints

- `POST /api/game/create` - Create game session, set player1
- `POST /api/game/:id/join` - Join game as player2, validate not full
- `GET /api/game/list` - List available games with participant count
- `GET /api/game/:id` - Get game state
- `PUT /api/game/:id` - Make a move (validate, update board, check win/draw, save move)
- `DELETE /api/game/:id` - Delete game

### 2.4 Leaderboard Endpoint

- `GET /api/leaderboard` - Get top 5 players by wins (not going to worry about ties currently)

### 2.5 Error Handling & Validation

- Standardize error response format
- Add input validation
- Make sure we have handled edge cases (game not found, invalid moves, etc.)

## Phase 3: Frontend Implementation


### 3.1 Frontend Setup

- Install React Query, React Router, shadcn/ui
- Configure cookie handling for user identification
- Set up routing structure

### 3.2 User Management

- Auto-create user on app load (check cookie, create if needed)
- User profile component (set name, color)
- Cookie management utilities

### 3.3 Home/Lobby SCreen

- Game list component (shows available games (not full))
- Create game button
- Join game functionality
- Polling for game list updates

### 3.4 Game Board

- 3x3 grid board component
- Display current turn
- Polling for game state updates (1-2 second interval)
- Move history display (optional, for replay feature)

### 3.5 Leaderboard Page

- Display top 5 players
- Show wins, losses, draws

### 3.6 Routing & Navigation

- Set up React Router routes

## Implementation Order Summary

1. **Backend Foundation**: Database setup → Shared types → Express structure
2. **Backend API**: User endpoints → Game logic → Game endpoints → Leaderboard
3. **Frontend**: Setup → User management → Lobby → Game board → Leaderboard → Routing

## Key Technical Decisions

- **Board State**: Comma-separated string `"X,O, ,X,O, ,X,O "` (positions 0-8)
- **Move History**: Borroew from online chess prior art, track all moves in `game_moves` table for replay capability
- **User Auth**: Cookie-based UUID, user can immediately start playing or join a game
- **Communication**: REST API with polling (MVP), WebSockets/SSE future enhancement
- **Testing**: Vitest for backend, React Testing Library for frontend


## Things to think about (fun):

- **Share Links**: Making links to a sharable game lobby, i.e. /game/{id} or /game/?id={id}
- **Spectator Mode**: worth letting peoplle join full games in order to spectate?

## Research

- I am thinking about potentially a json format for the gameboard where the keys are like a1,a2,a3,b1... similar to chess notation, but I need to look up potential prior art with chess board storage, the csv flat string is a very simple data type but it may make functions messier for me down the road and less human readable
