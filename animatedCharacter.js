let canvas;
let drawingSurface;
let spriteSheetCharacter;
let spriteSheetEnemy;
let spriteSheetButton;
let entities = [];
let activeKeys = new Array(255);

let button = undefined;

let tank = undefined;
let enemy = undefined;
let character = undefined;

let keyboard = {
	SPACE: 32,
	LEFT: 65,
	RIGHT: 68,
	UP: 87,
	DOWN: 83
}

window.addEventListener("load", init, false);

function init() {
	canvas = document.querySelector("canvas");
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight;

	drawingSurface = canvas.getContext("2d");

	spriteSheetButton = new SpriteSheet("assets/img/btnPlay.png", "assets/button.json", spriteLoaded);

	// spriteSheetCharacter = new SpriteSheet("assets/img/tank.png", "assets/tank.json", buttonsLoaded);
	// spriteSheetEnemy = new SpriteSheet("assets/img/monster.png","assets/monster.json", monsterLoaded);
}

//----------------------------------------------------------------------------------------------------------------------

function buttonsLoaded() {
	tank = new Tank(spriteSheetCharacter, canvas.width * 0.5 - 36, 75, canvas.width, canvas.height);
	entities.push(tank);
}

//Monster Functions
function monsterLoaded(){
	for(i = 0; i < 1; i++) {
		enemy = new Monster(spriteSheetEnemy, canvas.width * 0.5 - 356 + (i * 20), 345, canvas.width, canvas.height);
		entities.push(enemy);
	}
}

function moveMonster() {
	if(enemy.x < tank.x){
		enemy.x++;
	}
	if(enemy.x> tank.x){
		enemy.x--;
	}

	if(enemy.y < tank.y){
		enemy.y++;
	}
	if(enemy.y > tank.y){
		enemy.y--;
	}

	collisionMonster();
}

function collisionMonster() {
	if(enemy.x + enemy.width == tank.x )
		alert("gameover");
}

//----------------------------------------------------------------------------------------------------------------------

function spriteLoaded() {
	button = new Button(spriteSheetButton, canvas.width * 0.5 - 36, 75, canvas.width, canvas.height);
	entities.push(button);	

  	update();

	setInterval(moveMonster, 10);

  	window.addEventListener("keydown", keyDownHandler, false);
  	window.addEventListener("keyup", keyUpHandler, false);
}

function keyDownHandler(e) {
	activeKeys[e.keyCode] = true;  
}

function keyUpHandler(e) {
	activeKeys[e.keyCode] = false;  
	tank.stop();
}

function update() {
 	if (activeKeys[keyboard.LEFT])
		tank.move(tank.direction.LEFT);
	if (activeKeys[keyboard.RIGHT])
		tank.move(tank.direction.RIGHT);
	if (activeKeys[keyboard.UP])
		tank.move(tank.direction.UP);
	if (activeKeys[keyboard.DOWN])
		tank.move(tank.direction.DOWN);

    // if (activeKeys[keyboard.SPACE]) 
	// {
	// 	activeKeys[keyboard.SPACE] = false;
	// 	tank.stop();

	// 	let fire = new Fire(spriteSheet, tank.x - 10,
	// 		tank.y + tank.height * 0.5 - 10);
	// 	entities.push(fire);

	// 	let bullet = new Bullet(spriteSheet,
	// 		tank.x, tank.y + tank.height * 0.5);
	// 	entities.push(bullet);
	// }
  
	for (let i = 0; i < entities.length; i++)
		entities[i].update();
	
	requestAnimationFrame(update, canvas);
	render();
}

function render() {   
	drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
  
  	for (let i = 0; i < entities.length; i++)
	{ 
    	let entity = entities[i];
		let sprite = entity.getSprite();  
	 
    	if (!entity.killed)
		{
			drawingSurface.drawImage(
				entity.spriteSheet.img, 
				sprite.x, sprite.y, 
				sprite.width, sprite.height,
				entity.x, entity.y,  
				entity.width, entity.height
			);
  		}
  	}
}
