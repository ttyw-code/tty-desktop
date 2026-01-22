import { useState } from 'react';
import { RefreshCw, Undo2, Trophy } from 'lucide-react';

// 棋盘大小
const BOARD_SIZE = 15;

// 方向数组：横、竖、左斜、右斜
const DIRECTIONS = [
  [1, 0],  // Horizontal
  [0, 1],  // Vertical
  [1, 1],  // Diagonal \
  [1, -1]  // Diagonal /
];

// 星位（天元及四周的四个点）
const STAR_POINTS = [
  [3, 3], [11, 3],
  [7, 7],
  [3, 11], [11, 11]
];

const GomokuGame = () => {
  // 游戏状态
  // board: 二维数组，存储 null, 'black', 'white'
  const [history, setHistory] = useState([Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))]);
  const [currentMove, setCurrentMove] = useState(0);
  const [winner, setWinner] = useState<string | null>(null); // 'black', 'white', or null
  const [winningLine, setWinningLine] = useState<{r: number, c: number}[]>([]); // 存储获胜连线的坐标
  
  // 当前棋盘状态
  const currentBoard = history[currentMove];
  // 当前执子方 (黑先白后)
  const isBlackNext = currentMove % 2 === 0;

  // 判断胜负逻辑
  const checkWinner = (board: any[][], row: number, col: number, player: string) => {
    for (let [dx, dy] of DIRECTIONS) {
      let count = 1;
      let line = [{r: row, c: col}];

      // 正向检查
      let r = row + dy;
      let c = col + dx;
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        count++;
        line.push({r, c});
        r += dy;
        c += dx;
      }

      // 反向检查
      r = row - dy;
      c = col - dx;
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        count++;
        line.push({r, c});
        r -= dy;
        c -= dx;
      }

      if (count >= 5) {
        return { winner: player, line };
      }
    }
    return null;
  };

  // 处理点击落子
  const handleSquareClick = (row: number, col: number) => {
    // 如果已经有子或者游戏结束，直接返回
    if (currentBoard[row][col] || winner) return;

    const newBoard = currentBoard.map(r => [...r]);
    const currentPlayer = isBlackNext ? 'black' : 'white';
    newBoard[row][col] = currentPlayer;

    // 更新历史记录（处理悔棋后重新落子的情况）
    const nextHistory = [...history.slice(0, currentMove + 1), newBoard];
    
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    // 检查胜负
    const result = checkWinner(newBoard, row, col, currentPlayer);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    }
  };

  // 重新开始
  const resetGame = () => {
    setHistory([Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))]);
    setCurrentMove(0);
    setWinner(null);
    setWinningLine([]);
  };

  // 悔棋
  const undoMove = () => {
    if (currentMove > 0 && !winner) {
      setCurrentMove(currentMove - 1);
    }
  };

  // 渲染单个格子
  const renderSquare = (row: number, col: number) => {
    const value = currentBoard[row][col];
    const isStarPoint = STAR_POINTS.some(([r, c]) => r === row && c === col);
    
    // 判断是否在获胜连线上
    const isWinningPiece = winningLine.some((pos) => pos.r === row && pos.c === col);
    
    // 判断是否是最后一步（用于显示标记）
    // 需要比较当前格子与上一步历史记录的差异，或者简单地通过逻辑判断
    // 这里我们简单起见，不重新遍历，而是标记：如果是当前有子，且是最新一步
    // 由于我们没有直接存最后一步坐标，这里不做复杂反推，
    // 但可以通过 history 比较。
    // 简化版：我们只在 handleSquareClick 里知道最后落子位置，
    // 为了渲染时知道哪个是最后一步，我们在下面的 return 中逻辑判断不太容易。
    // 让我们稍微改一下逻辑，我们可以不显示"最后一步"标记，或者为了完美体验，增加一个 state 存 lastMove。
    
    // 改进：直接用 board 比较 history[currentMove] 和 history[currentMove-1] 来找不同有点慢。
    // 既然是 UI 组件，我们简单点：通过比较索引。
    // 实际上对于 React 这种规模，不需要过度优化。
    
    // 让我们换个思路：只高亮 WinningPiece 足够了。
    // 如果想要"Last Move" 高亮，我们其实可以在 board 数据结构里存 step，或者单独存 lastMove 坐标。
    // 这里为了简洁，我会在逻辑里加入一个简单的判断：
    // 如果棋盘不为空，且当前格子的棋子在上一回合为空（如果是第一步则直接显示），则为最后一步。
    
    let isLastMove = false;
    if (currentMove > 0 && value) {
      const prevBoard = history[currentMove - 1];
      if (!prevBoard[row][col]) {
        isLastMove = true;
      }
    }

    return (
      <div 
        key={`${row}-${col}`}
        className="relative flex items-center justify-center w-full h-full cursor-pointer"
        onClick={() => handleSquareClick(row, col)}
      >
        {/* 棋盘线 */}
        <div className={`absolute bg-stone-800 pointer-events-none
          ${row === 0 ? 'top-1/2 h-1/2' : row === BOARD_SIZE - 1 ? 'top-0 h-1/2' : 'h-full'} 
          w-[0.0625rem] left-1/2 -translate-x-1/2`} 
        />
        <div className={`absolute bg-stone-800 pointer-events-none
          ${col === 0 ? 'left-1/2 w-1/2' : col === BOARD_SIZE - 1 ? 'left-0 w-1/2' : 'w-full'} 
          h-[0.0625rem] top-1/2 -translate-y-1/2`} 
        />
        
        {/* 星位小圆点 */}
        {isStarPoint && !value && (
          <div className="absolute w-1.5 h-1.5 bg-stone-800 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        )}

        {/* 棋子 */}
        {value && (
          <div 
            className={`
              relative z-10 w-[85%] h-[85%] rounded-full shadow-md 
              transition-all duration-200 ease-out transform scale-100
              ${value === 'black' 
                ? 'bg-gradient-to-br from-gray-800 to-black ring-[0.0625rem] ring-gray-600' 
                : 'bg-gradient-to-br from-white to-gray-200 ring-[0.0625rem] ring-gray-300'
              }
              ${isWinningPiece ? 'ring-[0.125rem] ring-red-500 shadow-[0_0_0.625rem_rgba(239,68,68,0.8)] scale-110' : ''}
            `}
          >
            {/* 棋子的高光效果 */}
            <div className={`absolute top-[15%] left-[15%] w-[30%] h-[30%] rounded-full bg-white opacity-20`} />
            
            {/* 最后一步标记 (红色小点) */}
            {isLastMove && !winner && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full opacity-80" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full w-full min-h-0 flex-col items-center justify-start bg-stone-100 p-4 font-sans text-stone-800 overflow-hidden">
      
      {/* 标题 */}
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-widest text-stone-800">五子棋</h1>
        <p className="text-stone-500 text-sm">Gomoku</p>
      </div>

      {/* 状态栏 */}
      <div className="flex items-center justify-between w-full max-w-[25rem] mb-4 px-[1rem] py-[0.75rem] bg-white rounded-xl shadow-sm border-[0.0625rem] border-stone-200">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isBlackNext ? 'bg-black' : 'bg-gray-300'}`}></div>
          <span className={`font-bold ${isBlackNext ? 'text-black' : 'text-gray-400'}`}>黑方</span>
        </div>
        
        {winner ? (
          <div className="flex items-center gap-2 text-amber-600 font-bold animate-pulse">
            <Trophy size={18} />
            <span>{winner === 'black' ? '黑方获胜!' : '白方获胜!'}</span>
          </div>
        ) : (
          <div className="text-stone-400 text-sm font-medium">
            {isBlackNext ? '黑方落子' : '白方落子'}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className={`font-bold ${!isBlackNext ? 'text-stone-600' : 'text-gray-300'}`}>白方</span>
          <div className={`w-3 h-3 rounded-full border border-gray-300 ${!isBlackNext ? 'bg-white' : 'bg-gray-100'}`}></div>
        </div>
      </div>

      {/* 棋盘区域 */}
      <div className="p-1.5 bg-[#dcb35c] rounded-lg shadow-2xl border-[0.125rem] border-[#b58e3e]">
        <div 
          className="grid bg-[#eecfa1] relative"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            width: 'min(60vmin, 24rem)',
            height: 'min(60vmin, 24rem)',
          }}
        >
          {/* 渲染所有格子 */}
          {Array.from({ length: BOARD_SIZE }).map((_, row) => (
            Array.from({ length: BOARD_SIZE }).map((_, col) => renderSquare(row, col))
          ))}
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={undoMove}
          disabled={currentMove === 0 || !!winner}
          className={`
            flex items-center gap-2 px-[1.5rem] py-[0.5rem] rounded-full font-medium transition-colors
            ${currentMove === 0 || !!winner 
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
              : 'bg-white text-stone-700 hover:bg-stone-50 shadow-sm border-[0.0625rem] border-stone-300 active:scale-95'}
          `}
        >
          <Undo2 size={18} />
          悔棋
        </button>

        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-[1.5rem] py-[0.5rem] rounded-full font-medium bg-stone-800 text-white hover:bg-stone-700 shadow-md active:scale-95 transition-all"
        >
          <RefreshCw size={18} />
          新游戏
        </button>
      </div>
      
      <div className="mt-4 text-xs text-stone-400 text-center max-w-xs">
        规则: 双方分别使用黑白两色的棋子，下在棋盘网格线的交叉点上，先形成5子连线者获胜。
      </div>

    </div>
  );
};

export default GomokuGame;