ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({

	gender: "female",
	dead: false,
	health: 1,
	animSheet: new ig.AnimationSheet( 'media/player.png', 4, 4),
	size: {x: 4, y: 4},
	maxVel: {x: 50, y: 10},
	speed: 50,

	init: function(x, y, settings) {
	    this.parent(x, y, settings);

	    ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
	    ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
	    ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
	    ig.input.bind(ig.KEY.UP_ARROW, 'up');
	    ig.input.bind(ig.KEY.SPACE, 'jump');
	    ig.input.bind(ig.KEY.ENTER, 'ok');
	    ig.input.bind(ig.KEY.PERIOD, 'period');

	},

	update: function() {
		
		if(ig.input.state('up')) {
			this.pos.y += 5;
			this.dead = this.pos.y >= 200 ? true : false;
			console.log('y: ' + this.pos.y);
		}

		if(ig.input.pressed('period')) {
			console.log('Am I dead yet? (:');
			console.log(this.dead);
		}

		if(ig.input.pressed('jump')) {
			this.shield();
			this.shoot();
			console.log('You just died. GG.');
			console.log(this);
			this.health = 0;
			this.kill();
		}

		if (ig.input.state('left')) {
			// this.vel.x = -100;
			this.pos.x -= 5;
			console.log('x: ' + this.pos.x);
		} else if (ig.input.state('right')) {
			// this.vel.x = 100;
			this.pos.x += 5;
			console.log('x: ' + this.pos.x);
		} else if (ig.input.state('down')) {
			this.pos.y -= 5;
			console.log('y: ' + this.pos.y);
		} else {
			this.vel.x = 0;
		}
		this.parent();			
	},

	shield: function() {
		console.log("Shield activated!");
	},

	shoot: function(){
		console.log("Shooting...");
	}

});

});