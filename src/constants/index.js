export const WRONG_ANSWER_DELAY = 1000;
export const WRONG_ANSWER_DURATION = 250;
export const ROLL_OVER_DELAY = 500;

export const gameOptions = {
  tileSize: 200,
  tileSpacing: 20,
  boardSize: {
    rows: 4,
    cols: 6,
  },
};

export const TOTAL_PAIRS = gameOptions.boardSize.rows * gameOptions.boardSize.cols / 2;
