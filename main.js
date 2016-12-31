 // Create the state that will contain the whole game
 var mainState = {
   preload: function() {
     // Here we preload the assets
     game.load.image('player','assets/warrior.png');
     game.load.image('wall','assets/brick.png');
     game.load.image('sword','assets/sword.png');
     game.load.image('medicine','assets/medicine.png');
     game.load.image('enemy','assets/monster.png');
   },

   create: function() {
     // Here we create the game
     // Set the background color to blue
     game.stage.backgroundColor = '#3598db';

     // Start the Arcade physics system (for movements and collisions)
     game.physics.startSystem(Phaser.Physics.ARCADE);

     // Add the physics engine to all game objects
     game.world.enableBody = true;
     
     this.cursor = game.input.keyboard.createCursorKeys();
     
     this.player = game.add.sprite(70,100,'player');
     
     this.player.body.gravity.y = 0;
     this.player.health = 100;

     this.healthText = game.add.text(5, 3, 'Health: '+this.player.health, {fill:'white'});
     this.attack = 10;
     this.attackText = game.add.text(155, 3, 'Attack: '+this.attack, {fill:'yellow'});

     this.walls = game.add.group();
     this.swords = game.add.group();
     this.medicines = game.add.group();
     this.enemies = game.add.group();

     var level = [
      'xxxxxxxxxxxxxxxxxxxxxx',
      '!         !          x',
      '!                 ?  x',
      '!         ?          x',
      '!                    x',
      '!     o   !    x     x',
      'xxxxxxxxxxxxxxxx!!!!!x',
     ];

     for (var i = 0; i < level.length; i++) {
       for (var j = 0; j < level[i].length; j++) {
         if (level[i][j] == 'x') {
            var wall = game.add.sprite(30+24*j, 30+24*i, 'wall');
            this.walls.add(wall);
            wall.body.immovable = true;
         }

         else if (level[i][j] == 'o') {
            var sword = game.add.sprite(30+24*j, 30+24*i, 'sword');
            this.swords.add(sword);
         }

         else if (level[i][j] == '!') {
            var enemy = game.add.sprite(30+24*j, 30+24*i, 'enemy');
            this.enemies.add(enemy);
         }

         else if (level[i][j] == '?') {
            var medicine = game.add.sprite(30+24*j, 30+24*i, 'medicine');
            this.medicines.add(medicine);
         }
       }
     }
   },

   update: function() {
     if (!this.player.alive) {
      this.restart();
     }
     this.player.body.velocity.setTo(0, 0);
     this.healthText.text = 'Health: '+this.player.health;
     game.physics.arcade.collide(this.player, this.walls);

     game.physics.arcade.collide(this.player, this.swords, this.takeSowrd, null, this);

     game.physics.arcade.collide(this.player, this.medicines, this.takeMedicine, null, this);

     game.physics.arcade.collide(this.player, this.enemies, this.fightMonster, null, this);
     // Here we update the game 60 times per second
     if (this.cursor.left.isDown)
       this.player.body.velocity.x = -200;
     else if (this.cursor.right.isDown)
       this.player.body.velocity.x = 200;
     else if (this.cursor.up.isDown)
       this.player.body.velocity.y = -100;
     else if (this.cursor.down.isDown)
       this.player.body.velocity.y = 100;

     
   },

   takeSowrd: function(player, sowrd) {
    this.attack = 100;
    this.attackText.text = 'Attack: '+this.attack;
    sowrd.kill();
   },

   takeMedicine: function (player, medicine) {
     player.heal(100);
     medicine.kill();
   },

   fightMonster: function(player, enemy) {
      enemy.damage(100);
      player.damage(50);
   },

   restart: function () {
     game.state.start('main');
   }
 };

 // Initialize the game and start our state
 var game = new Phaser.Game(600, 250);
 game.state.add('main', mainState);
 game.state.start('main');