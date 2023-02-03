import { Injectable } from '@angular/core';
import { IColorDictionary, removeColorTransparency, getUniqueColors, replaceLeastUsedColors, addOutline } from '../core/image-editor/canvas.functions';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  canvasColors: IColorDictionary = {};

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
    let colorBuffer = new Uint8Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data.buffer);
    colorBuffer = removeColorTransparency(colorBuffer);
    let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    imageData.data.set(colorBuffer);
    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * get unique colors in the canvas
   * @param ctx CanvasRenderingContext2D
   * @returns array of color objects
   */
  getUniqueColors(ctx: CanvasRenderingContext2D): IColorDictionary {
    return getUniqueColors(new Uint8Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data.buffer));
  }

  /**
   * replace the least used color with the closest color in the color dictionary
   * @param colorsToReplace number color number of colors to be replaced
   * @param canvasColors IColorDictionary current color dictionary
   * @param colorBuffer Uint8Array color buffer
   * @return object containing the color dictionary and the color buffer
   */
  replaceLeastUsedColors(colorsToReplace: number, canvasColors: IColorDictionary, colorBuffer: Uint8Array): { canvasColors: IColorDictionary, colorBuffer: Uint8Array } {
    return replaceLeastUsedColors(colorsToReplace, canvasColors, colorBuffer);
  }

  /**
   * adds an outline over fully transparent pixels around colored pixels
   * @param colorBuffer Uint8Array color buffer
   * @param imageWidth number imageWidth in pixels
   * @param outlineWidth number outline width in pixels
   * @param outlineColor number[] array of 4 numbers (r,g,b,a) between 0 and 255 representing the desired outline color
   * @returns Uint8Array colorBuffer
   */
  addOutline(colorBuffer: Uint8Array, imageWidth: number, outlineWidth: number, outlineColor: number[]): Uint8Array {
    return addOutline(colorBuffer, imageWidth, outlineWidth, outlineColor);
  }
}
