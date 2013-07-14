ig.module(
	'game.entities.enemy'
)


.requires(
	'impact.entity',
	'impact.font',
	'game.entities.shield'
)

.defines(function(){
	
	EntityEnemy = ig.Entity.extend({
		size: {x: 32, y: 32},
		health: 1, 
		animSheet: new ig.AnimationSheet('media/BeeSpriteSheet01.png', 32, 32),
		animSheetExplode: new ig.AnimationSheet('media/ExplosionSpriteSheet.png', 32, 32),
		collides: ig.Entity.COLLIDES.PASSIVE,
		type: ig.Entity.TYPE.B, //enemy group
		checkAgainst: ig.Entity.TYPE.A, //player group
		gravityFactor: 0,

		init: function(x, y, settings) {
			var self = this;
			this.parent(x, y, settings)
			//add frames + tweaks
			var type = Math.floor(Math.random() * 2) + 1;
			if (type == 1) {
				this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 5]);
				this.animSheet = this.animSheetExplode;
				this.addAnim('explode', 0.2, [0,1,2,3]);
				this.type = 'bee';
			} else {
				this.addAnim('fly', 0.5, [6, 7]);
				this.animSheet = this.animSheetExplode;
				this.addAnim('explode', 0.2, [0,1,2,3]);
				
				this.type = 'dragon';
				var rand = Math.round(Math.random() * (3500 - 1000)) + 1000;
    			setTimeout(function() {
					self.poo();
				}, rand);
			}
			
		},
		
		// if collided with player
		check: function(other) {
			if (other instanceof EntityPlayer){
				this.currentAnim = this.anims.explode
				other.health -= 1;
				this.parent();
			}
			else if (other instanceof EntityProjectile){
				ig.game.score += SETTINGS.ENEMY_POINTS;
				this.currentAnim = this.anims.explode
				other.kill();
			}
		},

		update: function(){
			var random = Math.random() * 100 + 1;
			var random2 = Math.random() * 100 + 1;
			var multiplier = random <= 50 ? 1 : -1;
			var multiplier2 = random2 <= 50 ? 1 : -1;

			this.vel.x = random2 * multiplier2;

			if (this.type == 'bee') {
				this.vel.y = 10 * random * multiplier;
			} else if (this.type == 'dragon') {
				this.vel.y = -10 * multiplier;
			}

			if (this.vel.x == 0){
				this.kill();
			}
			
		    if( this.currentAnim == this.anims.explode ) {
				if (this.currentAnim.loopCount){
		        	this.kill();
				}
				
				this.currentAnim.update();
				return;
		    }
			if (this.pos.x <= ig.game.screen.x || this.pos.y >= ig.system.height){
				this.kill();
			}
			
			this.parent();
		},

		poo: function(){
			var random = Math.floor(Math.random() * 100) + 1;
			var drop = null;
			if(random >= 87)
				var drop = random >= 97 ? 'shield' : 'obstacle'; 

			if (drop == 'shield')
				ig.game.spawnEntity(EntityShield, ig.game.screen.x + ig.system.width, this.pos.y);
			else if (drop == 'obstacle')
				ig.game.spawnEntity(EntityObstacle, ig.game.screen.x + ig.system.width, this.pos.y);
		}
	})
})
