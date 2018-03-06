/** 
 * The Background. This class represents a game background.
 * 
 * Author(s): Cuong Tran
 * TCSS491 - Winter 2018
 */
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
	
	Entity.call(this, game, 0, 0, -1);
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,this.x, this.y, 800, 60);
};

Background.prototype.update = function () {
};
