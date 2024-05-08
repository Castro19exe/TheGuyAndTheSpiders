class SpriteSheet 
{
	constructor(spriteSheetImage, spriteSheetJSON, callback) {
		this.img = null;
		this.sprites = new Array();

		this.notify = callback; 
        this.url = spriteSheetImage;
		let img = new Image();
		
		img.onload = function() { 
			this.img = img;
			fetch(spriteSheetJSON)
				.then((response) => response.text())
				.then((text) => this.parseSpriteSheetDefinition(text));
		}.bind(this)
		
	 	img.src = spriteSheetImage;
	}

	defSprite(name, x, y, w, h, cx, cy) {
 		let spt = {
			"id": name,
			"x": x,
			"y": y,
			"width": w,
			"height": h,
			"cx": cx == null ? 0 : cx,
			"cy": cy == null ? 0 : cy
		};

		this.sprites.push(spt);
	} 

	parseSpriteSheetDefinition(spriteJSON) {
        let spriteSheet = JSON.parse(spriteJSON);

        for(let key in spriteSheet['frames'])
		{
            let x = spriteSheet['frames'][key].frame.x;
            let y = spriteSheet['frames'][key].frame.y;
            let w = spriteSheet['frames'][key].frame.w;
            let h = spriteSheet['frames'][key].frame.h;
            let cx = -Math.round(w/2);
            let cy = -Math.round(h/2);
            this.defSprite(key, x, y, w, h, cx, cy);
		}     
		 
		this.notify();
	}
	
	getStats(name) {
		let statsFrames = new Array();

		for(let i = 0; i < this.sprites.length; i++)
		{
			let stName = new RegExp(name, "gi");
            if (this.sprites[i].id.match(stName))
				statsFrames.push(this.sprites[i]);
		}

		return statsFrames;
	}
}
