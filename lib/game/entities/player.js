ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'impact.game',
	'impact.font'
)
.defines(function(){

    EntityPlayer = ig.Entity.extend({
	dead: false,
	health: 1,
	boost: 0,
	animSheet: new ig.AnimationSheet( 'media/player.png', 8, 16),
	size: {x: 8, y: 16},
	maxVel: {x: 100, y: 200},
    friction: {x: 600, y: 0},
	acceleration: 500,
    onGround: true,
    jump: 150,
    isAlive: true,
	collides: ig.Entity.COLLIDES.ACTIVE,
	type: ig.Entity.TYPE.A, //enemy group
	checkAgainst: ig.Entity.TYPE.NONE, //player group
	font: new ig.Font( 'media/04b03.font.png' ),

	init: function(x, y, settings) {
	    this.parent(x, y, settings);

        this.addAnim( 'idle', 1, [0] );
	},
	
	update: function() {
        if (this.vel.y == 0) {
            this.onGround = true;
        }

		if (ig.input.state('left')) {
			this.accel.x = -this.acceleration;
		} else if (ig.input.state('right')) {
			this.accel.x = this.acceleration;
		} else {
			this.accel.x = 0;
		}

        if (this.onGround && ig.input.state('jump')) {
            this.vel.y = -this.jump;
            this.onGround = false;
            console.log("health: " + this.health);
			console.log("boost: " + this.boost);
        }

        this.currentAnim = this.anims.idle;
		this.updateGameStatus();
		this.parent();
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Add your own drawing code here
	},
	
	updateGameStatus: function() {
		// Clamp player to boundaries
        this.pos.x = (this.pos.x).limit(ig.game.screen.x, ig.game.screen.x + ig.system.width - 1);
		if (this.isAlive) {
		    // Check for player death if touches left or bottom edges
		    if (this.pos.x <= ig.game.screen.x || this.pos.y >= ig.system.height)
		        this.isAlive = false;
		    // Scroll screen to the left and update score
		    ig.game.screen.x += ig.game.SPEED * ig.system.tick;
		    ig.game.score += Math.round(ig.game.SPEED * ig.system.tick);
		}
	}
    });
});