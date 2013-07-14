ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'impact.game',
	'impact.font',
	'impact.sound'
)
.defines(function(){

    EntityPlayer = ig.Entity.extend({
	dead: false,
	health: 2,
	boost: SETTINGS.BOOST_COUNT,
	animSheet: new ig.AnimationSheet( 'media/CharacterSpriteSheet.png', 64, 64),
	size: {x: 64, y: 64},
	maxVel: {x: 150, y: 200},
    friction: {x: 200, y: 0},
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
	lastFired: null, 

	init: function(x, y, settings) {
	    this.parent(x, y, settings);

        this.addAnim( 'idle', 0.1, [0, 1, 2, 3, 4] );
        this.addAnim( 'shield', 0.1, [5, 6, 7, 8, 9]);
		this.addAnim( 'death', 1, [10,11,12,13,14,15,15, 15,16,17,18]);
	},
	
	update: function() {
		if (!ig.game.startOfLevel) {
			this.checkShield();
	        if (this.vel.y == 0)
	            this.onGround = true;

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
				var x = this.flip ? this.pos.x -64 : this.pos.x + 64;
				var y = this.pos.y + 5; 

				//start fire counter
				if (!this.lastFired) {
					ig.game.spawnEntity(EntityProjectile, x, y, {flip:this.flip});
					this.lastFired = new ig.Timer(1);

					var sound = new ig.Sound('media/sound/rocket.*');
					sound.play();
				}
				if (this.lastFired.delta() > SETTINGS.PROJECTILE_FIRE_RATE) {
					ig.game.spawnEntity(EntityProjectile, x, y, {flip:this.flip});
					this.lastFired.set(SETTINGS.PROJECTILE_FIRE_RATE);

					var sound = new ig.Sound('media/sound/rocket.*');
					sound.play();
				}
			}


		    if (this.onGround && ig.input.state('jump') && this.boost > 0 ) 
		    	this.startBoost();

		    this.checkBoost(); 

	        if (!this.onGround && !ig.input.state('jump'))
	        	this.stopBoost();

	        this.currentAnim.flip.x = this.flip;
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
			this.boostTimer = new ig.Timer(SETTINGS.BOOST_RATE); 
		} else {
			this.boostTimer.set(SETTINGS.BOOST_RATE);
		}
		

		var sound = new ig.Sound('media/sound/boost.ogg')
		sound.play();
		
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
	   	if (this.floating && this.boostTimer.delta() > SETTINGS.BOOST_RATE) {
	   		this.decreaseBoost(1);
	   		this.boostTimer.set(SETTINGS.BOOST_RATE); 
	   	}

	   	if (this.boost <= 0 && this.floating) {
	   		this.stopBoost(); 
	   	}
	},

	checkShield: function() {
		if (this.health < 2) {
    		this.currentAnim = this.anims.idle;
    	} else {
    		this.currentAnim = this.anims.shield;
    	}
	},
	
	updateGameStatus: function() {
		// Clamp player to boundaries
        this.pos.x = (this.pos.x).limit(ig.game.screen.x, ig.game.screen.x + ig.system.width - this.size.x);
        this.pos.y = (this.pos.y).limit(ig.game.screen.y + 10, ig.game.screen.y + ig.system.height);
		if (this.isAlive) {
		    // Check for player death if touches left or bottom edges
		    if (this.pos.x <= ig.game.screen.x || this.pos.y >= ig.system.height)
		        this.isAlive = false;
		    // Scroll screen to the left and update score
		    ig.game.screen.x += ig.game.SPEED * ig.system.tick;
		    ig.game.score += Math.round(ig.game.SPEED * ig.system.tick);
		}
		
	},

	increaseBoost: function(boost) {
		this.boost = (this.boost + boost > 100) ? 100 : this.boost + boost; 
	},

	decreaseBoost: function(boost) {
		this.boost = (this.boost - boost < 0 ) ? 0 : this.boost - boost;
	}, 

	increaseHealth: function(hp) {
		this.health = (this.health + hp > 2) ? 2 : this.health + hp; 
		this.checkShield(); 
	}
    });
	
	EntityPlayerDeath = ig.Entity.extend({
		animSheet: new ig.AnimationSheet( 'media/CharacterSpriteSheet.png', 64, 64),
		size: {x: 64, y: 64},
		
		init: function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim( 'death', 0.1, [10,11,12,13,14,15,15, 15,16,17,18]);
		},
		
		clean: function(){
			this.kill();
		},
		
		update: function(){

			this.vel.y = -100;
			this.parent();
		}
	});

	EntityProjectile = ig.Entity.extend({
		size: {x: 32, y: 32},
		maxVel: {x: 500, y: 0},
		type: ig.Entity.TYPE.A, 
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.PASSIVE, 
		animSheet: new ig.AnimationSheet('media/Rocket_Sprite01.png', 32, 32),
		startPos: {x: 0, y: 0},
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.startPos.x = x; 
			this.startPos.y = y; 
			this.addAnim('idle', 1, [0]);
			this.currentAnim.flip.x = settings.flip; 

			this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
		}, 

		update: function(res) {
			if (Math.abs(this.startPos.x - this.pos.x) >= 500) {
				this.kill(); 
			}
			this.parent(); 
		},
		
		check: function(other){
			if (other  instanceof EntityEnemy){
				other.receiveDamage(1, this);
				this.kill();
			}

			if (other instanceof EntityObstacle) {
				this.kill();
			}
		},

		handleMovementTrace: function(res) {
			this.parent(res);
			if (res.collision.x || res.collision.y) {
				this.kill(); 
			}
		}
	});
});