# Chess Game Backend

This project is a backend implementation for a multiplayer chess game. It provides APIs to manage game state, piece selection, and moves while leveraging Redis for in-memory storage and WebSocket for real-time updates.

---

## **Features**
1. **Game State Management**:
   - Models board, pieces, turns, check state, and game over state.
   - Tracks possible moves (`nextMovesPossible`) and killed pieces.

2. **RESTful APIs**:
   - Create and manage chess games.
   - Select and move pieces with validation.

3. **Real-Time Updates**:
   - Uses WebSocket for broadcasting game state changes.

4. **In-Memory Storage**:
   - Redis is used to store the game state for fast access.

5. **Testing**:
   - Comprehensive testing using Jest and Supertest.

---

## **Installation**

### **Dependencies**
Install the required dependencies:
```bash
npm install express socket.io redis
npm install --save-dev jest supertest @types/jest @types/supertest
```

---

## **Usage**

### **1. Start Redis**
Run Redis using Docker:
```bash
docker run -d -p 6379:6379 redis
```

### **2. Build the Project**
Compile the TypeScript code to JavaScript:
```bash
npx tsc
```

### **3. Run Tests**
Execute the test suite:
```bash
npm test
```

### **4. Start the Server**
Start the server locally using `ts-node`:
```bash
npx ts-node src/index.ts
```

---

## **API Endpoints**

### **1. Create a Game**
- **Endpoint**: `POST /game`
- **Description**: Creates a new chess game and returns the game ID.
- **Response**:
```json
{
  "gameId": "abc123"
}
```

### **2. Get Game State**
- **Endpoint**: `GET /game/:id`
- **Description**: Fetches the current state of the specified game.
- **Response**:
```json
{
  "success": true,
  "game": {
    "board": [...],
    "turn": "white",
    "isCheck": false,
    "isGameOver": false,
    "nextMovesPossible": {...},
    "killedPieces": [...]
  }
}
```

### **3. Select a Piece**
- **Endpoint**: `POST /game/:id/select`
- **Description**: Selects a chess piece for a move.
- **Request**:
```json
{
  "pieceId": "W60p"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Piece selected"
}
```

### **4. Make a Move**
- **Endpoint**: `POST /game/:id/move`
- **Description**: Moves the selected piece to a new position.
- **Request**:
```json
{
  "toPosition": { "x": 4, "y": 5 }
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Move made successfully"
}
```

---

## **Local Development**

### **Run the Application**
- Start Redis (required):
```bash
docker run -d -p 6379:6379 redis
```
- Start the backend:
```bash
npx ts-node src/index.ts
```

---

## **Testing**
Run the tests using Jest and Supertest:
```bash
npm test
```

### **Tested APIs**
- Create Game
- Get Game State
- Select a Piece
- Move a Piece

---

## **Known Issues**
- **Select API**:
  - Needs additional implementation to validate and select pieces correctly.
  - Current functionality works but requires further refinements.

---

## **Future Enhancements**
1. **Real-Time Game State**:
   - Enhance WebSocket functionality for better player synchronization.
2. **AI Player**:
   - Implement basic AI for single-player mode.
3. **Persistence**:
   - Store game states in a database for long-term retention.

---

This project is tested and running fine. Let me know if you have any questions or need further assistance! 😊
