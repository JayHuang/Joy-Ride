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
		animSheet: new ig.AnimationSheet('media/rock.png', 32,32),
		
		init: function(x, y, settings) {
			this.parent(x,y, settings);
			
			var type = Math.floor(Math.random() * 2) + 1;
			if (type == 1) {
				this.addAnim('rock1', 1, [0]);
				this.addAnim('explode', 0.2, [0,1]);
			} else {
				this.addAnim('rock2', 1, [2]);
				this.addAnim('explode', 0.2, [2,1]);
			}
		},
		
		check: function(other){
			if (other instanceof EntityPlayer && this.vel.y != 0){
				other.health -=1;
			}
			else if (other instanceof EntityProjectile){
				
				this.currentAnim = this.anims.explode;
				other.kill();
			}	
			else if (!other instanceof EntityPlayer) {
				other.kill();
			}
		},
		
		
		update: function() {
		    if( this.currentAnim == this.anims.explode ) {
				if (this.currentAnim.loopCount){
		        	this.kill();
				}
				
				this.currentAnim.update();
				return;
		    }
			this.parent();
		}
	});
});