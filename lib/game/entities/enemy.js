ig.module(
	'game.entities.enemy'
)


.requires(
	'impact.entity',
	'impact.font'
)

.defines(function(){
	
	EntityEnemy = ig.Entity.extend({
		size: {x: 8, y: 8},
		health: 1, 
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
			var random = Math.random() * 100 + 1;
			var random2 = Math.random() * 100 + 1;
			var multiplier = random <= 50 ? 1 : -1;
			var multiplier2 = random2 <= 50 ? 1 : -1;

			this.vel.y = 10 * random * multiplier;
			this.vel.x = random2 * multiplier2;
			this.parent();
		}
	})
})
