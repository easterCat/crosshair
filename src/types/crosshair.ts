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

// Built-in preset crosshairs
export const BUILTIN_PRESETS: CrosshairConfig[] = [
  {
    id: 'builtin-cross-red',
    name: 'Cross Red',
    style: 'cross',
    color: '#ff0000',
    size: 24,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 0,
    outline: true,
    outlineColor: '#000000',
    outlineWidth: 1,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-cross-green',
    name: 'Cross Green',
    style: 'cross',
    color: '#00ff00',
    size: 24,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 0,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-circle-blue',
    name: 'Circle Blue',
    style: 'circle',
    color: '#00aaff',
    size: 20,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 0,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-dot-white',
    name: 'Dot White',
    style: 'dot',
    color: '#ffffff',
    size: 4,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 0,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-cross-dot',
    name: 'Cross + Dot',
    style: 'cross-dot',
    color: '#ff4444',
    size: 24,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 0,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-circle-dot',
    name: 'Circle + Dot',
    style: 'circle-dot',
    color: '#ff8800',
    size: 20,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 0,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-gap-cross',
    name: 'Gap Cross',
    style: 'gap-cross',
    color: '#00ff00',
    size: 28,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 6,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-t',
    name: 'T-Shape',
    style: 't',
    color: '#ffff00',
    size: 24,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 0,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-hollow-cross',
    name: 'Hollow Cross',
    style: 'hollow-cross',
    color: '#ffffff',
    size: 24,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 0,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-delta',
    name: 'Delta',
    style: 'delta',
    color: '#ff6600',
    size: 24,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 0,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-diamond',
    name: 'Diamond',
    style: 'diamond',
    color: '#ff00ff',
    size: 20,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 0,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-bracket',
    name: 'Bracket',
    style: 'bracket',
    color: '#00ffff',
    size: 24,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 0,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-outline-circle',
    name: 'Outline Circle',
    style: 'outline',
    color: '#ffffff',
    size: 30,
    thickness: 1,
    opacity: 0.8,
    rotation: 0,
    gap: 0,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
  {
    id: 'builtin-pulse',
    name: 'Pulse Red',
    style: 'cross',
    color: '#ff0000',
    size: 24,
    thickness: 2,
    opacity: 1,
    rotation: 0,
    gap: 0,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: true,
    animationSpeed: 2,
  },
  {
    id: 'builtin-sw',
    name: 'Classic SW',
    style: 'cross',
    color: '#c8c8c8',
    size: 20,
    thickness: 1,
    opacity: 0.9,
    rotation: 0,
    gap: 4,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 0,
    animated: false,
    animationSpeed: 1,
  },
];
