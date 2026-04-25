export interface ShapeDefinition {
  id: string;
  name: string;
  category: 'basic' | 'decorative';
  icon: string;
  getPath: (w: number, h: number, options?: ShapeOptions) => string;
}

export interface ShapeOptions {
  cornerRadius?: number;
  borderThickness?: number;
  points?: number;
  innerRadius?: number;
}

function polygonPath(cx: number, cy: number, r: number, sides: number, rotation = -Math.PI / 2): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = rotation + (2 * Math.PI * i) / sides;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pts.push(`${i === 0 ? 'M' : 'L'}${x},${y}`);
  }
  return pts.join(' ') + ' Z';
}

function starPath(cx: number, cy: number, outerR: number, innerR: number, points: number): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = -Math.PI / 2 + (Math.PI * i) / points;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pts.push(`${i === 0 ? 'M' : 'L'}${x},${y}`);
  }
  return pts.join(' ') + ' Z';
}

export const shapeDefinitions: ShapeDefinition[] = [
  // Basic Shapes
  {
    id: 'circle',
    name: 'Circle',
    category: 'basic',
    icon: '⬤',
    getPath: (w, h) => {
      const rx = w / 2, ry = h / 2;
      return `M${rx},0 A${rx},${ry} 0 1,1 ${rx},${h} A${rx},${ry} 0 1,1 ${rx},0 Z`;
    },
  },
  {
    id: 'square',
    name: 'Square',
    category: 'basic',
    icon: '⬛',
    getPath: (w, h) => `M0,0 L${w},0 L${w},${h} L0,${h} Z`,
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    category: 'basic',
    icon: '▬',
    getPath: (w, h) => `M0,0 L${w},0 L${w},${h} L0,${h} Z`,
  },
  {
    id: 'triangle',
    name: 'Triangle',
    category: 'basic',
    icon: '▲',
    getPath: (w, h) => `M${w / 2},0 L${w},${h} L0,${h} Z`,
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    category: 'basic',
    icon: '⬠',
    getPath: (w, h) => polygonPath(w / 2, h / 2, Math.min(w, h) / 2, 5),
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'basic',
    icon: '⬡',
    getPath: (w, h) => polygonPath(w / 2, h / 2, Math.min(w, h) / 2, 6),
  },
  {
    id: 'octagon',
    name: 'Octagon',
    category: 'basic',
    icon: '⯃',
    getPath: (w, h) => polygonPath(w / 2, h / 2, Math.min(w, h) / 2, 8),
  },
  {
    id: 'star',
    name: 'Star',
    category: 'basic',
    icon: '★',
    getPath: (w, h) => starPath(w / 2, h / 2, Math.min(w, h) / 2, Math.min(w, h) / 4, 5),
  },
  {
    id: 'oval',
    name: 'Oval',
    category: 'basic',
    icon: '⬮',
    getPath: (w, h) => {
      const rx = w / 2, ry = h / 2;
      return `M${rx},0 A${rx},${ry} 0 1,1 ${rx},${h} A${rx},${ry} 0 1,1 ${rx},0 Z`;
    },
  },
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'basic',
    icon: '◆',
    getPath: (w, h) => `M${w / 2},0 L${w},${h / 2} L${w / 2},${h} L0,${h / 2} Z`,
  },
  {
    id: 'parallelogram',
    name: 'Parallelogram',
    category: 'basic',
    icon: '▰',
    getPath: (w, h) => {
      const offset = w * 0.2;
      return `M${offset},0 L${w},0 L${w - offset},${h} L0,${h} Z`;
    },
  },
  {
    id: 'trapezoid',
    name: 'Trapezoid',
    category: 'basic',
    icon: '⏢',
    getPath: (w, h) => {
      const offset = w * 0.15;
      return `M${offset},0 L${w - offset},0 L${w},${h} L0,${h} Z`;
    },
  },
  // Decorative Shapes
  {
    id: 'heart',
    name: 'Heart',
    category: 'decorative',
    icon: '♥',
    getPath: (w, h) => {
      const cx = w / 2;
      return `M${cx},${h * 0.85} C${w * 0.05},${h * 0.5} ${w * 0.0},${h * 0.15} ${cx},${h * 0.3} C${w},${h * 0.15} ${w * 0.95},${h * 0.5} ${cx},${h * 0.85} Z`;
    },
  },
  {
    id: 'shield',
    name: 'Shield',
    category: 'decorative',
    icon: '🛡',
    getPath: (w, h) => `M${w / 2},0 L${w},${h * 0.15} L${w},${h * 0.55} Q${w},${h * 0.8} ${w / 2},${h} Q0,${h * 0.8} 0,${h * 0.55} L0,${h * 0.15} Z`,
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'decorative',
    icon: '🏷',
    getPath: (w, h) => starPath(w / 2, h / 2, Math.min(w, h) / 2, Math.min(w, h) * 0.38, 8),
  },
  {
    id: 'cloud',
    name: 'Cloud',
    category: 'decorative',
    icon: '☁',
    getPath: (w, h) => {
      return `M${w * 0.25},${h * 0.6} A${w * 0.18},${h * 0.2} 0 0,1 ${w * 0.15},${h * 0.35} A${w * 0.2},${h * 0.2} 0 0,1 ${w * 0.4},${h * 0.2} A${w * 0.18},${h * 0.18} 0 0,1 ${w * 0.65},${h * 0.25} A${w * 0.18},${h * 0.18} 0 0,1 ${w * 0.85},${h * 0.4} A${w * 0.15},${h * 0.18} 0 0,1 ${w * 0.8},${h * 0.6} Z`;
    },
  },
  {
    id: 'leaf',
    name: 'Leaf',
    category: 'decorative',
    icon: '🍃',
    getPath: (w, h) => `M${w / 2},0 Q${w},0 ${w},${h / 2} Q${w},${h} ${w / 2},${h} Q0,${h} 0,${h / 2} Q0,0 ${w / 2},0 Z`,
  },
  {
    id: 'flower',
    name: 'Flower',
    category: 'decorative',
    icon: '✿',
    getPath: (w, h) => {
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2;
      const petals = 6;
      const pts: string[] = [];
      for (let i = 0; i < petals; i++) {
        const a1 = (2 * Math.PI * i) / petals - Math.PI / 2;
        const a2 = (2 * Math.PI * (i + 0.5)) / petals - Math.PI / 2;
        const ox = cx + r * Math.cos(a1);
        const oy = cy + r * Math.sin(a1);
        const mx = cx + r * 0.45 * Math.cos(a2);
        const my = cy + r * 0.45 * Math.sin(a2);
        if (i === 0) pts.push(`M${ox},${oy}`);
        pts.push(`Q${cx + r * 0.85 * Math.cos(a1 + Math.PI / petals)},${cy + r * 0.85 * Math.sin(a1 + Math.PI / petals)} ${mx},${my}`);
        const nextA = (2 * Math.PI * (i + 1)) / petals - Math.PI / 2;
        const nx = cx + r * Math.cos(nextA);
        const ny = cy + r * Math.sin(nextA);
        pts.push(`Q${cx + r * 0.85 * Math.cos(a2 + Math.PI / petals / 2)},${cy + r * 0.85 * Math.sin(a2 + Math.PI / petals / 2)} ${nx},${ny}`);
      }
      return pts.join(' ') + ' Z';
    },
  },
  {
    id: 'frame',
    name: 'Frame',
    category: 'decorative',
    icon: '⬜',
    getPath: (w, h) => {
      const b = Math.min(w, h) * 0.12;
      return `M0,0 L${w},0 L${w},${h} L0,${h} Z M${b},${b} L${b},${h - b} L${w - b},${h - b} L${w - b},${b} Z`;
    },
  },
  {
    id: 'ribbon',
    name: 'Ribbon',
    category: 'decorative',
    icon: '🎀',
    getPath: (w, h) => `M0,${h * 0.25} L${w * 0.1},0 L${w * 0.1},${h * 0.2} L${w * 0.9},${h * 0.2} L${w * 0.9},0 L${w},${h * 0.25} L${w * 0.9},${h * 0.5} L${w * 0.9},${h * 0.8} L${w * 0.1},${h * 0.8} L${w * 0.1},${h * 0.5} Z`,
  },
  {
    id: 'arrow',
    name: 'Arrow',
    category: 'decorative',
    icon: '➤',
    getPath: (w, h) => `M0,${h * 0.3} L${w * 0.6},${h * 0.3} L${w * 0.6},0 L${w},${h / 2} L${w * 0.6},${h} L${w * 0.6},${h * 0.7} L0,${h * 0.7} Z`,
  },
  {
    id: 'gear',
    name: 'Gear',
    category: 'decorative',
    icon: '⚙',
    getPath: (w, h) => {
      const cx = w / 2, cy = h / 2;
      const outerR = Math.min(w, h) / 2;
      const innerR = outerR * 0.7;
      const teeth = 10;
      const pts: string[] = [];
      for (let i = 0; i < teeth; i++) {
        const a1 = (2 * Math.PI * i) / teeth;
        const a2 = a1 + Math.PI / teeth * 0.4;
        const a3 = a1 + Math.PI / teeth * 0.6;
        const a4 = a1 + Math.PI / teeth;
        pts.push(
          `${i === 0 ? 'M' : 'L'}${cx + outerR * Math.cos(a1)},${cy + outerR * Math.sin(a1)}`,
          `L${cx + outerR * Math.cos(a2)},${cy + outerR * Math.sin(a2)}`,
          `L${cx + innerR * Math.cos(a3)},${cy + innerR * Math.sin(a3)}`,
          `L${cx + innerR * Math.cos(a4)},${cy + innerR * Math.sin(a4)}`
        );
      }
      return pts.join(' ') + ' Z';
    },
  },
  {
    id: 'cross',
    name: 'Cross',
    category: 'decorative',
    icon: '✚',
    getPath: (w, h) => {
      const t = 0.3;
      return `M${w * t},0 L${w * (1 - t)},0 L${w * (1 - t)},${h * t} L${w},${h * t} L${w},${h * (1 - t)} L${w * (1 - t)},${h * (1 - t)} L${w * (1 - t)},${h} L${w * t},${h} L${w * t},${h * (1 - t)} L0,${h * (1 - t)} L0,${h * t} L${w * t},${h * t} Z`;
    },
  },
  {
    id: 'crescent',
    name: 'Crescent',
    category: 'decorative',
    icon: '🌙',
    getPath: (w, h) => {
      const rx = w / 2, ry = h / 2;
      return `M${rx},0 A${rx},${ry} 0 1,1 ${rx},${h} A${rx * 0.6},${ry * 0.8} 0 1,0 ${rx},0 Z`;
    },
  },
  {
    id: 'lightning',
    name: 'Lightning',
    category: 'decorative',
    icon: '⚡',
    getPath: (w, h) =>
      `M${w * 0.55},0 L${w * 0.15},${h * 0.55} L${w * 0.45},${h * 0.55} L${w * 0.3},${h} L${w * 0.85},${h * 0.4} L${w * 0.55},${h * 0.4} L${w * 0.75},0 Z`,
  },
  {
    id: 'house',
    name: 'House',
    category: 'decorative',
    icon: '⌂',
    getPath: (w, h) =>
      `M0,${h * 0.4} L${w / 2},0 L${w},${h * 0.4} L${w},${h} L0,${h} Z`,
  },
  {
    id: 'tag',
    name: 'Tag',
    category: 'decorative',
    icon: '🏷',
    getPath: (w, h) =>
      `M0,${h * 0.2} L${w * 0.75},${h * 0.2} L${w},${h / 2} L${w * 0.75},${h * 0.8} L0,${h * 0.8} Z`,
  },
  {
    id: 'speech',
    name: 'Speech',
    category: 'decorative',
    icon: '💬',
    getPath: (w, h) =>
      `M0,0 L${w},0 L${w},${h * 0.7} L${w * 0.55},${h * 0.7} L${w * 0.4},${h} L${w * 0.4},${h * 0.7} L0,${h * 0.7} Z`,
  },
  {
    id: 'starburst',
    name: 'Starburst',
    category: 'decorative',
    icon: '✷',
    getPath: (w, h) => starPath(w / 2, h / 2, Math.min(w, h) / 2, Math.min(w, h) * 0.3, 12),
  },
  {
    id: 'plaque',
    name: 'Plaque',
    category: 'decorative',
    icon: '▭',
    getPath: (w, h) => {
      const r = Math.min(w, h) * 0.18;
      return `M${r},0 L${w - r},0 Q${w},0 ${w},${r} L${w},${h - r} Q${w},${h} ${w - r},${h} L${r},${h} Q0,${h} 0,${h - r} L0,${r} Q0,0 ${r},0 Z`;
    },
  },
  {
    id: 'bone',
    name: 'Bone',
    category: 'decorative',
    icon: '🦴',
    getPath: (w, h) => {
      const r = h * 0.25;
      return `M${r},${h / 2 - r} A${r},${r} 0 1,0 ${r},${h / 2 + r} L${w - r},${h / 2 + r} A${r},${r} 0 1,0 ${w - r},${h / 2 - r} Z`;
    },
  },
  {
    id: 'paw',
    name: 'Paw',
    category: 'decorative',
    icon: '🐾',
    getPath: (w, h) => {
      const cx = w / 2, cy = h * 0.65;
      const padR = Math.min(w, h) * 0.28;
      const toeR = Math.min(w, h) * 0.13;
      const pad = `M${cx},${cy - padR} A${padR},${padR * 0.85} 0 1,1 ${cx},${cy + padR} A${padR},${padR * 0.85} 0 1,1 ${cx},${cy - padR} Z`;
      const toe = (tx: number, ty: number) =>
        `M${tx},${ty - toeR} A${toeR},${toeR} 0 1,1 ${tx},${ty + toeR} A${toeR},${toeR} 0 1,1 ${tx},${ty - toeR} Z`;
      return [
        pad,
        toe(cx - padR * 0.95, cy - padR * 0.7),
        toe(cx - padR * 0.35, cy - padR * 1.2),
        toe(cx + padR * 0.35, cy - padR * 1.2),
        toe(cx + padR * 0.95, cy - padR * 0.7),
      ].join(' ');
    },
  },
  {
    id: 'hexnut',
    name: 'Hex Nut',
    category: 'decorative',
    icon: '⬢',
    getPath: (w, h) => {
      const outer = polygonPath(w / 2, h / 2, Math.min(w, h) / 2, 6);
      const r = Math.min(w, h) * 0.18;
      const cx = w / 2, cy = h / 2;
      const hole = `M${cx + r},${cy} A${r},${r} 0 1,1 ${cx - r},${cy} A${r},${r} 0 1,1 ${cx + r},${cy} Z`;
      return `${outer} ${hole}`;
    },
  },
  {
    id: 'keyhole',
    name: 'Keyhole',
    category: 'decorative',
    icon: '🔑',
    getPath: (w, h) => {
      const cx = w / 2, cy = h * 0.35, r = Math.min(w, h) * 0.22;
      return `M${cx - r * 0.4},${cy + r * 0.7} L${cx - r * 0.6},${h} L${cx + r * 0.6},${h} L${cx + r * 0.4},${cy + r * 0.7} A${r},${r} 0 1,0 ${cx - r * 0.4},${cy + r * 0.7} Z`;
    },
  },
  {
    id: 'medal',
    name: 'Medal',
    category: 'decorative',
    icon: '🏅',
    getPath: (w, h) => {
      const cx = w / 2, cy = h * 0.6, r = Math.min(w, h) * 0.38;
      const ribbon = `M${cx - r * 0.6},0 L${cx - r * 0.2},${cy} L${cx + r * 0.2},${cy} L${cx + r * 0.6},0 Z`;
      const circle = `M${cx},${cy - r} A${r},${r} 0 1,1 ${cx},${cy + r} A${r},${r} 0 1,1 ${cx},${cy - r} Z`;
      return `${ribbon} ${circle}`;
    },
  },
  {
    id: 'wave',
    name: 'Wave',
    category: 'decorative',
    icon: '〜',
    getPath: (w, h) =>
      `M0,${h * 0.2} Q${w * 0.25},0 ${w * 0.5},${h * 0.2} T${w},${h * 0.2} L${w},${h * 0.8} Q${w * 0.75},${h} ${w * 0.5},${h * 0.8} T0,${h * 0.8} Z`,
  },
];

export const getShapeById = (id: string) => shapeDefinitions.find(s => s.id === id);
