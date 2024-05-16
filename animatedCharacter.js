let canvas;
let drawingSurface;
let spriteSheetHero;
let spriteSheetEnemy;
let spriteSheetButton;
let spriteSheetKnife;
let entities = [];
let activeKeys = new Array(255);
let isGameStarted = false;
let button = undefined;
let hero = undefined;
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

    // menu
    spriteSheetButton = new SpriteSheet("assets/img/btnPlay.png", "assets/button.json", carregarBotao);
    canvas.addEventListener("click", canvasClick);
}

// MENU
function carregarBotao() {
    button = new Button(spriteSheetButton, canvas.width * 0.5 - 128, canvas.height * 0.5 - 258 * 0.5, canvas.width, canvas.height);
    entities.push(button);
    update();
}

function startgame() {
    isGameStarted = true;
    url = './assets/img/background.png';
    canvas.style.background = `url('${url}')`;
    canvas.style.backgroundSize = 'cover';
    spriteSheetHero = new SpriteSheet("assets/img/tank.png", "assets/tank.json", heroLoaded);
    spriteSheetEnemy = new SpriteSheet("assets/img/monster.png", "assets/monster.json", spawnMonster);
    spriteSheetKnife = new SpriteSheet("assets/img/knife.png", "assets/knife.json", null);
    startRound();
    update();
    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);
}

function startRound() {
    if (verificarSeExisteEnemies()) {
        console.log("Existe Inimigos");
    } else {
        loadMonsters();
        round++;
    }
}

function loadKnife(x, y) {
    let knife = new Projectile(spriteSheetKnife, hero.x, hero.y, x, y,5, canvas.width, canvas.height, 3);
    entities.push(knife);
}

function canvasClick(e) {
    // saber se a posição que foi clicada no canvas é a mesma posição do botão do menu
    let clickedX = e.clientX;
    let clickedY = e.clientY;

    if (isGameStarted) {
        // throw knife
        loadKnife(clickedX, clickedY);
    } else if (clickedX > button.x && clickedX < button.x + button.width && clickedY > button.y && clickedY < button.y + button.height) {
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
    if (hero != undefined) {
        let x, y;
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (
            x > (hero.x + hero.width + MARGEM) || x < (hero.x - MARGEM) ||
            y > (hero.y + hero.height + MARGEM) || y < (hero.y - MARGEM)
        );

        let enemy = new Monster(spriteSheetEnemy, x, y,1, canvas.width, canvas.height, 5);
        entities.push(enemy);
    }
}

// Monster Functions
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

    entities.forEach(entity => {
        if (entity instanceof Monster) {
            moveEntity(entity, hero.x, hero.y, entity.velocity);
            if (detectCollision(entity, hero)) {
                //alert("MORRESTE");
            }
        } else if (entity instanceof Projectile) {
            if (entity.x === entity.destinyX && entity.y === entity.destinyY) {

                removeEntities.push(entity);
            } else {
                moveEntity(entity, entity.destinyX, entity.destinyY, entity.velocity);
            }
        }
    });

    // COLISSOES
    entities.forEach(monster => {
        if (monster instanceof Monster) {
            entities.forEach(projetile => {
                if (projetile instanceof Projectile && detectCollision(monster, projetile)) {
					
					monster.life-= projetile.damage;
					if(monster.life<=0){
						removeEntities.push(monster);
					}
                    removeEntities.push(projetile);
                }
            });
        }
    });

    if (removeEntities.length !== 0) {
        removeEntities.forEach(entity => {
            let index = entities.indexOf(entity);
            if (index > -1) {
                entities.splice(index, 1);
            }
        });
    }
}

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
    if (activeKeys[keyboard.LEFT]) {
        hero.move(hero.direction.LEFT);
    }
    if (activeKeys[keyboard.RIGHT]) {
        hero.move(hero.direction.RIGHT);
    }
    if (activeKeys[keyboard.UP]) {
        hero.move(hero.direction.UP);
    }
    if (activeKeys[keyboard.DOWN]) {
        hero.move(hero.direction.DOWN);
    }

    entitiesActions();

    for (let i = 0; i < entities.length; i++) {
        entities[i].update();
    }

    requestAnimationFrame(update, canvas);
    render();
}

function render() {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        let sprite = entity.getSprite();

        if (!entity.killed) {
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
