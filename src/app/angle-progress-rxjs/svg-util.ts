// Converted this to TS & added improved interfaces + variable names
// https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle

export interface SvgArc {
  d: string;
  innerStart: ArcPoint;
  innerEnd: ArcPoint;
  outerStart: ArcPoint;
  outerEnd: ArcPoint;
  radius: number;
  largeArcFlag: string;
}

export interface ArcPoint {
  x: number;
  y: number;
}

export function createSvgArc(
  x: number,
  y: number,
  radius: number,
  spread: number,
  startAngle: number,
  endAngle: number
): SvgArc {
  var innerStart = polarToCartesian(x, y, radius, endAngle);
  var innerEnd = polarToCartesian(x, y, radius, startAngle);
  var outerStart = polarToCartesian(x, y, radius + spread, endAngle);
  var outerEnd = polarToCartesian(x, y, radius + spread, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  var d = [
    'M',
    outerStart.x,
    outerStart.y,
    'A',
    radius + spread,
    radius + spread,
    0,
    largeArcFlag,
    0,
    outerEnd.x,
    outerEnd.y,
    'L',
    innerEnd.x,
    innerEnd.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    1,
    innerStart.x,
    innerStart.y,
    'L',
    outerStart.x,
    outerStart.y,
    'Z'
  ].join(' ');

  return {
    d,
    innerStart,
    innerEnd,
    outerStart,
    outerEnd,
    radius,
    largeArcFlag
  };
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}
