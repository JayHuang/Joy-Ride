ig.module(
	'game.entities.monument'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){

	EntityMonument = ig.Entity.extend({
		effect: 'boost',
		size: {x: 64, y: 64},
		animSheet: new ig.AnimationSheet('media/monument.png', 64, 64),
		collides: ig.Entity.COLLIDES.FIXED,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0, 1, 2, 3]);
		},
		
		check: function(other) {
			if (other instanceof EntityPlayer){
				//TODO need to "end the game";
				$('#menu').addClass('showend').show();
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