let canvas;
let drawingSurface;
let spriteSheetHero;
let spriteSheetEnemy;
let spriteSheetButton;
let spriteSheetKnife;
let spriteSheetLightning;
// Entities HEROE + BOTOES etc
let isGameRuning = true;
let entities = []; 
let projectiles = [];
let monsters = [];
let powers  =[];
let activeKeys = new Array(255);
let isGameStarted = false;
let button = undefined;
let round = 1;
let life = 5;
let keyboard = {
    SPACE: 32,
    LEFT: 65,
    RIGHT: 68,
    UP: 87,
    DOWN: 83
};

window.addEventListener("load", init, false);

function init() {
    canvas = document.querySelector("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawingSurface = canvas.getContext("2d");

    // Menu
    spriteSheetButton = new SpriteSheet("assets/img/btnPlay.png", "assets/button.json", carregarBotao);
    canvas.addEventListener("click", canvasClick);
}

// MENU
function carregarBotao() {
    button = new Button(spriteSheetButton, canvas.width * 0.5 - 128, canvas.height * 0.5 - 258 * 0.5, canvas.width, canvas.height);
    entities.push(button);
    update();
}
function a(){}

function startgame() {

    isGameStarted = true;
    isGameRuning = true;
    let url = './assets/img/background.png';
    canvas.style.background = `url('${url}')`;
    canvas.style.backgroundSize = 'cover';
    spriteSheetHero = new SpriteSheet("assets/img/tank.png", "assets/tank.json", heroLoaded);
    
    spriteSheetEnemy = new SpriteSheet("assets/img/aranha.png", "assets/aranha.json", spawnMonster);
    spriteSheetKnife = new SpriteSheet("assets/img/knife.png", "assets/knife.json", a);
    spriteSheetLightning = new SpriteSheet("assets/img/lightning.png", "assets/lightning.json", a);
    
    spriteSheetMolotov = new SpriteSheet("assets/img/molotov.png", "assets/molotov.json", a);
    //começar rondas
    setInterval(() => {
        startRound();
    }, 1000);

    setInterval(() => {
        strikeLighting();
    }, 5000);


    setInterval(() => {
        throwMolotov();
    }, 5000);
    update();
    //levelUpMenu();
    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);
}

function startRound() {
    if (monsters.length ==0) {
        loadMonsters();
        round++;
    }
}

function loadKnife(x, y) {
    let knife = new Projectile(spriteSheetKnife, hero.x, hero.y, x, y, 5, canvas.width, canvas.height, 3);
    projectiles.push(knife);
}

function canvasClick(e) {
    let clickedX = e.clientX;
    let clickedY = e.clientY;

    if (isGameStarted && isGameRuning) {
        // Throw knife
        loadKnife(clickedX, clickedY);
    } else if (clickedX > button.x && clickedX < button.x + button.width && clickedY > button.y && clickedY < button.y + button.height && isGameRuning) {
        //CLICOU NO BOTAO
        entities.pop(button);
        startgame();
    }else if(!isGameRuning){
        largura = 670; 
        altura = 354; 
        xMenu= canvas.width/2-largura/2;
        yMenu= canvas.height/2- altura/2;
        if(clickedX > xMenu && clickedX<(xMenu+largura) ){
            



            
            isGameRuning=true;
        }
    }
}

function heroLoaded() {
    hero = new Hero(spriteSheetHero, canvas.width * 0.5, canvas.height * 0.5, canvas.width, canvas.height);
    entities.push(hero);
}

function spawnMonster() {
    const MARGEM = 1000;
    let enemy;


    if (hero != null) {
        let x, y;

        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (
            x > (hero.x + hero.width + MARGEM) || x < (hero.x - MARGEM) ||
            y > (hero.y + hero.height + MARGEM) || y < (hero.y - MARGEM)
        )

        enemy = new Monster(spriteSheetEnemy, x, y, 1, canvas.width, canvas.height, life);
        monsters.push(enemy);
    }
}
function levelUpMenu(){
    console.log("level up")
    
    var largura = 670; 
    var altura = 354; 
    drawingSurface.lineWidth = 5;  
    xMenu= canvas.width/2-largura/2;
    yMenu= canvas.height/2- altura/2;
    //contorno
    drawingSurface.strokeStyle = 'black';
    drawingSurface.beginPath();
    drawingSurface.rect(xMenu,yMenu,  largura, altura);
    
    //quadrado
    drawingSurface.fillStyle = 'white';
    drawingSurface.fillRect(xMenu, yMenu, largura, altura );
    //primeira opçao
    limite=largura/3;
    drawingSurface.rect(xMenu,yMenu,  limite, altura);
    
    drawingSurface.fillStyle = 'blue';
    opcao = drawingSurface.fillRect(xMenu,yMenu, limite, altura)
    
    
    //segunda

    largura=limite*2;
    drawingSurface.rect(xMenu,yMenu,  largura, altura);

    //terceira




    drawingSurface.stroke();
    //pausar o jogo
    isGameRuning=false;
    //
}
function loadMonsters() {
    let enemysQuantity = round + 2;
    let time = 1000;

    if (round % 5 == 0) {
        levelUpMenu();
        life = life * 2;
    }

    for (let i = 0; i < enemysQuantity; i++) {
        setTimeout(spawnMonster, time);
        time += 300;
    }
}

function moveEntity(entity, destinyX, destinyY, velocity) {
    let deltaX = destinyX - entity.x;
    let deltaY = destinyY - entity.y;
    let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > velocity) {
        let stepX = (deltaX / distance) * velocity;
        let stepY = (deltaY / distance) * velocity;

        entity.x += stepX;
        entity.y += stepY;
    } else {
        entity.x = destinyX;
        entity.y = destinyY;
    }
}

function detectCollision(entity1, entity2) {
    return (
        entity1.x < entity2.x + entity2.width &&
        entity1.x + entity1.width > entity2.x &&
        entity1.y < entity2.y + entity2.height &&
        entity1.y + entity1.height > entity2.y
    );
}
function throwMolotov(){

    rad=Math.floor(Math.random() * 4);
    //ira cair a molotov num dos lados do heroi
    x = hero.x;
    y = hero.y;
    margem=100;
    if(rad==1) x -=margem;
    if(rad==2) y +=margem;
    if(rad==3) x +=margem;
    if(rad==4) x -=margem
    molotov = new Power(spriteSheetMolotov ,  x , y, canvas.width, canvas.height, 5, 2000, 5000);
    powers.push(molotov);
}


function strikeLighting(){
    //Manda um raio para um monstro atoa
    if(monsters.length>0){
        let i = Math.floor(Math.random() * monsters.length);
        let monster = monsters[i];
        lighting= new Power(spriteSheetLightning, monster.x , monster.y , canvas.width, canvas.height, 5, 250,5000);
        lighting.y =   monster.y+(monster.height/2) -lighting.height;
        
        powers.push(lighting);
    }
}

function entitiesActions() {
    let removeEntities = [];
   
    // HERO
    entities.forEach(entity => {
        if (entity instanceof Hero) {
            if (activeKeys[keyboard.LEFT]) {
                entity.move(entity.direction.LEFT);
            }
            if (activeKeys[keyboard.RIGHT]) {
                entity.move(entity.direction.RIGHT);
            }
            if (activeKeys[keyboard.UP]) {
                entity.move(entity.direction.UP);
            }
            if (activeKeys[keyboard.DOWN]) {
                entity.move(entity.direction.DOWN);
            }
        }

    });

    // POWERS ACTIONS
    powers.forEach(power => {
        setTimeout(() => {
            index = powers.indexOf(power);
            powers.splice(index,1)
        }, power.time);
    });
    // PROJECTILES ACTIONS
    projectiles.forEach(projectile => {
        if (projectile.x === projectile.destinyX && projectile.y === projectile.destinyY) {
            removeEntities.push(projectile);
        } else {
            moveEntity(projectile, projectile.destinyX, projectile.destinyY, projectile.velocity);
        }
    });

    // MONSTER ACTIONS
    monsters.forEach(monster => {
        moveEntity(monster, hero.x, hero.y, monster.velocity);
        if (detectCollision(monster, hero)) {
            //alert("MORRESTE");

            //tirar vida ao heroi aqui
        }
    });

    // COLISON BETWEN MONSTER AND PROJECTILES
    monsters.forEach(monster => {
        projectiles.forEach(projectile => {
            if (detectCollision(monster, projectile)) {
                monster.life -= projectile.damage;
                if (monster.life <= 0) {
                    removeEntities.push(monster);
                }
                removeEntities.push(projectile);
            }
        });
        powers.forEach(power => {
            if (detectCollision(monster, power)) {
                monster.life -= power.damage;
                if (monster.life <= 0) {
                    removeEntities.push(monster);
                }
            }
        });
    });

    // ENTIDADES A REMOVER
    removeEntities.forEach(entity => {
        let index;
        index = powers.indexOf(entity);
        if(index >-1){
            powers.splice(index,1)
        }
        index = projectiles.indexOf(entity);
        if (index > -1) {
            projectiles.splice(index, 1);
        }
        index = monsters.indexOf(entity);
        if (index > -1) {
            monsters.splice(index, 1);
        }
        index = entities.indexOf(entity);
        if (index > -1) {
            entities.splice(index, 1);
        }
    });
}

function keyDownHandler(e) {
    activeKeys[e.keyCode] = true;
}

function keyUpHandler(e) {
    activeKeys[e.keyCode] = false;
    if (hero) {
        hero.stop();
    }
}

function update() {
    if(isGameRuning ){
        entitiesActions();
        powers.forEach(power => power.update());
        entities.forEach(entity => entity.update());
        projectiles.forEach(projectile => projectile.update());
        monsters.forEach(monster => monster.update());
        /*setTimeout(() => {
            requestAnimationFrame(update, canvas); 
        }, 1000/60);*/
        render();
    }
    
    requestAnimationFrame(update, canvas);
}

function render() {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
    allEntities = [];
    allEntities.push(powers);
    allEntities.push(entities);
    allEntities.push(projectiles);
    allEntities.push(monsters);

    allEntities.forEach(entities => {
        entities.forEach(entity => {
            let sprite = entity.getSprite();
            drawingSurface.drawImage(
                entity.spriteSheet.img,
                sprite.x, sprite.y,
                sprite.width, sprite.height,
                entity.x, entity.y,
                entity.width, entity.height
                );
        });
    });
}
