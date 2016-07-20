Game = function(){}
Game.prototype = {
	create:function(){
		this.background = this.game.add.tileSprite(0,0,this.game.width,this.game.height,'background');
		this.background.autoScroll(-200,0)
		this.GRAVITY = 400;
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.player = this.game.add.sprite(0,0,'player');
		this.player.x = this.game.world.centerX;
		this.player.y = this.game.world.centerY;
		this.player.scale.setTo(2);
        this.player.animations.add("fly", [0,1,2], 10, true);
        this.player.animations.play("fly");
        this.game.physics.arcade.enable(this.player);
        this.game.physics.arcade.gravity.y = this.GRAVITY;
        //this.player.body.allowGravity = false;
        this.elapsed = 0;
        this.generationTime = 3000;
        this.walls = this.game.add.group();
        this.walls.enableBody = true;
        var flapKey = this.game.input.keyboard.addKey(VK_ENTER);
        flapKey.onDown.add(this.flap,this);
        this.flapVelocity = 300;
        this.game.input.onDown.add(this.flap,this);

        var style = {
            fontSize: "60px",
            fill: "#FFF",
            align: "center"
        };

        this.score = 0;
        this.txtScore = this.game.add.text(0,0,'Score :',style);
        this.txtScore.x = this.game.width - (2*this.txtScore.width);

	},
	flap:function(){
		this.player.body.velocity.y = -this.flapVelocity;
	},

	update:function(){
		this.elapsed+= this.game.time.elapsed;
		if(this.player.body.velocity.y > -20){
			this.player.frame = 3;
		}else{
			this.player.animations.play('fly');
		}
		if(this.elapsed>=this.generationTime){
			this.elapsed = 0;
			this.spawnWall();
		}
		this.walls.forEach(function(wall){
			if(wall.x<0){
				wall.kill();
			}else if(!wall.scored){
				if(this.player.x>=wall.x){
					wall.scored = true;
					this.score+=0.5;
					this.txtScore.text = "Score : "+this.score;
				}
			}
		},this);

		this.game.physics.arcade.collide(this.player,
			this.walls,function(player,wall){

			},null,this)
	},
	spawnWall:function(){
		var wallY = this.rnd.integerInRange
            (this.game.height *.3, this.game.height *.7);
        var top = this.generateWall(wallY);
        var bottom = this.generateWall(wallY, true);
	},
	generateWall:function(wallY,flipped){
		var posY;
		var opening = 400;
		if(flipped){
			wallY = wallY - (opening/2)
		}else{
			wallY = wallY + (opening/2);
		}
		var wall = this.walls.getFirstDead();
		if(!wall){
			wall = this.game.add.sprite(this.game.width,
				wallY,'wall');
			this.walls.add(wall);
		}else{
			wall.reset(this.game.width,wallY);
		}
		wall.scored = false;
		wall.body.velocity.x = -200;
		if(flipped){
			wall.scale.y = -1;
			wall.body.offset.y = -wall.body.height;
		}else{
			wall.scale.y = 1;
			wall.body.offset.y = 0;
		}
		wall.body.immovable = true;
		wall.body.allowGravity = false;
	}
}