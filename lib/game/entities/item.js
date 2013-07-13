/*
TODO: need to define the custom types of items in the game
*/
ig.module(
	'game.entities.item'
)
.requires(
	'impact.entity'
)
.defines(function(){

	EntityItem = ig.Entity.extend({
		effect: 'boost',
		size: {x: 32, y: 32},
		animSheet: new ig.AnimationSheet('media/item.png', 8, 16),
		collides: ig.Entity.COLLIDES.PASSIVE,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0])
		},
		
		check: function(other) {
			//when collided apply boost and clear item object
			this.kill();
			other.boost += 2;
		},
		
		update: function() {
			this.currentAnim = this.anims.idle; 

			//TODO if player collects item, apply boost

			this.parent();
		}
	});
});