let canvas;
let drawingSurface;
let spriteSheetHero;
let spriteSheetEnemy;
let spriteSheetButton;
let spriteSheetKnife;
// Entities HEROE + BOTOES etc
let entities = []; 
let projectiles = [];
let monsters = [];
let activeKeys = new Array(255);
let isGameStarted = false;
let button = undefined;
let round = 1;

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
    let url = './assets/img/background.png';
    canvas.style.background = `url('${url}')`;
    canvas.style.backgroundSize = 'cover';
    spriteSheetHero = new SpriteSheet("assets/img/tank.png", "assets/tank.json", heroLoaded);
    spriteSheetEnemy = new SpriteSheet("assets/img/monster.png", "assets/monster.json", spawnMonster);
    spriteSheetKnife = new SpriteSheet("assets/img/knife.png", "assets/knife.json", a);
    
    //começar rondas
    setInterval(() => {
        startRound();
    }, 5000);
    
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
    let knife = new Projectile(spriteSheetKnife, hero.x, hero.y, x, y, 5, canvas.width, canvas.height, 3);
    projectiles.push(knife);
}

function canvasClick(e) {
    let clickedX = e.clientX;
    let clickedY = e.clientY;

    if (isGameStarted) {
        // Throw knife
        loadKnife(clickedX, clickedY);
    } else if (clickedX > button.x && clickedX < button.x + button.width && clickedY > button.y && clickedY < button.y + button.height) {
        //CLICOU NO BOTAO
        entities.pop(button);
        startgame();
    }
}

function heroLoaded() {
    hero = new Hero(spriteSheetHero, canvas.width * 0.5, canvas.height * 0.5, canvas.width, canvas.height);
    entities.push(hero);
}

function spawnMonster() {
    const MARGEM = 1000;
    if (hero != null) {
        let x, y;
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (
            x > (hero.x + hero.width + MARGEM) || x < (hero.x - MARGEM) ||
            y > (hero.y + hero.height + MARGEM) || y < (hero.y - MARGEM)
        );

        let enemy = new Monster(spriteSheetEnemy, x, y, 1, canvas.width, canvas.height, 5);
        monsters.push(enemy);
    }
}

function loadMonsters() {
    let enemysQuantity = round * 5;
    let time = 1000;

    for (let i = 0; i < enemysQuantity; i++) {
        setTimeout(spawnMonster, time);
        time += 500;
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
    });

    // ENTIDADES A REMOVER
    removeEntities.forEach(entity => {
        let index;
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
    entitiesActions();

    entities.forEach(entity => entity.update());
    projectiles.forEach(projectile => projectile.update());
    monsters.forEach(monster => monster.update());

    requestAnimationFrame(update, canvas);
    render();
}

function render() {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

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

    projectiles.forEach(projectile => {
        let sprite = projectile.getSprite();
        drawingSurface.drawImage(
            projectile.spriteSheet.img,
            sprite.x, sprite.y,
            sprite.width, sprite.height,
            projectile.x, projectile.y,
            projectile.width, projectile.height
        );
    });

    monsters.forEach(monster => {
        let sprite = monster.getSprite();
        drawingSurface.drawImage(
            monster.spriteSheet.img,
            sprite.x, sprite.y,
            sprite.width, sprite.height,
            monster.x, monster.y,
            monster.width, monster.height
        );
    });
}
