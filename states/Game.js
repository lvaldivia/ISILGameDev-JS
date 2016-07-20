Game = function(game){}

Game.prototype ={
    create:function(){
        this.GRAVITY = 400;
        this.background =
                this.game.add.tileSprite(0,0,
                this.game.width,this.game.height,
                'background');
        this.background.autoScroll(-200,0);
        this.player = this.game.add.sprite(0,0,'player');
        this.player.x = this.game.world.centerX - 350;
        this.player.y = this.game.world.centerY;
        this.player.scale.setTo(2);
        this.player.animations.add("fly", [0,1,2], 10, true);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = this.GRAVITY;
        this.game.physics.arcade.enable(this.player);
        this.player.body.allowGravity = false;
        this.game.input.onDown.add(this.flap,this);
        this.elapsed = 0;
        this.gameOver = false;
        this.walls = this.game.add.group();
        this.startGame = false;
        this.generationTime = 3000;
        this.flapVelocity = 300;

        var flapKey = this.game.input.keyboard.addKey(VK_ENTER);
        flapKey.onDown.add(this.flap, this);
        this.score = 0;
        var style = {
            fontSize: "60px",
            fill: "#FFF",
            align: "center"
        };
        this.maxScore = this.add.text(this.game.width - 800,0,"Max Score",style);
        this.maxScore.visible = false;
        if(localStorage.jumps !=null){
          this.maxScore.text = "Max Score :"+localStorage.jumps;
          this.maxScore.visible = true;
        }
        this.scoreText = this.add.text(
         this.world.centerX,
         this.world.centerY,
         "PRESS ENTER TO PLAY",
         style);
         this.scoreText.anchor.setTo(0.5, 0.5);
    },
    flap:function(){
      if(!this.startGame){
          this.startGame = true;
          if(!this.player.body.allowGravity){
            this.player.body.allowGravity = true;
            this.scoreText.text ="Score : "+ this.score;
          }
      }else{
        if(this.player.alive){
          this.player.body.velocity.y = -this.flapVelocity;
        }else{
          this.reset();
        }
      }
    },
    update:function(){
      if(this.startGame){
        if(!this.gameOver){
            if(this.player.body.velocity.y > -20){
                this.player.frame = 3;
            }else{
                this.player.animations.play("fly");
            }
            this.elapsed+= this.game.time.elapsed;
            if(this.elapsed>=this.generationTime){
                this.elapsed = 0;
                this.spawnWalls();
            }
          this.walls.forEachAlive(function(wall){
              if(wall.x<-wall.width){
                wall.kill();
              }else if(!wall.scored){
                if(this.player.x>=wall.x){
                  wall.scored = true;
                  this.score+=0.5;
                  this.scoreText.text = "Score : "+this.score;
                }
              }
          },this);

          if(this.player.y > this.game.height){
            this.gameOver = true;
            this.showGameOver();
          }

          this.game.physics.arcade.collide(
               this.player,this.walls
               ,function(player,wall){
                   if(!this.gameOver){
                       this.gameOver = true;
                       this.showGameOver();

                   }
               },null,this);
        }
      }
    },
    showGameOver:function(){
        if(localStorage.jumps!=null){
            var score = localStorage.jumps;
            if(score< this.score){
              localStorage.jumps = this.score;
            }
        }else{
            localStorage.jumps = this.score;
        }
        this.player.kill();
        this.scoreText.text = "YOU LOSE YOUR SCORE :"+this.score + " \n ENTER TO TRY AGAIN";
    },

    reset:function(){
      this.score = 0;
      this.gameOver = false;
      this.startGame = false;
      this.player.reset(this.game.world.centerX,this.game.world.centerY);
      this.player.body.allowGravity = false;
      this.player.play("flying");
      this.scoreText.text = "PRESS ENTER TO PLAY";
      this.maxScore.text = "Max Score : "+localStorage.jumps;
      this.maxScore.visible =true;
      this.walls.removeAll();
    },


    spawnWalls: function(){
        var wallY = this.rnd.integerInRange
            (this.game.height *.3, this.game.height *.7);
        var botWall = this.generateWall(wallY);
        var topWall = this.generateWall(wallY, true);
    },

    generateWall:function(wallY,flipped){
        var posY ;
        var opening  = 400;
        if(flipped){
            wallY = wallY - (opening/2);
        }else{
            wallY = wallY + (opening/2);
        }

        var wall = this.walls.getFirstDead();
        if(!wall){
          wall = this.game.add.sprite(this.game.width,
                  wallY,'wall');
          this.game.physics.arcade.enable(wall);
        }else{
            wall.reset(this.game.width,wallY);
        }
        wall.scored = false;
        wall.body.velocity.x = -200;
        if(flipped){
            wall.scale.y = -1;
            wall.body.offset.y  = -wall.body.height;
        }else{
          wall.scale.y = 1;
          wall.body.offset.y = 0;
        }
        wall.body.immovable = true;
        wall.body.allowGravity = false;
        this.walls.add(wall);
    }
}
