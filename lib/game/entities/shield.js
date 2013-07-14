ig.module(
	'game.entities.shield'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){

	EntityShield = ig.Entity.extend({
		size: {x: 32, y: 32},
		animSheet: new ig.AnimationSheet('media/shield.png', 32, 32),
		collides: ig.Entity.COLLIDES.PASSIVE,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
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