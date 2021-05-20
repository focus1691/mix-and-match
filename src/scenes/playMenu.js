import Phaser from 'phaser';

export default class playMenu extends Phaser.Scene {
  constructor() {
    super('playMenu');
  }
  create() {
    this.scene.bringToTop();
    var tintedText = this.add.dynamicBitmapText(this.game.config.width / 2, this.game.config.height / 2, 'ice', 'Start', 128).setOrigin(0.5).setCenterAlign();
    tintedText.tintTopLeft = 0x5babe0;
    tintedText.tintTopRight = 0xfff;
    tintedText.tintBottomLeft = 0xfff;
    tintedText.tintBottomRight = 0x5babe0;
    tintedText.setInteractive();

    tintedText.on('pointerdown', () => {
      this.scene.start('playGame');
    });
  }
}
