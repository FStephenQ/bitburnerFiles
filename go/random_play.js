const FACTIONS = [
  "Netburners",
  "Slum Snakes",
  "The Black Hand",
  "Tetrads",
  "Daedalus",
  "Illuminati",
];
const BOARD_SIZE = 13;

export async function main(ns) {
  let factionIdx = 0;
  ns.go.resetBoardState(FACTIONS[factionIdx], BOARD_SIZE);

  while (true) {
    let result, x, y;

    do {
      const board = ns.go.getBoardState();
      const validMoves = ns.go.analysis.getValidMoves();
      const liberties = ns.go.analysis.getLiberties();
      const chains = ns.go.analysis.getChains();

      // TODO: more move options
      const [randX, randY] = getRankedMove(board, validMoves, liberties, chains);

      x = randX;
      y = randY;

      if (x === undefined) {
        // Pass turn if no moves are found
        result = await ns.go.passTurn();
      } else {
        // Play the selected move
        result = await ns.go.makeMove(x, y);
      }

      // Log opponent's next move, once it happens
      await ns.go.opponentNextTurn();

      await ns.sleep(200);

      // Keep looping as long as the opponent is playing moves
    } while (result?.type !== "gameOver");

    factionIdx = (factionIdx + 1) % FACTIONS.length;
    ns.go.resetBoardState(FACTIONS[factionIdx], BOARD_SIZE);
  }
}

const getRankedMove = (board, validMoves, liberties, chains) => {
  const size = board[0].length;
  const neighbors = (x, y) => [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
    .filter(([nx, ny]) => nx >= 0 && nx < size && ny >= 0 && ny < size);

  // Build chain liberty map and enemy chain cell lists
  const chainLibs = {};
  const enemyChainCells = {};
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (board[x][y] === "X" || board[x][y] === "O") {
        chainLibs[chains[x][y]] = liberties[x][y];
      }
      if (board[x][y] === "O") {
        const id = chains[x][y];
        if (!enemyChainCells[id]) enemyChainCells[id] = [];
        enemyChainCells[id].push([x, y]);
      }
    }
  }

  let bestScore = -Infinity;
  let bestMoves = [];

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (!validMoves[x][y]) continue;

      let emptyNeighbors = 0;
      const adjOwnChains = new Set();
      const adjEnemyChains = new Set();

      for (const [nx, ny] of neighbors(x, y)) {
        if (board[nx][ny] === ".") emptyNeighbors++;
        else if (board[nx][ny] === "X") adjOwnChains.add(chains[nx][ny]);
        else if (board[nx][ny] === "O") adjEnemyChains.add(chains[nx][ny]);
      }

      const capturableChains = [...adjEnemyChains].filter(id => chainLibs[id] === 1);
      const captureBonus = capturableChains.length * 1000;

      const attackBonus = [...adjEnemyChains]
        .filter(id => chainLibs[id] > 1)
        .reduce((sum, id) => sum + 10 / (chainLibs[id] - 1), 0);

      // Count liberties gained by our chains from captured enemy cells becoming empty
      const captureLibGain = capturableChains.reduce((sum, id) => {
        for (const [cx, cy] of enemyChainCells[id]) {
          for (const [nx, ny] of neighbors(cx, cy)) {
            if (board[nx][ny] === "X") sum++;
          }
        }
        return sum;
      }, 0);

      const libertyDelta = emptyNeighbors - adjOwnChains.size + captureLibGain;

      // Never fill a true eye — all neighbors are our pieces or walls, nothing to capture
      if (emptyNeighbors === 0 && adjEnemyChains.size === 0) continue;

      const connectionBonus = adjOwnChains.size * 6;
      const mergeBonus = adjOwnChains.size >= 2 ? 20 * (adjOwnChains.size - 1) : 0;

      // Defense: save own chains in atari (1 liberty left)
      const saveBonus = [...adjOwnChains]
        .filter(id => chainLibs[id] === 1)
        .length * 900;

      // Expansion: boost purely open moves so the AI claims territory early
      const expansionBonus = adjOwnChains.size === 0 && adjEnemyChains.size === 0
        ? libertyDelta * 2
        : 0;

      const isFillHole = emptyNeighbors === 1
        && adjOwnChains.size > 0
        && [...adjOwnChains].every(id => chainLibs[id] >= 4);

      const isWorthy = captureBonus > 0 || saveBonus > 0 || libertyDelta > 0 || isFillHole || adjOwnChains.size > 0;
      if (!isWorthy) continue;

      const score = captureBonus + saveBonus + attackBonus + libertyDelta * 3 + expansionBonus + connectionBonus + mergeBonus;

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [[x, y]];
      } else if (score === bestScore) {
        bestMoves.push([x, y]);
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * bestMoves.length);
  return bestMoves[randomIndex] ?? [];
};