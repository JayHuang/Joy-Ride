ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

	EntityPlayer = ig.Entity.extend({
		init: function() {
		},
		
		
		update: function() {
			this.parent();
		}
	});
});