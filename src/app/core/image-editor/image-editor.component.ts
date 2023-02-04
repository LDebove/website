import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { CanvasService } from 'src/app/services/canvas.service';
import { IColorDictionary } from './canvas.functions';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('preview') preview!: ElementRef;

  imageForm = new FormGroup({
    pixelate: new FormControl('1', [ Validators.min(1), Validators.max(1000) ]),
    colorRemover: new FormControl('1', [ Validators.min(1) ]),
    outlineAddition: new FormControl('0', [ Validators.min(0) ])
  });

  originalCanvas!: HTMLCanvasElement;
  originalCanvasCtx!: CanvasRenderingContext2D;
  previewCanvas!: HTMLCanvasElement;
  previewCanvasCtx!: CanvasRenderingContext2D;
  backupCanvas!: HTMLCanvasElement;
  backupCanvasCtx!: CanvasRenderingContext2D;

  ready: boolean = false;
  colorReady: boolean = false;
  imageLoaded: boolean = false;

  canvasChangeIndicator: boolean = false;
  canvasColors: IColorDictionary = {};
  canvasColorNumber: number = 1;
  outlineColor: number[] = [255, 255, 255, 255];

  previewCanvasLoaded: Subject<void> = new Subject<void>();

  workers: Worker[] = [];

  activeFunction: any = {
    pixelate: false,
    colorRemover: false,
    outlineAddition: false,
  }

  constructor(private canvasService: CanvasService) { }

  ngOnInit(): void {
    const worker = new Worker(new URL('./canvas-calculation.worker', import.meta.url));
    this.previewCanvasLoaded.subscribe({
      next: () => {
        this.workers.forEach(w => {
          w.terminate();
        });
        this.getUniqueColors();
      }
    });
    worker.terminate();
  }

  ngAfterViewInit(): void {
    this.imageForm.disable();
    this.previewCanvas = <HTMLCanvasElement>this.preview.nativeElement;
    this.previewCanvasCtx = this.previewCanvas.getContext('2d')!;
    this.originalCanvas = document.createElement('canvas');
    this.originalCanvasCtx = this.originalCanvas.getContext('2d')!;
    this.backupCanvas = document.createElement('canvas');
    this.backupCanvasCtx = this.backupCanvas.getContext('2d')!;
  }

  /**
   * sets one function as active and others as inactive
   * allows to store the state of the canvas before using another function
   * @param functionKey string key representing the function to activate
   */
  setFunctionActive(functionKey: string): void {
    Object.keys(this.activeFunction).forEach(key => {
      this.activeFunction[key] = false;
    });
    this.activeFunction[functionKey] = true;
  }

  initFormValues(): void {
    this.imageForm.patchValue({
      pixelate: '1',
      colorRemover: '1',
      outlineAddition: '0'
    });
  }

  /**
   * draw the input image inside the canvas
   * @param imageLoadEvent Event
   */
  setCanvas(imageLoadEvent: Event): void {
    this.initFormValues();
    this.canvasChangeIndicator = !this.canvasChangeIndicator;
    this.ready = false;
    this.colorReady = false;
    this.imageLoaded = false;
    this.imageForm.disable();
    let originalCanvas = this.originalCanvas;
    let originalCanvasCtx = this.originalCanvasCtx;
    let previewCanvas = this.previewCanvas;
    let previewCanvasCtx = this.previewCanvasCtx;
    let backupCanvas = this.backupCanvas;
    let backupCanvasCtx = this.backupCanvasCtx;
    let canvasService = this.canvasService;
    let previewCanvasLoaded = this.previewCanvasLoaded;

    let reader = new FileReader();
    reader.onload = function (event) {
      let img = new Image();
      img.onload = function () {
        originalCanvas.width = img.width;
        originalCanvas.height = img.height;
        canvasService.drawImage(originalCanvasCtx, img, 0, 0);
        previewCanvas.width = img.width;
        previewCanvas.height = img.height;
        canvasService.drawImage(previewCanvasCtx, img, 0, 0);
        backupCanvas.width = img.width;
        backupCanvas.height = img.height;
        canvasService.drawImage(backupCanvasCtx, img, 0, 0);
        previewCanvasLoaded.next();
      }
      img.src = <string>event.target!.result;
    }
    reader.readAsDataURL((<any>imageLoadEvent.target!).files[0]);
    this.ready = true;
    this.imageLoaded = true;
    this.imageForm.get('pixelate')?.enable();
    this.imageForm.get('outlineAddition')?.enable();
  }

  /**
   * reset canvas to their original image data
   */
  resetPreviewCanvas(): void {
    this.canvasService.drawImage(this.previewCanvasCtx, this.originalCanvas, 0, 0);
    this.canvasService.drawImage(this.backupCanvasCtx, this.originalCanvas, 0, 0);
  }

  /**
   * removes the colors that are not fully opaque
   * uses web workers to perform calculations
   */
  removeColorTransparency(): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./canvas-calculation.worker', import.meta.url));
      this.workers.push(worker);
      worker.onmessage = ({ data }) => {
        if (data.function === 'removeColorTransparency') {
          let imageData = this.previewCanvasCtx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height);
          imageData.data.set(data.response);
          this.previewCanvasCtx.putImageData(imageData, 0, 0);
          this.canvasService.drawImage(this.backupCanvasCtx, this.previewCanvas, 0, 0);
          this.getUniqueColors();
          worker.terminate();
        }
      };
      worker.postMessage({
        function: 'removeColorTransparency',
        params: [
          new Uint8Array(this.previewCanvasCtx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height).data.buffer)
        ]
      });
    } else {
      this.canvasService.removeColorTransparency(this.previewCanvasCtx);
      this.canvasService.drawImage(this.backupCanvasCtx, this.previewCanvas, 0, 0);
      this.getUniqueColors();
    }
  }

  /**
   * pixelate the canvas according to the given pixel ratio
   * @param input EventTarget
   */
  pixelate(input: EventTarget): void {
    if(this.activeFunction.pixelate) {
      this.canvasService.drawImage(this.previewCanvasCtx, this.backupCanvas, 0, 0);
    } else {
      this.canvasService.drawImage(this.backupCanvasCtx, this.previewCanvas, 0, 0);
      this.setFunctionActive('pixelate');
    }
    let pixels = parseInt((<HTMLInputElement>input).value);
    this.canvasService.pixelate(this.previewCanvasCtx, pixels);
    this.getUniqueColors();
  }

  /**
   * get the number of unique colors in the image
   * uses web workers to perform calculations
   */
  getUniqueColors(): void {
    this.imageForm.get('colorRemover')?.disable();
    this.ready = false;
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./canvas-calculation.worker', import.meta.url));
      this.workers.push(worker);
      worker.onmessage = ({ data }) => {
        if (data.function === 'getUniqueColors') {
          this.canvasColors = data.response;
          let colorRemoverFormControl = this.imageForm.get('colorRemover');
          colorRemoverFormControl?.removeValidators(Validators.max(this.canvasColorNumber));
          this.canvasColorNumber = Object.keys(this.canvasColors).length;
          console.log(this.canvasColorNumber)
          colorRemoverFormControl?.addValidators(Validators.max(this.canvasColorNumber));
          colorRemoverFormControl?.updateValueAndValidity();
          this.imageForm.patchValue({
            colorRemover: `${this.canvasColorNumber}`
          });
          this.imageForm.get('colorRemover')?.enable();
          worker.terminate();
          this.ready = true;
        }
      };
      worker.postMessage({
        function: 'getUniqueColors',
        params: [
          new Uint8Array(this.previewCanvasCtx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height).data.buffer)
        ]
      });
    } else {
      this.canvasColors = this.canvasService.getUniqueColors(this.previewCanvasCtx);
      let colorRemoverFormControl = this.imageForm.get('colorRemover');
      colorRemoverFormControl?.removeValidators(Validators.max(this.canvasColorNumber));
      this.canvasColorNumber = Object.keys(this.canvasColors).length;
      colorRemoverFormControl?.addValidators(Validators.max(this.canvasColorNumber));
      colorRemoverFormControl?.updateValueAndValidity();
      this.imageForm.patchValue({
        colorRemover: `${this.canvasColorNumber}`
      });
      this.imageForm.get('colorRemover')?.enable();
      this.colorReady = true;
      this.ready = true;
    }
  }

  /**
   * replace the N least used colors with their closest colors in the canvas
   * uses web workers to perform calculations
   * @param input EventTarget
   */
  replaceLeastUsedColors(input: EventTarget): void {
    let newColorNumber = parseInt((<HTMLInputElement>input).value);
    let colorsToReplace = Object.keys(this.canvasColors).length - newColorNumber;
    if (newColorNumber >= this.canvasColorNumber || newColorNumber <= 1 || colorsToReplace < 1) return;
    if(this.activeFunction.colorRemover) {
      this.canvasService.drawImage(this.previewCanvasCtx, this.backupCanvas, 0, 0);
    } else {
      this.canvasService.drawImage(this.backupCanvasCtx, this.previewCanvas, 0, 0);
      this.setFunctionActive('colorRemover');
    }
    this.ready = false;
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./canvas-calculation.worker', import.meta.url));
      this.workers.push(worker);
      worker.onmessage = ({ data }) => {
        if (data.function === 'replaceLeastUsedColors') {
          let imageData = this.previewCanvasCtx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height);
          imageData.data.set(data.response.colorBuffer);
          this.previewCanvasCtx.putImageData(imageData, 0, 0);
          worker.terminate();
          this.ready = true;
        }
      };
      worker.postMessage({
        function: 'replaceLeastUsedColors',
        params: [
          colorsToReplace,
          this.canvasColors,
          new Uint8Array(this.previewCanvasCtx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height).data.buffer)
        ]
      });
    } else {
      let result = this.canvasService.replaceLeastUsedColors(
        colorsToReplace,
        this.canvasColors,
        new Uint8Array(this.previewCanvasCtx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height).data.buffer)
      );
      let imageData = this.previewCanvasCtx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height);
      imageData.data.set(result.colorBuffer);
      this.previewCanvasCtx.putImageData(imageData, 0, 0);
      this.ready = true;
    }
  }

  /**
   * adds an outline over fully transparent pixels around colored pixels
   * uses web workers to perform calculations
   * @param input EventTarget
   */
  addOutline(input: EventTarget): void {
    let outlineWidth = parseInt((<HTMLInputElement>input).value);
    if (outlineWidth < 0) return;
    if(this.activeFunction.outlineAddition) {
      this.canvasService.drawImage(this.previewCanvasCtx, this.backupCanvas, 0, 0);
    } else {
      this.canvasService.drawImage(this.backupCanvasCtx, this.previewCanvas, 0, 0);
      this.setFunctionActive('outlineAddition');
    }
    this.ready = false;
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./canvas-calculation.worker', import.meta.url));
      this.workers.push(worker);
      worker.onmessage = ({ data }) => {
        if (data.function === 'addOutline') {
          let imageData = this.previewCanvasCtx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height);
          imageData.data.set(data.response);
          this.previewCanvasCtx.putImageData(imageData, 0, 0);
          worker.terminate();
          this.ready = true;
        }
      };
      worker.postMessage({
        function: 'addOutline',
        params: [
          new Uint8Array(this.previewCanvasCtx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height).data.buffer),
          this.previewCanvas.width,
          outlineWidth,
          this.outlineColor
        ]
      });
    } else {
      let result = this.canvasService.addOutline(
        new Uint8Array(this.previewCanvasCtx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height).data.buffer),
        this.previewCanvas.width,
        outlineWidth,
        this.outlineColor
      );
      let imageData = this.previewCanvasCtx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height);
      imageData.data.set(result);
      this.previewCanvasCtx.putImageData(imageData, 0, 0);
      this.ready = true;
    }
  }

  /**
   * sets outline color to the input value
   * convert hexadecimal color string to 3 number rgb
   * @param input EventTarget
   */
  setOutlineColor(input: EventTarget): void {
    let hexColor = (<HTMLInputElement>input).value;
    if(hexColor.length !== 7) return;
    this.outlineColor = [parseInt('0x' + hexColor.substring(1, 3)), parseInt('0x' + hexColor.substring(3, 5)), parseInt('0x' + hexColor.substring(5, 7)), 255];
  }

  /**
   * download the canvas as a png
   */
  download(): void {
    let link = document.createElement('a');
    link.download = 'image.png';
    link.href = this.previewCanvas.toDataURL();
    link.click();
  }
}
