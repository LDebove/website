import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { removeColorTransparency, getUniqueColors, replaceLeastUsedColors, addOutline } from './editor.functions';
import { IColorDictionary } from './editor.model';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private working = new Subject<boolean>();

  constructor() {
    this.working.next(false);
  }

  isWorking(): Observable<boolean> {
    return this.working.asObservable();
  }

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
   * uses web workers
   * @param ctx CanvasRenderingContext2D
   */
  removeColorTransparency(ctx: CanvasRenderingContext2D, backupCtx: CanvasRenderingContext2D): void {
    this.working.next(true);
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./editor.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        if (data.function === 'removeColorTransparency') {
          let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
          imageData.data.set(data.response);
          ctx.putImageData(imageData, 0, 0);
          this.drawImage(backupCtx, ctx.canvas, 0, 0);
          this.working.next(false);
          worker.terminate();
        }
      };
      worker.postMessage({
        function: 'removeColorTransparency',
        params: [
          new Uint8Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data.buffer)
        ]
      });
    } else {
      let colorBuffer = new Uint8Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data.buffer);
      colorBuffer = removeColorTransparency(colorBuffer);
      let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      imageData.data.set(colorBuffer);
      ctx.putImageData(imageData, 0, 0);
      this.drawImage(backupCtx, ctx.canvas, 0, 0);
      this.working.next(false);
    }
  }

  /**
   * get unique colors in the canvas
   * uses web workers
   * @param ctx CanvasRenderingContext2D
   * @returns array of color objects
   */
  async getUniqueColors(ctx: CanvasRenderingContext2D): Promise<IColorDictionary> {
    let colorDictionary: IColorDictionary = {};
    await new Promise<IColorDictionary>(resolve => {
      if(typeof Worker !== 'undefined') {
        const worker = new Worker(new URL('./editor.worker', import.meta.url));
        worker.onmessage = ({ data }) => {
          if (data.function === 'getUniqueColors') {
            colorDictionary = data.response;
            worker.terminate();
            resolve(colorDictionary);
          }
        };
        worker.postMessage({
          function: 'getUniqueColors',
          params: [
            new Uint8Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data.buffer)
          ]
        });
      } else {
        colorDictionary = getUniqueColors(new Uint8Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data.buffer));
        resolve(colorDictionary);
      }
    });
    return colorDictionary;
  }

  /**
   * replace the least used color with the closest color in the color dictionary
   * uses web workers
   * @param colorsToReplace number color number of colors to be replaced
   * @param canvasColors IColorDictionary current color dictionary
   * @param colorBuffer Uint8Array color buffer
   * @return object containing the color dictionary and the color buffer
   */
  async replaceLeastUsedColors(colorsToReplace: number, canvasColors: IColorDictionary, colorBuffer: Uint8Array): Promise<{ canvasColors: IColorDictionary, colorBuffer: Uint8Array }> {
    let object: { canvasColors: IColorDictionary, colorBuffer: Uint8Array } = { canvasColors: {}, colorBuffer: new Uint8Array() };
    await new Promise<{ canvasColors: IColorDictionary, colorBuffer: Uint8Array }>(resolve => {
      if(typeof Worker !== 'undefined') {
        const worker = new Worker(new URL('./editor.worker', import.meta.url));
        worker.onmessage = ({ data }) => {
          if (data.function === 'replaceLeastUsedColors') {
            object = { canvasColors: data.response.canvasColors, colorBuffer: data.response.colorBuffer }
            worker.terminate();
            resolve(object);
          }
        };
        worker.postMessage({
          function: 'replaceLeastUsedColors',
          params: [
            colorsToReplace,
            canvasColors,
            colorBuffer
          ]
        });
      } else {
        object = replaceLeastUsedColors(colorsToReplace, canvasColors, colorBuffer);
        resolve(object);
      }
    });
    return object;
  }

  /**
   * adds an outline over fully transparent pixels around colored pixels
   * @param colorBuffer Uint8Array color buffer
   * @param imageWidth number imageWidth in pixels
   * @param outlineWidth number outline width in pixels
   * @param outlineColor number[] array of 4 numbers (r,g,b,a) between 0 and 255 representing the desired outline color
   * @returns Uint8Array colorBuffer
   */
  addOutline(ctx: CanvasRenderingContext2D, outlineWidth: number, outlineColor: number[]): void {
    this.working.next(true);
    if(typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./editor.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        if (data.function === 'addOutline') {
          let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
          imageData.data.set(data.response);
          ctx.putImageData(imageData, 0, 0);
          this.working.next(false);
          worker.terminate();
        }
      };
      worker.postMessage({
        function: 'addOutline',
        params: [
          new Uint8Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data.buffer),
          ctx.canvas.width,
          outlineWidth,
          outlineColor
        ]
      });
    } else {
      let result = addOutline(
        new Uint8Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data.buffer),
        ctx.canvas.width,
        outlineWidth,
        outlineColor
      );
      let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      imageData.data.set(result);
      ctx.putImageData(imageData, 0, 0);
      this.working.next(false);
    }
  }
}
