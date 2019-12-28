class bootGame extends Phaser.Scene {
    constructor () {
        super("BootGame");
    }
    preload () {
        this.load.image("emptytyle", "images/emptytile.png");
        this.load.spritesheet("tiles", "images/memory-learning-game-tiles.png", {
            frameWidth: gameOptions.tileSize,
            frameHeight: gameOptions.tileSize
        });
        this.load.audio('theme', 'audio/370293__mrthenoronha__water-game-theme-loop.wav');
        this.load.audio('correct_answer', 'audio/362445__tuudurt__positive-response.wav');
        this.load.audio('positive_warning', 'audio/136755__ultranova105__positive-warning.wav');
    }
    create () {
        this.scene.start("playGame");
    }
}

class playMenu extends Phaser.Scene {
    constructor  () {
        super('playMenu');
    }
    preload () {
        this.load.bitmapFont('ice', 'fonts/iceicebaby.png', 'fonts/iceicebaby.xml');
    }
    create () {
        this.scene.bringToTop();

        var tintedText = this.add.dynamicBitmapText(300, 300, 'ice', 'Play again?', 128);
        console.log(tintedText);
        tintedText.tintTopLeft = 0x5babe0;
        tintedText.tintTopRight = 0xfff;
        tintedText.tintBottomLeft = 0xfff;
        tintedText.tintBottomRight = 0x5babe0;
        tintedText.setInteractive();

        tintedText.on('pointerdown', () => { this.scene.start("playGame"); });
    }
}

class playGame extends Phaser.Scene {
	constructor () {
		super("playGame");
	}
    init () {
        this.inputBlocked = false;
    }
	create () {
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
                    startingSprite:  this.add.image(tilePosition.x, tilePosition.y, "emptytyle"),
                    tileSprite: this.add.sprite(tilePosition.x, tilePosition.y, "tiles", this.boardPositions[k]).setVisible(false),
                    turnedOver: false,
                    active: true
                }

                this.board[i][j].startingSprite.row = i;
                this.board[i][j].startingSprite.col = j;
                this.board[i][j].startingSprite.setInteractive();
                this.board[i][j].startingSprite.on('pointerdown', this.handleSelection);
            }
        }
        this.correctAnswer = this.sound.add('correct_answer');
        this.positiveWarning = this.sound.add('positive_warning');
        
        this.music = this.sound.add('theme');
        this.music.play({loop: true});
	}

	shutdown () {
		this.input.keyboard.shutdown();
	}

    handleSelection (pointer) {
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
            duration: 1000,
            onComplete: function () {
            }
        });

        stack.push(tile);

        if (stack.length === 1) {
            scene.inputBlocked = false;
        }
        else if (stack.length === 2) {
            if (stack[0].value === stack[1].value) {
                scene.matchingPairs++;
                scene.stack = [];
                scene.correctAnswer.play();

                if (scene.matchingPairs === 12) {
                    scene.music.stop();
                    this.scene.scene.pause();
                    this.scene.scene.launch('playMenu');
                } else {
                    scene.inputBlocked = false;
                }
            } else {
                scene.positiveWarning.play();

                scene.time.addEvent({
                        delay: 2000,
                        callback: scene.handleWrongAnswer,
                        args: [scene],
                        loop: false
                    });
            }
        }
    }

    handleWrongAnswer (scene) {
        scene.stack[0].tileSprite.setVisible(false);
        scene.stack[0].startingSprite.setVisible(true);
        scene.stack[0].startingSprite.alpha = 0.2;

        scene.stack[1].tileSprite.setVisible(false);
        scene.stack[1].startingSprite.setVisible(true);
        scene.stack[1].startingSprite.alpha = 0.2;


        var tween2 = scene.tweens.add({
            targets: [scene.stack[0].startingSprite, scene.stack[1].startingSprite],
            alpha: 1,
            duration: 1000,
            onComplete: function () {
                scene.stack = [];

                scene.inputBlocked = false;
                scene.correctAnswer.resume();
            }
        });
    }

    getTilePosition(row, col) {
        var posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);
        var posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);
        return new Phaser.Geom.Point(posX, posY);
    }

    shuffle (a) {
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

function resizeGame() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

const gameOptions = {
    tileSize: 200,
    tileSpacing: 20,
    boardSize: {
        rows: 4,
        cols: 6
    }
}

var config = {
    type: Phaser.AUTO,
    parent: 'mix-and-match',
	title: "Memory Game",
	url: "https://localhost/psychotechnology/mix-and-match/",
	version: "1.0.0",
    width: gameOptions.boardSize.cols * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
    height: gameOptions.boardSize.rows * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
    backgroundColor: 0x0a5b91,
    scale: {
        mode: Phaser.DOM.FIT,
        autoCenter: Phaser.DOM.CENTER_BOTH
    },
    scene: [bootGame, playMenu, playGame]
};

var game = new Phaser.Game(config);
window.focus();