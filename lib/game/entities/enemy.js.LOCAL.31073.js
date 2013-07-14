ig.module(
	'game.entities.enemy'
)


.requires(
	'impact.entity',
	'impact.font'
)

.defines(function(){
	
	EntityEnemy = ig.Entity.extend({
		size: {x: 16, y: 16},
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
			this.vel.y = 10;
			this.vel.x = -80;
			this.parent();
		}	
		
	})
})
