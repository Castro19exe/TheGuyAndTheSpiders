class Entity 
{
    constructor() {
        this.spriteSheet = undefined;
        this.eStates = {};
        this.frames = new Array();
        this.currentFrame = 0;
        this.currentState = undefined;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }
    
    update() { }
}