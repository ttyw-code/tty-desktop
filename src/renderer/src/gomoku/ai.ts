const DIRECTIONS: Array<[number, number]> = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
];

export type AiWeights = {
  // 连成 5 的直接胜利分
  win: number;
  // 活四（四连且至少一端可延伸）分
  fourOpen: number;
  // 活三（两端均可延伸）分
  threeOpen: number;
  // 冲三（只有一端可延伸）分
  threeClosed: number;
  // 活二分
  twoOpen: number;
  // 眠二分
  twoClosed: number;
  // 活一分
  oneOpen: number;
};

export type AiConfig = {
  // AI 思考延迟（毫秒），用于模拟“思考时间”
  thinkTimeMs: number;
  // 防守权重（对手威胁的权重系数）
  defendWeight: number;
  // 中心偏好权重（越大越偏向下在中心）
  centerWeight: number;
  // 评分权重表
  weights: AiWeights;
};

const defaultConfig: AiConfig = {
  thinkTimeMs: 1000,
  defendWeight: 0.9,
  centerWeight: 1,
  weights: {
    win: 100000,
    fourOpen: 10000,
    threeOpen: 2000,
    threeClosed: 500,
    twoOpen: 200,
    twoClosed: 60,
    oneOpen: 10,
  },
};

export const createAi = (boardSize: number, config?: Partial<AiConfig>) => {
  // 合并默认配置与外部传入配置，支持局部覆盖
  const mergedConfig: AiConfig = {
    ...defaultConfig,
    ...config,
    weights: {
      ...defaultConfig.weights,
      ...(config?.weights ?? {}),
    },
  };

  // 统计某方向上的连子数与两端是否有空位（活口）
  const countLine = (board: any[][], player: string, row: number, col: number, dx: number, dy: number) => {
    let count = 1;
    let openEnds = 0;

    let r = row + dy;
    let c = col + dx;
    while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player) {
      count++;
      r += dy;
      c += dx;
    }
    if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && !board[r][c]) openEnds++;

    r = row - dy;
    c = col - dx;
    while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player) {
      count++;
      r -= dy;
      c -= dx;
    }
    if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && !board[r][c]) openEnds++;

    return { count, openEnds };
  };

  // 计算落子后在四个方向上的启发式得分
  const scoreCell = (board: any[][], player: string, row: number, col: number) => {
    let score = 0;
    for (const [dx, dy] of DIRECTIONS) {
      const { count, openEnds } = countLine(board, player, row, col, dx, dy);
      if (count >= 5) return mergedConfig.weights.win;
      if (count === 4 && openEnds > 0) score += mergedConfig.weights.fourOpen;
      else if (count === 3 && openEnds === 2) score += mergedConfig.weights.threeOpen;
      else if (count === 3 && openEnds === 1) score += mergedConfig.weights.threeClosed;
      else if (count === 2 && openEnds === 2) score += mergedConfig.weights.twoOpen;
      else if (count === 2 && openEnds === 1) score += mergedConfig.weights.twoClosed;
      else if (count === 1 && openEnds === 2) score += mergedConfig.weights.oneOpen;
    }
    return score;
  };

  // 扫描是否存在一步即胜的落点
  const tryWinningMove = (board: any[][], player: string, emptyCells: { r: number; c: number }[], checkWinner: (b: any[][], r: number, c: number, p: string) => any) => {
    for (const { r, c } of emptyCells) {
      const testBoard = board.map((row) => [...row]);
      testBoard[r][c] = player;
      if (checkWinner(testBoard, r, c, player)) return { r, c };
    }
    return null;
  };

  // 选择当前局面的最佳落点（启发式评分）
  const findBestMove = (board: any[][], checkWinner: (b: any[][], r: number, c: number, p: string) => any) => {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (!board[r][c]) emptyCells.push({ r, c });
      }
    }

    // 先找白方一步致胜
    const winMove = tryWinningMove(board, 'white', emptyCells, checkWinner);
    if (winMove) return winMove;
    // 再找能阻止黑方致胜的一步
    const blockMove = tryWinningMove(board, 'black', emptyCells, checkWinner);
    if (blockMove) return blockMove;

    let best: { r: number; c: number } | null = null;
    let bestScore = -Infinity;
    const center = Math.floor(boardSize / 2);

    // 评估每个空位的攻守价值 + 中心偏好
    for (const { r, c } of emptyCells) {
      const attackScore = scoreCell(board, 'white', r, c);
      const defendScore = scoreCell(board, 'black', r, c);
      const centerBias = -(Math.abs(r - center) + Math.abs(c - center));
      const total = attackScore + defendScore * mergedConfig.defendWeight + centerBias * mergedConfig.centerWeight;
      if (total > bestScore) {
        bestScore = total;
        best = { r, c };
      }
    }

    return best || emptyCells[Math.floor(Math.random() * emptyCells.length)] || null;
  };

  return { findBestMove, config: mergedConfig };
};
