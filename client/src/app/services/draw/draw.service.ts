/* eslint-disable complexity */
import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import {
    HALF_HEIGHT,
    HALF_WIDTH,
    IMAGE_HEIGHT,
    IMAGE_WIDTH,
    QUARTER_HEIGHT,
    QUARTER_WIDTH,
    SIX,
    THOUSAND_MILLISECONDS,
    TWENTY,
    TWO_FIFTY,
} from '@common/global-constants';
@Injectable({
    providedIn: 'root',
})
export class DrawService {
    isVisible: boolean;
    context: CanvasRenderingContext2D;
    errLContext: CanvasRenderingContext2D;
    errRContext: CanvasRenderingContext2D;
    blinkIntervals: number[] = [];
    private canvasSize: Vec2 = { x: IMAGE_WIDTH, y: IMAGE_HEIGHT };

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    drawWord(word: string, mousePosition: Vec2, context: CanvasRenderingContext2D) {
        const startPosition: Vec2 = mousePosition;
        context.font = '20px system-ui';
        context.fillStyle = 'red';
        for (let i = 0; i < word.length; i++) {
            context.fillText(word[i], startPosition.x + TWENTY * i, startPosition.y);
            setTimeout(() => {
                context.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
            }, THOUSAND_MILLISECONDS);
        }
    }

    getPixelColor(pix: Vec2, context: CanvasRenderingContext2D): string {
        const red = context.getImageData(pix.x, pix.y, 1, 1).data[0].toString();
        const green = context.getImageData(pix.x, pix.y, 1, 1).data[1].toString();
        const blue = context.getImageData(pix.x, pix.y, 1, 1).data[2].toString();

        const color = red + ', ' + green + ', ' + blue;

        return 'rgb(' + color + ')';
    }

    drawPixel(pix: Vec2, context: CanvasRenderingContext2D, color: string) {
        context.fillStyle = color;
        context.fillRect(pix.x, pix.y, 1, 1);
    }

    cancelBlinking(): void {
        this.blinkIntervals.forEach((intervalId) => {
            clearInterval(intervalId);
        });
        this.blinkIntervals = [];
    }

    blinkCheat(diff: Vec2[], context: CanvasRenderingContext2D): void {
        let isBlinkVisible = false;
        const originalColors: { [key: string]: string } = {};

        const draw = () => {
            for (const pix of diff) {
                const key = `${pix.x}-${pix.y}`;
                if (isBlinkVisible) {
                    this.drawPixel(pix, context, 'red');
                } else {
                    this.drawPixel(pix, context, originalColors[key]);
                }
            }
            isBlinkVisible = !isBlinkVisible;
        };

        for (const pix of diff) {
            const key = `${pix.x}-${pix.y}`;
            originalColors[key] = this.getPixelColor(pix, context);
        }

        const intervalId = setInterval(draw, TWO_FIFTY);
        this.blinkIntervals.push(intervalId as unknown as number);
    }

    blinkHint(diff: Vec2[], context: CanvasRenderingContext2D, nbHints: number): void {
        let currentColor = 'red';
        switch (nbHints) {
            case 0: {
                const segmentWidth = 40;
                const quadX = Math.floor(diff[0].x / HALF_WIDTH);
                const quadY = Math.floor(diff[0].y / HALF_HEIGHT);
                if (quadX === 0) {
                    for (let x = 0; x < HALF_WIDTH; x += segmentWidth) {
                        for (let i = 0; i < segmentWidth; i++) {
                            context.lineWidth = 3;
                            const pix: Vec2 = { x: x + i, y: HALF_HEIGHT };
                            this.drawPixel(pix, context, currentColor);
                        }
                        currentColor = currentColor === 'red' ? 'blue' : 'red';
                    }
                } else {
                    for (let x = HALF_WIDTH; x < IMAGE_WIDTH; x += segmentWidth) {
                        for (let i = 0; i < segmentWidth; i++) {
                            context.lineWidth = 3;
                            const pix: Vec2 = { x: x + i, y: HALF_HEIGHT };
                            this.drawPixel(pix, context, currentColor);
                        }
                        currentColor = currentColor === 'red' ? 'blue' : 'red';
                    }
                }
                if (quadY === 0) {
                    for (let y = 0; y < HALF_HEIGHT; y += segmentWidth) {
                        for (let i = 0; i < segmentWidth; i++) {
                            context.lineWidth = 3;
                            const pix: Vec2 = { x: HALF_WIDTH, y: y + i };
                            this.drawPixel(pix, context, currentColor);
                        }
                        currentColor = currentColor === 'red' ? 'blue' : 'red';
                    }
                } else {
                    for (let y = HALF_HEIGHT; y < IMAGE_HEIGHT; y += segmentWidth) {
                        for (let i = 0; i < segmentWidth; i++) {
                            context.lineWidth = 3;
                            const pix: Vec2 = { x: HALF_WIDTH, y: y + i };
                            this.drawPixel(pix, context, currentColor);
                        }
                        currentColor = currentColor === 'red' ? 'blue' : 'red';
                    }
                }

                break;
            }
            case 1: {
                const quadX = Math.floor(diff[0].x / QUARTER_WIDTH);
                const quadY = Math.floor(diff[0].y / QUARTER_HEIGHT);
                const segmentWidth = 20;
                for (let x = QUARTER_WIDTH * quadX; x < QUARTER_WIDTH * (quadX + 1); x += segmentWidth) {
                    for (let i = 0; i < segmentWidth; i++) {
                        context.lineWidth = 3;
                        let pix: Vec2 = { x: x + i, y: QUARTER_HEIGHT * quadY };
                        this.drawPixel(pix, context, currentColor);
                        pix = { x: x + i, y: QUARTER_HEIGHT * (quadY + 1) };
                        this.drawPixel(pix, context, currentColor);
                    }
                    currentColor = currentColor === 'red' ? 'blue' : 'red';
                }
                for (let y = QUARTER_HEIGHT * quadY; y < QUARTER_HEIGHT * (quadY + 1); y += segmentWidth) {
                    for (let i = 0; i < segmentWidth; i++) {
                        context.lineWidth = 3;
                        let pix: Vec2 = { x: QUARTER_WIDTH * quadX, y: y + i };
                        this.drawPixel(pix, context, currentColor);
                        pix = { x: QUARTER_WIDTH * (quadX + 1), y: y + i };
                        this.drawPixel(pix, context, currentColor);
                    }
                    currentColor = currentColor === 'red' ? 'blue' : 'red';
                }

                break;
            }
            case 2: {
                const midPoint = { x: IMAGE_WIDTH / 2, y: IMAGE_HEIGHT / 2 };
                const arrowHead = 'red';
                const arrowBody = 'blue';
                const arrowLength = 100;
                const arrowHeadSize = 20;
                const radius = 50;

                const dx = diff[0].x - midPoint.x;
                const dy = diff[0].y - midPoint.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                let arrowStart;
                let angle;
                if (distance <= radius) {
                    arrowStart = { x: IMAGE_WIDTH / 2, y: 10 };
                    angle = Math.atan2(midPoint.y - arrowStart.y, midPoint.x - arrowStart.x);
                } else {
                    arrowStart = midPoint;
                    angle = Math.atan2(dy, dx);
                }

                context.beginPath();
                context.moveTo(arrowStart.x, arrowStart.y);
                context.lineTo(arrowStart.x + arrowLength * Math.cos(angle), arrowStart.y + arrowLength * Math.sin(angle));
                context.strokeStyle = arrowBody;
                context.lineWidth = 3;
                context.stroke();

                context.beginPath();
                context.moveTo(arrowStart.x + arrowLength * Math.cos(angle), arrowStart.y + arrowLength * Math.sin(angle));
                context.lineTo(
                    arrowStart.x + arrowLength * Math.cos(angle) - arrowHeadSize * Math.cos(angle - Math.PI / SIX),
                    arrowStart.y + arrowLength * Math.sin(angle) - arrowHeadSize * Math.sin(angle - Math.PI / SIX),
                );
                context.lineTo(
                    arrowStart.x + arrowLength * Math.cos(angle) - arrowHeadSize * Math.cos(angle + Math.PI / SIX),
                    arrowStart.y + arrowLength * Math.sin(angle) - arrowHeadSize * Math.sin(angle + Math.PI / SIX),
                );
                context.lineTo(arrowStart.x + arrowLength * Math.cos(angle), arrowStart.y + arrowLength * Math.sin(angle));
                context.closePath();
                context.fillStyle = arrowHead;
                context.fill();

                break;
            }
        }
    }
}
