function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

//
//if (event.button === 0) {
//	if (event.x > 160 && event.x < 320 &&
//	    event.y > 96 && event.y < 148) {
//		
//		if (event.x > 160 && event.x < 215) {
//			
//			that.selectedUnit = 1;
//			that.unitHighlight.changeLoc(0);
//		} else if (event.x > 217 && event.x < 268) {
//			
//			that.selectedUnit = 2;
//			that.unitHighlight.changeLoc(1);
//		} else if (event.x > 270 && event.x < 320) {
//			console.log("sdfsafasfdasfdas");
//			that.selectedUnit = 3;
//			that.unitHighlight.changeLoc(2);
//		}
//		that.unitSelected = true;
//	}

/**********************/
function Karen(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("img/karenrun.png")
    														,0, 0, 45, 47, 0.2, 8, true, false);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("img/karenjump.png")
    														,0,0, 38.75, 76, 0.3, 4, false, false);
    this.punchAnimation = new Animation(ASSET_MANAGER.getAsset("img/karenpunch.png")
			,0,0, 60, 52, 0.1, 9, false, false);
    this.jumping = false;
    this.punch = false;
    this.speed = 100;
    this.radius = 100;
    this.ground = 440;
    Entity.call(this, game, 0, 440);
}
Karen.prototype = new Entity();
Karen.prototype.constructor = Karen;

Karen.prototype.update = function () {
	
	if (this.game.space) this.jumping = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-1 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
	
    if (this.game.b) this.punch = true;
    if (this.punch) {
    		if (this.punchAnimation.isDone()) {
            this.punchAnimation.elapsedTime = 0;         
            this.punch = false;
        }
    		this.punchAnimation;
    		
    } else {
    		this.x += this.game.clockTick * this.speed;

    }
    if (this.x > 800) this.x = -10;    
    if (this.x < 0) this.x = 10;  
    Entity.prototype.update.call(this);
}
Karen.prototype.draw = function (ctx) {
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 10, this.y-20);
    } else if (this.punch) {
    		this.punchAnimation.drawFrame(this.game.clockTick, ctx, this.x +10 , this.y);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

//the "main" code begins here
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("img/karenjump.png");
ASSET_MANAGER.queueDownload("img/karenrun.png");
ASSET_MANAGER.queueDownload("img/karenpunch.png");
ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    
    
    var gameEngine = new GameEngine();
    //var bg = new Background(gameEngine);
    //gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("/Users/Cuong_Tran/Desktop/TCSS491/workspace/Homework1/img/bg.jpg"), 800, 600));
   // gameEngine.addEntity(bg);
    
    var karen = new Karen(gameEngine)
    gameEngine.addEntity(karen)
    gameEngine.init(ctx);
    gameEngine.start();
});
