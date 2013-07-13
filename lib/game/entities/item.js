ig.module(
	'game.entities.item'
)
.requires(
	'impact.entity'
)
.defines(function(){

	EntityItem = ig.Entity.extend({
		init: function() {
		},
		
		
		update: function() {
			this.parent();
		}
	});
});