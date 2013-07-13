ig.module(
	'game.entities.obstacle'
)
.requires(
	'impact.entity'
)
.defines(function(){

	EntityObstacle = ig.Entity.extend({
		init: function() {
		},
		
		
		update: function() {
			this.parent();
		}
	});
});