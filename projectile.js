class Projectile extends Entity 
{
    constructor(spriteSheet, x, y,destinyX,destinyY, velocity, canvasWidth, canvasHeight, damage) {
        super();
        this.states = {
            MOVE: 'MOVE',
            SHOOT: 'SHOOT',
            STOPPED: 'STOPPED',
            HIT: 'HIT'
        };

        this.direction = {
            LEFT: 'LEFT',
            RIGHT: 'RIGHT',
            UP: 'UP',
            DOWN: 'DOWN'
        }

        this.spriteSheet = spriteSheet;
        this.x = x;
        this.y = y;
        this.destinyX = destinyX;
        this.destinyY = destinyY
        this.currentState = this.states.STOPPED;
        this.currentFrame = 0;
        this.vx = 3;
        this.vy = 3;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.damage = damage;
        this.velocity = velocity;
        this.rotation = 0;
        this.setup();
    }
    
    update() {
        this.currentFrame = (++this.currentFrame) % this.frames.length;
        this.width = this.frames[this.currentFrame].width;
        this.height = this.frames[this.currentFrame].height;

        moveEntity(this, this.destinyX, this.destinyY, this.velocity);
        this.rotation += 0.1;
    }
    
    getSprite() {
        return this.frames[this.currentFrame];
    }
    
    setup() {
        this.eStates.MOVE = this.spriteSheet.getStats('ANDAR');
        this.eStates.SHOOT = this.spriteSheet.getStats('DISPARAR');
        this.eStates.STOPPED = this.spriteSheet.getStats('PARADO');
        this.eStates.HIT = this.spriteSheet.getStats('ATINGIDO');

        this.frames = this.eStates[this.currentState];
        this.width = this.frames[0].width;
        this.height = this.frames[0].height;
    }
    
}
