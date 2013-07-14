ig.module(
	'game.entities.enemy'
)


.requires(
	'impact.entity',
	'impact.font'
)

.defines(function(){
	
	EntityEnemy = ig.Entity.extend({
		size: {x: 32, y: 32},
		health: 1, 
		animSheet: new ig.AnimationSheet('media/BeeSpriteSheet01.png', 32, 32),
		collides: ig.Entity.COLLIDES.PASSIVE,
		type: ig.Entity.TYPE.B, //enemy group
		checkAgainst: ig.Entity.TYPE.A, //player group
		
		init: function(x, y, settings) {
			this.parent(x, y, settings)
			//add frames + tweaks
			var type = Math.floor(Math.random() * 2) + 1;
			if (type == 1) {
				this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 5]);
			} else {
				this.addAnim('fly', 0.5, [6, 7]);
			}
		},
		
		// if collided with player
		check: function(other) {
			if (other instanceof EntityPlayer){
				this.kill();
				other.health -= 1;
				this.parent();
			}
			else if (other instanceof EntityProjectile){
				other.kill();
				this.kill();
			}
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
