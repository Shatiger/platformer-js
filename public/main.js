'use strict;'

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var currentLevel = 0;
var target = [1, 1];

var player, obstacles, coins;

var CANVAS_WIDTH = 1200;
var CANVAS_HEIGHT = 600;
var FPS = 60;

var then, now, elapsed, fpsInterval;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

var setLevel = function(lvl) {

    window.removeEventListener("keydown", controller.KeyListener);
    window.removeEventListener("keyup", controller.KeyListener);

    if (lvl === 0) {
        player = {
            xPrev: 0,
            yPrev: 0,
            width: 32,
            height: 64,
            x: 0,
            y: 0,
            xVelocity: 0,
            yVelocity: 0,
            jumping: true,
            coins: 0
        };
        obstacles = [
            {
                width: 100,
                height: 20,
                x: 300,
                y: 500
            },
            {
                width: 100,
                height: 20,
                x: 500,
                y: 400
            },
            {
                width: 100,
                height: 20,
                x: 700,
                y: 300
            },
        ];
        coins = [
            {
                width: 25,
                height: 25,
                x: 537,
                y: 360
            }
        ];
    }

    if (lvl === 1) {
        player = {
            xPrev: 0,
            yPrev: 0,
            width: 32,
            height: 64,
            x: 0,
            y: 0,
            xVelocity: 0,
            yVelocity: 0,
            jumping: true,
            coins: 0
        };
        obstacles = [
            {
                width: 100,
                height: 20,
                x: 300,
                y: 500
            },
            {
                width: 100,
                height: 20,
                x: 500,
                y: 400
            },
            {
                width: 100,
                height: 20,
                x: 800,
                y: 300
            },
        ];
        coins = [
            {
                width: 25,
                height: 25,
                x: 537,
                y: 360
            }
        ];
    }

    window.addEventListener("keydown", controller.KeyListener);
    window.addEventListener("keyup", controller.KeyListener);
}

var controller = {
    left: false,
    right: false,
    up: false,
    KeyListener: function(evt) {
        var keyState = (evt.type == "keydown") ? true : false;
        switch (evt.keyCode) {
            case 37:
                controller.left = keyState;
                break;
            case 38:
                controller.up = keyState;
                break;
            case 39:
                controller.right = keyState;
                break;
        }
    }
};

var startAnimation = function(fps) {
    setLevel(currentLevel);
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    animation(then);
}

var animation = function(newTime) {
    window.requestAnimationFrame(animation);
    now = newTime;
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        update();
        draw();
    }
}

var isCollided = function(obst, obj) {
    if (obj.x + obj.width > obst.x 
    && obj.x < obst.x + obst.width
    && obj.y < obst.y + obst.height
    && obj.y + obj.height > obst.y) {
        return true;
    } else {
        return false;
    }
}

var collideHandler = function(obst, obj) {
    if (isCollided(obst, obj)) {
        if (obj.xPrev >= obst.x + obst.width) {
            obj.x = obst.x + obst.width;
            obj.xVelocity = 0;
        }
        if (obj.xPrev + obj.width <= obst.x) {
            obj.x = obst.x - obj.width;
            obj.xVelocity = 0;
        }
        if (obj.yPrev + obj.height <= obst.y) {
            obj.y = obst.y - obj.height;
            obj.yVelocity = 0;
            obj.jumping = false;
        }
        if (obj.yPrev >= obst.y + obst.height) {
            obj.y = obst.y + obst.height;
            obj.yVelocity = 0;
        }
    }
}

var coinHandler = function (coin, obj) {
    if(isCollided(coin, obj)) {
        player.coins += 1;
        coin.x = -25;
    }
}

var update = function () {
    player.xPrev = player.x;
    player.yPrev = player.y;

    if (controller.up && player.jumping === false) {
        player.yVelocity -= 30;
        player.jumping = true;
    }

    if (controller.left) {
        player.xVelocity -= 1;
    }

    if (controller.right) {
        player.xVelocity += 1;
    }

    player.yVelocity += 1.5;
    player.x += player.xVelocity;
    player.y += player.yVelocity;
    player.xVelocity *= 0.9;
    player.yVelocity *= 0.9;

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x > CANVAS_WIDTH - player.width) {
        player.x = CANVAS_WIDTH - player.width;
    }

    if (player.y > CANVAS_HEIGHT - player.height) {
        player.y = CANVAS_HEIGHT - player.height;
        player.yVelocity = 0;
        player.jumping = false;
    }

    for (var i = 0; i < obstacles.length; i++) {
        collideHandler(obstacles[i], player);
    }

    for (var i = 0; i < coins.length; i++) {
        coinHandler(coins[i], player);
    }

    if (target[currentLevel] === player.coins) {
        currentLevel += 1;
        if (currentLevel < target.length) {
            setLevel(currentLevel);
        } else {
            alert('Игра завершена!');
            currentLevel = 0;
            setLevel(currentLevel);
        }
    }

}

var drawObject = function(obj, style) {
    context.fillStyle = style;
    context.fillRect(obj.x, obj.y, obj.width, obj.height);
}

var draw = function() {
    //фон
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    //игрок
    context.fillStyle = '#000000';
    context.fillRect(player.x, player.y, player.width, player.height);

    //препятствия
    for (var i = 0; i < obstacles.length; i++) {
        drawObject(obstacles[i], '#00ff00');
    }

    //монетки
    for (var i = 0; i < coins.length; i++) {
        drawObject(coins[i], '#eac448');
    }

    //количество монеток
    context.fillStyle = '#0000ff';
    context.font = 'normal 30px Arial';
    context.fillText(player.coins, 20, 50);
}

startAnimation(FPS);