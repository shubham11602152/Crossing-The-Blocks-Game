let score = 0;
let playerTop,
  playerBottom,
  playerX,
  playerY,
  playerHeight,
  playerTopPercentage = 0;
var gameStarted = (collided = startreached = endreached = false);
let blockLeft, blockRight, blockWidth;

var winHeight = (winWidth = 0);
var movePlayerInterval;
var moveBy = 1;
var playerTime = 800;
var min = 2,
  max = 7;

const MUSIC = {
  1: "mixkit-ritual-synth-suspense-683.wav",
  2: "mixkit-rebel-wayz-232.mp3",
  3: "mixkit-slow-ramp-57.mp3",
  4: "stranger-things-124008.mp3",
};

function playMusic(songID) {
  const music = new Audio(`./assets/music/${MUSIC[songID]}`);
  music.play();
  music.loop = true;
  music.playbackRate = 1;
}

window.onload = function () {
  const instructionScreen = document.querySelector(".instruction-screen");
  const inspirationScreen = document.querySelector(".inspiration-screen");
  const game = document.querySelector(".game");
  const player = document.querySelector(".player");
  const block = document.getElementById("t1");
  const scores = document.querySelector(".scores");
  const traffic = document.querySelectorAll(".traffic");

  var isMoving = false;
  var isMovingDown = false;
  var borderEffect = false;
  winHeight = window.innerHeight - 20;
  winWidth = game.getBoundingClientRect().width;

  setDifficulty();
  initialize();

  inspirationScreen.addEventListener("click", closeInspiration);
  instructionScreen.addEventListener("click", () => {
    closeInstruction();
    playMusic(randNum(1,4));
  });

  var strt = setInterval(updateEvents, 1);

  window.addEventListener("resize", initialize);

  function startPlayer() {
    if (!isMoving) {
      startreached = endreached = false;
      movePlayerInterval = setInterval(move, 5);
    } else {
      clearInterval(movePlayerInterval);
    }
    isMoving = !isMoving;
  }

  function initialize() {
    //stop moving the player
    if (isMoving) {
      clearInterval(movePlayerInterval);
      isMoving = false;
    }

    playerBottom = parseInt(getComputedStyle(player).bottom);
    blockWidth = parseInt(getComputedStyle(block).width);
    playerHeight = blockWidth;
    playerX = player.getBoundingClientRect.x;
    playerY = player.getBoundingClientRect.y;
    playerTop = (playerTopPercentage * (window.innerHeight - 20)) / 100;
    player.style.top = Math.floor(playerTop) + "px";

    winHeight = window.innerHeight - 20;
    winWidth = game.getBoundingClientRect().width;

    playerTopPercentage = (100 * playerTop) / winHeight;
    // using speed = distance/time formula
    // calculating constant speed for different screen size
    moveBy = winHeight / playerTime;
  }

  function move() {
    if (playerTop <= 0 && !isMovingDown && borderEffect ) {
      setDifficulty();
      startreached = true;
      isMovingDown = true;
      playerTop += moveBy;
      playerBottom -= moveBy;
      player.style.top = playerTop + "px";
      changeborderColor("top");
      clearInterval(movePlayerInterval);
    } else if (playerBottom <= 0 && isMovingDown ) {
      endreached = true;
      isMovingDown = false;
      playerTop -= moveBy;
      playerBottom += moveBy;
      player.style.top = playerTop + "px";
      changeborderColor("bottom");
      clearInterval(movePlayerInterval);
    } else if (playerTop > 0 && isMovingDown) {
      startreached = endreached = false;
      playerTop += moveBy;
      playerBottom -= moveBy;
      player.style.top = playerTop + "px";
    } else if (playerTop <= 0 &&  !isMovingDown && !borderEffect) {
      // setDifficulty()
      startreached = true;
      isMovingDown = true;
      playerTop += moveBy;
      playerBottom -= moveBy;
      borderEffect = true;
      player.style.top = playerTop + "px";
      // changeborderColor('top')
    } else {
      startreached = endreached = false;
      playerTop -= moveBy;
      playerBottom += moveBy;
      player.style.top = playerTop + "px";
    }

    playerTopPercentage = (100 * playerTop) / winHeight;
    playerX = player.getBoundingClientRect().x;
    playerY = player.getBoundingClientRect().y;
  }

  function collisionCheck(bx, by, bwidth, bheight) {
    if (
      bx + bwidth > playerX &&
      playerX + playerHeight > bx &&
      by + bheight > playerY &&
      playerY + playerHeight > by
    ) {
      navigator.vibrate(100);
      collided = true;
      restart();
    }
  }

  function restart() {
    score = 0;
    borderEffect = false;
    updateScore(score);
    player.style.top = "0%";
    isMovingDown = false;
    playerTop = parseInt(getComputedStyle(player).top);
    playerBottom = parseInt(getComputedStyle(player).bottom);
    playerX = player.getBoundingClientRect().x;
    playerY = player.getBoundingClientRect().y;
    collided = false;

    clearInterval(movePlayerInterval);
    isMoving = false;
    setDifficulty();
  }

  function updateEvents() {

    block1Pos = traffic[0].getBoundingClientRect();
    block2Pos = traffic[1].getBoundingClientRect();
    block3Pos = traffic[2].getBoundingClientRect();
    block4Pos = traffic[3].getBoundingClientRect();

    collisionCheck(block1Pos.x, block1Pos.y, blockWidth, blockWidth);
    collisionCheck(block2Pos.x, block2Pos.y, blockWidth, blockWidth);
    collisionCheck(block3Pos.x, block3Pos.y, blockWidth, blockWidth);
    collisionCheck(block4Pos.x, block4Pos.y, blockWidth, blockWidth);

    game.addEventListener("click", startPlayer);
  }

  function changeborderColor(d) {
    let s;
    if (d == "top") {
      game.style.borderTopColor = "#ffaf1181";
    } else if (d == "bottom") {
      game.style.borderBottomColor = "#ffaf1181";
    }
    scores.classList.add("scale");
    s = setTimeout(def, 100);
    function def() {
      game.style.borderColor = "#00000081";
      scores.classList.remove("scale");
    }
    updateScore(++score);
  }

  function updateScore(score) {
    scores.innerText = score;
  }

  function closeInstruction() {
    instructionScreen.classList.add("fadeout");
    document.body.removeEventListener("click", closeInstruction);
  }
  function closeInspiration() {
    inspirationScreen.classList.add("fadeout");
    document.body.removeEventListener("click", closeInspiration);
  }

  function setDifficulty() {
    configBlockSpeedAndDirection(traffic[0]);
    configBlockSpeedAndDirection(traffic[1]);
    configBlockSpeedAndDirection(traffic[2]);
    configBlockSpeedAndDirection(traffic[3]);
  }

  function configBlockSpeedAndDirection(block) {
    block.style.animationDuration = randNum(min, max) + "s";
    var dirColor = randDirection();
    block.style.animationDirection = dirColor.dir;
    block.style.backgroundColor = dirColor.color;
  }
  function randNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function randDirection() {
    var directions = [
      { dir: "normal", color: "#ADEECF" },
      { dir: "reverse", color: "#CAB8FF" },
      { dir: "alternate", color: "#FF616D" },
    ];
    return directions[randNum(0, 2)];
  }
};

function log(str) {
  console.log(str);
}
