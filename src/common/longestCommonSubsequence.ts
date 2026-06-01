/*---------------------------------------------------------------------------------------------*/
/**
 * 最长公共子序列算法实现
 * @param str1 
 * @param str2 
 * @returns 
 */
export function longestCommonSubsequence(str1: string[], str2: string[]): string {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = m, j = n;
  const lcs: string[] = [];

  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcs.push(str1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcs.reverse().join('');
}

export function isInteger(input: unknown): boolean {
  return typeof input === 'number' && Number.isInteger(input);
}