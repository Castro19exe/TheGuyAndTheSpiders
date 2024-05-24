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

let knifeDamage=1;
let molotovDamage=0;
let lightingDamage=0;
let upgrade1, upgrade2, upgrade3;


let lightingIsInTimeout = false;
let molotovIsInTimeout = false;

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
        if(isGameRuning){
            startRound();
        }
    }, 1000);

    
    update();
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
    let knife = new Projectile(spriteSheetKnife, hero.x, hero.y, x, y, 5, canvas.width, canvas.height, knifeDamage);
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

    desenharQuadrado(x,y,largura,altura, texto(upgrade2), cor)
    //primeiro
    
    cor= "White"
    text = texto(upgrade1);
    if(text.includes("Desbloquear")) cor = "Purple"
    

    desenharQuadrado((x-largura),y,largura,altura, texto(upgrade1), cor)
    cor= "White"
    text = texto(upgrade3);
    if(text.includes("Desbloquear")) cor = "Purple"
    
    //utlimo
    desenharQuadrado((x= x+largura),y,largura,altura, texto(upgrade3), cor)
 
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
    molotov = new Power(spriteSheetMolotov ,  x , y, canvas.width, canvas.height, molotovDamage, 2000, 5000);
    powers.push(molotov);
}


function strikeLighting(){
    //Manda um raio para um monstro atoa
    if(monsters.length>0){
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
