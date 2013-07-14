ig.module(
	'game.entities.obstacle'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){

	EntityObstacle = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.FIXED,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		size: {x:32, y:32},
		animSheet: new ig.AnimationSheet('media/obstacle.png', 32,32),
		
		init: function(x, y, settings) {
			this.parent(x,y, settings);
			
			var type = Math.floor(Math.random() * 2) + 1;
			if (type == 1) {
				this.addAnim('rock1', 1, [0]);
			} else {
				this.addAnim('rock2', 1, [1]);
			}
		},
		
		check: function(other){
			if (other instanceof EntityPlayer && this.vel.y != 0){
				this.explode();
				other.health -=1;
				console.log('Dropping obstacle');
			}
			else if (other instanceof EntityProjectile){
				this.explode();
				other.kill();
			}
			else if (!other instanceof EntityPlayer) {
				other.kill();
			}
		},
		
		explode: function(){
			//stub for explode animation
			this.kill();
		},
		
		update: function() {
			this.parent();
		}
	});
});