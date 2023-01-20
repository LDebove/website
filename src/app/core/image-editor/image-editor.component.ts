import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { CanvasService } from 'src/app/services/canvas.service';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('preview') preview: ElementRef = {} as ElementRef;

  originalCanvas: HTMLCanvasElement = {} as HTMLCanvasElement;
  originalCanvasCtx: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;
  previewCanvas: HTMLCanvasElement = {} as HTMLCanvasElement;
  previewCanvasCtx: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;
  backupCanvas: HTMLCanvasElement = {} as HTMLCanvasElement;
  backupCanvasCtx: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;

  imageLoaded: boolean = false;
  colorNumber: number = 1;
  canvasChangeIndicator: boolean = false;

  previewCanvasLoaded: Subject<void> = new Subject<void>();

  constructor(private canvasService: CanvasService) { }

  ngOnInit(): void {
    this.previewCanvasLoaded.subscribe({
      next: () => {
        this.getUniqueColors();
      }
    });
  }

  ngAfterViewInit(): void {
    this.previewCanvas = <HTMLCanvasElement>this.preview.nativeElement;
    this.previewCanvasCtx = this.previewCanvas.getContext('2d')!;
    this.originalCanvas = document.createElement('canvas');
    this.originalCanvasCtx = this.originalCanvas.getContext('2d')!;
    this.backupCanvas = document.createElement('canvas');
    this.backupCanvasCtx = this.backupCanvas.getContext('2d')!;
  }

  setCanvas(imageLoadEvent: Event): void {
    this.canvasChangeIndicator = !this.canvasChangeIndicator;
    this.imageLoaded = false;
    let originalCanvas = this.originalCanvas;
    let originalCanvasCtx = this.originalCanvasCtx;
    let previewCanvas = this.previewCanvas;
    let previewCanvasCtx = this.previewCanvasCtx;
    let backupCanvas = this.backupCanvas;
    let backupCanvasCtx = this.backupCanvasCtx;
    let canvasService = this.canvasService;
    let previewCanvasLoaded = this.previewCanvasLoaded;

    let reader = new FileReader();
    reader.onload = function(event) {
      let img = new Image();
      img.onload = function() {
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
    this.imageLoaded = true;
  }

  resetPreviewCanvas(): void {
    this.canvasService.drawImage(this.previewCanvasCtx, this.originalCanvas, 0, 0);
    this.canvasService.drawImage(this.backupCanvasCtx, this.originalCanvas, 0, 0);
  }

  removeColorTransparency(): void {
    this.canvasService.removeColorTransparency(this.previewCanvasCtx);
  }

  pixelate(input: EventTarget): void {
    let pixels = parseInt((<HTMLInputElement>input).value);
    this.canvasService.drawImage(this.previewCanvasCtx, this.backupCanvas, 0, 0);
    this.canvasService.pixelate(this.previewCanvasCtx, pixels);
  }

  getUniqueColors(): void {
    // this.colorNumber = data;
    // this.colorNumber = this.canvasService.getUniqueColors(this.previewCanvasCtx).length;
  }
}
