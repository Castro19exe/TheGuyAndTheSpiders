class Camera extends Entity {
	constructor(x,y,w,h) {
		super();
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h; 
	}
 	
	center(gameWorld) {
		this.x = (gameWorld.x + gameWorld.width / 2) - this.width / 2;
		this.y = (gameWorld.y + gameWorld.height / 2) - this.height / 2;
	}

	rightInnerBoundary() {
		return this.x + (this.width * 0.75);
	} 
	  
	leftInnerBoundary() {
		return this.x + (this.width * 0.25);
	} 
	  
	topInnerBoundary() {
		return this.y + (this.height * 0.25);
	} 
	  
	bottomInnerBoundary() {
		return this.y + (this.height * 0.75);
	}
  
	drawFrame(ctx, drawInnerBoundaries, colorF, colorIB) {
		colorF = colorF != undefined ? colorF : "red";
		colorIB = colorIB != undefined ? colorIB : "blue";
		if (ctx == undefined || drawInnerBoundaries == undefined)
			return;

		ctx.strokeStyle = colorF;
		ctx.strokeRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = colorF;
		ctx.font = "12px Arial"; 
		ctx.fillText("Camera Frame: " + this.width + "x" + this.height, this.x + 5, this.y + 15); 
		ctx.fillText("Camera Position: " + this.x + "x" + this.y, this.x + 5, this.y + 30); 

		if (this.leftInnerBoundary == undefined) 
			return;  

		if (drawInnerBoundaries) { 
			ctx.strokeStyle = colorIB;
			ctx.moveTo(this.leftInnerBoundary(), this.topInnerBoundary() - 10) 
			ctx.lineTo(this.leftInnerBoundary(), this.bottomInnerBoundary() + 10);

			ctx.moveTo(this.rightInnerBoundary(), this.topInnerBoundary() - 10) 
			ctx.lineTo(this.rightInnerBoundary(), this.bottomInnerBoundary() + 10);

			ctx.moveTo(this.leftInnerBoundary() - 10, this.topInnerBoundary()) 
			ctx.lineTo(this.rightInnerBoundary() + 10, this.topInnerBoundary());

			ctx.moveTo(this.leftInnerBoundary() - 10, this.bottomInnerBoundary()) 
			ctx.lineTo(this.rightInnerBoundary() + 10, this.bottomInnerBoundary());
			ctx.stroke();

			ctx.fillStyle = colorIB;
			ctx.font = "12px Arial"; 
			ctx.fillText(this.leftInnerBoundary(), this.leftInnerBoundary(), this.topInnerBoundary() - 10);
			ctx.fillText(this.rightInnerBoundary(), this.rightInnerBoundary(), this.topInnerBoundary() - 10);

			ctx.fillText("Camera Inner Boundaries", this.leftInnerBoundary() + 5,this.topInnerBoundary() + 15);
		}
	}
}
