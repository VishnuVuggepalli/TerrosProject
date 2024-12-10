import { GameModel, Position } from '../models/GameModel';
import { isValidMove } from '../utils/chessUtils';
import { redis } from './RedisService';

export class ChessService {
  private static GAME_KEY_PREFIX = 'game:';

  public async createGame(): Promise<string> {
    const gameId = Math.random().toString(36).substr(2, 9);
    const game = new GameModel();
    await redis.set(`${ChessService.GAME_KEY_PREFIX}${gameId}`, JSON.stringify(game.getState()));
    return gameId;
  }

  public async getGame(gameId: string): Promise<GameModel | null> {
    const gameStateJson = await redis.get(`${ChessService.GAME_KEY_PREFIX}${gameId}`);
    if (!gameStateJson) return null;
  
    const gameState = JSON.parse(gameStateJson);
    const game = new GameModel();
    game.setState(gameState);
    return game;
  }
  

  public async selectPiece(gameId: string, pieceId: string): Promise<boolean> {
    const gameStateJson = await redis.get(`${ChessService.GAME_KEY_PREFIX}${gameId}`);
    if (!gameStateJson) return false; // Game not found
  
    const gameState = JSON.parse(gameStateJson);
  
    // Check if the piece exists in the game state
    const isValidPiece =
      gameState.board.some((row: string[]) => row.includes(pieceId)) &&
      gameState.turn === (pieceId.startsWith('W') ? 'white' : 'black'); // Ensure correct turn
  
    if (!isValidPiece) return false;
  
    // Update the game state with the selected piece
    gameState.selectedPiece = pieceId;
  
    // Save the updated state to Redis
    await redis.set(`${ChessService.GAME_KEY_PREFIX}${gameId}`, JSON.stringify(gameState));
    return true;
  }
  

  public async makeMove(gameId: string, toPosition: Position): Promise<boolean> {
    const gameStateJson = await redis.get(`${ChessService.GAME_KEY_PREFIX}${gameId}`);
    if (!gameStateJson) return false;

    const gameState = JSON.parse(gameStateJson);
    const pieceId = gameState.selectedPiece;
    if (!pieceId) return false;

    const validMoves = gameState.nextMovesPossible[pieceId] || [];
    if (!validMoves.some((pos:Position) => pos.x === toPosition.x && pos.y === toPosition.y)) {
      return false; // Invalid move
    }

    const fromPosition = this.getPiecePosition(gameState.board, pieceId);
    if (!fromPosition) return false;

    const targetPiece = gameState.board[toPosition.y][toPosition.x];
    if (targetPiece) {
      gameState.killedPieces.push(targetPiece); // Capture
    }

    gameState.board[toPosition.y][toPosition.x] = pieceId;
    gameState.board[fromPosition.y][fromPosition.x] = '';
    gameState.selectedPiece = undefined; // Clear selected piece
    gameState.turn = gameState.turn === 'white' ? 'black' : 'white';

    const game = new GameModel();
    game.setState(gameState);
    game.updateNextMoves();
    gameState.nextMovesPossible = game.getState().nextMovesPossible;

    await redis.set(`${ChessService.GAME_KEY_PREFIX}${gameId}`, JSON.stringify(gameState));
    return true;
  }

  private getPiecePosition(board: string[][], pieceId: string): Position | null {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x] === pieceId) {
          return { x, y };
        }
      }
    }
    return null;
  }
}
