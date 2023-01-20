import { Injectable } from '@angular/core';

export interface color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface canvasColor {
  color: color;
  pixelCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  canvasColors: canvasColor[] = [];

  constructor() { }

  /**
   * draws image into canvas ctx
   * @param ctx CanvasRenderingContext2D
   * @param image HTMLCanvasElement | HTMLVideoElement | HTMLOrSVGImageElement | ImageBitmap | OffscreenCanvas
   * @param dx number destination topLeftX
   * @param dy number destination topLeftY
   */
  drawImage(ctx: CanvasRenderingContext2D, image: CanvasImageSource, dx: number, dy: number): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, dx, dy);
  }

  /**
   * pixelate canvas
   * @param ctx CanvasRenderingContext2D
   * @param pixels number by which the dimensions will be divided
   */
  pixelate(ctx: CanvasRenderingContext2D, pixels: number): void {
    let sWidth = ctx.canvas.width / pixels;                       // source width
    let sHeight = ctx.canvas.height / pixels;                     // source height
    let sCtx = document.createElement('canvas').getContext('2d'); // source ctx
    if(!sCtx || sWidth < 1 || sHeight < 1) {
      console.log('pixelate: could not create source canvas');
      return;
    }
    sCtx.canvas.width = sWidth;
    sCtx.canvas.height = sHeight;
    sCtx.clearRect(0, 0, sWidth, sHeight);
    sCtx.imageSmoothingEnabled = false;
    sCtx.drawImage(ctx.canvas, 0, 0, sWidth, sHeight);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sCtx.canvas, 0, 0, sWidth, sHeight, 0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  /**
   * set non opaque colors to fully transparent
   * @param ctx CanvasRenderingContext2D
   */
  removeColorTransparency(ctx: CanvasRenderingContext2D): void {
    let colorBuffer = new Uint8ClampedArray(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data.buffer);
    for(let i = 0; i < colorBuffer.length; i += 4) {
      if(colorBuffer[i + 3] < 255) {
        colorBuffer[i] = 0;
        colorBuffer[i + 1] = 0;
        colorBuffer[i + 2] = 0;
        colorBuffer[i + 3] = 0;
      }
    }
    let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    imageData.data.set(colorBuffer);
    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * get unique colors in the canvas
   * @param ctx CanvasRenderingContext2D
   * @returns array of color objects
   */
  getUniqueColors(ctx: CanvasRenderingContext2D): canvasColor[] {
    console.log('get unique colors');
    this.canvasColors = [];
    let colorBuffer = new Uint8Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data.buffer);
    for(let i = 0; i < colorBuffer.length; i += 4) {
      let canvasColor: canvasColor = {
        color: { r: colorBuffer[i], g: colorBuffer[i + 1], b: colorBuffer[i + 2], a: colorBuffer[i + 3] },
        pixelCount: 1
      };
      if(!this.alreadyInCanvasColors(canvasColor)) {
        this.canvasColors.push(canvasColor);
      } else {
        let colorIndex = this.canvasColors.findIndex(
          (arrayColor) =>
          arrayColor.color.r === canvasColor.color.r
          && arrayColor.color.g === canvasColor.color.g
          && arrayColor.color.b === canvasColor.color.b
          && arrayColor.color.a === canvasColor.color.a
        );
        this.canvasColors[colorIndex].pixelCount += 1;
      }
    }
    console.log(this.canvasColors);
    return this.canvasColors;
  }

  /**
   * check if color is in canvasColor variable
   * @param color color
   * @param array color array
   * @returns true if color is in array, false if not
   */
  private alreadyInCanvasColors(canvasColor: canvasColor): boolean {
    for(let arrayColor of this.canvasColors) {
      if(canvasColor.color.r === arrayColor.color.r && canvasColor.color.g === arrayColor.color.g && canvasColor.color.b === arrayColor.color.b && canvasColor.color.a === arrayColor.color.a) {
        return true;
      }
    }
    return false;
  }

  test(value: number): number {
    return value * value;
  }
}
