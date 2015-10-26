import String from 'color-string';

/*** Helper methods ***/
function number(n) {
  if (typeof (n) === 'number') {
    return n;
  } else {
    return NaN;
  }
}

function clamp(val) {
  return Math.min(1, Math.max(0, val));
}

/**
 * ColorOps provides a LESS-inspired API for mutating colors.
 * Suitable for stylesheet use. All operations are immutable and return
 * CSS-compatible strings (rgba())
 *
 * Inspiration:
 * https://github.com/mapbox/color-ops/
 * https://github.com/less/less.js/blob/master/dist/less.js
 * https://github.com/harthur/color/blob/master/index.js
 *
 * Author @agresvig
 *
 */
export default class ColorOps {

  constructor(color) {
    // parse constructor argument
    // see https://www.npmjs.com/package/color-string
    if (typeof color === 'string') {
      let vals = String.getRgba(color) ||
          String.getHsla(color) ||
          String.getRgb(color);

      if (!vals) {
        console.error('Unable to parse color from string \"' + color + '\"');
      }
      this.values = vals;
      this.hslObj = ColorOps.toHSL(vals);
    }
    else if (typeof color === 'object') {
      if (typeof color.h !== 'undefined' &&
        typeof color.s !== 'undefined' &&
        typeof color.l !== 'undefined') {
        this.values = ColorOps.hslaToRgb(color);
        this.hslObj = color;
      } else {
        console.error('Unable to parse color from object', JSON.stringify(color));
      }
    }
    else {
      console.error('Constructor argument must be String or Object', color);
    }
  }

  /***************************
   * Accessor Methods
   ***************************/

  /*
   * Get the hue component of a color
   *
   * @returns {Number} hue
   */
  hue() {
    return Math.round(this.hslObj.h);
  }

  /*
   * Get the saturation component of a color as a string
   * representing percentage
   *
   * @returns {String} saturation
   */
  saturation() {
    return Math.round(this.hslObj.s * 100) + '%';
  }

  /*
   * Get the lightness component of a color as a string
   * representing percentage
   *
   * @returns {String} lightness
   */
  lightness() {
    return Math.round(this.hslObj.l * 100) + '%';
  }

  /*
   * Return true if the lightness value of this color is greater than 55%.
   * Note that alpha is ignored for this calculation
   */
  isLight() {
    return this.hslObj.l > 0.70;
  }

  /*
   * Get the alpha component of a color
   *
   * @returns {Number} alpha
   */
  alpha() {
    return this.hslObj.a;
  }

  /***************************
   * Manipulation methods
   ***************************/

  /*
   * Saturate a color by a given amount
   *
   * @param {Number} amount
   * @returns CSS-compatible color string
   */
  saturate(amount, chainable) {
    var hsl = ColorOps.toHSL(this.values);

    hsl.s += amount / 100;
    hsl.s = clamp(hsl.s);
    return chainable ? new ColorOps(hsl) : ColorOps.toRgbaString(hsl);
  }

  /*
   * Deaturate a color by a given amount
   *
   * @param {Number} amount
   * @returns CSS-compatible color string
   */
  desaturate(amount, chainable) {
    var hsl = ColorOps.toHSL(this.values);

    hsl.s -= amount / 100;
    hsl.s = clamp(hsl.s);
    return chainable ? new ColorOps(hsl) : ColorOps.toRgbaString(hsl);
  }

  /*
   * Lighten a color by a given amount
   *
   * @param {Number} amount
   * @returns CSS-compatible color string
   */
  lighten(amount, chainable) {
    var hsl = ColorOps.toHSL(this.values);

    hsl.l += amount / 100;
    hsl.l = clamp(hsl.l);
    return chainable ? new ColorOps(hsl) : ColorOps.toRgbaString(hsl);
  }

  /*
   * Darken a color by a given amount
   *
   * @param {Number} amount
   * @returns CSS-compatible color string
   */
  darken(amount, chainable) {
    var hsl = ColorOps.toHSL(this.values);

    hsl.l -= amount / 100;
    hsl.l = clamp(hsl.l);
    return chainable ? new ColorOps(hsl) : ColorOps.toRgbaString(hsl);
  }

  /*
   * Decrease the transparency (or increase the opacity) of a color, making it
   * more opaque.
   *
   * @param {Number} amount
   * @returns CSS-compatible color string
   */
  fadein(amount, chainable) {
    var hsl = ColorOps.toHSL(this.values);

    hsl.a += amount / 100;
    hsl.a = clamp(hsl.a);
    return chainable ? new ColorOps(hsl) : ColorOps.toRgbaString(hsl);
  }

  /*
   * Increase the transparency (or decrease the opacity) of a color, making it
   * less opaque. To fade in the other direction use `fadein`.
   *
   * @param {Number} amount
   * @returns CSS-compatible color string
   */
  fadeout(amount, chainable) {
    var hsl = ColorOps.toHSL(this.values);

    hsl.a -= amount / 100;
    hsl.a = clamp(hsl.a);
    return chainable ? new ColorOps(hsl) : ColorOps.toRgbaString(hsl);
  }

  /*
   * Set the absolute transparency of a color. Can be applied to colors whether
   * they already have an opacity value or not.
   *
   * @param {Number} amount
   * @returns CSS-compatible color string
   */
  fade(amount, chainable) {
    var hsl = ColorOps.toHSL(this.values);

    hsl.a = amount / 100;
    hsl.a = clamp(hsl.a);
    return chainable ? new ColorOps(hsl) : ColorOps.toRgbaString(hsl);
  }

  /*
   * Rotate the hue angle of a color in either direction.
   *
   * @param {Number} amount
   * @returns CSS-compatible color string
   */
  spin(amount, chainable) {
    var hsl = ColorOps.toHSL(this.values);
    var hue = (hsl.h + amount) % 360;

    hsl.h = hue < 0 ? 360 + hue : hue;
    return chainable ? new ColorOps(hsl) : ColorOps.toRgbaString(hsl);
  }

  /*
   * Remove all saturation from a color in the HSL color space; the same as
   * calling `desaturate(100)`
   *
   * @returns CSS-compatible color string
   */
  greyscale() {
    var hsl = ColorOps.toHSL(this.values);

    hsl.s = 0;
    return ColorOps.toRgbaString(hsl);
  }

  /*
   * Returns css-compatible string representation of the color
   * Format: 'rgba(r, g, b, a)'
   *
   * @returns {String} CSS-compatible color string
   */
  toString() {
    return ColorOps.toRgbaString(this.hslObj);
  }


  toHexString() {
    return ColorOps.hex(this.hslObj);
  }

  /**
   * Convert color values to HSL object
   * @param {Array} color
   * @returns {Object} hsla ({h, s, l, a})
   */
  static toHSL(color) {
    var r = color[0] / 255,
      g = color[1] / 255,
      b = color[2] / 255,
      a = color[3];

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2, d = max - min;

    if (max === min) {
      h = s = 0;
    } else {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s, l: l, a: a };
  }

  /*
   * r,g,b -> [r, g, b, 1]
   */
  static rgb(r, g, b) {
    return this.rgba(r, g, b, 1.0);
  }

  /*
   * r,g,b, a -> [r, g, b, a]
   */
  static rgba(r, g, b, a) {
    // Check values are valid numbers
    var rgb = [r, g, b].map(function (c) { return number(c); });
    a = number(a);
    if (rgb.some(isNaN) || isNaN(a)) {
      return null;
    }
    rgb.push(a);
    return rgb;
  }

  /*
   * {h, s, l, a} -> [r, g, b, a]
   */
  static hslaToRgb(hslObj) {
    let h = (number(hslObj.h) % 360) / 360;
    let s = number(hslObj.s);
    let l = number(hslObj.l);
    let a = number(hslObj.a);

    if ([h, s, l, a].some(isNaN)) {
      return null;
    }
    var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s,
      m1 = l * 2 - m2;

    function hue(hVal) {
      hVal = hVal < 0 ? hVal + 1 : (hVal > 1 ? hVal - 1 : hVal);
      if (hVal * 6 < 1) {
        return m1 + (m2 - m1) * hVal * 6;
      } else if (hVal * 2 < 1) {
        return m2;
      } else if (hVal * 3 < 2) {
        return m1 + (m2 - m1) * (2 / 3 - hVal) * 6;
      } else {
        return m1;
      }
    }

    return this.rgba(
      Math.round(hue(h + 1 / 3) * 255),
      Math.round(hue(h) * 255),
      Math.round(hue(h - 1 / 3) * 255),
      a
    );
  }

  /*
   * {h, s, l, a} -> 'rgba(r, g, b, a)'
   */
  static toRgbaString(hslObj) {
    let rgba = ColorOps.hslaToRgb(hslObj);
    return String.rgbString(rgba);
  }

  /*
   * {h, s, l, a} -> '#XXXXXX'
   */
  static hex(hslObj) {
    let rgba = ColorOps.hslaToRgb(hslObj);
    return String.hexString(rgba);
  }
}
