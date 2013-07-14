ig.module(
	'game.entities.shield'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){

	EntityShield = ig.Entity.extend({
		size: {x: 40, y: 40},
		animSheet: new ig.AnimationSheet('media/shield.png', 40, 40),
		collides: ig.Entity.COLLIDES.PASSIVE,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 0.1, [0, 1, 2]);
		},
		
		check: function(other) {
			//when collided apply boost and clear item object
			if (other instanceof EntityPlayer){
				var pickup_sound = new ig.Sound( 'media/sound/item.*' );
				pickup_sound.play();
				this.kill();
				other.increaseHealth(1); 
			}
		},
		
		update: function() {
			this.currentAnim = this.anims.idle; 
			
			if (this.chance <= 30){
				this.pos.y = this.pos_y;
			}
			this.parent();
		}
	});
});