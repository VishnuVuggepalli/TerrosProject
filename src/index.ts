import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { ChessService } from './services/ChessService';
import { connectRedis } from './services/RedisService';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const chessService = new ChessService();
const PORT = 3000;

app.use(express.json());

connectRedis().then(() => {
  console.log('Redis connected');
});

// REST APIs
app.post('/game', async (req: Request, res: Response) => {
  const gameId = await chessService.createGame();
  res.status(201).json({ gameId });
});

app.get(
  '/game/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params; // Extract game ID from the URL
      const game = await chessService.getGame(id);

      if (!game) {
        res.status(404).json({ success: false, error: 'Game not found' });
        return;
      }

      res.status(200).json({ success: true, game: game.getState() });
    } catch (error) {
      console.error('Error fetching game state:', error); // Log the error for debugging
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);


app.post(
  '/game/:id/select',
  async (req: Request<{ id: string }, {}, { pieceId: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { pieceId } = req.body;

      console.log(`Selecting piece: gameId=${id}, pieceId=${pieceId}`);

      // Validate input
      if (!pieceId || typeof pieceId !== 'string') {
        console.log('Invalid pieceId format');
        res.status(400).json({ success: false, error: 'Invalid pieceId format' });
        return;
      }

      const success = await chessService.selectPiece(id, pieceId);

      console.log(`Piece selection result: ${success}`);

      if (success) {
        res.status(200).json({ success: true, message: 'Piece selected' });
      } else {
        res.status(400).json({ success: false, error: 'Invalid piece selection' });
      }
    } catch (error) {
      console.error('Error selecting piece:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);



app.post(
  '/game/:id/move',
  async (req: Request<{ id: string }, {}>, res: Response): Promise<void> => {
    try {
      const { id } = req.params; // Game ID from the URL
      const { toPosition } = req.body; // Target position for the move

      // Validate input
      if (!toPosition || typeof toPosition.x !== 'number' || typeof toPosition.y !== 'number') {
        res.status(400).json({ success: false, error: 'Invalid toPosition format' });
        return;
      }

      // Make the move
      const success = await chessService.makeMove(id, toPosition);

      if (success) {
        res.status(200).json({ success: true, message: 'Move made successfully' });
      } else {
        res.status(400).json({ success: false, error: 'Invalid move' });
      }
    } catch (error) {
      console.error('Error processing move:', error); // Log error for debugging
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);



// WebSocket event management
io.on('connection', (socket) => {
  console.log('A user connected');

  // Join a specific game room
  socket.on('joinGame', (gameId) => {
    socket.join(gameId);
    console.log(`User joined game: ${gameId}`);
  });

  // Broadcast game state changes
  socket.on('moveMade', async (gameId) => {
    const game = await chessService.getGame(gameId);
    if (game) {
      io.to(gameId).emit('update', game.getState());
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

export default app;