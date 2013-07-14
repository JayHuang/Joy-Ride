//some tunable settings we can reference throughout our game
var SETTINGS = {
	SPEED: 50, // Affects scrolling & scroe
	GRAVITY: 200, // Entities affected by gravity
	PLAYER_ACCELERATION: 800, 
	PLAYER_JUMP: -200, 
	PLAYER_FALL: 200, 
	BOOST_RATE: 0.1, //rate of boost decrease 1%/BOOST_RATE
    BOOST_COUNT: 70,
    ENEMY_POINTS: 75,
    ITEM_POINTS: 50,
    ITEM_BOOST: 7,
    PROJECTILE_FIRE_RATE: 0.125, //per second
    BOOST_SPAWN_RATE: 14, //Spawns items every x seconds
    ENEMY_SPAWN_RATE: 2 //Spawns enemies every x seconds
};

var boostIntervalId;

ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
    'impact.debug.debug',
    'game.entities.player',
	'game.entities.enemy',
	'game.entities.item',
	'game.entities.obstacle',
    'game.levels.TheJourney'
)
.defines(function(){

MyGame = ig.Game.extend({
    player: null,       // Reference to player entity
    score: 0,
	time: 0,
	itemTimer: 0,
    startOfLevel: true,
	gameOverSound: new ig.Sound('media/sound/death.ogg'),

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),

	start: function() {
		this.score = 0;
        this.SPEED = SETTINGS.SPEED;          // Affects scrolling & score
        this.gravity = SETTINGS.GRAVITY;       // Entities affected by gravity 
        this.loadLevel( LevelTheJourney );

        this.timer = new ig.Timer();
        this.player = this.spawnEntity( EntityPlayer, 64, 88 );
		
		for (var i = 1; i < 2; i++)
			this.spawnEntity( EntityItem, ig.system.width / 2 + 20 + i * 60, ig.system.height / 2 - 16 );
		
		this.hasPlayedGOSound = false;
		this.gameOver = false;
		ig.game.startOfLevel = false; 
		$('.gameover').hide(); 
	},

	init: function() {
        self = this;
        this.trackGameTime();
		// Initialize your game here; bind keys etc.
        //setTimeout(function(){ ig.game.startOfLevel = false; }, 1000);
        this.boostIntervalId = setInterval(function() {
            self.player.increaseBoost(1);
        }, 2000);
        
        setInterval(function() {
            if (self.player.health >= 1)
                self.placeEnemies();
        }, SETTINGS.ENEMY_SPAWN_RATE * 1000);

        setInterval(function() {
            if (self.player.health >= 1)
                self.placeItems();
        }, SETTINGS.BOOST_SPAWN_RATE * 1000);

        setInterval(function() {
            var entities = ig.game.entities;
            for(var i = 0; i < entities.length; i++) {
                if (entities[i].pos.x <= self.screen.x)
                    entities[i].kill();
            }
        }, 1000);
        // Bind keys
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        ig.input.bind(ig.KEY.UP_ARROW, 'jump');
        ig.input.bind(ig.KEY.SPACE, 'shoot');
		ig.input.bind(ig.KEY.A, 'log');
		ig.input.bind(ig.KEY.X, 'restart');

		this.start();
	},
	
    trackGameTime: function() {
        setInterval(function(){
            ig.game.timePlayed = Math.round(ig.game.timer.delta());
            ig.game.setGameSpeed();
        }, 1000);
    },

    setGameSpeed: function() {
        if (Math.round(this.timePlayed) % 1 == 0) {
            this.SPEED += 2;
            this.player.acceleration += 2;
            this.player.maxVel.x += 2;
            this.player.friction.x += 2;
        }
    },

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

		if (ig.input.state('restart')) {
			// this.hasPlayedGOSound = false;
			// this.gameOver = false;
			this.start();

		}

        if (!this.startOfLevel) {
            if (this.player.health <= 0) {
				clearInterval(this.boostIntervalId); 
				if (this.hasPlayedGOSound == false){
					this.gameOverSound.play();
					this.hasPlayedGOSound = true;
				}
				if (!this.gameOver){
					this.death = this.spawnEntity( EntityPlayerDeath, this.player.pos.x, this.player.pos.y);
					this.gameOver = true;
					
				}
				
				if (this.death.currentAnim.loopCount){
					this.death.clean();
				}
				this.death.currentAnim.update();
				this.player.kill();
            } else {
				this.time += 1;
				this.itemTimer +=1;
                // Check for player death if touches left or bottom edges
                if (this.player.pos.x <= this.screen.x || this.player.pos.y >= ig.system.height){
                    this.player.health = 0;
					if (this.hasPlayedGOSound == false){
						this.gameOverSound.play();
						this.hasPlyedGOSound = true;
					}
				}
                // Scroll screen to the left and update score
                this.screen.x += ig.game.SPEED * ig.system.tick;
                this.score += Math.round(ig.game.SPEED * ig.system.tick);
            }
        }
	},
	
	placeEnemies: function(){
		var maxHeight = ig.system.height;
		var maxWidth = ig.system.width;
		var minX = this.player.pos.x + 50;
		
		// 3 enemies at a time at most
		var numOfEnemies = Math.floor(Math.random() * 2) + 1
		
		for (var i = 1; i <= numOfEnemies; i++){
    		var x_pos = Math.random() * (maxWidth - minX) + minX;
            var y_pos = Math.random() * (this.player.pos.y - 1) + 1;

    		this.enemy = this.spawnEntity(EntityEnemy, this.screen.x + ig.system.width, y_pos);
		}
	},
	
	placeItems: function() {
		var maxHeight = ig.system.height;
		var maxWidth = ig.system.width;
		var minX = this.player.pos.x + 50;
		
		// 3 emenies at a time at most
		var numOfEnemies = Math.floor(Math.random() * 1) + 1
		
		for (var i=0; i< numOfEnemies; i++){
		var x_pos = Math.random() * (maxWidth - minX) + minX;
		var y_pos = Math.random() * (this.player.pos.y - 1) + 1;
		
		this.enemy = this.spawnEntity(EntityItem, this.screen.x + ig.system.width, y_pos);
		}

		
	},
	
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Add your own drawing code here
        var x = ig.system.width/2,
            y = ig.system.height/2;

        if (this.startOfLevel) {
            this.font.draw('JOY RIDE', x, y, ig.Font.ALIGN.CENTER);
        }

        $('.score-val').text(this.score);
       	$('.boost-bar .boost-fill').css('width', Math.floor(this.player.boost) + '%').end().find('.label').text(Math.floor(this.player.boost) + '%');
        if (this.player.health <= 0) {
            $('.gameover').show(); 
            //this.player.kill();
        }
	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled up by a factor of 2
ig.main( '#canvas', MyGame, 60, 800, 600, 1);
ig.system.stopRunLoop(); 

});
