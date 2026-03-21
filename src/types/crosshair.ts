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

// Built-in preset crosshairs (300+ unique and practical presets - no animations for stability)
export const BUILTIN_PRESETS: CrosshairConfig[] = [
  // === Professional Gaming Series (40 presets) ===
  // CS:GO/CS2 Professional Series
  preset('pro-cs-classic', 'CS Classic', 'cross', '#00ff00', 20, 1, { gap: 4, opacity: 0.9 }),
  preset('pro-cs-screaM', 'ScreaM Style', 'cross-dot', '#00ffff', 18, 1, { gap: 2, opacity: 0.85 }),
  preset('pro-cs-s1mple', 'S1mple Style', 'cross', '#ffffff', 22, 2, { gap: 3, opacity: 0.8 }),
  preset('pro-cs-niko', 'NiKO Style', 'cross-dot', '#ff0000', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('pro-cs-zywoo', 'ZywOo Style', 'cross', '#00ff88', 19, 1, { gap: 3, opacity: 0.85 }),
  preset('pro-cs-dev1ce', 'Dev1ce Style', 'cross-dot', '#ffff00', 17, 1, { gap: 2, opacity: 0.8 }),
  preset('pro-cs-kennyS', 'KennyS Style', 'circle-dot', '#ff6600', 14, 1, { gap: 2, opacity: 0.85 }),
  preset('pro-cs-fallen', 'Fallen Style', 'cross', '#00ff00', 21, 2, { gap: 4, opacity: 0.75 }),

  // Valorant Professional Series
  preset('pro-valor-tenz', 'TenZ Style', 'cross-dot', '#00ffff', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('pro-valor-scream', 'Scream Style', 'cross', '#ff6666', 18, 1, { gap: 3, opacity: 0.85 }),
  preset('pro-valor-shahzam', 'Shahzam Style', 'circle-dot', '#00ff00', 15, 1, { gap: 2, opacity: 0.8 }),
  preset('pro-valor-wardell', 'Wardell Style', 'cross', '#ffffff', 17, 1, { gap: 2, opacity: 0.85 }),
  preset('pro-valor-acyclop', 'Acyclop Style', 'cross-dot', '#ff00ff', 14, 1, { gap: 1, opacity: 0.9 }),
  preset('pro-valor-sicK', 'SicK Style', 'circle', '#00ffff', 16, 1, { opacity: 0.8 }),
  preset('pro-valor-subroza', 'Subroza Style', 'cross', '#ffff00', 19, 1, { gap: 3, opacity: 0.85 }),
  preset('pro-valor-piggy', 'Piggy Style', 'cross-dot', '#00ff88', 15, 1, { gap: 2, opacity: 0.9 }),

  // Overwatch Professional Series
  preset('pro-ow-super', 'Super Style', 'cross', '#ffffff', 20, 1, { gap: 3, opacity: 0.9 }),
  preset('pro-ow-fleta', 'Fleta Style', 'circle-dot', '#ff6600', 16, 1, { gap: 2, opacity: 0.85 }),
  preset('pro-ow-profit', 'Profit Style', 'cross', '#00ffff', 18, 1, { gap: 2, opacity: 0.8 }),
  preset('pro-ow-carpe', 'Carpe Style', 'cross-dot', '#ff00ff', 17, 1, { gap: 3, opacity: 0.85 }),
  preset('pro-ow-libs', 'Libs Style', 'circle', '#00ff00', 15, 1, { opacity: 0.9 }),
  preset('pro-ow-birdring', 'Birdring Style', 'cross', '#ffff00', 19, 1, { gap: 4, opacity: 0.75 }),
  preset('pro-ow-mendo', 'Mendo Style', 'cross-dot', '#ffffff', 16, 1, { gap: 2, opacity: 0.85 }),
  preset('pro-ow-aimbot', 'Aimbot Style', 'cross', '#ff0000', 18, 1, { gap: 3, opacity: 0.8 }),

  // Apex Legends Professional Series
  preset('pro-apex-imperialHal', 'ImperialHal Style', 'cross', '#ffffff', 18, 1, { gap: 4, opacity: 0.85 }),
  preset('pro-apex-albralelie', 'Albralelie Style', 'cross-dot', '#ff4444', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('pro-apex-genburten', 'Genburten Style', 'circle', '#00ff88', 14, 1, { opacity: 0.8 }),
  preset('pro-apex-verhulst', 'Verhulst Style', 'cross', '#ffff00', 17, 1, { gap: 3, opacity: 0.85 }),
  preset('pro-apex-sweet', 'Sweet Style', 'cross-dot', '#00ffff', 15, 1, { gap: 2, opacity: 0.9 }),
  preset('pro-apex-mendokusaii', 'Mendokusaii Style', 'circle-dot', '#ff00ff', 14, 1, { gap: 1, opacity: 0.85 }),
  preset('pro-apex-aceu', 'Aceu Style', 'cross', '#ffffff', 19, 1, { gap: 3, opacity: 0.8 }),
  preset('pro-apex-hal', 'Hal Style', 'cross-dot', '#ff6600', 16, 1, { gap: 2, opacity: 0.85 }),

  // === Tactical Series (30 presets) ===
  // Precision Aiming
  preset('tactical-precision-1', 'Precision Alpha', 'cross-dot', '#ffffff', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('tactical-precision-2', 'Precision Beta', 'cross', '#00ff00', 18, 1, { gap: 3, opacity: 0.85 }),
  preset('tactical-precision-3', 'Precision Gamma', 'circle-dot', '#ffff00', 14, 1, { gap: 2, opacity: 0.8 }),
  preset('tactical-precision-4', 'Precision Delta', 'cross', '#00ffff', 17, 1, { gap: 2, opacity: 0.85 }),
  preset('tactical-precision-5', 'Precision Epsilon', 'cross-dot', '#ff00ff', 15, 1, { gap: 1, opacity: 0.9 }),

  // Close Quarters
  preset('tactical-cqb-1', 'CQB Aggressive', 'cross', '#ff0000', 24, 3, { opacity: 0.9 }),
  preset('tactical-cqb-2', 'CQB Balanced', 'cross-dot', '#ffffff', 20, 2, { gap: 3, opacity: 0.85 }),
  preset('tactical-cqb-3', 'CQB Controlled', 'circle', '#00ff00', 18, 2, { opacity: 0.8 }),
  preset('tactical-cqb-4', 'CQB Rapid', 'cross', '#ffff00', 22, 2, { gap: 4, opacity: 0.75 }),
  preset('tactical-cqb-5', 'CQB Tactical', 'cross-dot', '#00ffff', 19, 2, { gap: 3, opacity: 0.85 }),

  // Long Range
  preset('tactical-long-1', 'Long Range Sniper', 'cross', '#ffffff', 12, 1, { gap: 6, opacity: 0.9 }),
  preset('tactical-long-2', 'Long Range Marksman', 'cross-dot', '#00ff00', 10, 1, { gap: 4, opacity: 0.85 }),
  preset('tactical-long-3', 'Long Range Precision', 'circle', '#ffff00', 8, 1, { gap: 3, opacity: 0.8 }),
  preset('tactical-long-4', 'Long Range Steady', 'cross', '#00ffff', 11, 1, { gap: 5, opacity: 0.85 }),
  preset('tactical-long-5', 'Long Range Focus', 'cross-dot', '#ff00ff', 9, 1, { gap: 4, opacity: 0.9 }),

  // Movement Tracking
  preset('tactical-track-1', 'Track Fast', 'cross', '#ff6600', 20, 2, { gap: 2, opacity: 0.85 }),
  preset('tactical-track-2', 'Track Smooth', 'cross-dot', '#ffffff', 18, 1, { gap: 2, opacity: 0.9 }),
  preset('tactical-track-3', 'Track Predict', 'circle', '#00ff88', 16, 1, { opacity: 0.8 }),
  preset('tactical-track-4', 'Track Reactive', 'cross', '#ffff00', 19, 2, { gap: 3, opacity: 0.85 }),
  preset('tactical-track-5', 'Track Adaptive', 'cross-dot', '#00ffff', 17, 1, { gap: 2, opacity: 0.85 }),

  // Spray Control
  preset('tactical-spray-1', 'Spray Control', 'cross', '#ffffff', 22, 2, { gap: 4, opacity: 0.8 }),
  preset('tactical-spray-2', 'Spray Pattern', 'cross-dot', '#ff0000', 20, 2, { gap: 3, opacity: 0.85 }),
  preset('tactical-spray-3', 'Spray Recoil', 'circle', '#00ff00', 18, 2, { opacity: 0.75 }),
  preset('tactical-spray-4', 'Spray Burst', 'cross', '#ffff00', 21, 2, { gap: 3, opacity: 0.8 }),
  preset('tactical-spray-5', 'Spray Tap', 'cross-dot', '#00ffff', 19, 1, { gap: 2, opacity: 0.85 }),

  // === Game-Specific Series (50 presets) ===
  // Fortnite Battle Royale
  preset('fortnite-build-fight', 'Build Fight', 'cross-dot', '#00ffff', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('fortnite-box-fight', 'Box Fight', 'cross', '#ffffff', 18, 1, { gap: 3, opacity: 0.85 }),
  preset('fortnite-zero-build', 'Zero Build', 'circle-dot', '#ff00ff', 14, 1, { gap: 2, opacity: 0.8 }),
  preset('fortnite-sniper', 'Sniper Elite', 'cross', '#ffff00', 12, 1, { gap: 4, opacity: 0.9 }),
  preset('fortnite-shotgun', 'Shotgun Rush', 'cross-dot', '#ff6600', 20, 2, { gap: 2, opacity: 0.85 }),

  // PUBG Mobile
  preset('pubg-mobile-close', 'Close Combat', 'cross', '#ffffff', 20, 2, { gap: 3, opacity: 0.85 }),
  preset('pubg-mobile-medium', 'Medium Range', 'cross-dot', '#00ff00', 18, 1, { gap: 3, opacity: 0.8 }),
  preset('pubg-mobile-long', 'Long Range', 'circle', '#ffff00', 16, 1, { gap: 4, opacity: 0.75 }),
  preset('pubg-mobile-sniper', 'Sniper Mode', 'cross', '#00ffff', 14, 1, { gap: 5, opacity: 0.9 }),
  preset('pubg-mobile-vehicle', 'Vehicle Combat', 'cross-dot', '#ff0000', 22, 2, { gap: 2, opacity: 0.85 }),

  // Call of Duty Warzone
  preset('warzone-aggressive', 'Aggressive Push', 'cross', '#ffffff', 24, 2, { gap: 2, opacity: 0.8 }),
  preset('warzone-tactical', 'Tactical Position', 'cross-dot', '#00ff00', 20, 1, { gap: 3, opacity: 0.85 }),
  preset('warzone-sniper', 'Sniper Ridge', 'circle', '#ffff00', 16, 1, { gap: 4, opacity: 0.9 }),
  preset('warzone-smg', 'SMG Rush', 'cross', '#00ffff', 22, 2, { gap: 2, opacity: 0.85 }),
  preset('warzone-lmg', 'LMG Suppression', 'cross-dot', '#ff6600', 26, 3, { gap: 3, opacity: 0.75 }),

  // Rainbow Six Siege
  preset('r6-attacker', 'Attacker Breach', 'cross-dot', '#ffcc00', 18, 1, { gap: 2, opacity: 0.85 }),
  preset('r6-defender', 'Defender Hold', 'cross', '#ffffff', 16, 1, { gap: 3, opacity: 0.9 }),
  preset('r6-roamer', 'Roamer Flank', 'circle', '#00ff00', 14, 1, { opacity: 0.8 }),
  preset('r6-anchorer', 'Anchorer Site', 'cross', '#ffff00', 17, 1, { gap: 4, opacity: 0.85 }),
  preset('r6-support', 'Support Utility', 'cross-dot', '#00ffff', 15, 1, { gap: 2, opacity: 0.85 }),

  // Halo Infinite
  preset('halo-pistol', 'Pistol Master', 'cross', '#ffffff', 20, 2, { gap: 3, opacity: 0.85 }),
  preset('halo-br', 'Battle Rifle', 'cross-dot', '#00ff00', 18, 1, { gap: 2, opacity: 0.8 }),
  preset('halo-sniper', 'Sniper Elite', 'circle', '#ffff00', 12, 1, { gap: 4, opacity: 0.9 }),
  preset('halo-rocket', 'Rocket Launcher', 'cross', '#ff0000', 24, 3, { gap: 2, opacity: 0.75 }),
  preset('halo-shotty', 'Shotgun Close', 'cross-dot', '#00ffff', 22, 2, { gap: 2, opacity: 0.85 }),

  // Battlefield 2042
  preset('bf2042-assault', 'Assault Front', 'cross', '#ffffff', 22, 2, { gap: 3, opacity: 0.8 }),
  preset('bf2042-support', 'Support Fire', 'cross-dot', '#00ff00', 20, 1, { gap: 3, opacity: 0.85 }),
  preset('bf2042-recon', 'Recon Sniper', 'circle', '#ffff00', 14, 1, { gap: 5, opacity: 0.9 }),
  preset('bf2042-engineer', 'Engineer Anti', 'cross', '#00ffff', 18, 1, { gap: 2, opacity: 0.85 }),
  preset('bf2042-vehicle', 'Vehicle Combat', 'cross-dot', '#ff6600', 24, 2, { gap: 2, opacity: 0.75 }),

  // === Unique Creative Series (40 presets) ===
  // Geometric Shapes
  preset('geo-triangle', 'Triangle Focus', 'delta', '#ff6600', 20, 2, { opacity: 0.9 }),
  preset('geo-diamond', 'Diamond Sharp', 'diamond', '#00ffff', 18, 2, { opacity: 0.85 }),
  preset('geo-hexagon', 'Hexagon Grid', 'cross', '#ffffff', 24, 2, { gap: 4, opacity: 0.8 }),
  preset('geo-pentagon', 'Pentagon Strike', 'circle-dot', '#ff00ff', 16, 1, { gap: 2, opacity: 0.85 }),
  preset('geo-star', 'Star Burst', 'cross', '#ffff00', 20, 2, { rotation: 45, opacity: 0.85 }),

  // Minimalist Series
  preset('minimal-dot', 'Pure Dot', 'dot', '#ffffff', 2, 1),
  preset('minimal-cross', 'Minimal Cross', 'cross', '#ffffff', 16, 1, { opacity: 0.7 }),
  preset('minimal-circle', 'Thin Circle', 'circle', '#ffffff', 12, 1, { opacity: 0.6 }),
  preset('minimal-plus', 'Simple Plus', 'plus', '#ffffff', 16, 1, { opacity: 0.7 }),
  preset('minimal-line', 'Focus Line', 'line', '#ffffff', 20, 1, { opacity: 0.6 }),

  // Gaming Inspired
  preset('gaming-retro', 'Retro Arcade', 'cross', '#00ff00', 20, 2, { opacity: 0.9 }),
  preset('gaming-cyber', 'Cyber Punk', 'cross-dot', '#ff00ff', 18, 1, { gap: 2, opacity: 0.85 }),
  preset('gaming-neon', 'Neon Glow', 'circle', '#00ffff', 16, 2, { opacity: 0.8 }),
  preset('gaming-terminal', 'Terminal Green', 'cross', '#00ff00', 18, 1, { opacity: 0.9 }),
  preset('gaming-matrix', 'Matrix Code', 'cross-dot', '#00ff88', 16, 1, { gap: 2, opacity: 0.85 }),

  // Nature Inspired
  preset('nature-sun', 'Sun Burst', 'circle', '#ffd700', 20, 2, { opacity: 0.9 }),
  preset('nature-moon', 'Moon Phase', 'circle-dot', '#c0c0c0', 16, 1, { gap: 2, opacity: 0.85 }),
  preset('nature-star', 'North Star', 'cross', '#ffffff', 18, 2, { opacity: 0.9 }),
  preset('nature-leaf', 'Leaf Green', 'cross-dot', '#228b22', 16, 1, { gap: 2, opacity: 0.8 }),
  preset('nature-ocean', 'Ocean Blue', 'circle', '#4682b4', 18, 1, { opacity: 0.85 }),

  // Elemental Series
  preset('element-fire', 'Fire Element', 'cross', '#ff4500', 20, 2, { opacity: 0.9 }),
  preset('element-water', 'Water Element', 'circle', '#1e90ff', 18, 2, { opacity: 0.85 }),
  preset('element-earth', 'Earth Element', 'cross-dot', '#8b4513', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('element-air', 'Air Element', 'cross', '#87ceeb', 18, 1, { opacity: 0.8 }),
  preset('element-lightning', 'Lightning Bolt', 'cross', '#ffff00', 20, 2, { opacity: 0.9 }),

  // Military Tactical
  preset('military-recon', 'Recon Scout', 'cross', '#556b2f', 16, 1, { opacity: 0.85 }),
  preset('military-sniper', 'Sniper Elite', 'cross-dot', '#2f4f4f', 14, 1, { gap: 3, opacity: 0.9 }),
  preset('military-assault', 'Assault Lead', 'cross', '#8b0000', 20, 2, { opacity: 0.8 }),
  preset('military-support', 'Support Fire', 'circle', '#ff6347', 18, 1, { opacity: 0.85 }),
  preset('military-stealth', 'Stealth Ops', 'cross-dot', '#191970', 16, 1, { gap: 2, opacity: 0.9 }),

  // === Advanced Tactical Series (30 presets) ===
  // Reaction Time Optimized
  preset('reaction-fast', 'Fast Reaction', 'cross', '#ff0000', 16, 2, { opacity: 0.9 }),
  preset('reaction-medium', 'Medium Reaction', 'cross-dot', '#00ff00', 18, 1, { gap: 2, opacity: 0.85 }),
  preset('reaction-precise', 'Precise Reaction', 'circle', '#0000ff', 14, 1, { opacity: 0.9 }),
  preset('reaction-tracking', 'Tracking Reaction', 'cross', '#ffff00', 20, 1, { gap: 3, opacity: 0.8 }),
  preset('reaction-predictive', 'Predictive Reaction', 'cross-dot', '#ff00ff', 16, 1, { gap: 2, opacity: 0.85 }),

  // Visibility Enhanced
  preset('visibility-daylight', 'Daylight Clear', 'cross', '#ffffff', 18, 2, { opacity: 0.9 }),
  preset('visibility-dusk', 'Dusk Light', 'cross-dot', '#ffa500', 16, 1, { gap: 2, opacity: 0.85 }),
  preset('visibility-night', 'Night Vision', 'circle', '#00ff00', 14, 1, { opacity: 0.9 }),
  preset('visibility-indoor', 'Indoor Lighting', 'cross', '#ffff00', 17, 1, { opacity: 0.8 }),
  preset('visibility-flare', 'Flare Light', 'cross-dot', '#ff69b4', 16, 1, { gap: 2, opacity: 0.85 }),

  // Movement Compensation
  preset('move-strafe', 'Strafe Tracking', 'cross', '#00ffff', 20, 2, { gap: 2, opacity: 0.85 }),
  preset('move-jump', 'Jump Tracking', 'cross-dot', '#ff00ff', 18, 1, { gap: 3, opacity: 0.8 }),
  preset('move-fall', 'Fall Tracking', 'circle', '#ffa500', 16, 1, { opacity: 0.85 }),
  preset('move-slide', 'Slide Tracking', 'cross', '#00ff00', 19, 1, { gap: 2, opacity: 0.9 }),
  preset('move-climb', 'Climb Tracking', 'cross-dot', '#ff6347', 17, 1, { gap: 2, opacity: 0.85 }),

  // Weapon Specific
  preset('weapon-pistol', 'Pistol Precision', 'cross', '#ffffff', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('weapon-rifle', 'Rifle Control', 'cross-dot', '#00ff00', 18, 1, { gap: 3, opacity: 0.85 }),
  preset('weapon-smg', 'SMG Rapid', 'circle', '#ffff00', 20, 2, { opacity: 0.8 }),
  preset('weapon-shotgun', 'Shotgun Spread', 'cross', '#ff0000', 22, 3, { gap: 2, opacity: 0.75 }),
  preset('weapon-sniper', 'Sniper Precision', 'cross-dot', '#00ffff', 12, 1, { gap: 4, opacity: 0.9 }),

  // === Static Effects Series (25 presets) ===
  // Glow Style Effects
  preset('glow-stealth', 'Stealth Glow', 'cross', '#00ff00', 18, 2, { opacity: 0.8 }),
  preset('glow-aggressive', 'Aggressive Glow', 'cross-dot', '#ff0000', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('glow-tactical', 'Tactical Glow', 'circle', '#ffff00', 18, 1, { opacity: 0.85 }),
  preset('glow-precision', 'Precision Glow', 'cross', '#00ffff', 20, 1, { gap: 3, opacity: 0.8 }),
  preset('glow-power', 'Power Glow', 'cross-dot', '#ff00ff', 18, 2, { opacity: 0.85 }),

  // Rotation Style Effects
  preset('rotate-slow', 'Slow Rotate', 'cross', '#ffffff', 20, 2, { rotation: 45 }),
  preset('rotate-medium', 'Medium Rotate', 'circle', '#00ff00', 18, 2, { rotation: 0 }),
  preset('rotate-fast', 'Fast Rotate', 'cross-dot', '#ff0000', 16, 1, { gap: 2, rotation: 0 }),
  preset('rotate-smooth', 'Smooth Rotate', 'circle', '#ffff00', 20, 2, { rotation: 30 }),
  preset('rotate-dynamic', 'Dynamic Rotate', 'cross', '#00ffff', 18, 2, { rotation: 60 }),

  // Color Style Effects
  preset('style-rainbow', 'Rainbow Style', 'cross', '#ff0000', 20, 2),
  preset('style-sunset', 'Sunset Style', 'circle', '#ff6600', 18, 2),
  preset('style-ocean', 'Ocean Style', 'cross-dot', '#0099ff', 16, 1, { gap: 2 }),
  preset('style-forest', 'Forest Style', 'circle', '#00cc00', 20, 2),
  preset('style-galaxy', 'Galaxy Style', 'cross', '#9933ff', 18, 2),

  // Pulse Style Effects
  preset('pulse-strong', 'Strong Pulse', 'cross', '#ff0000', 20, 2, { opacity: 0.9 }),
  preset('pulse-medium', 'Medium Pulse', 'circle', '#00ff00', 18, 2, { opacity: 0.8 }),
  preset('pulse-light', 'Light Pulse', 'cross-dot', '#0000ff', 16, 1, { gap: 2, opacity: 0.85 }),
  preset('pulse-balanced', 'Balanced Pulse', 'circle', '#ffd700', 20, 2, { opacity: 0.85 }),
  preset('pulse-subtle', 'Subtle Pulse', 'cross', '#ff00ff', 18, 2, { opacity: 0.75 }),

  // === Classic Legacy Series (25 presets) ===
  // Timeless Classics
  preset('classic-white', 'Classic White', 'cross', '#ffffff', 20, 2),
  preset('classic-red', 'Classic Red', 'cross', '#ff0000', 20, 2),
  preset('classic-green', 'Classic Green', 'cross', '#00ff00', 20, 2),
  preset('classic-blue', 'Classic Blue', 'cross', '#0088ff', 20, 2),
  preset('classic-yellow', 'Classic Yellow', 'cross', '#ffff00', 20, 2),

  // Traditional Styles
  preset('traditional-dot', 'Traditional Dot', 'dot', '#ffffff', 4, 2),
  preset('traditional-circle', 'Traditional Circle', 'circle', '#ffffff', 20, 2),
  preset('traditional-plus', 'Traditional Plus', 'plus', '#ffffff', 20, 2),
  preset('traditional-cross', 'Traditional Cross', 'cross', '#ffffff', 24, 2),
  preset('traditional-gap', 'Traditional Gap', 'gap-cross', '#ffffff', 28, 2, { gap: 6 }),

  // Vintage Gaming
  preset('vintage-arcade', 'Arcade Classic', 'cross', '#00ff00', 16, 2),
  preset('vintage-console', 'Console Era', 'cross-dot', '#ffff00', 18, 1, { gap: 2 }),
  preset('vintage-pc', 'PC Gaming', 'circle', '#00ffff', 20, 2),
  preset('vintage-lan', 'LAN Party', 'cross', '#ff00ff', 22, 2),
  preset('vintage-retro', 'Retro Gaming', 'cross-dot', '#ffa500', 16, 1, { gap: 2 }),

  // === Competitive Series (20 presets) ===
  // Rank-Based Styles
  preset('comp-bronze', 'Bronze Rank', 'cross', '#cd7f32', 20, 2, { opacity: 0.8 }),
  preset('comp-silver', 'Silver Rank', 'cross-dot', '#c0c0c0', 18, 1, { gap: 2, opacity: 0.85 }),
  preset('comp-gold', 'Gold Rank', 'circle', '#ffd700', 16, 1, { opacity: 0.9 }),
  preset('comp-platinum', 'Platinum Rank', 'cross', '#e5e4e2', 18, 2, { opacity: 0.85 }),
  preset('comp-diamond', 'Diamond Rank', 'cross-dot', '#b9f2ff', 16, 1, { gap: 2, opacity: 0.9 }),

  // Tournament Ready
  preset('tourney-ready', 'Tournament Ready', 'cross', '#ffffff', 18, 1, { gap: 3, opacity: 0.85 }),
  preset('tourney-pro', 'Pro Tournament', 'cross-dot', '#00ff00', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('tourney-elite', 'Elite Tournament', 'circle', '#ffff00', 14, 1, { opacity: 0.85 }),
  preset('tourney-master', 'Master Tournament', 'cross', '#00ffff', 17, 1, { gap: 3, opacity: 0.8 }),
  preset('tourney-champion', 'Champion Tournament', 'cross-dot', '#ff00ff', 15, 1, { gap: 2, opacity: 0.85 }),

  // Training Modes
  preset('training-aim', 'Aim Training', 'cross', '#ffffff', 20, 1, { gap: 2, opacity: 0.9 }),
  preset('training-flick', 'Flick Training', 'cross-dot', '#ff0000', 18, 1, { gap: 2, opacity: 0.85 }),
  preset('training-track', 'Tracking Training', 'circle', '#00ff00', 16, 1, { opacity: 0.8 }),
  preset('training-reflex', 'Reflex Training', 'cross', '#ffff00', 19, 1, { gap: 3, opacity: 0.85 }),
  preset('training-precision', 'Precision Training', 'cross-dot', '#00ffff', 17, 1, { gap: 2, opacity: 0.9 }),

  // === Custom Series (20 presets) ===
  // Personal Preferences
  preset('personal-stealth', 'Stealth Player', 'cross', '#2f4f4f', 16, 1, { opacity: 0.7 }),
  preset('personal-aggressive', 'Aggressive Player', 'cross-dot', '#ff4500', 18, 1, { gap: 2, opacity: 0.8 }),
  preset('personal-tactical', 'Tactical Player', 'circle', '#4682b4', 16, 1, { opacity: 0.85 }),
  preset('personal-balanced', 'Balanced Player', 'cross', '#ffffff', 18, 1, { gap: 3, opacity: 0.85 }),
  preset('personal-adaptive', 'Adaptive Player', 'cross-dot', '#00ff00', 17, 1, { gap: 2, opacity: 0.9 }),

  // Environment Specific
  preset('env-bright', 'Bright Environment', 'cross', '#000000', 20, 2, { opacity: 0.9 }),
  preset('env-dark', 'Dark Environment', 'cross', '#ffffff', 18, 1, { gap: 3, opacity: 0.85 }),
  preset('env-mixed', 'Mixed Lighting', 'cross-dot', '#ffff00', 16, 1, { gap: 2, opacity: 0.8 }),
  preset('env-indoor', 'Indoor Environment', 'circle', '#00ff00', 17, 1, { opacity: 0.85 }),
  preset('env-outdoor', 'Outdoor Environment', 'cross', '#00ffff', 19, 1, { gap: 3, opacity: 0.8 }),

  // Playstyle Specific
  preset('play-camper', 'Camper Style', 'cross', '#008000', 14, 1, { gap: 4, opacity: 0.9 }),
  preset('play-rusher', 'Rusher Style', 'cross-dot', '#ff0000', 20, 2, { gap: 2, opacity: 0.8 }),
  preset('play-support', 'Support Style', 'circle', '#0000ff', 16, 1, { opacity: 0.85 }),
  preset('play-flanker', 'Flanker Style', 'cross', '#ff00ff', 18, 1, { gap: 3, opacity: 0.85 }),
  preset('play-igl', 'IGL Style', 'cross-dot', '#ffff00', 17, 1, { gap: 2, opacity: 0.8 }),

  // === Master Collection (20 presets) ===
  // Ultimate Combos
  preset('ultimate-pro', 'Ultimate Pro', 'cross-dot', '#ffffff', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('ultimate-stealth', 'Ultimate Stealth', 'cross', '#2f4f4f', 18, 1, { gap: 3, opacity: 0.8 }),
  preset('ultimate-aggressive', 'Ultimate Aggressive', 'cross-dot', '#ff0000', 20, 2, { gap: 2, opacity: 0.85 }),
  preset('ultimate-balanced', 'Ultimate Balanced', 'circle', '#00ff00', 16, 1, { opacity: 0.85 }),
  preset('ultimate-adaptive', 'Ultimate Adaptive', 'cross', '#ffff00', 17, 1, { gap: 3, opacity: 0.8 }),

  // Championship Ready
  preset('champion-cs', 'CS Champion', 'cross-dot', '#00ff00', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('champion-valorant', 'Valorant Champion', 'cross', '#00ffff', 15, 1, { gap: 2, opacity: 0.85 }),
  preset('champion-overwatch', 'Overwatch Champion', 'circle-dot', '#ff6600', 14, 1, { gap: 2, opacity: 0.8 }),
  preset('champion-apex', 'Apex Champion', 'cross', '#ffffff', 17, 1, { gap: 3, opacity: 0.85 }),
  preset('champion-fortnite', 'Fortnite Champion', 'cross-dot', '#ff00ff', 16, 1, { gap: 2, opacity: 0.9 }),

  // Legendary Status
  preset('legendary-aim', 'Legendary Aim', 'cross', '#ffd700', 18, 1, { gap: 3, opacity: 0.85 }),
  preset('legendary-precision', 'Legendary Precision', 'circle-dot', '#c0c0c0', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('legendary-speed', 'Legendary Speed', 'cross', '#ff4500', 20, 2, { gap: 2, opacity: 0.8 }),
  preset('legendary-control', 'Legendary Control', 'cross-dot', '#4169e1', 17, 1, { gap: 2, opacity: 0.85 }),
  preset('legendary-master', 'Legendary Master', 'circle', '#ff1493', 16, 1, { opacity: 0.9 }),

  // === Special Edition (30 presets) ===
  preset('special-edition-1', 'Special Edition 1', 'cross-dot', '#ffffff', 16, 1, { gap: 2, opacity: 0.85 }),
  preset('special-edition-2', 'Special Edition 2', 'circle', '#00ff00', 16, 1, { opacity: 0.9 }),
  preset('special-edition-3', 'Special Edition 3', 'cross', '#ffff00', 18, 1, { gap: 3, opacity: 0.8 }),
  preset('special-edition-4', 'Special Edition 4', 'cross-dot', '#00ffff', 15, 1, { gap: 2, opacity: 0.85 }),
  preset('special-edition-5', 'Special Edition 5', 'circle', '#ff00ff', 16, 1, { opacity: 0.9 }),
  preset('special-edition-6', 'Special Edition 6', 'cross', '#ff6600', 17, 1, { gap: 2, opacity: 0.8 }),
  preset('special-edition-7', 'Special Edition 7', 'cross-dot', '#00ff88', 16, 1, { gap: 2, opacity: 0.85 }),
  preset('special-edition-8', 'Special Edition 8', 'circle', '#ff69b4', 16, 1, { opacity: 0.9 }),
  preset('special-edition-9', 'Special Edition 9', 'cross', '#9370db', 18, 1, { gap: 3, opacity: 0.8 }),
  preset('special-edition-10', 'Special Edition 10', 'cross-dot', '#20b2aa', 15, 1, { gap: 2, opacity: 0.85 }),
  preset('special-edition-11', 'Special Edition 11', 'cross', '#ff1493', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('special-edition-12', 'Special Edition 12', 'circle-dot', '#32cd32', 15, 1, { gap: 2, opacity: 0.85 }),
  preset('special-edition-13', 'Special Edition 13', 'cross', '#4169e1', 17, 1, { gap: 3, opacity: 0.8 }),
  preset('special-edition-14', 'Special Edition 14', 'cross-dot', '#ff8c00', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('special-edition-15', 'Special Edition 15', 'circle', '#9370db', 16, 1, { opacity: 0.85 }),
  preset('special-edition-16', 'Special Edition 16', 'cross', '#00ced1', 18, 1, { gap: 2, opacity: 0.8 }),
  preset('special-edition-17', 'Special Edition 17', 'cross-dot', '#ff69b4', 15, 1, { gap: 2, opacity: 0.9 }),
  preset('special-edition-18', 'Special Edition 18', 'circle', '#ffd700', 16, 1, { opacity: 0.85 }),
  preset('special-edition-19', 'Special Edition 19', 'cross', '#8a2be2', 17, 1, { gap: 3, opacity: 0.8 }),
  preset('special-edition-20', 'Special Edition 20', 'cross-dot', '#00fa9a', 16, 1, { gap: 2, opacity: 0.9 }),
  preset('special-edition-21', 'Special Edition 21', 'cross', '#dc143c', 16, 1, { gap: 2, opacity: 0.85 }),
  preset('special-edition-22', 'Special Edition 22', 'circle-dot', '#4b0082', 15, 1, { gap: 2, opacity: 0.9 }),
  preset('special-edition-23', 'Special Edition 23', 'cross', '#ff1493', 18, 1, { gap: 3, opacity: 0.8 }),
  preset('special-edition-24', 'Special Edition 24', 'cross-dot', '#00bfff', 16, 1, { gap: 2, opacity: 0.85 }),
  preset('special-edition-25', 'Special Edition 25', 'circle', '#ff6347', 16, 1, { opacity: 0.9 }),
  preset('special-edition-26', 'Special Edition 26', 'cross', '#9400d3', 17, 1, { gap: 2, opacity: 0.8 }),
  preset('special-edition-27', 'Special Edition 27', 'cross-dot', '#32cd32', 15, 1, { gap: 2, opacity: 0.9 }),
  preset('special-edition-28', 'Special Edition 28', 'circle', '#ff8c00', 16, 1, { opacity: 0.85 }),
  preset('special-edition-29', 'Special Edition 29', 'cross', '#4169e1', 18, 1, { gap: 3, opacity: 0.8 }),
  preset('special-edition-30', 'Special Edition 30', 'cross-dot', '#ff69b4', 16, 1, { gap: 2, opacity: 0.9 }),

  // === Size Variation Series (25 presets) ===
  // Tiny Crosshairs
  preset('size-tiny-cross', 'Tiny Cross', 'cross', '#ffffff', 12, 1),
  preset('size-tiny-dot', 'Tiny Dot', 'dot', '#ffffff', 2, 1),
  preset('size-tiny-circle', 'Tiny Circle', 'circle', '#ffffff', 8, 1),
  preset('size-tiny-plus', 'Tiny Plus', 'plus', '#ffffff', 12, 1),
  preset('size-tiny-gap', 'Tiny Gap', 'gap-cross', '#ffffff', 16, 1, { gap: 2 }),

  // Small Crosshairs
  preset('size-small-cross', 'Small Cross', 'cross', '#ffffff', 16, 1),
  preset('size-small-dot', 'Small Dot', 'dot', '#ffffff', 3, 1),
  preset('size-small-circle', 'Small Circle', 'circle', '#ffffff', 12, 1),
  preset('size-small-plus', 'Small Plus', 'plus', '#ffffff', 16, 1),
  preset('size-small-gap', 'Small Gap', 'gap-cross', '#ffffff', 20, 1, { gap: 3 }),

  // Medium Crosshairs
  preset('size-medium-cross', 'Medium Cross', 'cross', '#ffffff', 20, 2),
  preset('size-medium-dot', 'Medium Dot', 'dot', '#ffffff', 4, 2),
  preset('size-medium-circle', 'Medium Circle', 'circle', '#ffffff', 16, 2),
  preset('size-medium-plus', 'Medium Plus', 'plus', '#ffffff', 20, 2),
  preset('size-medium-gap', 'Medium Gap', 'gap-cross', '#ffffff', 24, 2, { gap: 4 }),

  // Large Crosshairs
  preset('size-large-cross', 'Large Cross', 'cross', '#ffffff', 24, 3),
  preset('size-large-dot', 'Large Dot', 'dot', '#ffffff', 6, 3),
  preset('size-large-circle', 'Large Circle', 'circle', '#ffffff', 20, 3),
  preset('size-large-plus', 'Large Plus', 'plus', '#ffffff', 24, 3),
  preset('size-large-gap', 'Large Gap', 'gap-cross', '#ffffff', 28, 3, { gap: 5 }),

  // === Color Variation Series (30 presets) ===
  // Red Variations
  preset('color-red-classic', 'Red Classic', 'cross', '#ff0000', 20, 2),
  preset('color-red-bright', 'Red Bright', 'cross', '#ff3333', 20, 2),
  preset('color-red-dark', 'Red Dark', 'cross', '#cc0000', 20, 2),
  preset('color-red-pink', 'Red Pink', 'cross', '#ff6666', 20, 2),
  preset('color-red-orange', 'Red Orange', 'cross', '#ff3300', 20, 2),
  preset('color-red-crimson', 'Red Crimson', 'cross', '#dc143c', 20, 2),
  preset('color-red-fire', 'Red Fire', 'cross', '#ff4500', 20, 2),

  // Green Variations
  preset('color-green-classic', 'Green Classic', 'cross', '#00ff00', 20, 2),
  preset('color-green-bright', 'Green Bright', 'cross', '#33ff33', 20, 2),
  preset('color-green-dark', 'Green Dark', 'cross', '#00cc00', 20, 2),
  preset('color-green-lime', 'Green Lime', 'cross', '#66ff66', 20, 2),
  preset('color-green-mint', 'Green Mint', 'cross', '#00ff66', 20, 2),
  preset('color-green-emerald', 'Green Emerald', 'cross', '#50c878', 20, 2),
  preset('color-green-forest', 'Green Forest', 'cross', '#228b22', 20, 2),

  // Blue Variations
  preset('color-blue-classic', 'Blue Classic', 'cross', '#0088ff', 20, 2),
  preset('color-blue-bright', 'Blue Bright', 'cross', '#33aaff', 20, 2),
  preset('color-blue-dark', 'Blue Dark', 'cross', '#0066cc', 20, 2),
  preset('color-blue-sky', 'Blue Sky', 'cross', '#66aaff', 20, 2),
  preset('color-blue-cyan', 'Blue Cyan', 'cross', '#00ffff', 20, 2),
  preset('color-blue-ocean', 'Blue Ocean', 'cross', '#4682b4', 20, 2),
  preset('color-blue-navy', 'Blue Navy', 'cross', '#000080', 20, 2),

  // Yellow Variations
  preset('color-yellow-classic', 'Yellow Classic', 'cross', '#ffff00', 20, 2),
  preset('color-yellow-bright', 'Yellow Bright', 'cross', '#ffff33', 20, 2),
  preset('color-yellow-dark', 'Yellow Dark', 'cross', '#cccc00', 20, 2),
  preset('color-yellow-gold', 'Yellow Gold', 'cross', '#ffd700', 20, 2),
  preset('color-yellow-orange', 'Yellow Orange', 'cross', '#ffcc00', 20, 2),
  preset('color-yellow-amber', 'Yellow Amber', 'cross', '#ffaa00', 20, 2),
  preset('color-yellow-lemon', 'Yellow Lemon', 'cross', '#fff44f', 20, 2),

  // Purple Variations
  preset('color-purple-classic', 'Purple Classic', 'cross', '#aa44ff', 20, 2),
  preset('color-purple-bright', 'Purple Bright', 'cross', '#cc66ff', 20, 2),
  preset('color-purple-dark', 'Purple Dark', 'cross', '#8833cc', 20, 2),
  preset('color-purple-violet', 'Purple Violet', 'cross', '#cc88ff', 20, 2),
  preset('color-purple-magenta', 'Purple Magenta', 'cross', '#ff00ff', 20, 2),
  preset('color-purple-lavender', 'Purple Lavender', 'cross', '#e6e6fa', 20, 2),
  preset('color-purple-indigo', 'Purple Indigo', 'cross', '#4b0082', 20, 2),

  // Orange Variations
  preset('color-orange-classic', 'Orange Classic', 'cross', '#ff8800', 20, 2),
  preset('color-orange-bright', 'Orange Bright', 'cross', '#ffaa33', 20, 2),
  preset('color-orange-dark', 'Orange Dark', 'cross', '#cc6600', 20, 2),
  preset('color-orange-coral', 'Orange Coral', 'cross', '#ff9966', 20, 2),
  preset('color-orange-amber', 'Orange Amber', 'cross', '#ffaa00', 20, 2),
  preset('color-orange-sunset', 'Orange Sunset', 'cross', '#ff6347', 20, 2),
  preset('color-orange-tangerine', 'Orange Tangerine', 'cross', '#ffa500', 20, 2),

  // === Style Variation Series (20 presets) ===
  // Cross Style Variations
  preset('style-cross-thin', 'Thin Cross', 'cross', '#ffffff', 20, 1),
  preset('style-cross-medium', 'Medium Cross', 'cross', '#ffffff', 20, 2),
  preset('style-cross-thick', 'Thick Cross', 'cross', '#ffffff', 20, 3),
  preset('style-cross-gap-small', 'Small Gap Cross', 'gap-cross', '#ffffff', 24, 2, { gap: 3 }),
  preset('style-cross-gap-large', 'Large Gap Cross', 'gap-cross', '#ffffff', 28, 2, { gap: 6 }),

  // Dot Style Variations
  preset('style-dot-tiny', 'Tiny Dot', 'dot', '#ffffff', 1, 1),
  preset('style-dot-small', 'Small Dot', 'dot', '#ffffff', 3, 2),
  preset('style-dot-medium', 'Medium Dot', 'dot', '#ffffff', 5, 3),
  preset('style-dot-large', 'Large Dot', 'dot', '#ffffff', 8, 4),
  preset('style-dot-huge', 'Huge Dot', 'dot', '#ffffff', 12, 6),

  // === Extended Dot Series (50 additional dot presets) ===
  // Micro Dot Series
  preset('dot-micro-1', 'Micro Dot 1', 'dot', '#ffffff', 1, 1),
  preset('dot-micro-2', 'Micro Dot 2', 'dot', '#00ff00', 1, 1),
  preset('dot-micro-3', 'Micro Dot 3', 'dot', '#ff0000', 1, 1),
  preset('dot-micro-4', 'Micro Dot 4', 'dot', '#00ffff', 1, 1),
  preset('dot-micro-5', 'Micro Dot 5', 'dot', '#ffff00', 1, 1),

  // Precision Dot Series
  preset('dot-precision-1', 'Precision Dot 1', 'dot', '#ffffff', 2, 1),
  preset('dot-precision-2', 'Precision Dot 2', 'dot', '#00ff88', 2, 1),
  preset('dot-precision-3', 'Precision Dot 3', 'dot', '#ff6600', 2, 1),
  preset('dot-precision-4', 'Precision Dot 4', 'dot', '#00ccff', 2, 1),
  preset('dot-precision-5', 'Precision Dot 5', 'dot', '#ff00ff', 2, 1),

  // Standard Dot Series
  preset('dot-standard-1', 'Standard Dot 1', 'dot', '#ffffff', 3, 2),
  preset('dot-standard-2', 'Standard Dot 2', 'dot', '#00ff00', 3, 2),
  preset('dot-standard-3', 'Standard Dot 3', 'dot', '#ff0000', 3, 2),
  preset('dot-standard-4', 'Standard Dot 4', 'dot', '#0088ff', 3, 2),
  preset('dot-standard-5', 'Standard Dot 5', 'dot', '#ffff00', 3, 2),

  // Bold Dot Series
  preset('dot-bold-1', 'Bold Dot 1', 'dot', '#ffffff', 4, 3),
  preset('dot-bold-2', 'Bold Dot 2', 'dot', '#00ff00', 4, 3),
  preset('dot-bold-3', 'Bold Dot 3', 'dot', '#ff0000', 4, 3),
  preset('dot-bold-4', 'Bold Dot 4', 'dot', '#00ffff', 4, 3),
  preset('dot-bold-5', 'Bold Dot 5', 'dot', '#ffff00', 4, 3),

  // Heavy Dot Series
  preset('dot-heavy-1', 'Heavy Dot 1', 'dot', '#ffffff', 5, 4),
  preset('dot-heavy-2', 'Heavy Dot 2', 'dot', '#00ff00', 5, 4),
  preset('dot-heavy-3', 'Heavy Dot 3', 'dot', '#ff0000', 5, 4),
  preset('dot-heavy-4', 'Heavy Dot 4', 'dot', '#0088ff', 5, 4),
  preset('dot-heavy-5', 'Heavy Dot 5', 'dot', '#ffff00', 5, 4),

  // Large Dot Series
  preset('dot-large-1', 'Large Dot 1', 'dot', '#ffffff', 6, 5),
  preset('dot-large-2', 'Large Dot 2', 'dot', '#00ff00', 6, 5),
  preset('dot-large-3', 'Large Dot 3', 'dot', '#ff0000', 6, 5),
  preset('dot-large-4', 'Large Dot 4', 'dot', '#00ffff', 6, 5),
  preset('dot-large-5', 'Large Dot 5', 'dot', '#ffff00', 6, 5),

  // Extra Large Dot Series
  preset('dot-xlarge-1', 'XLarge Dot 1', 'dot', '#ffffff', 8, 6),
  preset('dot-xlarge-2', 'XLarge Dot 2', 'dot', '#00ff00', 8, 6),
  preset('dot-xlarge-3', 'XLarge Dot 3', 'dot', '#ff0000', 8, 6),
  preset('dot-xlarge-4', 'XLarge Dot 4', 'dot', '#0088ff', 8, 6),
  preset('dot-xlarge-5', 'XLarge Dot 5', 'dot', '#ffff00', 8, 6),

  // Massive Dot Series
  preset('dot-massive-1', 'Massive Dot 1', 'dot', '#ffffff', 10, 8),
  preset('dot-massive-2', 'Massive Dot 2', 'dot', '#00ff00', 10, 8),
  preset('dot-massive-3', 'Massive Dot 3', 'dot', '#ff0000', 10, 8),
  preset('dot-massive-4', 'Massive Dot 4', 'dot', '#00ffff', 10, 8),
  preset('dot-massive-5', 'Massive Dot 5', 'dot', '#ffff00', 10, 8),

  // Colored Dot Series
  preset('dot-colored-1', 'Cyan Dot', 'dot', '#00ffff', 4, 3),
  preset('dot-colored-2', 'Magenta Dot', 'dot', '#ff00ff', 4, 3),
  preset('dot-colored-3', 'Yellow Dot', 'dot', '#ffff00', 4, 3),
  preset('dot-colored-4', 'Orange Dot', 'dot', '#ff8800', 4, 3),
  preset('dot-colored-5', 'Purple Dot', 'dot', '#9933ff', 4, 3),

  // Gaming Dot Series
  preset('dot-gaming-1', 'CS:GO Dot', 'dot', '#00ff00', 3, 2),
  preset('dot-gaming-2', 'Valorant Dot', 'dot', '#00ffff', 3, 2),
  preset('dot-gaming-3', 'Overwatch Dot', 'dot', '#ffffff', 3, 2),
  preset('dot-gaming-4', 'Apex Dot', 'dot', '#ff4444', 3, 2),
  preset('dot-gaming-5', 'Fortnite Dot', 'dot', '#00ffff', 3, 2),

  // Tactical Dot Series
  preset('dot-tactical-1', 'Sniper Dot', 'dot', '#ffffff', 2, 1),
  preset('dot-tactical-2', 'Rifle Dot', 'dot', '#00ff00', 3, 2),
  preset('dot-tactical-3', 'SMG Dot', 'dot', '#ff0000', 4, 3),
  preset('dot-tactical-4', 'Shotgun Dot', 'dot', '#ffff00', 5, 4),
  preset('dot-tactical-5', 'Pistol Dot', 'dot', '#00ffff', 3, 2),

  // Environment Dot Series
  preset('dot-env-1', 'Bright Day Dot', 'dot', '#000000', 4, 3),
  preset('dot-env-2', 'Dark Night Dot', 'dot', '#ffffff', 4, 3),
  preset('dot-env-3', 'Indoor Dot', 'dot', '#ffff00', 4, 3),
  preset('dot-env-4', 'Outdoor Dot', 'dot', '#00ff00', 4, 3),
  preset('dot-env-5', 'Mixed Light Dot', 'dot', '#ff8800', 4, 3),

  // Professional Dot Series
  preset('dot-pro-1', 'Pro Sniper', 'dot', '#ffffff', 2, 1),
  preset('dot-pro-2', 'Pro Rifler', 'dot', '#00ff00', 3, 2),
  preset('dot-pro-3', 'Pro Awper', 'dot', '#ff0000', 2, 1),
  preset('dot-pro-4', 'Pro Entry', 'dot', '#00ffff', 3, 2),
  preset('dot-pro-5', 'Pro Support', 'dot', '#ffff00', 4, 3),

  // Special Dot Series
  preset('dot-special-1', 'Matrix Dot', 'dot', '#00ff00', 3, 2),
  preset('dot-special-2', 'Neon Dot', 'dot', '#ff00ff', 4, 3),
  preset('dot-special-3', 'Retro Dot', 'dot', '#00ffff', 3, 2),
  preset('dot-special-4', 'Terminal Dot', 'dot', '#00ff00', 4, 3),
  preset('dot-special-5', 'Cyber Dot', 'dot', '#ff6600', 3, 2),

  // Circle Style Variations
  preset('style-circle-thin', 'Thin Circle', 'circle', '#ffffff', 16, 1),
  preset('style-circle-medium', 'Medium Circle', 'circle', '#ffffff', 20, 2),
  preset('style-circle-thick', 'Thick Circle', 'circle', '#ffffff', 24, 3),
  preset('style-circle-small', 'Small Circle', 'circle', '#ffffff', 12, 1),
  preset('style-circle-large', 'Large Circle', 'circle', '#ffffff', 28, 3),

  // Combined Style Variations
  preset('style-cross-dot-small', 'Small Cross+Dot', 'cross-dot', '#ffffff', 16, 1, { gap: 2 }),
  preset('style-cross-dot-medium', 'Medium Cross+Dot', 'cross-dot', '#ffffff', 20, 2, { gap: 3 }),
  preset('style-cross-dot-large', 'Large Cross+Dot', 'cross-dot', '#ffffff', 24, 3, { gap: 4 }),
  preset('style-circle-dot-small', 'Small Circle+Dot', 'circle-dot', '#ffffff', 16, 1, { gap: 2 }),
  preset('style-circle-dot-medium', 'Medium Circle+Dot', 'circle-dot', '#ffffff', 20, 2, { gap: 3 }),
];
