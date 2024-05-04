import { ElementRef, Injectable } from '@angular/core';
import { UrlVec } from '@app/interfaces/url-vec';
import { FOUR, IMAGE_HEIGHT, IMAGE_WIDTH, TWO_FIFTY_FIVE } from '@common/global-constants';
@Injectable({
    providedIn: 'root',
})
export class DifferencesMatrixService {
    htmlId!: ElementRef<HTMLCanvasElement>;
    range = 3;
    diffContext: CanvasRenderingContext2D;
    imageDataL: ImageData;
    imageDataR: ImageData;
    private imagesUrl: UrlVec = { urlLeft: '', urlRight: '' };
    private canvasLeftUrlContext: string | ArrayBuffer;
    private canvasRightUrlContext: string | ArrayBuffer;

    get canvasLeftUrl(): string | ArrayBuffer {
        return this.canvasLeftUrlContext;
    }

    get canvasRightUrl(): string | ArrayBuffer {
        return this.canvasRightUrlContext;
    }

    get leftUrl(): string | ArrayBuffer {
        return this.imagesUrl.urlLeft;
    }

    get rightUrl(): string | ArrayBuffer {
        return this.imagesUrl.urlRight;
    }

    get enlargementRange(): number {
        return this.range;
    }

    get id(): ElementRef<HTMLCanvasElement> {
        return this.htmlId;
    }

    set leftUrl(leftUrl: string | ArrayBuffer) {
        this.imagesUrl.urlLeft = leftUrl;
    }

    set rightUrl(rightUrl: string | ArrayBuffer) {
        this.imagesUrl.urlRight = rightUrl;
    }

    set canvasLeftUrl(canvasLeftUrl: string | ArrayBuffer) {
        this.canvasLeftUrlContext = canvasLeftUrl;
    }

    set canvasRightUrl(canvasRightUrl: string | ArrayBuffer) {
        this.canvasRightUrlContext = canvasRightUrl;
    }

    set id(htmlId: ElementRef<HTMLCanvasElement>) {
        this.htmlId = htmlId;
    }

    set enlargementRange(range: number) {
        this.range = range;
    }

    imageMatrix() {
        const leftImage = new Image();
        const rightImage = new Image();
        const leftCanvas = new Image();
        const rightCanvas = new Image();
        leftImage.src = encodeURI(this.leftUrl as string);
        rightImage.src = encodeURI(this.rightUrl as string);
        leftCanvas.src = encodeURI(this.canvasLeftUrl as string);
        rightCanvas.src = encodeURI(this.canvasRightUrl as string);
        const canvasId = this.id.nativeElement;
        const imageContext = canvasId.getContext('2d');
        imageContext.drawImage(leftImage, 0, 0);
        imageContext.drawImage(leftCanvas, 0, 0);
        imageContext.drawImage(rightCanvas, 0, 0);
        imageContext.drawImage(rightCanvas, 0, 0);
        let differenceImageData = imageContext.getImageData(0, 0, canvasId.width, canvasId.height);

        for (let i = 0; i < this.imageDataL.data.length; i += FOUR) {
            if (
                this.imageDataL.data[i] === this.imageDataR.data[i] &&
                this.imageDataL.data[i + 1] === this.imageDataR.data[i + 1] &&
                this.imageDataL.data[i + 2] === this.imageDataR.data[i + 2] &&
                this.imageDataL.data[i + 3] === this.imageDataR.data[i + 3]
            ) {
                differenceImageData.data[i] = TWO_FIFTY_FIVE;
                differenceImageData.data[i + 1] = TWO_FIFTY_FIVE;
                differenceImageData.data[i + 2] = TWO_FIFTY_FIVE;
                differenceImageData.data[i + 3] = TWO_FIFTY_FIVE;
            } else {
                differenceImageData.data[i] = 0;
                differenceImageData.data[i + 1] = 0;
                differenceImageData.data[i + 2] = 0;
                differenceImageData.data[i + 3] = TWO_FIFTY_FIVE;
            }
        }

        differenceImageData = this.pixelRadius(differenceImageData);
        rightImage.onload = () => {
            imageContext.putImageData(differenceImageData, 0, 0);
        };

        const canvas = document.createElement('canvas');
        canvas.width = canvasId.width;
        canvas.height = canvasId.height;
        const context = canvas.getContext('2d');
        context.putImageData(differenceImageData, 0, 0);
        this.diffContext = context;
        return canvas;
    }

    getImgMat() {
        const matrixDiff: number[][] = [];
        for (let y = 0; y < IMAGE_HEIGHT; y++) {
            matrixDiff[y] = [];
            for (let x = 0; x < IMAGE_WIDTH; x++) {
                const pixel = this.diffContext.getImageData(x, y, 1, 1).data;
                if (pixel[0] === 0 && pixel[0] === 0 && pixel[2] === 0) {
                    matrixDiff[y][x] = 1;
                } else {
                    matrixDiff[y][x] = 0;
                }
            }
        }
        return matrixDiff;
    }

    async getImageMatrix(leftImagePath: string) {
        return new Promise<number[][]>((resolve) => {
            const leftImage = new Image();
            leftImage.src = encodeURI(leftImagePath);

            const matrixDiff: number[][] = [];

            leftImage.onload = () => {
                const leftCanvas = document.createElement('canvas');
                const leftContext = leftCanvas.getContext('2d');
                leftCanvas.width = leftImage.width;
                leftCanvas.height = leftImage.height;
                leftContext.drawImage(leftImage, 0, 0);

                for (let y = 0; y < IMAGE_HEIGHT; y++) {
                    matrixDiff[y] = [];
                    for (let x = 0; x < IMAGE_WIDTH; x++) {
                        const pixel = leftContext.getImageData(x, y, 1, 1).data;
                        if (pixel[0] === 0 && pixel[0] === 0 && pixel[2] === 0) {
                            matrixDiff[y][x] = 1;
                        } else {
                            matrixDiff[y][x] = 0;
                        }
                    }
                }
                resolve(matrixDiff);
            };
        });
    }

    pixelRadius(differenceImageData: ImageData) {
        const pixelsToChange = new Set<number>();
        for (let currentPixels = 0; currentPixels < differenceImageData.data.length; currentPixels += FOUR) {
            if (differenceImageData.data[currentPixels] === 0) {
                for (let y = -this.enlargementRange; y <= this.enlargementRange; y++) {
                    for (let x = -this.enlargementRange; x <= this.enlargementRange; x++) {
                        if (
                            currentPixels + y * IMAGE_WIDTH * FOUR + x * FOUR >= 0 &&
                            currentPixels + y * IMAGE_WIDTH * FOUR + x * FOUR < differenceImageData.data.length
                        ) {
                            pixelsToChange.add(currentPixels + y * IMAGE_WIDTH * FOUR + x * FOUR);
                            pixelsToChange.add(currentPixels + y * IMAGE_WIDTH * FOUR + x * FOUR + 1);
                            pixelsToChange.add(currentPixels + y * IMAGE_WIDTH * FOUR + x * FOUR + 2);
                            pixelsToChange.add(currentPixels + y * IMAGE_WIDTH * FOUR + x * FOUR + 3);
                        }
                    }
                }
            }
        }

        for (const change of pixelsToChange) {
            if (change % FOUR === 3) differenceImageData.data[change] = TWO_FIFTY_FIVE;
            else {
                differenceImageData.data[change] = 0;
            }
        }

        return differenceImageData;
    }
}
