import { gameOptions } from '../constants';
import Phaser from 'phaser';
//* Images
import emptyTitle from '../images/emptytile.png';
import tileset from '../images/memory-learning-game-tiles.png';
//* Sounds
import themeSong from '../audio/370293__mrthenoronha__water-game-theme-loop.wav';
import correctAnswerSound from '../audio/362445__tuudurt__positive-response.wav';
import warningSound from '../audio/136755__ultranova105__positive-warning.wav';
//* Fonts
import iceBabyFontImg from '../fonts/iceicebaby.png';
import iceBabyFontXML from '../fonts/iceicebaby.xml';

export default class preloaderScene extends Phaser.Scene {
  constructor() {
    super('preloader');
  }
  preload() {
    const W = this.game.config.width;
    const H = this.game.config.height;
    const BAR_FRAME_W = W / 4;
    const BAR_FRAME_H = H / 16;
    const BAR_W = BAR_FRAME_W - 110;
    const BAR_H = BAR_FRAME_H - 10;

    this.loadingText = this.add.text(0, 0, 'Loading: ', { fontSize: '2rem', fill: '#FFF' });
    this.loadingText.setPosition(this.game.config.width / 2 - this.loadingText.width / 1.5, this.game.config.height / 2 - this.loadingText.height / 1.5);
    this.loadingText.setDepth(2);

    this.xPos = W / 2 - this.loadingText.width / 1.5;
    this.yPos = H / 2 + this.loadingText.height / 1.5;

    this.graphics = this.add.graphics();
    this.newGraphics = this.add.graphics();
    var progressBar = new Phaser.Geom.Rectangle(this.xPos, this.yPos, BAR_FRAME_W, BAR_FRAME_H);
    var progressBarFill = new Phaser.Geom.Rectangle(this.xPos + 5, this.yPos + 5, BAR_W, BAR_H);

    this.graphics.fillStyle(0xffffff, 2);
    this.graphics.fillRectShape(progressBar);
    this.graphics.setDepth(2);

    this.newGraphics.fillStyle(0xaf111c, 1);
    this.newGraphics.fillRectShape(progressBarFill);
    this.newGraphics.setDepth(2);

    //* Images
    this.load.image('emptytyle', emptyTitle);

    //* Spritesheets
    this.load.spritesheet('tiles', tileset, {
      frameWidth: gameOptions.tileSize,
      frameHeight: gameOptions.tileSize,
    });

    //* Sounds
    this.load.audio('theme', themeSong);
    this.load.audio('correct_answer', correctAnswerSound);
    this.load.audio('positive_warning', warningSound);

    //* Fonts
    this.load.bitmapFont('ice', iceBabyFontImg, iceBabyFontXML);

    this.load.on('progress', this.updateBar, this);
    this.load.on('complete', this.complete, this);
  }
  render() {
    this.children.bringToTop(this.newGraphics);
    this.children.bringToTop(this.loadingText);
  }
  updateBar(percentage) {
    const W = this.game.config.width;
    const H = this.game.config.height;
    const BAR_FRAME_W = W / 4;
    const BAR_FRAME_H = H / 16;
    const BAR_W = BAR_FRAME_W - 110;
    const BAR_H = BAR_FRAME_H - 10;

    this.newGraphics.clear();
    this.newGraphics.fillStyle(0xaf111c, 1);
    this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(this.xPos + 5, this.yPos + 5, percentage * (BAR_FRAME_W - 10), BAR_H));

    percentage = percentage * 100;
    this.loadingText.setText('Loading: ' + percentage.toFixed(2) + '%');
  }
  complete() {
    this.scene.start('playMenu');
  }
}
