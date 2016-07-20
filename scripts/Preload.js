Preload = function(game){}

Preload.prototype = {
    preload:function(){
        this.game.load.image('background',
            'assets/background-texture.png');
        this.game.load.image('wall','assets/wall.png');
        this.game.load.spritesheet('player','assets/player.png',
            48, 48,4);
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },
    create:function(){
        this.game.state.start('Game');
    }
}