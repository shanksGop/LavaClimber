class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("RESET");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  
    this.isHurt = false;
    this.die = false;
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
      player = new Player();
      playerCount = player.getCount();

    form = new Form();
    form.display();

    climber1 = createSprite(30,320)
   
    climber1.addAnimation("p1",player1Img)
    climber1.addAnimation("hurt1", player1Hurt)
    climber1.scale = 0.2
    //climber1.debug = true;
    climber1.setCollider("circle", 0, 0, 120)

    climber2 = createSprite(470,320)
  
    climber2.addAnimation("p2",player2Img)
    climber2.addAnimation("hurt2", player2Hurt)
    climber2.scale = 0.2
    //climber2.debug = true;
    climber2.setCollider("circle", 0, 0, 120)

    bouldersGroup = new Group()
    fireballsGroup = new Group()
    this.addBoulders(bouldersGroup, 13, boulderImg, 0.02, boulder)
    this.addFireballs(fireballsGroup, 200, fireballImg, 0.01, fireball)
    
    climbers = [climber1, climber2]
    
  }

  addBoulders(spriteGroup, numberOfSprites, spriteImage, scale, sprite, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        x = random(width / 2 + 200, width / 2 - 200);
        y = random(-height * 7, height - 400);
      }
      var sprite = createSprite(x, y);
      sprite.addSpeed(2, 90)
      sprite.addAnimation("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
      
    }
  }
  //  spawnFireballs(){
  //   if(frameCount%60===0){
  //   fireball = createSprite(600,100,-10,320);
  //   fireball.addAnimation(fireballImg);
  //   console.log(fireball.y)
  //   fireball.velocityX = 5;
  //   fireball.y = Math.round(random(10,height-200 ));
  //   fireball.lifetime = 100;
  //   fireballsGroup.add(fireball);
  //   }
  //   }

  addFireballs(spriteGroup, numberOfSprites, spriteImage, scale, sprite, positions = []) {
    
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        var z = [700, 1300, 1800, 2300, 2800,  3300, 4800, 4300]
        x = random(z);
        y = random(-height * 7, height - 400);
      }
      var sprite = createSprite(x, y);
      sprite.addSpeed(3, 180)
      sprite.addAnimation("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
      
    }
  }

  handleElements() {
    form.hide();
 

    //C39
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 300, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 330, 100);

    // this.leadeboardTitle.html("Leaderboard");
    // this.leadeboardTitle.class("resetText");
    // this.leadeboardTitle.position(width / 3 - 60, 40);

  this.leader1.class("leadersText");
  this.leader1.position(width / 3 - 70, 80);

  this.leader2.class("leadersText");
  this.leader2.position(width / 3 - 70, 130);
   }

  
  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getPlayersAtEnd();


    if (allPlayers !== undefined) {
    
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        climbers[index-1].position.x = x;
        climbers[index-1].position.y = y;
        // boulder.velocityY = 2
        // if(climbers[0].collide(bouldersGroup)){
        //   climber1.changeAnimation("hurt1")
         
        // }

        // if(climbers[1].collide(bouldersGroup)){
        //   climber2.changeAnimation("hurt2")
     
        // }
        
        // if(!climbers[0].collide(bouldersGroup)){
        //   climber1.changeAnimation("p1")
        
        // }
        // if(!climbers[1].collide(bouldersGroup)){
        //   climber2.changeAnimation("p2")
         
        // }


        if (index === player.index) {
          stroke(3);
          fill("white");
          ellipse(x, y, 30, 30);

          this.showLife()
          this.handleObstacleCollision(index);

          if (player.life <= 0) {
            this.die = true;
            this.gameOver()
          }

          // Changing camera position in y direction
          
          if(climbers[index-1].position.y<200){
          camera.position.y = climbers[index - 1].position.y;
          }
    
      }
      }


      // handling keyboard events
      this.handlePlayerControls();

      // Finshing Line
       const finishLine = 3000;

      if (player.positionY > finishLine) {
        gameState = 2;
        player.rank += 1;
        Player.updatePlayersAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        playersAtEnd: 0
      });
      window.location.reload();
    });
  }

  showLife() {
    push();  
    fill("white");
    rect(width / 2 - 230, height - player.positionY - 240, 185, 20);
    fill("red");
    rect(width / 2 - 230, height - player.positionY - 240, player.life, 20);
    fill("yellow")
    text(player.name, width / 2 - 230, height - player.positionY - 210);
    noStroke();
    pop();
  }



  handlePlayerControls() {
    if(!this.die){
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 2;
        player.update();
      }

      if (keyIsDown(DOWN_ARROW)) {
        player.positionY -= 2;
        player.update();
      }

      if (keyIsDown(LEFT_ARROW)) {
        this.leftKeyActive = true
        player.positionX -= 2;
        player.update();
        
        if(this.isHurt){
        climbers[0].changeAnimation("p1");
        climbers[1].changeAnimation("p2")
        }
      }

      if (keyIsDown(RIGHT_ARROW)) {
        this.leftKeyActive = false;
        player.positionX += 2;
        player.update();

        if(this.isHurt){
          climbers[0].changeAnimation("p1");
          climbers[1].changeAnimation("p2")
          }

      }
    }
  }




  handleObstacleCollision(index) {
    if (climbers[index - 1].collide(bouldersGroup)) {
        this.isHurt = true;
        player.positionY -=200

        if(this.isHurt){
          climbers[0].changeAnimation("hurt1");
          climbers[1].changeAnimation("hurt2")
  
        }

      //Reducing Player Life
      if (player.life > 0) {
        player.life -= 200 / 4;
      }

      if(player.life<0){
        gameState = 2;
        this.gameOver()
      }
      player.update();
    }
    
    if (climbers[index - 1].collide(fireballsGroup)) {
      this.isHurt = true;
      player.positionY -=50

      if(this.isHurt){
        climbers[0].changeAnimation("hurt1");
        climbers[1].changeAnimation("hurt2")

      }

    //Reducing Player Life
    if (player.life > 0) {
      player.life -= 200 / 8;
    }

    if(player.life<0){
      gameState = 2;
      this.gameOver()
    }
    player.update();
  }
    
  }
 

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    },
    function (isConfirm){
      if(isConfirm){
        database.ref("/").set({
          playerCount: 0,
          gameState: 0,
          players: {},
          playersAtEnd: 0
        });
        window.location.reload();
      }
      }
    );
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: "You Didn't Make It!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Good Try"
    },
    function (isConfirm){
      if(isConfirm){
        database.ref("/").set({
          playerCount: 0,
          gameState: 0,
          players: {},
          playersAtEnd: 0
        });
        window.location.reload();
      }
      }
    );
    
  }

  // end() {
  //   console.log("Game Over");
  // }
}
