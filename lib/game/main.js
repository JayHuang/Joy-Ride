//some tunable settings we can reference throughout our game
var SETTINGS = {
	SPEED: 30, // Affects scrolling & scroe
	GRAVITY: 300, // Entities affected by gravity
	PLAYER_ACCELERATION: 500, 
	PLAYER_JUMP: -100, 
	PLAYER_FALL: 100, 
	BOOST_RATE: 1,
    BOOST_COUNT: 70,
    ITEM_POINTS: 50,
    ITEM_BOOST: 4, 
    PROJECTILE_FIRE_RATE: 0.25 //per second
};

ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

    'game.entities.player',
	'game.entities.enemy',
	'game.entities.item',
    'game.levels.level1'
)
.defines(function(){

MyGame = ig.Game.extend({
    SPEED: SETTINGS.SPEED,          // Affects scrolling & score
    gravity: SETTINGS.GRAVITY,       // Entities affected by gravity
    player: null,       // Reference to player entity
    playerAlive: true,
    score: 0,
	time: 0,
	itemTimer: 0,
    startOfLevel: true,

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),

	start: function() {
		this.score = 0; 
        this.loadLevel( LevelLevel1 );

        this.player = this.spawnEntity( EntityPlayer, ig.system.width / 2, ig.system.height / 2 - 16 );
		
		for (var i = 1; i <= 4; i++)
			this.spawnEntity( EntityItem, ig.system.width / 2 + i*50, ig.system.height / 2 - 16 );
		
		this.timer = new ig.Timer(5);
	},

	init: function() {
		// Initialize your game here; bind keys etc.

        setTimeout(function(){ ig.game.startOfLevel = false; }, 1000);

        // Bind keys
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        ig.input.bind(ig.KEY.UP_ARROW, 'jump');
        ig.input.bind(ig.KEY.SPACE, 'shoot');
		ig.input.bind(ig.KEY.A, 'log');
		ig.input.bind(ig.KEY.X, 'restart');

		this.start(); 

        // Load the LevelTest as required above ('game.level.test')
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

		if (ig.input.state('restart')) {
			this.start(); 
		}

        if (!this.startOfLevel) {
            if (this.player.health <= 0) {
                this.player.kill();
            } else {
				this.time += 1;
				this.itemTimer +=1;
                // Check for player death if touches left or bottom edges
                if (this.player.pos.x <= this.screen.x || this.player.pos.y >= ig.system.height)
                    this.player.health = 0;
                // Scroll screen to the left and update score
                this.screen.x += ig.game.SPEED * ig.system.tick;
                this.score += Math.round(ig.game.SPEED * ig.system.tick);
				
				if(this.time == 120){
					this.placeEnemies();
					this.time = 0;
				}
				
				if(this.itemTimer == 240){
					this.placeItems();
					this.itemTimer = 0;
				}
				
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

        this.font.draw('Score: ' + this.score, 5, 25);
        this.font.draw('Boost: ' + this.player.boost + '%', 5, 15);
        this.font.draw('Last Fired: ' + ((this.player.lastFired) ? this.player.lastFired.delta() : null) , 5, 35);

        if (this.player.health <= 0) {
            this.font.draw('Game over', x, y, ig.Font.ALIGN.CENTER);
            this.player.kill();
        }
	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2.5 );

});
