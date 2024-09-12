import { initSprites } from "./sprite";
import type { TSprite, TSpriteCollection } from "./sprite";

var s_bird: TSprite[];
var s_bg: TSprite;
var s_fg: TSprite;
var s_pipeNorth: TSprite;
var s_pipeSouth: TSprite;
var s_text: TSpriteCollection;
var s_score: TSprite;
var s_splash: TSprite;
var s_buttons: TSpriteCollection;
var s_numberS: TSprite;
var s_numberB: TSprite;

// Game Variables
var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var width: number;
var height: number;
var fgpos = 0;
var frames = 0;
var score = 0;
var best = Number(localStorage.getItem("best")) || 0;

// Game State Variables
enum GameState {
  Splash = 0,
  Game = 1,
  Score = 2,
}
var currentstate: GameState;

// Button object for OK button
class Button {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}
}
var okbtn: Button;

// Bird Class
class Bird {
  x: number;
  y: number;
  frame: number;
  velocity: number;
  animation: number[];
  rotation: number;
  radius: number;
  gravity: number;
  private _jump: number;

  constructor() {
    this.x = 60;
    this.y = 0;
    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 1];
    this.rotation = 0;
    this.radius = 12;
    this.gravity = 0.25;
    this._jump = 4.6;
  }

  jump() {
    this.velocity = -this._jump;
  }

  update() {
    const n = currentstate === GameState.Splash ? 10 : 5;
    this.frame += frames % n === 0 ? 1 : 0;
    this.frame %= this.animation.length;

    if (currentstate === GameState.Splash) {
      this.y = height - 280 + 5 * Math.cos(frames / 10);
      this.rotation = 0;
    } else {
      this.velocity += this.gravity;
      this.y += this.velocity;

      if (this.y >= height - s_fg.height - 10) {
        this.y = height - s_fg.height - 10;
        if (currentstate === GameState.Game) {
          currentstate = GameState.Score;
        }
        this.velocity = this._jump;
      }

      if (this.velocity >= this._jump) {
        this.frame = 1;
        this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
      } else {
        this.rotation = -0.3;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    const n = this.animation[this.frame];
    s_bird[n].draw(ctx, -s_bird[n].width / 2, -s_bird[n].height / 2);
    ctx.restore();
  }
}

const bird = new Bird();

// Pipes Class
class Pipes {
  private _pipes: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }> = [];

  reset() {
    this._pipes = [];
  }

  update() {
    if (frames % 100 === 0) {
      const _y =
        height - (s_pipeSouth.height + s_fg.height + 120 + 200 * Math.random());
      this._pipes.push({
        x: 500,
        y: _y,
        width: s_pipeSouth.width,
        height: s_pipeSouth.height,
      });
    }

    for (var i = 0; i < this._pipes.length; i++) {
      const p = this._pipes[i];

      if (i === 0) {
        score += p.x === bird.x ? 1 : 0;

        const cx = Math.min(Math.max(bird.x, p.x), p.x + p.width);
        const cy1 = Math.min(Math.max(bird.y, p.y), p.y + p.height);
        const cy2 = Math.min(
          Math.max(bird.y, p.y + p.height + 80),
          p.y + 2 * p.height + 80
        );
        const dx = bird.x - cx;
        const dy1 = bird.y - cy1;
        const dy2 = bird.y - cy2;
        const d1 = dx * dx + dy1 * dy1;
        const d2 = dx * dx + dy2 * dy2;
        const r = bird.radius * bird.radius;

        if (r > d1 || r > d2) {
          currentstate = GameState.Score;
        }
      }

      p.x -= 2;
      if (p.x < -p.width) {
        this._pipes.splice(i, 1);
        i--;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this._pipes) {
      s_pipeSouth.draw(ctx, p.x, p.y);
      s_pipeNorth.draw(ctx, p.x, p.y + 80 + p.height);
    }
  }
}

const pipes = new Pipes();

function onKeyDown(evt: KeyboardEvent) {
  if (evt.code === "Space") {
    switch (currentstate) {
      case GameState.Splash:
        currentstate = GameState.Game;
        bird.jump();
        break;
      case GameState.Game:
        bird.jump();
        break;
      case GameState.Score:
        break;
    }
  }
}

// Handle screen click events
function onpress(evt: MouseEvent | TouchEvent) {
  switch (currentstate) {
    case GameState.Splash:
      currentstate = GameState.Game;
      bird.jump();
      break;
    case GameState.Game:
      bird.jump();
      break;
    case GameState.Score: {
      const mx =
        evt instanceof MouseEvent ? evt.offsetX : evt.touches[0].clientX;
      const my =
        evt instanceof MouseEvent ? evt.offsetY : evt.touches[0].clientY;

      if (
        mx > okbtn.x &&
        mx < okbtn.x + okbtn.width &&
        my > okbtn.y &&
        my < okbtn.y + okbtn.height
      ) {
        pipes.reset();
        currentstate = GameState.Splash;
        score = 0;
      }
      break;
    }
  }
}

// Initialize the game
function main() {
  canvas = document.createElement("canvas");
  width = window.innerWidth;
  height = window.innerHeight > 600 ? 600 : window.innerHeight;

  // height = Math.max(600, window.innerHeight);

  var evt: "touchstart" | "mousedown" = "touchstart";
  if (width >= 500) {
    width = 400;
    height = 600;
    canvas.style.border = "1px solid #000";
    evt = "mousedown";
  }

  document.addEventListener("keydown", onKeyDown);

  document.addEventListener(evt, onpress);

  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext("2d")!;
  document.body.appendChild(canvas);

  currentstate = GameState.Splash;

  const img = new Image();
  img.onload = function () {
    const result = initSprites(img);

    s_bird = result.s_bird;
    s_bg = result.s_bg;
    s_fg = result.s_fg;
    s_pipeNorth = result.s_pipeNorth;
    s_pipeSouth = result.s_pipeSouth;
    s_text = result.s_text;
    s_score = result.s_score;
    s_splash = result.s_splash;
    s_buttons = result.s_buttons;
    s_numberS = result.s_numberS;
    s_numberB = result.s_numberB;
    ctx.fillStyle = "#70C5CF";
    okbtn = new Button(
      (width - s_buttons.Ok.width) / 2,
      height - 200,
      s_buttons.Ok.width,
      s_buttons.Ok.height
    );
    run();
  };
  img.src = "/sheet.png";
}

// Game loop
function run() {
  const loop = () => {
    update();
    render();
    window.requestAnimationFrame(loop);
  };
  window.requestAnimationFrame(loop);
}

// Update function for bird and pipes
function update() {
  frames++;

  if (currentstate !== GameState.Score) {
    fgpos = (fgpos - 2) % 14;
  } else {
    best = Math.max(best, score);
    localStorage.setItem("best", best.toString());
  }

  if (currentstate === GameState.Game) {
    pipes.update();
  }

  bird.update();
}

// Render function for canvas
function render() {
  ctx.fillRect(0, 0, width, height);
  s_bg.draw(ctx, 0, height - s_bg.height);
  s_bg.draw(ctx, s_bg.width, height - s_bg.height);

  pipes.draw(ctx);
  bird.draw(ctx);

  s_fg.draw(ctx, fgpos, height - s_fg.height);
  s_fg.draw(ctx, fgpos + s_fg.width, height - s_fg.height);

  const centerX = width / 2;

  if (currentstate === GameState.Splash) {
    s_splash.draw(ctx, centerX - s_splash.width / 2, height - 300);
    s_text.GetReady.draw(
      ctx,
      centerX - s_text.GetReady.width / 2,
      height - 380
    );
  } else if (currentstate === GameState.Score) {
    s_text.GameOver.draw(
      ctx,
      centerX - s_text.GameOver.width / 2,
      height - 400
    );
    s_score.draw(ctx, centerX - s_score.width / 2, height - 340);
    s_buttons.Ok.draw(ctx, okbtn.x, okbtn.y);

    s_numberS.draw(ctx, centerX - 47, height - 304, score, 0, 10);
    s_numberS.draw(ctx, centerX - 47, height - 262, best, 0, 10);
  } else {
    s_numberB.draw(ctx, 0, 20, score, centerX);
  }
}

// Start the game
main();
