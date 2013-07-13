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
    isAlive: true,
	collides: ig.Entity.COLLIDES.ACTIVE,
	type: ig.Entity.TYPE.A, //enemy group
	checkAgainst: ig.Entity.TYPE.NONE, //player group
	font: new ig.Font( 'media/04b03.font.png' ),
	boostTimer: null, 

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
        	if (!this.boostTimer) {
        		this.boostTimer = new ig.Timer(); 
        	} else {
        		this.boostTimer.set(0);
        	}
        	this.boost -= 1;Math.floor(this.boostTimer.delta());
        	ig.game.gravity = 0; 
            this.vel.y = -100;
            this.onGround = false;
        }

        if (!this.onGround && !ig.input.state('jump')) {
        	this.boostTimer.pause(); 
        	ig.game.gravity = 300; 
        	this.vel.y = 100;
        	this.onGround = true; 
        }

        this.currentAnim = this.anims.idle;
		this.updateGameStatus();
		this.parent();
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
        if (this.health <= 0){
            this.font.draw('Game over', ig.system.width / 2, ig.system.height / 2);
		}
	}
	

    });
});