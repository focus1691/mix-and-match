import Phaser from 'phaser';
import { gameOptions } from './constants';
//* Scenes
import playIntro from './scenes/introductionScene'; 
import preloaderScene from './scenes/preloader';
import playMenuScene from './scenes/playMenu';
import restartMenuScene from './scenes/restartMenu';
import playGameScene from './scenes/playGame';
//* CSS
import './css/style.css';

var config = {
    type: Phaser.AUTO,
    parent: 'mix-and-match',
	title: "Mix & Match Memory",
	url: "https://www.psychotechnology.com/mix-and-match/",
	version: "1.0.0",
    width: gameOptions.boardSize.cols * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
    height: gameOptions.boardSize.rows * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
    backgroundColor: 0x0a5b91,
    scale: {
        mode: Phaser.DOM.FIT,
        autoCenter: Phaser.DOM.CENTER_BOTH
    },
    scene: [playIntro, preloaderScene, playMenuScene, playGameScene, restartMenuScene]
};

var game = new Phaser.Game(config);
window.focus();