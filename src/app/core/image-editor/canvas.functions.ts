export interface IColorDictionary {
  [key: string]: number;
}


/**
 * set non opaque colors to fully transparent
 * @param colorBuffer Uint8Array
 */
export function removeColorTransparency(colorBuffer: Uint8Array): Uint8Array {
  for (let i = 0; i < colorBuffer.length; i += 4) {
    if (colorBuffer[i + 3] < 255) {
      colorBuffer[i] = 0;
      colorBuffer[i + 1] = 0;
      colorBuffer[i + 2] = 0;
      colorBuffer[i + 3] = 0;
    }
  }
  return colorBuffer;
}

/**
 * get unique colors in the canvas
 * @param ctx CanvasRenderingContext2D
 * @returns array of color objects
 */
export function getUniqueColors(colorBuffer: Uint8Array): IColorDictionary {
  let canvasColors: IColorDictionary = {};
  for (let i = 0; i < colorBuffer.length; i += 4) {
    let rgba = `${colorBuffer[i]},${colorBuffer[i + 1]},${colorBuffer[i + 2]},${colorBuffer[i + 3]}`;
    if (rgba in canvasColors) {
      canvasColors[rgba] += 1;
    } else {
      canvasColors[rgba] = 1;
    }
  }
  return canvasColors;
}

/**
 * replace the least used color with the closest color in the color dictionary
 * @param colorsToReplace number color number of colors to be replaced
 * @param canvasColors IColorDictionary current color dictionary
 * @param colorBuffer Uint8Array color buffer
 * @return object containing the color dictionary and the color buffer
 */
export function replaceLeastUsedColors(colorsToReplace: number, canvasColors: IColorDictionary, colorBuffer: Uint8Array): { canvasColors: IColorDictionary, colorBuffer: Uint8Array } {
  for(colorsToReplace; colorsToReplace > 0; colorsToReplace--) {
    // find the least used color
    let uses = canvasColors[Object.keys(canvasColors)[0]];
    let leastUsedColor = '';
    Object.keys(canvasColors).forEach(color => {
      if (canvasColors[color] < uses) {
        uses = canvasColors[color];
        leastUsedColor = color;
      }
    });
    // search the closest color to the least used color
    let closestColor = '';
    let distance = Math.sqrt(3 * Math.pow(255, 2)); // max euclidian distance between colors
    let rgba = leastUsedColor.split(',');
    Object.keys(canvasColors).forEach(color => {
      let _rgba = color.split(',');
      let _distance = Math.sqrt(
        Math.pow(parseInt(rgba[0]) - parseInt(_rgba[0]), 2) +
        Math.pow(parseInt(rgba[1]) - parseInt(_rgba[1]), 2) +
        Math.pow(parseInt(rgba[2]) - parseInt(_rgba[2]), 2)
      );
      if (_distance < distance) {
        distance = _distance;
        rgba = _rgba;
        closestColor = color;
      }
    });
    // replace the least used color by the closest color in the array buffer
    let oldRgba = leastUsedColor.split(',');
    for (let i = 0; i < colorBuffer.length; i += 4) {
      if (colorBuffer[i] === parseInt(oldRgba[0])
        && colorBuffer[i + 1] === parseInt(oldRgba[1])
        && colorBuffer[i + 2] === parseInt(oldRgba[2])
        && colorBuffer[i + 3] === parseInt(oldRgba[3])) {
        colorBuffer[i] = parseInt(rgba[0]);
        colorBuffer[i + 1] = parseInt(rgba[1]);
        colorBuffer[i + 2] = parseInt(rgba[2]);
        colorBuffer[i + 3] = parseInt(rgba[3]);
      }
    }
    // increase count of the new color
    canvasColors[closestColor] += canvasColors[leastUsedColor];
    // remove least used color from color dictionary
    delete canvasColors[leastUsedColor];
  }

  return { canvasColors: canvasColors, colorBuffer: colorBuffer };
}

/**
 * adds an outline over fully transparent pixels around colored pixels
 * @param colorBuffer Uint8Array color buffer
 * @param imageWidth number imageWidth in pixels
 * @param outlineWidth number outline width in pixels
 * @param outlineColor number[] array of 4 numbers (r,g,b,a) between 0 and 255 representing the desired outline color
 * @returns Uint8Array colorBuffer
 */
export function addOutline(colorBuffer: Uint8Array, imageWidth: number, outlineWidth: number, outlineColor: number[]): Uint8Array {
  for(outlineWidth; outlineWidth > 0; outlineWidth--) {
    let _colorBuffer = structuredClone(colorBuffer);
    for (let i = 0; i < colorBuffer.length; i += 4) {
      if(_colorBuffer[i + 3] !== 0) {
        let topLeft = i - 4 * (imageWidth - 1);
        if(topLeft > 0 && _colorBuffer[topLeft + 3] === 0) {
          colorBuffer[topLeft] = outlineColor[0];
          colorBuffer[topLeft + 1] = outlineColor[1];
          colorBuffer[topLeft + 2] = outlineColor[2];
          colorBuffer[topLeft + 3] = outlineColor[3];
        }

        let top = i - 4 * (imageWidth);
        if(top > 0 && _colorBuffer[top + 3] === 0) {
          colorBuffer[top] = outlineColor[0];
          colorBuffer[top + 1] = outlineColor[1];
          colorBuffer[top + 2] = outlineColor[2];
          colorBuffer[top + 3] = outlineColor[3];
        }

        let topRight = i - 4 * (imageWidth + 1);
        if(topRight > 0 && _colorBuffer[topRight + 3] === 0) {
          colorBuffer[topRight] = outlineColor[0];
          colorBuffer[topRight + 1] = outlineColor[1];
          colorBuffer[topRight + 2] = outlineColor[2];
          colorBuffer[topRight + 3] = outlineColor[3];
        }

        let centerLeft = i - 4;
        if(centerLeft > 0 && _colorBuffer[centerLeft + 3] === 0) {
          colorBuffer[centerLeft] = outlineColor[0];
          colorBuffer[centerLeft + 1] = outlineColor[1];
          colorBuffer[centerLeft + 2] = outlineColor[2];
          colorBuffer[centerLeft + 3] = outlineColor[3];
        }

        let centerRight = i + 4;
        if(centerRight < colorBuffer.length && _colorBuffer[centerRight + 3] === 0) {
          colorBuffer[centerRight] = outlineColor[0];
          colorBuffer[centerRight + 1] = outlineColor[1];
          colorBuffer[centerRight + 2] = outlineColor[2];
          colorBuffer[centerRight + 3] = outlineColor[3];
        }

        let bottomLeft = i + 4 * (imageWidth - 1);
        if(bottomLeft < colorBuffer.length && _colorBuffer[bottomLeft + 3] === 0) {
          colorBuffer[bottomLeft] = outlineColor[0];
          colorBuffer[bottomLeft + 1] = outlineColor[1];
          colorBuffer[bottomLeft + 2] = outlineColor[2];
          colorBuffer[bottomLeft + 3] = outlineColor[3];
        }

        let bottom = i + 4 * (imageWidth);
        if(bottom < colorBuffer.length && _colorBuffer[bottom + 3] === 0) {
          colorBuffer[bottom] = outlineColor[0];
          colorBuffer[bottom + 1] = outlineColor[1];
          colorBuffer[bottom + 2] = outlineColor[2];
          colorBuffer[bottom + 3] = outlineColor[3];
        }

        let bottomRight = i + 4 * (imageWidth + 1);
        if(bottomRight < colorBuffer.length && _colorBuffer[bottomRight + 3] === 0) {
          colorBuffer[bottomRight] = outlineColor[0];
          colorBuffer[bottomRight + 1] = outlineColor[1];
          colorBuffer[bottomRight + 2] = outlineColor[2];
          colorBuffer[bottomRight + 3] = outlineColor[3];
        }
      }
    }
  }
  return colorBuffer;
}
