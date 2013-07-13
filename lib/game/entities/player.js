ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

    EntityPlayer = ig.Entity.extend({
	dead: false,
	health: 1,
	animSheet: new ig.AnimationSheet( 'media/player.png', 8, 16),
	size: {x: 8, y: 16},
	maxVel: {x: 100, y: 200},
    friction: {x: 600, y: 0},
	acceleration: 500,
    onGround: true,
    jump: 150,

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
        }

        this.currentAnim = this.anims.idle;

		this.parent();
	}

    });
});