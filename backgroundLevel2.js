class BackgroundLevel2 extends Entity 
{
	constructor(spriteSheet, x, y) {
		super();
		this.states = {
			UNIQUE: 'UNIQUE'
		};
	
		this.spriteSheet = spriteSheet;
		this.x = x;
		this.y = y;
		this.currentState = this.states.UNIQUE;
		this.currentFrame = 0;
		this.vx = 0;
		this.vy = 0;
		this.setup();
	}
	  
	update() {
		this.x += this.vx;
		if (this.x == Math.round(this.width / 3 * 2))
			this.x = 0;
	}

	getSprite() {
		return this.frames[this.currentFrame];
	}

	setup() {
		this.eStates.UNIQUE = this.spriteSheet.getStats('UNIQUE');
		this.frames = this.eStates[this.currentState];
		this.width = this.frames[0].width;
		this.height = this.frames[0].height; 
	}

	stop() {
		this.vx = 0;
	}
}
