// Crosshair type definitions

export type CrosshairStyle =
  | 'cross'       // 经典十字
  | 'circle'      // 圆环
  | 'dot'         // 中心点
  | 'cross-dot'   // 十字+中心点
  | 'circle-dot'  // 圆环+中心点
  | 't'           // T字形
  | 'line'        // 单线
  | 'delta'       // 三角形/Delta
  | 'plus'        // 加号
  | 'hollow-cross' // 空心十字
  | 'gap-cross'   // 间隙十字（中间有空白）
  | 'outline'     // 轮廓圆
  | 'bracket'     // 括号形
  | 'arrow'       // 箭头
  | 'diamond'     // 菱形
  | 'custom';     // 用户自定义

export interface CrosshairConfig {
  id: string;
  name: string;
  style: CrosshairStyle;
  color: string;       // hex color, e.g. "#ff0000"
  size: number;        // overall size in pixels
  thickness: number;   // line thickness in pixels
  opacity: number;     // 0.0 - 1.0
  rotation: number;    // degrees, 0-360
  gap: number;         // gap size for gap-cross style
  outline: boolean;    // whether to draw outline
  outlineColor: string;
  outlineWidth: number;
  animated: boolean;   // pulsing animation
  animationSpeed: number; // pulse speed
}

export interface AppSettings {
  showCrosshair: boolean;
  showSettings: boolean;
  hotkeyToggle: string;
  hotkeySettings: string;
  hotkeyNextPreset: string;
  hotkeyPrevPreset: string;
  startMinimized: boolean;
  autoStart: boolean;
  currentPresetId: string | null;
}

// Helper to create a preset efficiently
function preset(
  id: string,
  name: string,
  style: CrosshairStyle,
  color: string,
  size: number,
  thickness: number,
  opts?: Partial<Omit<CrosshairConfig, 'id' | 'name' | 'style' | 'color' | 'size' | 'thickness'>>
): CrosshairConfig {
  return {
    id,
    name,
    style,
    color,
    size,
    thickness,
    opacity: opts?.opacity ?? 1,
    rotation: opts?.rotation ?? 0,
    gap: opts?.gap ?? 0,
    outline: opts?.outline ?? false,
    outlineColor: opts?.outlineColor ?? '#000000',
    outlineWidth: opts?.outlineWidth ?? 0,
    animated: opts?.animated ?? false,
    animationSpeed: opts?.animationSpeed ?? 1,
  };
}

// Built-in preset crosshairs (100+ presets)
export const BUILTIN_PRESETS: CrosshairConfig[] = [
  // === Classic Cross (20 presets) ===
  preset('builtin-cross-red', 'Cross Red', 'cross', '#ff0000', 24, 2, { outline: true, outlineColor: '#000000', outlineWidth: 1 }),
  preset('builtin-cross-green', 'Cross Green', 'cross', '#00ff00', 24, 2),
  preset('builtin-cross-blue', 'Cross Blue', 'cross', '#0088ff', 24, 2, { outline: true, outlineColor: '#003366', outlineWidth: 1 }),
  preset('builtin-cross-yellow', 'Cross Yellow', 'cross', '#ffcc00', 24, 2),
  preset('builtin-cross-cyan', 'Cross Cyan', 'cross', '#00ffff', 24, 2),
  preset('builtin-cross-magenta', 'Cross Magenta', 'cross', '#ff00ff', 24, 2),
  preset('builtin-cross-white', 'Cross White', 'cross', '#ffffff', 24, 2),
  preset('builtin-cross-orange', 'Cross Orange', 'cross', '#ff8800', 24, 2),
  preset('builtin-cross-pink', 'Cross Pink', 'cross', '#ff66aa', 24, 2),
  preset('builtin-cross-purple', 'Cross Purple', 'cross', '#aa44ff', 24, 2),
  preset('builtin-cross-thick-red', 'Cross Thick Red', 'cross', '#ff0000', 24, 4, { outline: true, outlineColor: '#000000', outlineWidth: 2 }),
  preset('builtin-cross-thin-green', 'Cross Thin Green', 'cross', '#00ff00', 24, 1),
  preset('builtin-cross-large-white', 'Cross Large White', 'cross', '#ffffff', 36, 2, { outline: true, outlineColor: '#000000', outlineWidth: 1 }),
  preset('builtin-cross-small-red', 'Cross Small Red', 'cross', '#ff0000', 16, 2),
  preset('builtin-cross-45deg', 'Cross 45°', 'cross', '#ffaa00', 24, 2, { rotation: 45 }),
  preset('builtin-cross-135deg', 'Cross 135°', 'cross', '#00aaff', 24, 2, { rotation: 135 }),
  preset('builtin-cross-semi', 'Cross Semi', 'cross', '#ffffff', 24, 2, { opacity: 0.5 }),
  preset('builtin-cross-pulse', 'Cross Pulse', 'cross', '#ff0000', 24, 2, { animated: true, animationSpeed: 2 }),
  preset('builtin-cross-sw', 'Classic SW', 'cross', '#c8c8c8', 20, 1, { gap: 4, opacity: 0.9 }),
  preset('builtin-cross-black', 'Cross Black', 'cross', '#222222', 24, 2),

  // === Circle (20 presets) ===
  preset('builtin-circle-blue', 'Circle Blue', 'circle', '#00aaff', 20, 2),
  preset('builtin-circle-red', 'Circle Red', 'circle', '#ff0000', 20, 2, { outline: true, outlineColor: '#000000', outlineWidth: 1 }),
  preset('builtin-circle-green', 'Circle Green', 'circle', '#00ff00', 20, 2),
  preset('builtin-circle-yellow', 'Circle Yellow', 'circle', '#ffff00', 20, 2),
  preset('builtin-circle-white', 'Circle White', 'circle', '#ffffff', 20, 2),
  preset('builtin-circle-cyan', 'Circle Cyan', 'circle', '#00ffff', 24, 2),
  preset('builtin-circle-orange', 'Circle Orange', 'circle', '#ff8800', 20, 2),
  preset('builtin-circle-pink', 'Circle Pink', 'circle', '#ff66aa', 20, 2),
  preset('builtin-circle-purple', 'Circle Purple', 'circle', '#aa44ff', 20, 2),
  preset('builtin-circle-thick-white', 'Circle Thick White', 'circle', '#ffffff', 20, 4),
  preset('builtin-circle-thin-red', 'Circle Thin Red', 'circle', '#ff0000', 24, 1),
  preset('builtin-circle-large-blue', 'Circle Large Blue', 'circle', '#0088ff', 40, 2),
  preset('builtin-circle-small-green', 'Circle Small Green', 'circle', '#00ff00', 12, 2),
  preset('builtin-circle-semi', 'Circle Semi', 'circle', '#ffffff', 20, 2, { opacity: 0.6 }),
  preset('builtin-circle-pulse', 'Circle Pulse', 'circle', '#ff4444', 20, 2, { animated: true, animationSpeed: 1.5 }),
  preset('builtin-circle-magenta', 'Circle Magenta', 'circle', '#ff00ff', 20, 2),
  preset('builtin-circle-outline-black', 'Circle Outline', 'circle', '#ffffff', 24, 1, { opacity: 0.8 }),
  preset('builtin-circle-outline-blue', 'Circle Outline Blue', 'circle', '#00aaff', 30, 1, { opacity: 0.8 }),
  preset('builtin-circle-glow-red', 'Circle Glow Red', 'circle', '#ff0000', 20, 2, { opacity: 0.9 }),
  preset('builtin-circle-gold', 'Circle Gold', 'circle', '#ffd700', 20, 2),

  // === Dot (15 presets) ===
  preset('builtin-dot-white', 'Dot White', 'dot', '#ffffff', 4, 2),
  preset('builtin-dot-red', 'Dot Red', 'dot', '#ff0000', 4, 2),
  preset('builtin-dot-green', 'Dot Green', 'dot', '#00ff00', 4, 2),
  preset('builtin-dot-blue', 'Dot Blue', 'dot', '#0088ff', 4, 2),
  preset('builtin-dot-yellow', 'Dot Yellow', 'dot', '#ffff00', 4, 2),
  preset('builtin-dot-cyan', 'Dot Cyan', 'dot', '#00ffff', 4, 2),
  preset('builtin-dot-pink', 'Dot Pink', 'dot', '#ff66aa', 4, 2),
  preset('builtin-dot-orange', 'Dot Orange', 'dot', '#ff8800', 4, 2),
  preset('builtin-dot-large-white', 'Dot Large White', 'dot', '#ffffff', 8, 2),
  preset('builtin-dot-small-red', 'Dot Small Red', 'dot', '#ff0000', 2, 2),
  preset('builtin-dot-small-green', 'Dot Small Green', 'dot', '#00ff00', 2, 2),
  preset('builtin-dot-medium-blue', 'Dot Medium Blue', 'dot', '#0088ff', 6, 2),
  preset('builtin-dot-semi', 'Dot Semi', 'dot', '#ffffff', 4, 2, { opacity: 0.5 }),
  preset('builtin-dot-pulse', 'Dot Pulse', 'dot', '#ff0000', 4, 2, { animated: true, animationSpeed: 3 }),
  preset('builtin-dot-gold', 'Dot Gold', 'dot', '#ffd700', 4, 2),

  // === Cross + Dot (10 presets) ===
  preset('builtin-cross-dot', 'Cross + Dot', 'cross-dot', '#ff4444', 24, 2),
  preset('builtin-cross-dot-green', 'Cross + Dot Green', 'cross-dot', '#00ff00', 24, 2),
  preset('builtin-cross-dot-blue', 'Cross + Dot Blue', 'cross-dot', '#0088ff', 24, 2),
  preset('builtin-cross-dot-white', 'Cross + Dot White', 'cross-dot', '#ffffff', 24, 2),
  preset('builtin-cross-dot-yellow', 'Cross + Dot Yellow', 'cross-dot', '#ffff00', 24, 2),
  preset('builtin-cross-dot-orange', 'Cross + Dot Orange', 'cross-dot', '#ff8800', 24, 2),
  preset('builtin-cross-dot-cyan', 'Cross + Dot Cyan', 'cross-dot', '#00ffff', 24, 2),
  preset('builtin-cross-dot-thick', 'Cross + Dot Thick', 'cross-dot', '#ffffff', 24, 4, { outline: true, outlineColor: '#000000', outlineWidth: 1 }),
  preset('builtin-cross-dot-large', 'Cross + Dot Large', 'cross-dot', '#ff0000', 36, 2),
  preset('builtin-cross-dot-semi', 'Cross + Dot Semi', 'cross-dot', '#ffffff', 24, 2, { opacity: 0.7 }),

  // === Circle + Dot (10 presets) ===
  preset('builtin-circle-dot', 'Circle + Dot', 'circle-dot', '#ff8800', 20, 2),
  preset('builtin-circle-dot-red', 'Circle + Dot Red', 'circle-dot', '#ff0000', 20, 2),
  preset('builtin-circle-dot-green', 'Circle + Dot Green', 'circle-dot', '#00ff00', 20, 2),
  preset('builtin-circle-dot-blue', 'Circle + Dot Blue', 'circle-dot', '#0088ff', 20, 2),
  preset('builtin-circle-dot-white', 'Circle + Dot White', 'circle-dot', '#ffffff', 20, 2),
  preset('builtin-circle-dot-yellow', 'Circle + Dot Yellow', 'circle-dot', '#ffff00', 20, 2),
  preset('builtin-circle-dot-cyan', 'Circle + Dot Cyan', 'circle-dot', '#00ffff', 20, 2),
  preset('builtin-circle-dot-large', 'Circle + Dot Large', 'circle-dot', '#ff8800', 30, 2),
  preset('builtin-circle-dot-small', 'Circle + Dot Small', 'circle-dot', '#ff8800', 12, 2),
  preset('builtin-circle-dot-pulse', 'Circle + Dot Pulse', 'circle-dot', '#ff4444', 20, 2, { animated: true, animationSpeed: 1.5 }),

  // === Gap Cross (8 presets) ===
  preset('builtin-gap-cross', 'Gap Cross', 'gap-cross', '#00ff00', 28, 2, { gap: 6 }),
  preset('builtin-gap-cross-red', 'Gap Cross Red', 'gap-cross', '#ff0000', 28, 2, { gap: 6 }),
  preset('builtin-gap-cross-blue', 'Gap Cross Blue', 'gap-cross', '#0088ff', 28, 2, { gap: 6 }),
  preset('builtin-gap-cross-white', 'Gap Cross White', 'gap-cross', '#ffffff', 28, 2, { gap: 8 }),
  preset('builtin-gap-cross-yellow', 'Gap Cross Yellow', 'gap-cross', '#ffff00', 28, 2, { gap: 6 }),
  preset('builtin-gap-cross-thin', 'Gap Cross Thin', 'gap-cross', '#00ff00', 28, 1, { gap: 10 }),
  preset('builtin-gap-cross-thick', 'Gap Cross Thick', 'gap-cross', '#ff8800', 28, 4, { gap: 6 }),
  preset('builtin-gap-cross-cyan', 'Gap Cross Cyan', 'gap-cross', '#00ffff', 28, 2, { gap: 6 }),

  // === T-Shape (6 presets) ===
  preset('builtin-t', 'T-Shape', 't', '#ffff00', 24, 2),
  preset('builtin-t-red', 'T-Shape Red', 't', '#ff0000', 24, 2),
  preset('builtin-t-white', 'T-Shape White', 't', '#ffffff', 24, 2),
  preset('builtin-t-green', 'T-Shape Green', 't', '#00ff00', 24, 2),
  preset('builtin-t-blue', 'T-Shape Blue', 't', '#0088ff', 24, 2),
  preset('builtin-t-large', 'T-Shape Large', 't', '#ffffff', 32, 2),

  // === Hollow Cross (5 presets) ===
  preset('builtin-hollow-cross', 'Hollow Cross', 'hollow-cross', '#ffffff', 24, 2),
  preset('builtin-hollow-cross-red', 'Hollow Cross Red', 'hollow-cross', '#ff0000', 24, 2),
  preset('builtin-hollow-cross-blue', 'Hollow Cross Blue', 'hollow-cross', '#0088ff', 24, 2),
  preset('builtin-hollow-cross-yellow', 'Hollow Cross Yellow', 'hollow-cross', '#ffff00', 24, 2),
  preset('builtin-hollow-cross-green', 'Hollow Cross Green', 'hollow-cross', '#00ff00', 24, 2),

  // === Delta/Triangle (5 presets) ===
  preset('builtin-delta', 'Delta', 'delta', '#ff6600', 24, 2),
  preset('builtin-delta-red', 'Delta Red', 'delta', '#ff0000', 24, 2),
  preset('builtin-delta-green', 'Delta Green', 'delta', '#00ff00', 24, 2),
  preset('builtin-delta-blue', 'Delta Blue', 'delta', '#0088ff', 24, 2),
  preset('builtin-delta-yellow', 'Delta Yellow', 'delta', '#ffff00', 24, 2),

  // === Diamond (4 presets) ===
  preset('builtin-diamond', 'Diamond', 'diamond', '#ff00ff', 20, 2),
  preset('builtin-diamond-red', 'Diamond Red', 'diamond', '#ff0000', 20, 2),
  preset('builtin-diamond-green', 'Diamond Green', 'diamond', '#00ff00', 20, 2),
  preset('builtin-diamond-blue', 'Diamond Blue', 'diamond', '#0088ff', 20, 2),

  // === Bracket (4 presets) ===
  preset('builtin-bracket', 'Bracket', 'bracket', '#00ffff', 24, 2),
  preset('builtin-bracket-red', 'Bracket Red', 'bracket', '#ff0000', 24, 2),
  preset('builtin-bracket-green', 'Bracket Green', 'bracket', '#00ff00', 24, 2),
  preset('builtin-bracket-white', 'Bracket White', 'bracket', '#ffffff', 24, 2),

  // === Outline Circle (4 presets) ===
  preset('builtin-outline-circle', 'Outline Circle', 'outline', '#ffffff', 30, 1, { opacity: 0.8 }),
  preset('builtin-outline-circle-red', 'Outline Circle Red', 'outline', '#ff0000', 30, 1, { opacity: 0.8 }),
  preset('builtin-outline-circle-blue', 'Outline Circle Blue', 'outline', '#0088ff', 30, 1, { opacity: 0.8 }),
  preset('builtin-outline-circle-green', 'Outline Circle Green', 'outline', '#00ff00', 30, 1, { opacity: 0.8 }),

  // === Plus (3 presets) ===
  preset('builtin-plus-white', 'Plus White', 'plus', '#ffffff', 24, 2),
  preset('builtin-plus-red', 'Plus Red', 'plus', '#ff0000', 24, 2),
  preset('builtin-plus-blue', 'Plus Blue', 'plus', '#0088ff', 24, 2),

  // === Special / Tournament (8 presets - popular esports styles) ===
  preset('builtin-tournament-val', 'Tournament Valorant', 'cross-dot', '#00ff88', 20, 2, { gap: 4 }),
  preset('builtin-tournament-cs', 'Tournament CS2', 'cross', '#ffffff', 20, 2, { gap: 4, opacity: 0.9 }),
  preset('builtin-tournament-apex', 'Tournament Apex', 'cross', '#ffffff', 20, 1, { gap: 6 }),
  preset('builtin-tournament-ow', 'Tournament Overwatch', 'cross-dot', '#ffffff', 20, 1, { gap: 3 }),
  preset('builtin-tournament-fortnite', 'Tournament Fortnite', 'cross-dot', '#ffffff', 18, 1, { gap: 2 }),
  preset('builtin-tournament-rainbow', 'Tournament Rainbow Six', 'cross-dot', '#ffcc00', 22, 2, { gap: 3 }),
  preset('builtin-tournament-warzone', 'Tournament Warzone', 'cross', '#ffffff', 20, 1, { gap: 5 }),
  preset('builtin-tournament- PUBG', 'Tournament PUBG', 'cross-dot', '#00ff00', 20, 1, { gap: 3 }),
];
