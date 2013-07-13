ig.module(
	'game.entities.enemy'
)
.requires(
	'impact.entity'
)
.defines(function(){

	EntityEnemy = ig.Entity.extend({
		init: function() {
		},
		
		
		update: function() {
			this.parent();
		}
	});
});