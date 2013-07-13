ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

    'game.entities.player',
    'game.levels.flat'
)
.defines(function(){

MyGame = ig.Game.extend({
    SPEED: 30,          // Affects scrolling & score
    gravity: 300,       // Entities affected by gravity
    player: null,       // Reference to player entity
    playerAlive: true,
    score: 0,

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
        // Bind keys
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        ig.input.bind(ig.KEY.SPACE, 'jump');

        // Load the LevelTest as required above ('game.level.test')
        this.loadLevel( LevelFlat );

        this.player = this.spawnEntity( EntityPlayer, ig.system.width / 2, ig.system.height / 2 - 16 );
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		// Add your own, additional update code here
        if (this.playerAlive) {
            // Check for player death if touches left or bottom edges
            if (this.player.pos.x <= this.screen.x || this.player.pos.y >= ig.system.height)
                this.playerAlive = false;
            // Scroll screen to the left and update score
            this.screen.x += ig.game.SPEED * ig.system.tick;
            this.score += Math.round(ig.game.SPEED * ig.system.tick);
        }
        // Clamp player to boundaries
        this.player.pos.x = (this.player.pos.x).limit(this.screen.x, this.screen.x + ig.system.width);

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
