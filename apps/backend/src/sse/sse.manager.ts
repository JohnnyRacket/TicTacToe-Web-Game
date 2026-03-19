import type { Response } from 'express';

interface SseClient {
  id: string;
  res: Response;
  channel: 'game' | 'lobby' | 'leaderboard';
  gameId?: string;
}

class SseManager {
  private clients = new Map<string, SseClient>();
  private clientIdCounter = 0;

  constructor() {
    // Keepalive comment ping every 25 seconds to prevent proxy timeouts
    setInterval(() => {
      for (const [id, client] of this.clients.entries()) {
        try {
          client.res.write(':\n\n');
        } catch {
          this.removeClient(id);
        }
      }
    }, 25000);
  }

  addClient(channel: SseClient['channel'], res: Response, options?: { gameId?: string }): string {
    const id = `client_${++this.clientIdCounter}`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    this.clients.set(id, {
      id,
      res,
      channel,
      gameId: options?.gameId,
    });

    return id;
  }

  removeClient(id: string): void {
    this.clients.delete(id);
  }

  private send(res: Response, event: string, data: unknown): void {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  private broadcastWhere(predicate: (client: SseClient) => boolean, event: string, data: unknown): void {
    for (const [id, client] of this.clients.entries()) {
      if (predicate(client)) {
        try {
          this.send(client.res, event, data);
        } catch {
          this.removeClient(id);
        }
      }
    }
  }

  sendToClient(clientId: string, event: string, data: unknown): void {
    const client = this.clients.get(clientId);
    if (client) {
      try {
        this.send(client.res, event, data);
      } catch {
        this.removeClient(clientId);
      }
    }
  }

  broadcastToGame(gameId: string, event: string, data: unknown): void {
    this.broadcastWhere((c) => c.channel === 'game' && c.gameId === gameId, event, data);
  }

  broadcastToLobby(event: string, data: unknown): void {
    this.broadcastWhere((c) => c.channel === 'lobby', event, data);
  }

  broadcastToLeaderboard(event: string, data: unknown): void {
    this.broadcastWhere((c) => c.channel === 'leaderboard', event, data);
  }
}

export const sseManager = new SseManager();
