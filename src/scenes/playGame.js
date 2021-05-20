import { gameOptions, WRONG_ANSWER_DELAY, WRONG_ANSWER_DURATION, ROLL_OVER_DELAY, TOTAL_PAIRS } from '../constants';
import Phaser from 'phaser';

export default class playGame extends Phaser.Scene {
  constructor() {
    super('playGame');
  }
  init() {
    this.inputBlocked = false;
  }
  create() {
    this.matchingPairs = 0;
    this.board = [];
    this.boardPositions = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11];
    this.stack = [];

    for (var i = 0; i < 100; i++) {
      this.shuffle(this.boardPositions);
    }

    for (var i = 0, k = 0; i < gameOptions.boardSize.rows; i++) {
      this.board[i] = [];

      for (var j = 0; j < gameOptions.boardSize.cols; j++, k++) {
        var tilePosition = this.getTilePosition(i, j);

        this.board[i][j] = {
          value: this.boardPositions[k],
          startingSprite: this.add.image(tilePosition.x, tilePosition.y, 'emptytyle'),
          tileSprite: this.add.sprite(tilePosition.x, tilePosition.y, 'tiles', this.boardPositions[k]).setVisible(false),
          turnedOver: false,
          active: true,
        };

        this.board[i][j].startingSprite.row = i;
        this.board[i][j].startingSprite.col = j;
        this.board[i][j].startingSprite.setInteractive();
        this.board[i][j].startingSprite.on('pointerdown', this.handleSelection);
      }
    }
    this.correctAnswer = this.sound.add('correct_answer');
    this.positiveWarning = this.sound.add('positive_warning');

    this.music = this.sound.add('theme');
    this.music.play({ loop: true });
    this.sound.volume = 0.1;
  }

  shutdown() {
    this.input.keyboard.shutdown();
  }

  handleSelection(pointer) {
    var scene = this.scene;
    var stack = scene.stack;
    var tile = scene.board[this.row][this.col];

    if (tile.turnedOver || !tile.active || scene.inputBlocked) return;

    scene.inputBlocked = true;

    tile.startingSprite.setVisible(false);
    tile.tileSprite.setVisible(true);
    tile.tileSprite.alpha = 0.2;

    var tween = scene.tweens.add({
      targets: tile.tileSprite,
      alpha: 1,
      duration: ROLL_OVER_DELAY,
      onComplete: function () {},
    });

    stack.push(tile);
    if (stack.length === 1) {
      scene.inputBlocked = false;
    } else if (stack.length === 2) {
      if (stack[0].value === stack[1].value) {
        scene.matchingPairs++;
        scene.stack = [];
        scene.correctAnswer.play();

        if (scene.matchingPairs === TOTAL_PAIRS) {
          scene.music.stop();
          this.scene.scene.pause();
          this.scene.scene.launch('restartMenu');
        } else {
          scene.inputBlocked = false;
        }
      } else {
        scene.positiveWarning.play();

        scene.time.addEvent({
          delay: WRONG_ANSWER_DELAY,
          callback: scene.handleWrongAnswer,
          args: [scene],
          loop: false,
        });
      }
    }
  }

  handleWrongAnswer(scene) {
    scene.stack[0].tileSprite.setVisible(false);
    scene.stack[0].startingSprite.setVisible(true);
    scene.stack[0].startingSprite.alpha = 0.2;

    scene.stack[1].tileSprite.setVisible(false);
    scene.stack[1].startingSprite.setVisible(true);
    scene.stack[1].startingSprite.alpha = 0.2;

    var tween2 = scene.tweens.add({
      targets: [scene.stack[0].startingSprite, scene.stack[1].startingSprite],
      alpha: 1,
      duration: WRONG_ANSWER_DURATION,
      onComplete: function () {
        scene.stack = [];

        scene.inputBlocked = false;
        scene.correctAnswer.resume();
      },
    });
  }

  getTilePosition(row, col) {
    var posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);
    var posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);
    return new Phaser.Geom.Point(posX, posY);
  }

  shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
}
