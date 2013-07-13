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
	acceleration: SETTINGS.PLAYER_ACCELERATION,
    onGround: true,
    jump: SETTINGS.PLAYER_JUMP,
    fall: SETTINGS.PLAYER_FALL, 
	collides: ig.Entity.COLLIDES.ACTIVE,
	type: ig.Entity.TYPE.A, //player group
	checkAgainst: ig.Entity.TYPE.NONE,
	font: new ig.Font( 'media/04b03.font.png' ),
	boostTimer: null, 
	floating: false, 
	flip: false, 

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
				this.flip = true; 
			} else if (ig.input.state('right')) {
				this.accel.x = this.acceleration;
				this.flip = false; 
			} else {
				this.accel.x = 0;
			}

			if (ig.input.pressed('shoot')) {
				var x = this.pos.x + 1;
				var y = this.pos.y;

				ig.game.spawnEntity(EntityProjectile, x, y, {flip:this.flip});
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
		this.gravityFactor = 0; 
		this.vel.y = this.jump;
		this.onGround = false;
	},

	stopBoost: function() {
    	this.floating = false; 
    	this.boostTimer.pause(); 
    	this.gravityFactor = 1; 
    	this.vel.y = this.fall;
    	this.onGround = true; 
	},

	checkBoost: function() {
	   	if (this.floating) {
	   		this.boost -= this.boostTimer.delta() * SETTINGS.BOOST_RATE; 
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

	EntityProjectile = ig.Entity.extend({
		size: {x: 8, y: 16},
		type: ig.Entity.TYPE.NONE, 
		checkAgainst: ig.Entity.TYPE.B,
		collides: ig.Entity.COLLIDES.NEVER, 
		animSheet: new ig.AnimationSheet('media/item.png', 8, 16),
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
			this.currentAnim.flip.x = settings.flip; 

			var velocity = (settings.flip ? -10 : 10);
		}
	});
});