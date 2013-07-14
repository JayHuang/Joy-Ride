/*
TODO: need to define the custom types of items in the game
*/
ig.module(
	'game.entities.item'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){

	EntityItem = ig.Entity.extend({
		effect: 'boost',
		size: {x: 55, y: 55},
		animSheet: new ig.AnimationSheet('media/Fuel_Sprite01.png', 64, 64),
		collides: ig.Entity.COLLIDES.PASSIVE,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
			this.chance = Math.floor(Math.random() * 100) + 1;
			this.pos_y = this.pos.y;
		},
		
		check: function(other) {
			//when collided apply boost and clear item object
			if (other instanceof EntityPlayer){
				var pickup_sound = new ig.Sound( 'media/sound/item.*' );
				pickup_sound.play();
				this.kill();
				other.increaseBoost(SETTINGS.ITEM_BOOST);
				ig.game.score += SETTINGS.ITEM_POINTS;
			}
		},
		
		update: function() {
			this.currentAnim = this.anims.idle; 
			
			if (this.chance <= 30)
				this.pos.y = this.pos_y;
			
			this.parent();
		}
	});
});