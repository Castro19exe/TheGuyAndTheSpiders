let canvas;
let drawingSurface;
let spriteSheetHero;
let spriteSheetEnemy;
let spriteSheetTitle;
let spriteSheetButtonLevel1;
let spriteSheetButtonLevel2;
let spriteSheetKnife;
let spriteSheetLightning;

// Entities
let isGameRuning = true;
let entities = []; 
let projectiles = [];
let monsters = [];
let powers  =[];
let activeKeys = new Array(255);
let isGameStarted = false;
let title = undefined;
let buttonLevel1 = undefined;
let buttonLevel2 = undefined;
let round = 1;
let life = 5; //monster life
let damageCooldown = 300;
let keyboard = {
    SPACE: 32,
    LEFT: 65,
    RIGHT: 68,
    UP: 87,
    DOWN: 83
};

let knifeDamage=1;
let molotovDamage=0;
let lightingDamage=0;
let upgrade1, upgrade2, upgrade3;

let lightingIsInTimeout = false;
let molotovIsInTimeout = false;

let spriteSheetBack;
let spriteSheetBackLevel2;

let background;
let backgroundLevel2;

let gameWorld;
let camera;
let deadSpiders;

window.addEventListener("load", init, false);

function init() {
    
    canvas = document.querySelector("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawingSurface = canvas.getContext("2d");
	gameWorld = new Entity();
	gameWorld.width = canvas.width;
	gameWorld.height = canvas.height;
	gameWorld.x = 0;
	gameWorld.y = 0;

    var audio = new Audio('assets/audio/music.mp3');
    audio.loop = true;

    audio.addEventListener('canplaythrough', function() {
    audio.play();
    });
	camera = new Camera(0, gameWorld.height / 2, Math.floor(gameWorld.width), gameWorld.height / 2);

    spriteSheetBack = new SpriteSheet("assets/img/background.png","assets/background.json", spriteLoaded);
    spriteSheetBackLevel2 = new SpriteSheet("assets/img/backgroundLevel2.jpg","assets/backgroundLevel2.json", spriteLoaded);

    // MENU
    spriteSheetTitle = new SpriteSheet("assets/img/title.png", "assets/title.json", titleLoaded);
    spriteSheetButtonLevel1 = new SpriteSheet("assets/img/btnMenu1.png", "assets/buttonLevel1.json", buttonLevel1Loaded);
    spriteSheetButtonLevel2 = new SpriteSheet("assets/img/btnMenu2.png", "assets/buttonLevel2.json", buttonLevel2Loaded);
    canvas.addEventListener("click", canvasClick);
}

function titleLoaded() {
    title = new Title(spriteSheetTitle, canvas.width * 0.5 - 405.5, canvas.height * 0.5 - 608 * 0.5, canvas.width, canvas.height);
    entities.push(title);
    update();
}

function buttonLevel1Loaded() {
    buttonLevel1 = new ButtonLevel1(spriteSheetButtonLevel1, canvas.width * 0.5 - 250, canvas.height * 0.5 - 258 * 0.5, canvas.width, canvas.height);
    entities.push(buttonLevel1);
    update();
}

function buttonLevel2Loaded() {
    buttonLevel2 = new ButtonLevel2(spriteSheetButtonLevel2, canvas.width * 0.5 - 250, canvas.height * 0.5 - 8 * 0.5, canvas.width, canvas.height);
    entities.push(buttonLevel2);
    update();
}

function spriteLoaded() { }

function startgame() {
    background = new Background(spriteSheetBack, 0, 0);
    entities.push(background); 
    isGameStarted = true;
    isGameRuning = true;
    deadSpiders = 0;
    spriteSheetHero = new SpriteSheet("assets/img/tank.png", "assets/tank.json", heroLoaded);

    spriteSheetEnemy = new SpriteSheet("assets/img/aranha.png", "assets/aranha.json", spawnMonster);
    spriteSheetKnife = new SpriteSheet("assets/img/knife.png", "assets/knife.json", spriteLoaded);
    spriteSheetLightning = new SpriteSheet("assets/img/lightning.png", "assets/lightning.json", spriteLoaded);
    
    spriteSheetMolotov = new SpriteSheet("assets/img/molotov.png", "assets/molotov.json", spriteLoaded);

    //começar rondas do primeiro nivel
    setInterval(() => {
        if(isGameRuning){
            startRound();
        }
    }, 1000);
    
    update();
    
    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);
}

function startGameLevelTwo() {
    backgroundLevel2 = new BackgroundLevel2(spriteSheetBackLevel2, 0, 0);
    entities.push(backgroundLevel2); 
    isGameStarted = true;
    isGameRuning = true;
    deadSpiders = 0;
    spriteSheetHero = new SpriteSheet("assets/img/tank.png", "assets/tank.json", heroLoaded);

    spriteSheetEnemy = new SpriteSheet("assets/img/aranha.png", "assets/aranha.json", spawnMonster);
    spriteSheetKnife = new SpriteSheet("assets/img/knife.png", "assets/knife.json", spriteLoaded);
    spriteSheetLightning = new SpriteSheet("assets/img/lightning.png", "assets/lightning.json", spriteLoaded);
    
    spriteSheetMolotov = new SpriteSheet("assets/img/molotov.png", "assets/molotov.json", spriteLoaded);

    //começar rondas do segundo nivel
    setInterval(() => {
        if(isGameRuning){
            startRoundLevelTwo();
        }
    }, 500);
    
    update();
    
    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);
}

function startRound() {
    if (monsters.length == 0) {
        loadMonsters();
        round++;
    }
}

function startRoundLevelTwo() {
    if (monsters.length == 0) {
        loadHarderMonsters();
        round++;
    }
}
function playAudio(audiofile){
    path = 'assets/audio/'+ audiofile;
    var audio = new Audio(path);
    audio.addEventListener('canplaythrough', function() {
    audio.play();
    });
}
function loadKnife(x, y) {
    playAudio("knife.mp3")
    let knife = new Projectile(spriteSheetKnife, hero.x, hero.y, x, y, 5, canvas.width, canvas.height, knifeDamage);
    knife.rotation = 0;
    projectiles.push(knife);
}

function canvasClick(e) {
    let clickedX = e.clientX;
    let clickedY = e.clientY;

    if (isGameStarted && isGameRuning) {
        // Throw knife
        loadKnife(clickedX, clickedY);
    } else if (clickedX > buttonLevel1.x && clickedX < buttonLevel1.x + buttonLevel1.width && clickedY > buttonLevel1.y && clickedY < buttonLevel1.y + buttonLevel1.height && isGameRuning) {
        //CLICOU NO BOTAO
        entities.pop(buttonLevel1);
        startgame();
    } else if (clickedX > buttonLevel2.x && clickedX < buttonLevel2.x + buttonLevel2.width && clickedY > buttonLevel2.y && clickedY < buttonLevel2.y + buttonLevel2.height && isGameRuning) {
        //CLICOU NO BOTAO DO SEGUNDO NIVEL
        entities.pop(buttonLevel2);
        startGameLevelTwo();
    } else if(!isGameRuning){
        largura = 300; 
        altura = 354;
        xMenu= canvas.width/2-largura/2- largura;
        yMenu= canvas.height/2- altura/2;
        if(clickedX > xMenu && clickedX<(xMenu+largura*3) &&clickedY>yMenu && clickedY<yMenu+altura  ){
            var chosenUpgrade;
            if(clickedX<xMenu+largura){
                chosenUpgrade = upgrade1;
            }
            else if(clickedX<xMenu + largura*2){
                chosenUpgrade = upgrade2;
            }
            else{
                chosenUpgrade  =upgrade3;
            }
            if(chosenUpgrade != undefined){

                if(chosenUpgrade.hasOwnProperty('lightingDamage')) {
                    lightingDamage += chosenUpgrade['lightingDamage'];
                } else if (chosenUpgrade.hasOwnProperty('molotovDamage')) {
                    molotovDamage += chosenUpgrade['molotovDamage'];
                } else if (chosenUpgrade.hasOwnProperty('knifeDamage')) {
                    knifeDamage += chosenUpgrade['knifeDamage'];
                }
                isGameRuning=true;
            }
        }
    }
}

function heroLoaded() {
    hero = new Hero(spriteSheetHero, canvas.width * 0.5, canvas.height * 0.5, canvas.width, canvas.height);
    entities.push(hero);
}

function spawnMonster() {
    const MARGEM = 3000;
    let enemy;

    if (hero != null) {
        let x, y;

        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (
            x > (hero.x + hero.width + MARGEM) && x < (hero.x - MARGEM) &&
            y > (hero.y + hero.height + MARGEM) && y < (hero.y - MARGEM)
        )

        enemy = new Monster(spriteSheetEnemy, x, y, 1, canvas.width, canvas.height, life);
        monsters.push(enemy);
    }
}
function die(){
    playAudio("youDied.mp3")
    
    largura = 500;
    altura = 100;
    x = canvas.width/2 -largura/2;
    y= canvas.height/2 -altura/2;

    drawingSurface.lineWidth = 5; 
    drawingSurface.strokeStyle = 'black';
    drawingSurface.beginPath();
    drawingSurface.rect(x,y,  largura, altura);
    drawingSurface.stroke();
    drawingSurface.fillStyle = "black";
    
    drawingSurface.fillRect(x, y, largura, altura );

    drawingSurface.fillStyle = 'red';
    drawingSurface.font = '40px Arial';
    drawingSurface.fillText("Morreste!", (x+largura/2)-80, y+altura/2 );

    drawingSurface.font = '20px Arial';
    drawingSurface.fillText("Mataste "+ deadSpiders+ " aranhas", (x+largura/2)-80, y+altura/2+20);
    isGameRuning=false;
    

    //erro proposital

    asdasda=asdasdad213
}
function levelUpMenu(){
    playAudio("levelUp.mp3")
    let upgrades = new Map();

    function upgradeDamage(type, damage) {
        if (damage == 0) {
            upgrades.set(type, damage + 1);
        } else {
            let rad = Math.ceil(Math.random() * round);
            upgrades.set(type, damage + rad);
        }
    }

    upgradeDamage('lightingDamage', lightingDamage);
    upgradeDamage('molotovDamage', molotovDamage);

    let rad = Math.ceil(Math.random() * round);
    upgrades.set('knifeDamage', knifeDamage + rad);

    function getRandomUpgrade(upgradesMap) {
        let keys = Array.from(upgradesMap.keys());
        let randomIndex = Math.floor(Math.random() * keys.length);
        let type = keys[randomIndex];
        let value = upgradesMap.get(type);
        let upgrade = {};
        upgrade[type] = value;
        return upgrade;
    }
    
    upgrade1 = getRandomUpgrade(upgrades);
    upgrade2 = getRandomUpgrade(upgrades);
    upgrade3 = getRandomUpgrade(upgrades);

    function desenharQuadrado(x,y , largura, altura, texto, cor){
        
        drawingSurface.lineWidth = 5; 
        drawingSurface.strokeStyle = 'black';
        drawingSurface.beginPath();
        drawingSurface.rect(x,y,  largura, altura);
        drawingSurface.stroke();
        drawingSurface.fillStyle = cor;
        
        drawingSurface.fillRect(x, y, largura, altura );

        drawingSurface.fillStyle = 'black';
        drawingSurface.font = '20px Arial';
        drawingSurface.fillText(texto, (x+10), y+altura/2 );
    }

   
    function texto(upgrade){
        if(upgrade.hasOwnProperty('lightingDamage')) {
            if(upgrade['lightingDamage'] === 1) {
                return "Desbloquear: Lançar raios";
            } else {
                return "Aumentar dano de raio em " + upgrade['lightingDamage'];
            }
        } else if (upgrade.hasOwnProperty('molotovDamage')) {
            if(upgrade['molotovDamage'] === 1) {
                return "Desbloquear: Lançar molotovs";
            } else {
                return "Aumentar dano de molotov em " + upgrade['molotovDamage'];
            }
        } else if (upgrade.hasOwnProperty('knifeDamage')) {
            return "Aumentar o dano da faca em " + upgrade['knifeDamage'];
        }
    }

    cor= "White"
    text = texto(upgrade2);
    if(text.includes("Desbloquear")) cor = "Purple"
     
    var largura = 300; 
    var altura = 354; 
    //quadrado Meio
    x= canvas.width/2-largura/2;
    y = canvas.height/2- altura/2;

    desenharQuadrado(x,y,largura,altura, texto(upgrade2), cor);
    //primeiro
    
    cor= "White";
    text = texto(upgrade1);
    if(text.includes("Desbloquear")) cor = "Purple";
    

    desenharQuadrado((x-largura),y,largura,altura, texto(upgrade1), cor);
    cor= "White";
    text = texto(upgrade3);
    if(text.includes("Desbloquear")) cor = "Purple";
    
    //utlimo
    desenharQuadrado((x= x+largura),y,largura,altura, texto(upgrade3), cor);
 
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

function loadHarderMonsters() {
    life = life + 2;  // para tornar a vida inicial destes mostros maior
    let enemysQuantity = round + 3;
    let time = 800;

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
    playAudio("fire.mp3")
    rad=Math.floor(Math.random() * 4);
    //ira cair a molotov num dos lados do heroi
    x = hero.x;
    y = hero.y;
    margem=100;
    if(rad==1) x -=margem;
    if(rad==2) y +=margem;
    if(rad==3) x +=margem;
    if(rad==4) x -=margem
    molotov = new Power(spriteSheetMolotov ,  x , y, canvas.width, canvas.height, molotovDamage, 2000, 5000);
    powers.push(molotov);
}


function strikeLighting(){
    //Manda um raio para um monstro atoa
    if(monsters.length>0){
        playAudio("lightning.mp3")
        let i = Math.floor(Math.random() * monsters.length);
        let monster = monsters[i];
        lighting= new Power(spriteSheetLightning, monster.x , monster.y , canvas.width, canvas.height, lightingDamage, 250,5000);
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
        if (projectile.spriteSheet === spriteSheetKnife) {
            //rotaçao faca
            projectile.rotation += 0.1; 
        }
        if (projectile.x === projectile.destinyX && projectile.y === projectile.destinyY) {
            removeEntities.push(projectile);
        } else {
            moveEntity(projectile, projectile.destinyX, projectile.destinyY, projectile.velocity);
        }
    });

    // MONSTER ACTIONS
    monsters.forEach(monster => {
        moveEntity(monster, hero.x, hero.y, monster.velocity);

        let currentTime = Date.now();

        if (detectCollision(monster, hero)) {
            if (currentTime - hero.lastDamageTime >= damageCooldown) {
                hero.life--;
                hero.lastDamageTime = currentTime;

                if (hero.life <= 0) {
                   die();
                }
            }
        }
    });

    // COLISON BETWEN MONSTER AND PROJECTILES
    monsters.forEach(monster => {
        projectiles.forEach(projectile => {
            if (detectCollision(monster, projectile)) {
                monster.life -= projectile.damage;
                if (monster.life <= 0) {
                    removeEntities.push(monster);
                    deadSpiders++;
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
    if(isGameRuning) {
        if (!lightingIsInTimeout && lightingDamage!=0) {
            setTimeout(() => {
                strikeLighting();
                lightingIsInTimeout = false; 
            }, 5000);
            lightingIsInTimeout = true; 
        }
        if (!molotovIsInTimeout && molotovDamage!=0) {
            setTimeout(() => {
                throwMolotov();
                molotovIsInTimeout = false; 
            }, 5000);
            molotovIsInTimeout = true; 
        }

        entitiesActions();

        powers.forEach(power => power.update());
        entities.forEach(entity => entity.update());
        projectiles.forEach(projectile => projectile.update());
        monsters.forEach(monster => monster.update());

        render();
    }
    
    setTimeout(() => {
        requestAnimationFrame(update, canvas); 
    }, 1000/60); 
    
}

function render() {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
    
    allEntities = [];
    allEntities.push(entities); 
    allEntities.push(powers);
    allEntities.push(projectiles);
    allEntities.push(monsters);

    allEntities.forEach(entities => {
        entities.forEach(entity => {
            if (entity instanceof Projectile && entity.spriteSheet === spriteSheetKnife) {
                drawingSurface.save(); 
                drawingSurface.translate(entity.x + entity.width / 2, entity.y + entity.height / 2); 
                drawingSurface.rotate(entity.rotation); 
                
                let sprite = entity.getSprite();
                drawingSurface.drawImage(
                    entity.spriteSheet.img,
                    sprite.x, sprite.y,
                    sprite.width, sprite.height,
                    -entity.width / 2, -entity.height / 2,
                    entity.width, entity.height
                );

                drawingSurface.restore(); 
            } else {
                let sprite = entity.getSprite();
                drawingSurface.drawImage(
                    entity.spriteSheet.img,
                    sprite.x, sprite.y,
                    sprite.width, sprite.height,
                    entity.x, entity.y,
                    entity.width, entity.height
                );
            }
        });
    });
}
