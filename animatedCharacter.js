let canvas;
let drawingSurface;
let spriteSheetHero;
let spriteSheetEnemy;
let spriteSheetButton;
let entities = [];
let activeKeys = new Array(255);
let isGameStarted = false;
let button = undefined;
let hero = undefined;
let character = undefined;
let spriteSheetKnife;
let round = 1
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

	// menu
	spriteSheetButton = new SpriteSheet("assets/img/btnPlay.png", "assets/button.json", carregarBotao);
	canvas.addEventListener("click", canvasClick)
}
//MENU
function carregarBotao() {
	button = new Button(spriteSheetButton, canvas.width * 0.5 - 128, canvas.height*0.5 - 258*0.5, canvas.width, canvas.height);
	entities.push(button);	
	update();
}

function startgame(){
	isGameStarted = true;
	url = './assets/img/background.png';
	canvas.style.background = `url('${url}')`;
	spriteSheetHero = new SpriteSheet("assets/img/tank.png","assets/tank.json", heroLoaded);
	spriteSheetEnemy = new SpriteSheet("assets/img/monster.png","assets/monster.json", spawnMonster);

	startRound();

	update();

	window.addEventListener("keydown", keyDownHandler, false);
	window.addEventListener("keyup", keyUpHandler, false);
}

function startRound(){
	if(verificarSeExisteEnemies())
		console.log("Existe Inimigos");
	else {
		loadMonsters()
		round++;
	}
};
function loadKnife(x,y){
	knife  =  new Projectile(spriteSheetKnife, hero.x ,hero.y,x,y, canvas.width, canvas.height)
	entities.push(knife)
}
function canvasClick(e){
	// saber se a possiçao que foi clicada no canvas é a mesma posiçao do botao do menu
	clickedX = e.clientX
	clickedY = e.clientY

	if(isGameStarted){
		//trow knife
		spriteSheetKnife = new SpriteSheet("assets/img/knife.png","assets/tank.json", loadKnife(clickedX,clickedY));


	}
	else if(clickedX > button.x && clickedX < button.x + button.width && clickedY>	 button.y && clickedY< button.y+ button.height){
		entities.pop(button)
		startgame();
	}

}

function heroLoaded() {
	hero = new Hero(spriteSheetHero, canvas.width * 0.5 , canvas.height*0.5, canvas.width, canvas.height)
	entities.push(hero);
}

function spawnMonster() {
	MARGEM = 1000;
	if(hero != undefined){
	do {
		x = Math.random() * canvas.width;
		y = Math.random() * canvas.height;
	} while (x > (hero.x + hero.width + MARGEM) && x < (hero.x - MARGEM) && y > (hero.y + hero.height + MARGEM) && y < (hero.y - MARGEM));

	enemy = new Monster(spriteSheetEnemy, x, y, canvas.width, canvas.height);
	entities.push(enemy);}
}

//Monster Functions
function loadMonsters(){
	enemysQuantity = round * 5;

	time = 1000;

	for(i = 0; i < enemysQuantity; i++) {
		setTimeout( spawnMonster, time)
		time += 500;
	}
}

function moveMonster() {
	entities.forEach(entity => {
		if (entity instanceof Monster){
			if(entity.x < hero.x){
				entity.x++;
			}
			if(entity.x> hero.x){
				entity.x--;
			}
			if(entity.y < hero.y){
				entity.y++;
			}
			if(entity.y > hero.y){
				entity.y--;
			}
			collisionMonster(entity);
		}
	});	
}

function collisionMonster(enemy) {
	//nao esta a funfar
	if(enemy.x + enemy.width == hero.x )
		alert("gameover");
}

//----------------------------------------------------------------------------------------------------------------------


function keyDownHandler(e) {
	activeKeys[e.keyCode] = true;  
}

function keyUpHandler(e) {
	activeKeys[e.keyCode] = false;  
	hero.stop();
}

function verificarSeExisteEnemies() {
    for (const entity of entities) {
        if (entity instanceof Monster) {
            return true; 
        }
    }
    return false; 
}

function update() {
 	if (activeKeys[keyboard.LEFT])
		hero.move(hero.direction.LEFT);
	if (activeKeys[keyboard.RIGHT])
		hero.move(hero.direction.RIGHT);
	if (activeKeys[keyboard.UP])
		hero.move(hero.direction.UP);
	if (activeKeys[keyboard.DOWN])
		hero.move(hero.direction.DOWN);
	
	moveMonster();
  
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
