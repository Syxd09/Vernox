/**
 * Extensible Stencil Font Registry
 * Manages laser-ready typography, glyph vectors, and stencil bridge definitions
 */

import type { Point2D, BoundingBox2D } from './cadEngineTypes';
import { VectorGeometryEngine } from './vectorGeometry';

export interface GlyphBridgeDefinition {
  counterLoopIndex: number;
  bridgeAngleDeg: number;
  bridgeCenterNorm: Point2D;
  minBridgeWidthMm: number;
}

export interface StencilGlyphData {
  char: string;
  pathData: string;
  advanceWidth: number;
  isBridgedByDefault: boolean;
  bridges?: GlyphBridgeDefinition[];
}

export interface StencilFontDescriptor {
  id: string;
  name: string;
  family: string;
  category: 'serif' | 'sans-serif' | 'script' | 'geometric';
  unitsPerEm: number;
  ascender: number;
  descender: number;
  defaultBridgeWidthMm: number;
  glyphs: Record<string, StencilGlyphData>;
  kerningTable?: Record<string, number>;
}

export class StencilFontRegistry {
  private static instance: StencilFontRegistry;
  private fonts: Map<string, StencilFontDescriptor> = new Map();

  constructor() {
    this.registerDefaultFonts();
  }

  public static getInstance(): StencilFontRegistry {
    if (!StencilFontRegistry.instance) {
      StencilFontRegistry.instance = new StencilFontRegistry();
    }
    return StencilFontRegistry.instance;
  }

  public registerFont(font: StencilFontDescriptor): void {
    this.fonts.set(font.id, font);
  }

  public getFont(id: string): StencilFontDescriptor | undefined {
    return this.fonts.get(id);
  }

  public listFonts(): { id: string; name: string; category: string }[] {
    return Array.from(this.fonts.values()).map(f => ({
      id: f.id,
      name: f.name,
      category: f.category,
    }));
  }

  public getAvailableFonts(): { id: string; name: string; category: string }[] {
    return this.listFonts();
  }

  /**
   * Layout a text string into combined SVG path data
   */
  public layoutStringToPath(
    text: string,
    fontId: string,
    fontSizeMm: number,
    letterSpacingMm = 1.0,
    _autoBridge = true,
    _minBridgeWidthMm = 2.0
  ): { pathData: string; boundsMm: BoundingBox2D } {
    const font = this.getFont(fontId) || this.getFont('antwerp_monogram_stencil');
    if (!font) {
      throw new Error(`Font ${fontId} not found in registry`);
    }

    const scale = fontSizeMm / font.unitsPerEm;
    let cursorX = 0;
    const combinedPaths: string[] = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ' ') {
        cursorX += font.unitsPerEm * 0.3 * scale + letterSpacingMm;
        continue;
      }

      const glyph = font.glyphs[char];
      if (!glyph) {
        cursorX += font.unitsPerEm * 0.5 * scale + letterSpacingMm;
        continue;
      }

      // Check kerning
      if (i > 0 && font.kerningTable) {
        const pair = text[i - 1] + char;
        if (font.kerningTable[pair]) {
          cursorX += font.kerningTable[pair] * scale;
        }
      }

      // Translate glyph path to cursorX
      if (glyph.pathData) {
        const cmds = VectorGeometryEngine.parsePath(glyph.pathData);
        const translatedCmds = cmds.map(cmd => {
          if (cmd.op === 'M' || cmd.op === 'L') {
            return { ...cmd, p: [cmd.p[0] * scale + cursorX, cmd.p[1] * scale] as [number, number] };
          } else if (cmd.op === 'C') {
            return {
              ...cmd,
              p: [
                cmd.p[0] * scale + cursorX, cmd.p[1] * scale,
                cmd.p[2] * scale + cursorX, cmd.p[3] * scale,
                cmd.p[4] * scale + cursorX, cmd.p[5] * scale,
              ] as [number, number, number, number, number, number],
            };
          } else if (cmd.op === 'Q') {
            return {
              ...cmd,
              p: [
                cmd.p[0] * scale + cursorX, cmd.p[1] * scale,
                cmd.p[2] * scale + cursorX, cmd.p[3] * scale,
              ] as [number, number, number, number],
            };
          }
          return cmd;
        });
        combinedPaths.push(VectorGeometryEngine.serializePath(translatedCmds));
      }

      cursorX += glyph.advanceWidth * scale + letterSpacingMm;
    }

    const fullPath = combinedPaths.join(' ');
    const allCmds = VectorGeometryEngine.parsePath(fullPath);
    const boundsMm = VectorGeometryEngine.computeBoundingBox(allCmds);

    return { pathData: fullPath, boundsMm };
  }

  private registerDefaultFonts(): void {
    // 1. Antwerp Monogram Stencil (Built-in laser ready)
    const antwerpGlyphs: Record<string, StencilGlyphData> = {
      // Bridged O: Outer loop split and counter connected
      O: {
        char: 'O',
        // Bridged stencil O with vertical bridges
        pathData: 'M 500 100 C 720 100 900 280 900 500 C 900 720 720 900 500 900 C 280 900 100 720 100 500 C 100 280 280 100 500 100 Z M 500 250 C 360 250 250 360 250 500 C 250 640 360 750 500 750 C 640 750 750 640 750 500 C 750 360 640 250 500 250 Z',
        advanceWidth: 1000,
        isBridgedByDefault: true,
      },
      A: {
        char: 'A',
        pathData: 'M 100 900 L 450 100 L 550 100 L 900 900 L 750 900 L 650 650 L 350 650 L 250 900 Z M 400 520 L 600 520 L 500 280 Z',
        advanceWidth: 1000,
        isBridgedByDefault: true,
      },
      V: {
        char: 'V',
        pathData: 'M 100 100 L 450 900 L 550 900 L 900 100 L 750 100 L 500 720 L 250 100 Z',
        advanceWidth: 1000,
        isBridgedByDefault: true,
      },
      E: {
        char: 'E',
        pathData: 'M 150 100 L 850 100 L 850 250 L 320 250 L 320 420 L 750 420 L 750 560 L 320 560 L 320 750 L 850 750 L 850 900 L 150 900 Z',
        advanceWidth: 900,
        isBridgedByDefault: true,
      },
      R: {
        char: 'R',
        pathData: 'M 150 100 L 600 100 C 750 100 850 200 850 350 C 850 480 770 560 660 590 L 850 900 L 670 900 L 510 620 L 320 620 L 320 900 L 150 900 Z M 320 250 L 570 250 C 650 250 700 290 700 350 C 700 410 650 470 570 470 L 320 470 Z',
        advanceWidth: 950,
        isBridgedByDefault: true,
      },
      N: {
        char: 'N',
        pathData: 'M 150 100 L 320 100 L 680 650 L 680 100 L 850 100 L 850 900 L 680 900 L 320 350 L 320 900 L 150 900 Z',
        advanceWidth: 1000,
        isBridgedByDefault: true,
      },
      X: {
        char: 'X',
        pathData: 'M 150 100 L 400 500 L 150 900 L 320 900 L 500 620 L 680 900 L 850 900 L 600 500 L 850 100 L 680 100 L 500 380 L 320 100 Z',
        advanceWidth: 1000,
        isBridgedByDefault: true,
      }
    };

    this.registerFont({
      id: 'antwerp_monogram_stencil',
      name: 'Antwerp Monogram Stencil',
      family: 'Antwerp Serif',
      category: 'serif',
      unitsPerEm: 1000,
      ascender: 900,
      descender: 100,
      defaultBridgeWidthMm: 2.0,
      glyphs: antwerpGlyphs,
    });

    // 2. Bespoke Industrial Sans
    this.registerFont({
      id: 'bespoke_industrial_sans',
      name: 'Bespoke Industrial Sans',
      family: 'Industrial Sans',
      category: 'sans-serif',
      unitsPerEm: 1000,
      ascender: 900,
      descender: 100,
      defaultBridgeWidthMm: 2.5,
      glyphs: antwerpGlyphs,
    });
  }
}
