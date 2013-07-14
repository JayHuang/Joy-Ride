ig.module(
	'game.entities.enemy'
)


.requires(
	'impact.entity',
	'impact.font'
)

.defines(function(){
	
	EntityEnemy = ig.Entity.extend({
		size: {x: 8, y: 16},
		animSheet: new ig.AnimationSheet('media/enemy.png', 8, 16),
		collides: ig.Entity.COLLIDES.PASSIVE,
		type: ig.Entity.TYPE.B, //enemy group
		checkAgainst: ig.Entity.TYPE.A, //player group
		
		init: function(x, y, settings) {
			this.parent(x, y, settings)
			//add frames + tweaks
			this.addAnim('fly', 0.5, [0])
		},
		
		// if collided with player
		check: function(other) {
			this.kill();
			other.health -= 1;
			this.parent();
		},

		
		update: function(){
<<<<<<< HEAD
			this.vel.y = 10;
			this.vel.x = -80;
=======
            if (!ig.game.startOfLevel) {
                this.vel.y = 0;
                this.vel.x = -20;
                //check collision with other enemies, passive won't resolve
            }


>>>>>>> a05a4d1f89e62c6bccca48b7dcaa63b61c7f4144
			this.parent();
		}	
		
	})
})
