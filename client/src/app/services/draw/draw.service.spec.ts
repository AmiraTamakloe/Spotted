/* eslint-disable @typescript-eslint/no-magic-numbers */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/interfaces/vec2';
import { DrawService } from '@app/services/draw/draw.service';
import { TWO_FIFTY_FIVE } from '@common/global-constants';
import { FIVE_THOUSAND, FOUR, THOUSAND_MILLISECONDS, TWO_FIFTY } from 'src/global-constants/global-constants';

describe('DrawService', () => {
    let service: DrawService;
    let ctxStub: CanvasRenderingContext2D;

    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const pos: Vec2 = { x: 250, y: 250 };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.context = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' width should return the width of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_WIDTH);
    });

    it(' height should return the height of the grid canvas', () => {
        expect(service.height).toEqual(CANVAS_HEIGHT);
    });

    it(' drawWord should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.context, 'fillText').and.callThrough();
        service.drawWord('test', pos, ctxStub);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it(' drawWord should not call fillText if word is empty', () => {
        const fillTextSpy = spyOn(service.context, 'fillText').and.callThrough();
        service.drawWord('', pos, ctxStub);
        expect(fillTextSpy).toHaveBeenCalledTimes(0);
    });

    it(' drawWord should call fillText as many times as letters in a word', () => {
        const fillTextSpy = spyOn(service.context, 'fillText').and.callThrough();
        const word = 'test';
        service.drawWord(word, pos, ctxStub);
        expect(fillTextSpy).toHaveBeenCalledTimes(word.length);
    });

    it(' drawWord should color pixels on the canvas', () => {
        let imageData = service.context.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawWord('test', pos, ctxStub);
        imageData = service.context.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawWord should clear the canvas after a delay', fakeAsync(() => {
        const setTimeoutSpy = spyOn(window, 'setTimeout').and.callThrough();
        service.drawWord('test', pos, ctxStub);
        tick(THOUSAND_MILLISECONDS);
        expect(setTimeoutSpy).toHaveBeenCalled();
    }));

    it('drawWord should clear the canvas after a delay', fakeAsync(() => {
        const setTimeoutSpy = spyOn(window, 'setTimeout').and.callThrough();
        service.drawWord('test', pos, ctxStub);
        tick(THOUSAND_MILLISECONDS);
        expect(setTimeoutSpy).toHaveBeenCalled();
        const clearRectSpy = spyOn(ctxStub, 'clearRect').and.callThrough();
        service.drawWord('test', pos, ctxStub);
        tick(THOUSAND_MILLISECONDS);
        expect(setTimeoutSpy).toHaveBeenCalled();
        expect(clearRectSpy).toHaveBeenCalled();
    }));

    describe('getPixelColor', () => {
        it('should return the correct color for a pixel in the top left corner', () => {
            const pixel: Vec2 = { x: 0, y: 0 };
            ctxStub.fillStyle = 'rgb(255, 0, 0)';
            ctxStub.fillRect(pixel.x, pixel.y, 1, 1);
            const color = service.getPixelColor(pixel, ctxStub);
            expect(color).toEqual('rgb(255, 0, 0)');
        });

        it('should return the correct color for a pixel in the middle of the canvas', () => {
            const pixel: Vec2 = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };
            ctxStub.fillStyle = 'rgb(0, 255, 0)';
            ctxStub.fillRect(pixel.x, pixel.y, 1, 1);
            const color = service.getPixelColor(pixel, ctxStub);
            expect(color).toEqual('rgb(0, 255, 0)');
        });

        it('should return the correct color for a pixel in the bottom right corner', () => {
            const pixel: Vec2 = { x: CANVAS_WIDTH - 1, y: CANVAS_HEIGHT - 1 };
            ctxStub.fillStyle = 'rgb(0, 0, 255)';
            ctxStub.fillRect(pixel.x, pixel.y, 1, 1);
            const color = service.getPixelColor(pixel, ctxStub);
            expect(color).toEqual('rgb(0, 0, 255)');
        });

        it('should return the correct color for a pixel with a different color format', () => {
            const pixel: Vec2 = { x: 20, y: 20 };
            ctxStub.fillStyle = 'hsl(0, 100%, 50%)';
            ctxStub.fillRect(pixel.x, pixel.y, 1, 1);
            const color = service.getPixelColor(pixel, ctxStub);
            expect(color).toEqual('rgb(255, 0, 0)');
        });

        it('should return rgb(0, 0, 0) for a pixel outside the canvas boundaries', () => {
            const pixel: Vec2 = { x: -10, y: -10 };
            const color = service.getPixelColor(pixel, ctxStub);
            expect(color).toEqual('rgb(0, 0, 0)');
        });

        it('should return rgb(0, 0, 0) for a pixel that has not been drawn on', () => {
            const pixel: Vec2 = { x: 30, y: 30 };
            const color = service.getPixelColor(pixel, ctxStub);
            expect(color).toEqual('rgb(0, 0, 0)');
        });
    });

    describe('drawPixel', () => {
        it('should draw a single pixel with the specified color', () => {
            const pixel: Vec2 = { x: 10, y: 10 };
            const color = 'rgb(255, 0, 0)';
            service.drawPixel(pixel, ctxStub, color);
            const imageData = service.context.getImageData(pixel.x, pixel.y, 1, 1).data;
            expect(imageData[0]).toEqual(TWO_FIFTY_FIVE);
            expect(imageData[1]).toEqual(0);
            expect(imageData[2]).toEqual(0);
        });

        it('should draw multiple pixels with the specified color', () => {
            const pixels: Vec2[] = [
                { x: 10, y: 10 },
                { x: 11, y: 10 },
                { x: 10, y: 11 },
                { x: 11, y: 11 },
            ];
            const color = 'rgb(255, 0, 0)';
            pixels.forEach((pixel) => {
                service.drawPixel(pixel, ctxStub, color);
            });
            const imageData = service.context.getImageData(0, 0, service.width, service.height).data;
            const redPixels = imageData.filter((x, i) => i % FOUR === 0 && x === TWO_FIFTY);
            expect(redPixels.length).toEqual(0);
        });

        it('should draw nothing if the color is not specified', () => {
            const pixel: Vec2 = { x: 10, y: 10 };
            service.drawPixel(pixel, ctxStub, undefined);
            const imageData = service.context.getImageData(pixel.x, pixel.y, 1, 1).data;
            expect(imageData[0]).toEqual(0);
            expect(imageData[1]).toEqual(0);
            expect(imageData[2]).toEqual(0);
        });
    });

    describe('cancelBlinking', () => {
        it('should clear all intervals in blinkIntervals array', () => {
            const intervalIds = [1, 2, 3];
            spyOn(window, 'clearInterval');
            service.blinkIntervals = intervalIds;
            service.cancelBlinking();
            expect(window.clearInterval).toHaveBeenCalledTimes(intervalIds.length);
            intervalIds.forEach((id) => {
                expect(window.clearInterval).toHaveBeenCalledWith(id);
            });
            expect(service.blinkIntervals.length).toEqual(0);
        });

        it('should do nothing if blinkIntervals is empty', () => {
            spyOn(window, 'clearInterval');
            service.blinkIntervals = [];
            service.cancelBlinking();
            expect(window.clearInterval).toHaveBeenCalledTimes(0);
        });
    });

    describe('blinkTriche', () => {
        it('should draw pixels with red color on the canvas', () => {
            const pixels: Vec2[] = [
                { x: 10, y: 11 },
                { x: 12, y: 13 },
                { x: 14, y: 15 },
                { x: 100, y: 311 },
            ];
            const diff = pixels;
            service.blinkCheat(diff, ctxStub);
            const imageData = service.context.getImageData(0, 0, service.width, service.height).data;
            const redPixels = imageData.filter((x, i) => i % FOUR === 0 && x === TWO_FIFTY);
            expect(redPixels.length).toEqual(0);
        });

        it('should not draw pixels outside of the canvas', () => {
            const pixels: Vec2[] = [
                { x: -52, y: 10 },
                { x: 800, y: 10 },
                { x: 10, y: -10 },
                { x: 10, y: 500 },
            ];
            const diff = pixels;
            service.blinkCheat(diff, ctxStub);
            const imageData = service.context.getImageData(0, 0, service.width, service.height).data;
            const redPixels = imageData.filter((x, i) => i % FOUR === 0 && x === TWO_FIFTY);
            expect(redPixels.length).toEqual(0);
        });

        it('should save the original colors of the pixels in diff', () => {
            const pixels: Vec2[] = [
                { x: 10, y: 11 },
                { x: 12, y: 13 },
                { x: 14, y: 15 },
                { x: 100, y: 311 },
            ];
            const diff = pixels;
            const getPixelColorSpy = spyOn(service, 'getPixelColor').and.callThrough();
            service.blinkCheat(diff, ctxStub);
            expect(getPixelColorSpy).toHaveBeenCalledTimes(pixels.length);
        });

        it('should start blinking and stop after 5000ms', () => {
            jasmine.clock().install();
            const pixels: Vec2[] = [
                { x: 10, y: 11 },
                { x: 12, y: 13 },
                { x: 14, y: 15 },
                { x: 100, y: 311 },
            ];
            const diff = pixels;
            service.blinkCheat(diff, ctxStub);
            jasmine.clock().tick(FIVE_THOUSAND);
            const imageData = service.context.getImageData(0, 0, service.width, service.height).data;
            const redPixels = imageData.filter((x, i) => i % FOUR === 0 && x === TWO_FIFTY);
            expect(redPixels.length).toEqual(0);
            jasmine.clock().uninstall();
        });
    });

    it('should draw a grid on the corner when nHints is 0', () => {
        const contextSpy = spyOn(service.context, 'stroke');
        const diff: Vec2[] = [{ x: 50, y: 50 }];
        const nHints = 0;
        service.blinkHint(diff, service.context, nHints);
        expect(contextSpy).toHaveBeenCalledTimes(0);
    });

    it('should draw a smaller grid in the first one when nHints is 1', () => {
        const contextSpy = spyOn(service.context, 'stroke');
        const diff: Vec2[] = [{ x: 150, y: 150 }];
        const nHints = 1;
        service.blinkHint(diff, service.context, nHints);
        expect(contextSpy).toHaveBeenCalledTimes(0);
    });

    it('should draw an arrow pointing to the point when nHints is 2', () => {
        const beginPathSpy = spyOn(service.context, 'beginPath');
        const moveToSpy = spyOn(service.context, 'moveTo');
        const lineToSpy = spyOn(service.context, 'lineTo');
        const closePathSpy = spyOn(service.context, 'closePath');
        const fillSpy = spyOn(service.context, 'fill');
        const diff: Vec2[] = [{ x: 320, y: 240 }];
        const nHints = 2;
        service.blinkHint(diff, service.context, nHints);
        expect(beginPathSpy).toHaveBeenCalledTimes(2);
        expect(moveToSpy).toHaveBeenCalledTimes(2);
        expect(lineToSpy).toHaveBeenCalledTimes(4);
        expect(closePathSpy).toHaveBeenCalledTimes(1);
        expect(fillSpy).toHaveBeenCalledTimes(1);
    });

    it('should draw an arrow pointing to middle when the difference is in the middle', () => {
        const beginPathSpy = spyOn(service.context, 'beginPath');
        const moveToSpy = spyOn(service.context, 'moveTo');
        const lineToSpy = spyOn(service.context, 'lineTo');
        const closePathSpy = spyOn(service.context, 'closePath');
        const fillSpy = spyOn(service.context, 'fill');
        const diff: Vec2[] = [{ x: 400, y: 300 }];
        const nHints = 2;
        service.blinkHint(diff, service.context, nHints);
        expect(beginPathSpy).toHaveBeenCalledTimes(2);
        expect(moveToSpy).toHaveBeenCalledTimes(2);
        expect(lineToSpy).toHaveBeenCalledTimes(4);
        expect(closePathSpy).toHaveBeenCalledTimes(1);
        expect(fillSpy).toHaveBeenCalledTimes(1);
    });

    it('should do nothing when the point is outside the canvas', () => {
        const contextSpy = spyOn(service.context, 'stroke');
        const diff: Vec2[] = [{ x: 1000, y: 1000 }];
        const nHints = 0;
        service.blinkHint(diff, service.context, nHints);
        expect(contextSpy).toHaveBeenCalledTimes(0);
    });
});
