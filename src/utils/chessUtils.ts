import { Position, GameState } from '../models/GameModel';

export const isValidMove = (
  from: Position,
  to: Position,
  gameState: GameState
): boolean => {
  const piece = gameState.board[from.y][from.x];
  if (!piece) return false; // No piece at the source

  const [color, , , type] = piece.split('');

  // Check if move lands within nextMovesPossible
  const validMoves = gameState.nextMovesPossible[piece] || [];
  return validMoves.some((pos) => pos.x === to.x && pos.y === to.y);
};
