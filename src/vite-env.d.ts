/// <reference types="vite/client" />

// Global Variables

declare var s_bird: Sprite[];
declare var s_bg: Sprite;
declare var s_fg: Sprite;
declare var s_pipeNorth: Sprite;
declare var s_pipeSouth: Sprite;
declare var s_text: SpriteCollection;
declare var s_score: Sprite;
declare var s_splash: Sprite;
declare var s_buttons: SpriteCollection;
declare var s_numberS: Sprite;
declare var s_numberB: Sprite;

declare function initSprites(img: HTMLImageElement): void;
