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
		animSheet: new ig.AnimationSheet('media/test.png', 32, 32),

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 0.1, [0, 1, 2])
		},
		
		
		update: function() {
			this.currentAnim = this.anims.idle; 

			//TODO if player collects item, apply boost

			this.parent();
		}
	});
});