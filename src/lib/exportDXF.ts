// Simple DXF export for laser cutting / CNC workflows
// Generates DXF R12 format with LINE and ARC entities from SVG path data

export function exportAsDXF(shapePath: string, shapeWidth: number, shapeHeight: number): string {
  const lines: string[] = [];

  // Header
  lines.push('0', 'SECTION', '2', 'HEADER');
  lines.push('9', '$ACADVER', '1', 'AC1009'); // R12
  lines.push('9', '$INSUNITS', '70', '4'); // mm
  lines.push('9', '$EXTMIN', '10', '0.0', '20', '0.0', '30', '0.0');
  lines.push('9', '$EXTMAX', '10', String(shapeWidth), '20', String(shapeHeight), '30', '0.0');
  lines.push('0', 'ENDSEC');

  // Tables
  lines.push('0', 'SECTION', '2', 'TABLES');
  lines.push('0', 'TABLE', '2', 'LAYER');
  lines.push('70', '1');
  lines.push('0', 'LAYER', '2', 'CUT', '70', '0', '62', '7', '6', 'CONTINUOUS');
  lines.push('0', 'ENDTAB');
  lines.push('0', 'ENDSEC');

  // Entities
  lines.push('0', 'SECTION', '2', 'ENTITIES');

  const points = svgPathToPoints(shapePath, shapeWidth, shapeHeight);
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    lines.push(
      '0', 'LINE',
      '8', 'CUT',
      '10', x1.toFixed(4),
      '20', (shapeHeight - y1).toFixed(4), // Flip Y for DXF
      '30', '0.0',
      '11', x2.toFixed(4),
      '21', (shapeHeight - y2).toFixed(4),
      '31', '0.0'
    );
  }

  lines.push('0', 'ENDSEC');
  lines.push('0', 'EOF');

  return lines.join('\n');
}

function svgPathToPoints(pathData: string, _w: number, _h: number): [number, number][] {
  const points: [number, number][] = [];
  const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
  let x = 0, y = 0;
  let startX = 0, startY = 0;

  for (const cmd of commands) {
    const type = cmd[0];
    const args = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

    switch (type.toUpperCase()) {
      case 'M':
        x = args[0]; y = args[1];
        startX = x; startY = y;
        points.push([x, y]);
        break;
      case 'L':
        x = args[0]; y = args[1];
        points.push([x, y]);
        break;
      case 'H':
        x = args[0];
        points.push([x, y]);
        break;
      case 'V':
        y = args[0];
        points.push([x, y]);
        break;
      case 'C': {
        // Approximate cubic bezier with line segments
        const [x1, y1, x2, y2, ex, ey] = args;
        const sx = x, sy = y;
        const segs = 16;
        for (let i = 1; i <= segs; i++) {
          const t = i / segs;
          const mt = 1 - t;
          const px = mt * mt * mt * sx + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * ex;
          const py = mt * mt * mt * sy + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * ey;
          points.push([px, py]);
        }
        x = ex; y = ey;
        break;
      }
      case 'Q': {
        const [qx1, qy1, qex, qey] = args;
        const sqx = x, sqy = y;
        const qsegs = 12;
        for (let i = 1; i <= qsegs; i++) {
          const t = i / qsegs;
          const mt = 1 - t;
          const px = mt * mt * sqx + 2 * mt * t * qx1 + t * t * qex;
          const py = mt * mt * sqy + 2 * mt * t * qy1 + t * t * qey;
          points.push([px, py]);
        }
        x = qex; y = qey;
        break;
      }
      case 'A': {
        // Approximate arc with line segments
        const [, , , , , ax2, ay2] = args;
        const segs = 24;
        for (let i = 1; i <= segs; i++) {
          const t = i / segs;
          const angle = Math.PI * t;
          const mx = x + (ax2 - x) * t;
          const my = y + (ay2 - y) * t;
          const bulge = Math.sin(angle) * Math.min(Math.abs(ax2 - x), Math.abs(ay2 - y)) * 0.5;
          const dx = -(ay2 - y);
          const dy = ax2 - x;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          points.push([mx + (dx / len) * bulge, my + (dy / len) * bulge]);
        }
        x = ax2; y = ay2;
        break;
      }
      case 'Z':
        if (points.length > 0 && (x !== startX || y !== startY)) {
          points.push([startX, startY]);
        }
        x = startX; y = startY;
        break;
    }
  }

  return points;
}
