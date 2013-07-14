ig.module(
	'game.entities.obstacle'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){

	EntityObstacle = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.FIXED,
		size: {x:32, y:32},
		animSheet: new ig.AnimationSheet('RockObstacle01.png', 32,32),
		
		init: function(x, y, settings) {
			this.parent(x,y, settings);
			
		},
		
		
		update: function() {
			this.parent();
		}
	});
});