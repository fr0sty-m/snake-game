// Game constants
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRID_SIZE = 20;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const FRAME_RATE = 200; // Time in milliseconds for each game tick (200ms = 5 frames per second)

// Snake class to manage snake properties and methods
class Snake {
  constructor() {
    this.body = [
      { x: 160, y: 300 },
      { x: 140, y: 300 },
      { x: 120, y: 300 },
    ];
    this.direction = { x: GRID_SIZE, y: 0 };
    this.growing = false;
  }

  // Draw the snake on the canvas
  draw() {
    this.body.forEach((segment) => {
      ctx.fillStyle = "green";
      ctx.fillRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);
    });
  }

  // Move the snake in the current direction
  move() {
    const head = {
      x: this.body[0].x + this.direction.x,
      y: this.body[0].y + this.direction.y,
    };
    this.body.unshift(head);

    if (!this.growing) {
      this.body.pop();
    } else {
      this.growing = false;
    }
  }

  // Change the snake's direction
  changeDirection(event) {
    const keyPressed = event.keyCode;

    if (keyPressed === 37 && this.direction.x === 0) {
      this.direction = { x: -GRID_SIZE, y: 0 };
    } else if (keyPressed === 38 && this.direction.y === 0) {
      this.direction = { x: 0, y: -GRID_SIZE };
    } else if (keyPressed === 39 && this.direction.x === 0) {
      this.direction = { x: GRID_SIZE, y: 0 };
    } else if (keyPressed === 40 && this.direction.y === 0) {
      this.direction = { x: 0, y: GRID_SIZE };
    }
  }

  // Check if the snake collides with the wall or itself
  checkCollision() {
    const head = this.body[0];

    // Collision with walls
    if (
      head.x < 0 ||
      head.x >= CANVAS_WIDTH ||
      head.y < 0 ||
      head.y >= CANVAS_HEIGHT
    ) {
      return true;
    }

    // Collision with itself
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }

    return false;
  }

  // Grow the snake by one unit
  grow() {
    this.growing = true;
  }
}

// Food class to manage food properties and methods
class Food {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.randomize();
  }

  // Randomize food position
  randomize() {
    this.x = Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)) * GRID_SIZE;
    this.y =
      Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)) * GRID_SIZE;
  }

  // Draw the food on the canvas
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, GRID_SIZE, GRID_SIZE);
  }
}

// Game class to manage game state and operations
class Game {
  constructor() {
    this.snake = new Snake();
    this.food = new Food();
    this.score = 0;
    this.gameOver = false;

    this.setup();
  }

  // Set up event listeners for keyboard input
  setup() {
    document.addEventListener("keydown", (event) =>
      this.snake.changeDirection(event),
    );
  }

  // Update the game state (move snake, check for collisions, etc.)
  update() {
    if (this.gameOver) return;

    this.snake.move();

    if (this.snake.checkCollision()) {
      this.gameOver = true;
      return;
    }

    // Check if the snake eats food
    if (
      this.snake.body[0].x === this.food.x &&
      this.snake.body[0].y === this.food.y
    ) {
      this.score += 10;
      this.snake.grow();
      this.food.randomize();
    }

    this.draw();
  }

  // Draw all the game elements (snake, food, score)
  draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.snake.draw();
    this.food.draw();
    this.drawScore();
  }

  // Draw the current score on the canvas
  drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${this.score}`, 10, 20);
  }

  // End the game and show the Game Over screen
  end() {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2);
    ctx.font = "20px Arial";
    ctx.fillText(
      "Press F5 to Restart",
      CANVAS_WIDTH / 2 - 90,
      CANVAS_HEIGHT / 2 + 30,
    );
  }
}

// Instantiate the game object
const game = new Game();

// Start the game loop with a fixed interval
function gameLoop() {
  game.update();

  if (game.gameOver) {
    game.end();
  } else {
    setTimeout(gameLoop, FRAME_RATE); // Slower loop, every 200ms
  }
}

// Start the game loop
gameLoop();
