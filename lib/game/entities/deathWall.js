ig.module(
	'game.entities.deathWall'
)
.requires(
	'impact.entity'
)
.defines(function(){

	EntityDeathWall = ig.Entity.extend({
		effect: 'boost',
		size: {x: 600, y: 600},
		animSheet: new ig.AnimationSheet('media/DeathWallSpriteSheet01.png', 600, 600),
		collides: ig.Entity.COLLIDES.FIXED,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0, 1, 2]);
		},
		
		check: function(other) {
			//when collided apply boost and clear item object
			if (other instanceof EntityPlayer){
				//TODO need to "end the game";
			} else if (other instanceof EntityProjectile) {
				other.kill()
			}
		},
		
		update: function() {
			this.currentAnim = this.anims.idle; 
			
			this.pos.x = this.pos.x;
			
			this.parent();
		}
	});
});