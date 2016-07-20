var game = new Phaser.Game(1920,1080,Phaser.AUTO);
game.state.add('Preload',Preload);
game.state.add('Game',Game);

game.state.start('Preload');