import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { CanvasService } from './canvas.service';
import { IColorDictionary } from './canvas.functions';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements AfterViewInit {
  @ViewChild('preview') preview?: ElementRef;

  imageForm = new FormGroup({
    pixelate: new FormControl('1', [ Validators.min(1), Validators.max(1000) ]),
    colorRemover: new FormControl('1', [ Validators.min(1) ]),
    outlineAddition: new FormControl('0', [ Validators.min(0) ])
  });
  outlineColorFormControl = new FormControl('#FFFFFF');

  originalCanvas?: HTMLCanvasElement;
  originalCanvasCtx?: CanvasRenderingContext2D;
  previewCanvas?: HTMLCanvasElement;
  previewCanvasCtx?: CanvasRenderingContext2D;
  backupCanvas?: HTMLCanvasElement;
  backupCanvasCtx?: CanvasRenderingContext2D;

  ready: boolean = false;
  imageLoaded: boolean = false;

  canvasChangeIndicator: boolean = false;
  canvasColors: IColorDictionary = {};
  canvasColorNumber: number = 1;
  outlineColor: number[] = [255, 255, 255, 255];

  activeFunction: any = {
    pixelate: false,
    colorRemover: false,
    outlineAddition: false,
  }

  constructor(private title: Title, private translate: TranslateService, private canvasService: CanvasService) { }

  ngAfterViewInit(): void {
    this.title.setTitle(`${this.translate.instant('APPS.IMAGE-EDITOR')} - Léo Debove`);
    this.translate.onLangChange.subscribe({
      next: () => {
        this.title.setTitle(`${this.translate.instant('APPS.IMAGE-EDITOR')} - Léo Debove`);
      }
    });
    this.imageForm.disable();
    this.previewCanvas = <HTMLCanvasElement>this.preview?.nativeElement;
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
    this.imageLoaded = false;
    this.imageForm.disable();

    let reader = new FileReader();
    reader.onload = (event) => {
      let img = new Image();
      img.onload = () => {
        this.originalCanvas!.width = img.width;
        this.originalCanvas!.height = img.height;
        this.canvasService.drawImage(this.originalCanvasCtx!, img, 0, 0);
        this.previewCanvas!.width = img.width;
        this.previewCanvas!.height = img.height;
        this.canvasService.drawImage(this.previewCanvasCtx!, img, 0, 0);
        this.backupCanvas!.width = img.width;
        this.backupCanvas!.height = img.height;
        this.canvasService.drawImage(this.backupCanvasCtx!, img, 0, 0);
        this.getUniqueColors();
      }
      img.src = <string>event.target?.result;
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
    this.canvasService.drawImage(this.previewCanvasCtx!, this.originalCanvas!, 0, 0);
    this.canvasService.drawImage(this.backupCanvasCtx!, this.originalCanvas!, 0, 0);
  }

  /**
   * removes the colors that are not fully opaque
   * uses web workers to perform calculations
   */
  removeColorTransparency(): void {
    let subscription = this.canvasService.isWorking().subscribe({
      next: (working) => {
        if(!working) {
          this.getUniqueColors();
          subscription.unsubscribe();
        }
      }
    });
    this.canvasService.removeColorTransparency(this.previewCanvasCtx!, this.backupCanvasCtx!);
  }

  /**
   * pixelate the canvas according to the given pixel ratio
   * @param input EventTarget
   */
  pixelate(input: EventTarget): void {
    if(this.activeFunction.pixelate) {
      this.canvasService.drawImage(this.previewCanvasCtx!, this.backupCanvas!, 0, 0);
    } else {
      this.canvasService.drawImage(this.backupCanvasCtx!, this.previewCanvas!, 0, 0);
      this.setFunctionActive('pixelate');
    }
    let pixels = parseInt((<HTMLInputElement>input).value);
    this.canvasService.pixelate(this.previewCanvasCtx!, pixels);
    this.getUniqueColors();
  }

  /**
   * get the number of unique colors in the image
   * uses web workers to perform calculations
   */
  getUniqueColors(): void {
    this.imageForm.get('colorRemover')?.disable();
    this.ready = false;
    let colorRemoverFormControl = this.imageForm.get('colorRemover');
    colorRemoverFormControl?.removeValidators(Validators.max(this.canvasColorNumber));

    this.canvasService.getUniqueColors(this.previewCanvasCtx!).then(result => {
      this.canvasColors = result;
      this.canvasColorNumber = Object.keys(this.canvasColors).length;
      colorRemoverFormControl?.addValidators(Validators.max(this.canvasColorNumber));
      colorRemoverFormControl?.updateValueAndValidity();
      this.imageForm.patchValue({
        colorRemover: `${this.canvasColorNumber}`
      });
      this.imageForm.get('colorRemover')?.enable();
      this.ready = true;
    });
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
      this.canvasService.drawImage(this.previewCanvasCtx!, this.backupCanvas!, 0, 0);
    } else {
      this.canvasService.drawImage(this.backupCanvasCtx!, this.previewCanvas!, 0, 0);
      this.setFunctionActive('colorRemover');
    }
    this.ready = false;

    this.canvasService.replaceLeastUsedColors(
      colorsToReplace,
      this.canvasColors,
      new Uint8Array(this.previewCanvasCtx!.getImageData(0, 0, this.previewCanvas!.width, this.previewCanvas!.height).data.buffer)
    ).then(result => {
      let imageData = this.previewCanvasCtx!.getImageData(0, 0, this.previewCanvas!.width, this.previewCanvas!.height);
      imageData.data.set(result.colorBuffer);
      this.previewCanvasCtx!.putImageData(imageData, 0, 0);
      this.ready = true;
    });
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
      this.canvasService.drawImage(this.previewCanvasCtx!, this.backupCanvas!, 0, 0);
    } else {
      this.canvasService.drawImage(this.backupCanvasCtx!, this.previewCanvas!, 0, 0);
      this.setFunctionActive('outlineAddition');
    }
    this.ready = false;

    let subscription = this.canvasService.isWorking().subscribe({
      next: (working) => {
        if(!working) {
          this.ready = true;
          subscription.unsubscribe();
        }
      }
    });
    this.canvasService.addOutline(
      this.previewCanvasCtx!,
      outlineWidth,
      this.outlineColor
    );
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
    link.href = this.previewCanvas!.toDataURL();
    link.click();
  }
}
