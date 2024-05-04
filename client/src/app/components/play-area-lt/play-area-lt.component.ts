/* eslint-disable no-empty */
/* eslint-disable max-params */
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import { DrawService } from '@app/services/draw/draw.service';
import { GamesService } from '@app/services/games/games.service';
import { HintsService } from '@app/services/hints/hints.service';
import { ModeSoloService } from '@app/services/mode-solo/mode-solo.service';
import { MouseService } from '@app/services/mouse/mouse.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { FIVE_THOUSAND, IMAGE_HEIGHT, IMAGE_WIDTH, TEN, THOUSAND_MILLISECONDS, TWO_FIFTY, TWO_THOUSAND } from '@common/global-constants';
@Component({
    selector: 'app-play-area-lt',
    templateUrl: './play-area-lt.component.html',
    styleUrls: ['./play-area-lt.component.scss'],
    providers: [GamesService],
})
export class PlayAreaLtComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() srcOriginalImg: string;
    @Input() srcModifiedImg: string;
    @Input() diffArray: Vec2[][];
    @Input() isEndGame: boolean;
    @Input() isHost: boolean;
    @Input() isSolo: boolean;
    @Input() diffHost: number;
    @Input() diffInv: number;
    @Input() isReplay: boolean;
    @Input() nbHints: number;
    @HostListener('document:keydown', ['$event'])
    @ViewChild('bgdL')
    bgdL: ElementRef<HTMLCanvasElement>;
    @ViewChild('bgdR') bgdR: ElementRef<HTMLCanvasElement>;
    @ViewChild('blinkL') blinkL: ElementRef<HTMLCanvasElement>;
    @ViewChild('blinkR') blinkR: ElementRef<HTMLCanvasElement>;
    @ViewChild('errorLCanvas', { static: false }) private errLCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('errorRCanvas', { static: false }) private errRCanvas!: ElementRef<HTMLCanvasElement>;
    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    wrongAudio = new Audio('./assets/wrong-answer.mp3');
    rightAudio = new Audio('./assets/right-answer.mp3');
    isError = false;
    isCheatMode = false;
    showCanvas = true;
    originalImage = new Image();
    modifiedImage = new Image();
    imageOriginal: string;
    imageModified: string;
    private canvasSize = { x: IMAGE_WIDTH, y: IMAGE_HEIGHT };
    constructor(
        private readonly drawService: DrawService,
        public gamesService: GamesService,
        public modeSoloService: ModeSoloService,
        public mouseService: MouseService,
        private socketClientService: SocketClientService,
        private hintsService: HintsService,
    ) {}

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    @HostListener('document:keydown', ['$event'])
    detectKey(event: KeyboardEvent) {
        if (!this.isReplay) {
            if (event.key === 'i' && this.isSolo) {
                this.hintMode();
            }
            if (event.key === 't') {
                this.cheatMode();
            }
        }
    }
    cheatMode() {
        if (!this.isReplay) {
            this.isCheatMode = !this.isCheatMode;
        }
        this.drawService.errLContext.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
        this.drawService.errRContext.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);

        for (const difference of this.diffArray) {
            if (!this.isCheatMode) {
                this.drawService.cancelBlinking();
            }

            if (this.isCheatMode && difference.length > 0) {
                this.drawService.blinkCheat(difference, this.drawService.errRContext);
                this.drawService.blinkCheat(difference, this.drawService.errLContext);
            }
        }
    }

    hintMode() {
        this.hintsService.diffArray = this.diffArray;
        this.hintsService.giveHint(this.nbHints);
    }

    async ngOnInit(): Promise<void> {
        this.socketClientService.on('blinkDiff', (val: { position: number }) => {
            this.blinkDiff(this.diffArray[val.position]);
            this.diffArray.splice(val.position, 1);
        });
        this.hintsService.diffArray = this.diffArray;
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes) {
            this.srcOriginalImg = await changes.srcOriginalImg.currentValue;
            this.srcModifiedImg = await changes.srcModifiedImg.currentValue;
            this.diffArray = await changes.diffArray.currentValue;
            this.drawService.errLContext = this.errLCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.drawService.errRContext = this.errRCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.serverImageLeft();
            this.serverImageRight();
        }
    }

    ngAfterViewInit(): void {
        this.drawService.errLContext = this.errLCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.serverImageLeft();

        this.drawService.errRContext = this.errRCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.serverImageRight();
    }

    findClickPos(click: MouseEvent) {
        const isClicked = this.mouseService.leftClickDetect(click);
        if (isClicked) {
            this.mousePosition = { x: click.offsetX, y: click.offsetY };
            this.isDifference(this.mousePosition);
        }
    }

    isDifference(mousePosition: Vec2) {
        if (this.isSolo) {
            let isDiff: boolean;
            this.gamesService.postVector(mousePosition, this.diffArray).subscribe((response) => {
                isDiff = response.body === 'true' ? true : false;
                if (isDiff) {
                    this.playSong(true);
                    this.socketClientService.send('differenceFound');
                    this.modeSoloService.incrementNumberOfDifferences();
                } else {
                    this.blockClick1Sec();
                    this.drawService.drawWord('ERREUR', mousePosition, this.drawService.errLContext);
                    this.drawService.drawWord('ERREUR', mousePosition, this.drawService.errRContext);
                    this.playSong(false);
                    this.socketClientService.send('soloErrorFound');
                }
            });
        } else {
            const hostId = window.location.href.split('LimitedTimeMultiplayerGame/')[1].split('/')[0];
            const gameId = window.location.href.split('LimitedTimeMultiplayerGame/')[1].split('/')[1];
            let isDiff: boolean;
            this.gamesService.postVector(mousePosition, this.diffArray).subscribe((response) => {
                isDiff = response.body === 'true' ? true : false;
                if (isDiff) {
                    this.playSong(true);
                    this.socketClientService.send('diffFound', { diffHost: this.diffHost, diffInv: this.diffInv, idHost: hostId, idGame: gameId });
                } else {
                    this.blockClick1Sec();
                    this.drawService.drawWord('ERREUR', mousePosition, this.drawService.errLContext);
                    this.drawService.drawWord('ERREUR', mousePosition, this.drawService.errRContext);
                    this.playSong(false);
                    this.socketClientService.send('errorFound', {
                        idHost: hostId,
                        idGame: gameId,
                    });
                }
            });
        }
    }

    switchCanvas() {
        this.showCanvas = !this.showCanvas;
    }

    blinkDiff(diff: Vec2[]) {
        let flash = TEN;
        let delay = TWO_THOUSAND;
        const deleteDelay = FIVE_THOUSAND;
        const bgdR = this.bgdR.nativeElement.getContext('2d');
        const bgdL = this.bgdL.nativeElement.getContext('2d');
        const blinkL = this.blinkL.nativeElement.getContext('2d');
        const blinkR = this.blinkR.nativeElement.getContext('2d');
        for (const pix of diff) {
            const color = this.drawService.getPixelColor(pix, bgdL);
            this.drawService.drawPixel(pix, blinkL, color);
            this.drawService.drawPixel(pix, blinkR, color);
        }
        while (flash > 0) {
            setTimeout(() => {
                this.switchCanvas();
            }, delay);
            flash--;
            delay += TWO_FIFTY;
        }
        setTimeout(() => {
            this.drawService.errLContext.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
            this.drawService.errRContext.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
            for (const pix of diff) {
                this.drawService.drawPixel(pix, bgdR, this.drawService.getPixelColor(pix, bgdL));
            }
        }, deleteDelay);
    }

    serverImageLeft() {
        const bgdL = this.bgdL.nativeElement;
        const contextL = bgdL.getContext('2d');
        this.gamesService.getGameImage(this.srcOriginalImg).subscribe((res) => {
            this.originalImage.src = 'data:image/bmp;base64,' + res;
            this.originalImage.onload = () => {
                contextL.drawImage(this.originalImage, 0, 0);
            };
        });
    }

    serverImageRight() {
        const bgdR = this.bgdR.nativeElement;
        const contextR = bgdR.getContext('2d');
        this.gamesService.getGameImage(this.srcModifiedImg).subscribe((res) => {
            this.modifiedImage.src = 'data:image/bmp;base64,' + res;
            this.modifiedImage.onload = () => {
                contextR.drawImage(this.modifiedImage, 0, 0);
            };
        });
    }

    findErrorPosition(mousePosition: Vec2, diffArray: Vec2[][]): number {
        const notFound = -1;
        for (let i = 0; i < diffArray.length; i++) {
            const error = diffArray[i];
            for (const position of error) {
                if (JSON.stringify(position) === JSON.stringify(mousePosition)) {
                    return i;
                }
            }
        }
        return notFound;
    }

    playSong(isRight: boolean): void {
        try {
            if (isRight) {
                this.rightAudio.play();
            } else {
                this.wrongAudio.play();
            }
        } catch (err: unknown) {}
    }

    blockClick1Sec() {
        this.isError = true;
        setTimeout(() => {
            this.isError = false;
        }, THOUSAND_MILLISECONDS);
    }
}
