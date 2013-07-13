ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

    'game.entities.player',
	'game.entities.enemy',
	'game.entities.item',
    'game.levels.flat'
)
.defines(function(){

MyGame = ig.Game.extend({
    SPEED: 30,          // Affects scrolling & score
    gravity: 300,       // Entities affected by gravity
    player: null,       // Reference to player entity
    playerAlive: true,
    score: 0,
	time: 0,

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
        // Bind keys
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        ig.input.bind(ig.KEY.SPACE, 'jump');
		ig.input.bind(ig.KEY.A, 'log')

        // Load the LevelTest as required above ('game.level.test')
        this.loadLevel( LevelFlat );

        this.player = this.spawnEntity( EntityPlayer, ig.system.width / 2, ig.system.height / 2 - 16 );
		
		for (var i=0; i<= 3; i++){
			this.spawnEntity( EntityItem, ig.system.width / 2 + i*50, ig.system.height / 2 - 16 );
		}
		
		this.timer = new ig.Timer(5);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		// Add your own, additional update code here
        if (this.playerAlive) {
			this.time += 1;
            // Check for player death if touches left or bottom edges
            if (this.player.pos.x <= this.screen.x || this.player.pos.y >= ig.system.height)
                this.playerAlive = false;
            // Scroll screen to the left and update score
            this.screen.x += ig.game.SPEED * ig.system.tick;
            this.score += Math.round(ig.game.SPEED * ig.system.tick);
			
			if(this.time == 120){
				this.placeEnemies();
				this.time = 0;
			}
        }
        // Clamp player to boundaries
        this.player.pos.x = (this.player.pos.x).limit(this.screen.x, this.screen.x + ig.system.width - 1);

	},
	
	placeEnemies: function(){
		var maxHeight = ig.system.height;
		var maxWidth = ig.system.width;
		var minX = this.player.pos.x + 50;
		
		// 3 emenies at a time at most
		var numOfEnemies = Math.floor(Math.random() * 2) + 1
		
		for (var i=0; i< numOfEnemies; i++){
		var x_pos = Math.random() * (maxWidth - minX) + minX;
		var y_pos = Math.random() * (this.player.pos.y - 1) + 1;
		
		this.enemy = this.spawnEntity(EntityEnemy, this.screen.x + ig.system.width, y_pos);
		}
		
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
        this.font.draw('Score: ' + this.score, 5, 25);
        if (!this.playerAlive)
            this.font.draw('Game over', ig.system.width / 2, ig.system.height / 2);
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
