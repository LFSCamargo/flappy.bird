export type TSpriteCollection = {
  [key: string]: Sprite;
};

export type TSprite = Sprite;

class Sprite {
  img: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;

  constructor(
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    color?: string
  ) {
    this.img = img;
    this.x = x * 2;
    this.y = y * 2;
    this.width = width * 2;
    this.height = height * 2;
    this.color = color;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    num?: number | string,
    center?: number,
    offset?: number
  ): void {
    if (num !== undefined) {
      this.drawNumber(ctx, x, y, num, center, offset);
    } else {
      ctx.drawImage(
        this.img,
        this.x,
        this.y,
        this.width,
        this.height,
        x,
        y,
        this.width,
        this.height
      );
    }
  }

  private drawNumber(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    num: number | string,
    center?: number,
    offset?: number
  ): void {
    const numStr = num.toString();
    const step = this.width + 2;

    if (center) {
      x = center - (numStr.length * step - 2) / 2;
    }
    if (offset) {
      x += step * (offset - numStr.length);
    }

    for (let i = 0; i < numStr.length; i++) {
      const n = parseInt(numStr[i], 10);
      ctx.drawImage(
        this.img,
        step * n,
        this.y,
        this.width,
        this.height,
        x,
        y,
        this.width,
        this.height
      );
      x += step;
    }
  }
}

/**
 * Initialize all sprites
 * @param img - Spritesheet image
 */
export function initSprites(img: HTMLImageElement) {
  const s_bird = [
    new Sprite(img, 156, 115, 17, 12),
    new Sprite(img, 156, 128, 17, 12),
    new Sprite(img, 156, 141, 17, 12),
  ];

  const s_bg = new Sprite(img, 0, 0, 138, 114);

  const s_fg = new Sprite(img, 138, 0, 112, 56);

  const s_pipeNorth = new Sprite(img, 251, 0, 26, 200);
  const s_pipeSouth = new Sprite(img, 277, 0, 26, 200);

  const s_text = {
    FlappyBird: new Sprite(img, 59, 114, 96, 22),
    GameOver: new Sprite(img, 59, 136, 94, 19),
    GetReady: new Sprite(img, 59, 155, 87, 22),
  };

  const s_buttons = {
    Rate: new Sprite(img, 79, 177, 40, 14),
    Menu: new Sprite(img, 119, 177, 40, 14),
    Share: new Sprite(img, 159, 177, 40, 14),
    Score: new Sprite(img, 79, 191, 40, 14),
    Ok: new Sprite(img, 119, 191, 40, 14),
    Start: new Sprite(img, 159, 191, 40, 14),
  };

  const s_score = new Sprite(img, 138, 56, 113, 58);
  const s_splash = new Sprite(img, 0, 114, 59, 49);

  const s_numberS = new Sprite(img, 0, 177, 6, 7);
  const s_numberB = new Sprite(img, 0, 188, 7, 10);

  return {
    s_bird,
    s_bg,
    s_fg,
    s_pipeNorth,
    s_pipeSouth,
    s_text,
    s_score,
    s_splash,
    s_buttons,
    s_numberS,
    s_numberB,
  };
}
