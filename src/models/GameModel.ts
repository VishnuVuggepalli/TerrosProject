export type PlayerColor = 'white' | 'black';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  board: string[][]; // 8x8 dynamic board
  turn: PlayerColor; // Current turn
  isCheck: boolean;  // Is the king in check?
  isGameOver: boolean; // Has the game ended?
  nextMovesPossible: Record<string, Position[]>; // Possible moves for each piece
  selectedPiece?: string; // The piece currently selected
  killedPieces: string[]; // List of killed pieces
}

export class GameModel {
  private state: GameState;

  constructor() {
    this.state = this.initializeGame();
  }

  private initializeGame(): GameState {
    const board: string[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(''));

    // Set up black pieces
    board[0] = [
      'B00r', 'B01n', 'B02b', 'B03q', 'B04k', 'B05b', 'B06n', 'B07r'
    ];
    board[1] = Array(8).fill(null).map((_, i) => `B1${i}p`);

    // Set up white pieces
    board[7] = [
      'W70r', 'W71n', 'W72b', 'W73q', 'W74k', 'W75b', 'W76n', 'W77r'
    ];
    board[6] = Array(8).fill(null).map((_, i) => `W6${i}p`);

    return {
      board,
      turn: 'white',
      isCheck: false,
      isGameOver: false,
      nextMovesPossible: {},
      killedPieces: []
    };
  }

  public getState(): GameState {
    return this.state;
  }

  public setState(newState: Partial<GameState>): void {
    this.state = { ...this.state, ...newState };
  }

  public updateNextMoves(): void {
    this.state.nextMovesPossible = this.calculateNextMoves(this.state.board, this.state.turn);
  }

  private calculateNextMoves(board: string[][], turn: PlayerColor): Record<string, Position[]> {
    const moves: Record<string, Position[]> = {};

    board.forEach((row, y) => {
      row.forEach((piece, x) => {
        if (piece && ((turn === 'white' && piece.startsWith('W')) || (turn === 'black' && piece.startsWith('B')))) {
          const possibleMoves = this.getPossibleMoves({ x, y }, piece, board);
          if (possibleMoves.length > 0) {
            moves[piece] = possibleMoves;
          }
        }
      });
    });

    return moves;
  }

  private getPossibleMoves(from: Position, piece: string, board: string[][]): Position[] {
    const [color, , , type] = piece.split('');
    const moves: Position[] = [];

    if (type === 'p') {
      const direction = color === 'W' ? -1 : 1;
      const nextY = from.y + direction;

      // Forward move
      if (board[nextY] && board[nextY][from.x] === '') {
        moves.push({ x: from.x, y: nextY });
      }

      // Capture moves (diagonals)
      if (board[nextY]) {
        if (board[nextY][from.x - 1]?.startsWith(color === 'W' ? 'B' : 'W')) {
          moves.push({ x: from.x - 1, y: nextY });
        }
        if (board[nextY][from.x + 1]?.startsWith(color === 'W' ? 'B' : 'W')) {
          moves.push({ x: from.x + 1, y: nextY });
        }
      }
    }

    // Add logic for other pieces (rook, knight, bishop, queen, king)
    return moves;
  }
}
