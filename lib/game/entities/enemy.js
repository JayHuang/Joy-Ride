ig.module(
	'game.entities.enemy'
)


.requires(
	'impact.entity'
)

.defines(function(){
	
	EntityEnemy = ig.Entity.extend({
		size: {x: 16, y: 16},
		animSheet: new ig.AnimationSheet('media/04b03.font.png', 16, 16),
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
			if (other){
				this.kill();
				other.kill();
			}
			
			self.kill()
		},

		
		update: function(){
			this.vel.y = 0;
			this.vel.x = -20;
			//check collision with other enemies, passive won't resolve

			this.parent();
		}	
		
	})
})
