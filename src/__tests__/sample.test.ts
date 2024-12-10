import request from 'supertest';
import app from '../index'; // Adjust path as needed

import { redis } from '../services/RedisService'; // Adjust the path as needed

afterAll(async () => {
  await redis.quit(); // Properly close the Redis connection
});

describe('Chess Game REST APIs', () => {
  let gameId: string;

  it('POST /game - should create a new game', async () => {
    const response = await request(app).post('/game');
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('gameId');
    gameId = response.body.gameId; // Save the game ID for other tests
  });

  it('GET /game/:id - should fetch the game state', async () => {
    const response = await request(app).get(`/game/${gameId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.game).toHaveProperty('board');
  });

  it('POST /game/:id/select - should select a piece', async () => {
    const response = await request(app)
      .post(`/game/${gameId}/select`)
      .send({ pieceId: 'W60p' }); // Replace with valid piece ID

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.message).toBe('Piece selected');
  });

  it('POST /game/:id/move - should make a move', async () => {
    const response = await request(app)
      .post(`/game/${gameId}/move`)
      .send({ toPosition: { x: 0, y: 5 } }); // Replace with a valid move position

    if (response.status === 200) {
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toBe('Move made successfully');
    } else {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toBe('Invalid move');
    }
  });
});