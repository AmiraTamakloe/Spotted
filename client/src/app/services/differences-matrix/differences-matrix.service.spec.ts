import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FIVE, THREE, TWO_FIFTY } from 'src/global-constants/global-constants';
import { DifferencesMatrixService } from './differences-matrix.service';

/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-len */

describe('DifferencesMatrixService', () => {
    let service: DifferencesMatrixService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DifferencesMatrixService],
        });
        service = TestBed.inject(DifferencesMatrixService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return the elargementRange', () => {
        expect(service.enlargementRange).toEqual(THREE);
    });
    it('should return the  updated elargementRange', () => {
        expect(service.enlargementRange).toEqual(THREE);
        service.enlargementRange = FIVE;
        expect(service.enlargementRange).toEqual(FIVE);
    });

    it('should call getImageMatrix', fakeAsync(() => {
        const myUrl = 'localhost:3000/testing';
        service.leftUrl = myUrl;
        service.rightUrl = myUrl;
        service.getImageMatrix('');
        expect(service.getImageMatrix).toBeTruthy();
    }));

    it('should be truthy', async () => {
        const myUrl = 'localhost:3000/testing';
        service.leftUrl = myUrl;
        service.rightUrl = myUrl;
        const leftImage = new Image();
        const rightImage = new Image();
        leftImage.src = encodeURI(service.leftUrl as string);
        rightImage.src = encodeURI(service.rightUrl as string);
        const canvasId = document.createElement('canvas') as HTMLCanvasElement;
        const imageContext = canvasId.getContext('2d');
        imageContext.drawImage(leftImage, 0, 0);
        const leftImageData = imageContext.getImageData(0, 0, canvasId.width, canvasId.height);

        imageContext.drawImage(rightImage, 0, 0);
        const differenceImageData = imageContext.getImageData(0, 0, canvasId.width, canvasId.height);

        for (let i = 0; i < leftImageData.data.length; i++) {
            differenceImageData.data[i] = 0;
        }
        const pixelRadiusValue = service.pixelRadius(differenceImageData);
        expect(pixelRadiusValue).toBeTruthy();
        expect(pixelRadiusValue).toEqual(differenceImageData);
    });

    it('should initialize the canvasId variable', () => {
        const canvas = document.createElement('canvas');
        service.id = { nativeElement: canvas };
        const spy = spyOn(service, 'imageMatrix');
        service.imageMatrix();
        expect(spy).toHaveBeenCalled();
        expect(service.id).toBeDefined();
    });

    it('should verify is an imageMatrix is there', fakeAsync(() => {
        const leftImageSrc = 'data:image/png;base64,iVBOR...';
        const rightImageSrc = 'data:image/png;base64,iVBOR...';

        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 640;
        const context = canvas.getContext('2d');

        const leftImageData = context.createImageData(canvas.width, canvas.height);
        const rightImageData = context.createImageData(canvas.width, canvas.height);

        leftImageData.data[0] = TWO_FIFTY;
        rightImageData.data[0] = 0;

        spyOn(context, 'drawImage').and.callThrough();
        spyOn(context, 'getImageData').and.callFake(() => {
            if ((context.drawImage as jasmine.Spy).calls.count() === 1) {
                return leftImageData;
            } else {
                return rightImageData;
            }
        });

        spyOn(context, 'putImageData').and.callThrough();

        service.leftUrl = leftImageSrc;
        service.rightUrl = rightImageSrc;
        service.id = { nativeElement: canvas };

        const imageData = new ImageData(new Uint8ClampedArray([0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255]), 2, 2);
        service.imageDataL = imageData;
        service.imageDataR = imageData;
        service.imageMatrix();

        tick();

        const rightImage = new Image();
        rightImage.src = rightImageSrc;
        rightImage.dispatchEvent(new Event('load'));

        expect(context.drawImage).toHaveBeenCalledTimes(4);
        expect(context.getImageData).toHaveBeenCalledTimes(1);
        expect(context.putImageData).toHaveBeenCalledTimes(0);
    }));

    it('should verify getImageMatrix', async () => {
        const leftImagePath = 'path/to/left/image';
        const serviceSpy = spyOn(service, 'getImageMatrix').and.callThrough();

        const imageMatrix = service.getImageMatrix(leftImagePath);

        expect(serviceSpy).toHaveBeenCalledWith(leftImagePath);
        expect(imageMatrix).toBeTruthy();
    });

    it('should test getImageMatrix with non-black pixel', async () => {
        const leftImagePath = 'path/to/left/image';
        const imageHeight = 480;
        const imageWidth = 640;
        const serviceSpy = spyOn(service, 'getImageMatrix').and.callThrough();

        const mockImage = new Image();
        mockImage.src =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5QgSFSs4Ax4ZIwAAAAtJREFUCNdjYMAEAAAUAAHlhrBKAAAAAElFTkSuQmCC';

        spyOn(window, 'Image').and.returnValue(mockImage);

        const imageMatrixPromise = service.getImageMatrix(leftImagePath);

        const mockEvent = new Event('load');
        mockImage.onload(mockEvent);

        const imageMatrix = await imageMatrixPromise;

        expect(serviceSpy).toHaveBeenCalledWith(leftImagePath);
        expect(imageMatrix).toBeTruthy();
        expect(imageMatrix.length).toEqual(imageHeight);
        imageMatrix.forEach((row) => {
            expect(row.length).toEqual(imageWidth);
            row.forEach((pixel) => {
                expect([0, 1]).toContain(pixel);
            });
        });

        expect(imageMatrix[0][0]).toEqual(1);
    });
});
