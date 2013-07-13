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
	boost: 100,
	animSheet: new ig.AnimationSheet( 'media/player.png', 8, 16),
	size: {x: 8, y: 16},
	maxVel: {x: 100, y: 200},
    friction: {x: 600, y: 0},
	acceleration: 500,
    onGround: true,
    jump: 150,
	collides: ig.Entity.COLLIDES.ACTIVE,
	type: ig.Entity.TYPE.A, //enemy group
	checkAgainst: ig.Entity.TYPE.NONE, //player group
	font: new ig.Font( 'media/04b03.font.png' ),
	boostTimer: null, 
	floating: false, 
	debug: 'no',

	init: function(x, y, settings) {
	    this.parent(x, y, settings);

        this.addAnim( 'idle', 1, [0] );
	},
	
	update: function() {
		if (!ig.game.startOfLevel) {
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


		    if (this.onGround && ig.input.state('jump') && this.boost > 0 ) {
		    	this.startBoost(); 
		    }

		    this.checkBoost(); 

	        if (!this.onGround && !ig.input.state('jump')) {
	        	this.stopBoost(); 
	        }

	        this.currentAnim = this.anims.idle;
			this.updateGameStatus();
			this.parent();
		}
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Add your own drawing code here
	},

	startBoost: function() {
		if (!this.boostTimer) {
			this.boostTimer = new ig.Timer(); 
		} else {
			this.boostTimer.set(0);
		}
		
		this.floating = true; 
		ig.game.gravity = 0; 
		this.vel.y = -100;
		this.onGround = false;
	},

	stopBoost: function() {
    	this.floating = false; 
    	this.boostTimer.pause(); 
    	ig.game.gravity = 300; 
    	this.vel.y = 100;
    	this.onGround = true; 
	},

	checkBoost: function() {
	   	if (this.floating) {
	   		this.boost -= this.boostTimer.delta(); 
	   	}

	   	if (this.boost <= 0 && this.floating) {
	   		this.stopBoost(); 
	   	}
	},
	
	updateGameStatus: function() {
		// Clamp player to boundaries
        this.pos.x = (this.pos.x).limit(ig.game.screen.x, ig.game.screen.x + ig.system.width - 3);
        this.pos.y = (this.pos.y).limit(ig.game.screen.y - this.size.y + 3, ig.game.screen.y + ig.system.height);
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