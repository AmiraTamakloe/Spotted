/* eslint-disable no-console */
/* eslint-disable max-params */
/* eslint-disable max-lines */
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { DialogNamePopupComponent } from '@app/components/dialog-name-popup/dialog-name-popup.component';
import { ImageMessageVect } from '@app/interfaces/image-message-vect';
import { UrlVec } from '@app/interfaces/url-vec';
import { Vec2 } from '@app/interfaces/vec2';
import { BitDepthCheckService } from '@app/services/bit-depth-check/bit-depth-check.service';
import { DifferencesAlgorithmService } from '@app/services/differences-algorithm/differences-algorithm.service';
import { DifferencesMatrixService } from '@app/services/differences-matrix/differences-matrix.service';
import { EnlargementSliderService } from '@app/services/enlargement-slider/enlargement-slider.service';
import { Game } from '@app/services/games/games.model';
import { GamesService } from '@app/services/games/games.service';
import { TypeCheckService } from '@app/services/type-check/type-check.service';
import { FileInterface } from '@common/fileInterface';
import { IMAGE_HEIGHT, IMAGE_TYPE_HIGHER_SLICE, IMAGE_TYPE_LOWER_SLICE, IMAGE_WIDTH, NEG_UN } from '@common/global-constants';

@Component({
    selector: 'app-game-creation-area',
    templateUrl: './game-creation-area.component.html',
    styleUrls: ['./game-creation-area.component.scss'],
    providers: [DifferencesMatrixService, EnlargementSliderService, DifferencesAlgorithmService],
})
export class GameCreationAreaComponent implements AfterViewInit {
    @ViewChild('htmlId') htmlId: ElementRef<HTMLCanvasElement>;
    @ViewChild('cLeft') cLeft: ElementRef<HTMLCanvasElement>;
    @ViewChild('cRight') cRight: ElementRef<HTMLCanvasElement>;
    @ViewChild('bgLeft') bgLeft: ElementRef<HTMLCanvasElement>;
    @ViewChild('bgRight') bgRight: ElementRef<HTMLCanvasElement>;
    @ViewChild('cTemp') cTemp: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasMergeL') canvasMergeL: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasMergeR') canvasMergeR: ElementRef<HTMLCanvasElement>;
    imagesMessages: ImageMessageVect = {
        msgLeft: 'Seules les images du type 24-bits bpm sont acceptées !',
        msgRight: 'Seules les images du type 24-bits bpm sont acceptées !',
    };
    imagesUrl: UrlVec = { urlLeft: '', urlRight: '' };
    isLeftInputHidden = true;
    rightInputHidden = true;
    isAllInputHidden = true;
    isDeactivateValidationLeft = true;
    isDeactivateValidationRight = true;
    leftImage = new Image();
    rightImage = new Image();
    base = new Image();
    range = 3;
    gameName: string;
    description: string;
    enlargementVal: number;
    result: HTMLCanvasElement;
    matrix: number[][];
    arrayDiff: Vec2[][];
    numDiff: number;
    level: string;
    isTypeCheck: boolean;
    isBitCheck: boolean;
    notBmp: string | ArrayBuffer;
    imageReader = new FileReader();
    canvasLeftContext: CanvasRenderingContext2D;
    canvasRightContext: CanvasRenderingContext2D;
    bgLeftContext: CanvasRenderingContext2D;
    bgRightContext: CanvasRenderingContext2D;
    canvasMergeLeftContext: CanvasRenderingContext2D;
    canvasMergeRightContext: CanvasRenderingContext2D;
    canvasTempContext: CanvasRenderingContext2D;
    isPainting: boolean = false;
    isLeft: boolean;
    stroke: string;
    lineWidth: number = 3;
    lastX: number;
    lastY: number;
    isRec: boolean = false;
    isCleanUp: boolean = false;
    historic: { gauche: ImageData; right: ImageData }[];
    historicRec: { gauche: CanvasRenderingContext2D; right: CanvasRenderingContext2D }[];
    indexRight: number;
    index: number = 0;
    isRectangle = true;
    imgDataR: ImageData;
    imgDataL: ImageData;
    constructor(
        private differencesAlgorithmService: DifferencesAlgorithmService,
        private differencesMatrixService: DifferencesMatrixService,
        private enlargementSliderService: EnlargementSliderService,
        private bitDepthCheckService: BitDepthCheckService,
        private typeCheckService: TypeCheckService,
        public dialog: MatDialog,
        public gamesService: GamesService,
    ) {
        this.enlargementVal = this.enlargementSliderService.enlargementValue;
    }

    @HostListener('document:keydown.control.z', ['$event'])
    keyBoardUndo(event: KeyboardEvent) {
        if (event.ctrlKey && event.code === 'KeyZ') {
            this.undo();
            event.preventDefault();
        }
    }
    @HostListener('document:keydown.control.shift.z', ['$event'])
    keyBoardRedo(event: KeyboardEvent) {
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyZ') {
            this.redo();
            event.preventDefault();
        }
    }

    @HostListener('document:keydown', ['$event'])
    @HostListener('document:keyup', ['$event'])
    carreOuRectangle(event: KeyboardEvent) {
        if (event.key === 'Shift') {
            this.isRectangle = event.type === 'keyup';
        }
    }

    undo() {
        if (this.index < 1) {
            return;
        } else {
            this.canvasLeftContext.putImageData(this.historic[this.index - 1].gauche, 0, 0);
            this.canvasRightContext.putImageData(this.historic[this.index - 1].right, 0, 0);
            this.index -= 1;
        }
    }

    redo() {
        if (this.index > this.historic.length - 2) {
            return;
        } else {
            this.canvasLeftContext.putImageData(this.historic[this.index + 1].gauche, 0, 0);
            this.canvasRightContext.putImageData(this.historic[this.index + 1].right, 0, 0);
            this.index += 1;
        }
    }

    ngAfterViewInit(): void {
        this.canvasLeftContext = this.cLeft.nativeElement.getContext('2d');
        this.canvasRightContext = this.cRight.nativeElement.getContext('2d');

        this.bgLeftContext = this.bgLeft.nativeElement.getContext('2d');
        this.bgRightContext = this.bgRight.nativeElement.getContext('2d');

        this.canvasMergeLeftContext = this.canvasMergeL.nativeElement.getContext('2d');
        this.canvasMergeLeftContext.fillStyle = 'white';
        this.canvasMergeLeftContext.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

        this.canvasMergeRightContext = this.canvasMergeR.nativeElement.getContext('2d');
        this.canvasMergeRightContext.fillStyle = 'white';
        this.canvasMergeRightContext.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

        this.canvasMergeR.nativeElement.width = IMAGE_WIDTH;
        this.canvasMergeR.nativeElement.height = IMAGE_HEIGHT;

        this.cRight.nativeElement.width = IMAGE_WIDTH;
        this.cRight.nativeElement.height = IMAGE_HEIGHT;

        this.bgRight.nativeElement.width = IMAGE_WIDTH;
        this.bgRight.nativeElement.height = IMAGE_HEIGHT;

        this.canvasMergeL.nativeElement.width = IMAGE_WIDTH;
        this.canvasMergeL.nativeElement.height = IMAGE_HEIGHT;

        this.cLeft.nativeElement.width = IMAGE_WIDTH;
        this.cLeft.nativeElement.height = IMAGE_HEIGHT;

        this.bgLeft.nativeElement.width = IMAGE_WIDTH;
        this.bgLeft.nativeElement.height = IMAGE_HEIGHT;

        this.canvasLeftContext.lineCap = 'round';
        this.canvasRightContext.lineCap = 'round';
        this.canvasTempContext = this.cTemp.nativeElement.getContext('2d');
        this.historic = [
            {
                gauche: this.canvasLeftContext.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT),
                right: this.canvasRightContext.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT),
            },
        ];
    }
    updateSettings(): void {
        this.canvasLeftContext.strokeStyle = this.stroke;
        this.canvasLeftContext.lineWidth = this.lineWidth;
        this.canvasLeftContext.fillStyle = this.stroke;

        this.canvasRightContext.lineWidth = this.lineWidth;
        this.canvasRightContext.strokeStyle = this.stroke;
        this.canvasRightContext.fillStyle = this.stroke;
    }

    clickDown(isLeft: boolean, event: MouseEvent): void {
        this.checkArrays();
        this.isPainting = true;
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        if (!this.isCleanUp) {
            if (isLeft) {
                this.canvasLeftContext.beginPath();
                this.canvasLeftContext.lineTo(event.offsetX, event.offsetY);
                this.canvasLeftContext.stroke();
                this.canvasLeftContext.beginPath();
            } else {
                this.canvasRightContext.beginPath();
                this.canvasRightContext.lineTo(event.offsetX, event.offsetY);
                this.canvasRightContext.stroke();
                this.canvasRightContext.beginPath();
            }
        } else {
            if (isLeft) {
                this.canvasLeftContext.clearRect(this.lastX, this.lastY, this.lineWidth, this.lineWidth);
            } else {
                this.canvasRightContext.clearRect(this.lastX, this.lastY, this.lineWidth, this.lineWidth);
            }
        }
    }

    mouseMove(isLeft: boolean, event: MouseEvent): void {
        if (!this.isPainting) return;
        if (!this.isCleanUp) {
            if (isLeft) {
                this.canvasLeftContext.lineTo(event.offsetX, event.offsetY);
                this.canvasLeftContext.stroke();
            } else {
                this.canvasRightContext.lineTo(event.offsetX, event.offsetY);
                this.canvasRightContext.stroke();
            }
        } else {
            if (isLeft) {
                this.canvasLeftContext.clearRect(this.lastX, this.lastY, this.lineWidth, this.lineWidth);
            } else {
                this.canvasRightContext.clearRect(this.lastX, this.lastY, this.lineWidth, this.lineWidth);
            }
        }
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
    }

    cleaning(): void {
        this.isRec = false;
        this.isCleanUp = true;
    }

    drawing(): void {
        this.isRec = false;
        this.isCleanUp = false;
    }
    leaved(): void {
        this.isPainting = false;
    }

    clickUp(): void {
        this.isPainting = false;
        this.saveImage();
    }
    saveImage(): void {
        const newHist = {
            gauche: this.canvasLeftContext.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT),
            right: this.canvasRightContext.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT),
        };
        this.historic.push(newHist);
        this.index += 1;
    }

    recActivate(): void {
        this.isRec = true;
        this.canvasRightContext.beginPath();
        this.canvasLeftContext.beginPath();
    }

    reverse(): void {
        this.canvasTempContext.drawImage(this.cRight.nativeElement, 0, 0);
        this.canvasRightContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.canvasRightContext.drawImage(this.cLeft.nativeElement, 0, 0);
        this.canvasLeftContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.canvasLeftContext.drawImage(this.cTemp.nativeElement, 0, 0);
        this.canvasTempContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.saveImage();
    }

    duplicLeft(): void {
        this.canvasRightContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.canvasRightContext.drawImage(this.cLeft.nativeElement, 0, 0);
        this.saveImage();
    }

    duplicRight(): void {
        this.canvasLeftContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.canvasLeftContext.drawImage(this.cRight.nativeElement, 0, 0);
        this.saveImage();
    }

    startRectangle(event: MouseEvent): void {
        this.checkArrays();
        this.isPainting = true;
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        this.canvasRightContext.beginPath();
        this.canvasLeftContext.beginPath();
    }

    async moveRectangle(leftOrRight: boolean, event: MouseEvent): Promise<void> {
        if (!this.isPainting) return;
        this.saveImage();
        this.undo();
        this.historic.pop();

        const width = event.offsetX - this.lastX;
        const height = event.offsetY - this.lastY;

        let rectWidth = width;
        let rectHeight = height;

        let startX = this.lastX;
        let startY = this.lastY;

        if (!this.isRectangle) {
            const minDimension = Math.min(Math.abs(width), Math.abs(height));
            rectWidth = rectHeight = minDimension;

            const horizontalDirection = width < 0 ? NEG_UN : 1;
            const verticalDirection = height < 0 ? NEG_UN : 1;

            startX = this.lastX + (horizontalDirection < 0 ? -minDimension : 0);
            startY = this.lastY + (verticalDirection < 0 ? -minDimension : 0);
        } else {
            const horizontalDirection = width < 0 ? NEG_UN : 1;
            const verticalDirection = height < 0 ? NEG_UN : 1;

            startX = this.lastX + (horizontalDirection < 0 ? width : 0);
            startY = this.lastY + (verticalDirection < 0 ? height : 0);

            rectWidth = Math.abs(rectWidth);
            rectHeight = Math.abs(rectHeight);
        }

        if (leftOrRight) {
            this.canvasLeftContext.clearRect(startX, startY, rectWidth, rectHeight);
            this.canvasLeftContext.fillRect(startX, startY, rectWidth, rectHeight);
            this.canvasLeftContext.stroke();
        } else {
            this.canvasRightContext.clearRect(startX, startY, rectWidth, rectHeight);
            this.canvasRightContext.fillRect(startX, startY, rectWidth, rectHeight);
            this.canvasRightContext.stroke();
        }
    }

    endRectangle(event: MouseEvent): void {
        if (!this.isPainting) return;
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        this.isPainting = false;
        this.saveImage();
    }

    clearArea(): void {
        this.canvasLeftContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.canvasRightContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.saveImage();
    }
    checkArrays(): void {
        if (this.index < this.historic.length) {
            this.historic.splice(this.index + 1, this.historic.length);
        }
    }

    decrement() {
        this.enlargementVal = this.enlargementSliderService.decrement();
    }

    increment() {
        this.enlargementVal = this.enlargementSliderService.increment();
    }

    async selectBMPImage(e: Event, id: number) {
        let element: HTMLInputElement;
        let imageSize: number;
        let fileInterface: FileInterface;
        let imageFile: File;
        try {
            element = e.currentTarget as HTMLInputElement;
        } catch (err) {
            console.log(err);
        }
        try {
            fileInterface = {
                fileArray: element.files,
                fileSize: element.files?.item(0)?.size,
            };
        } catch (err) {
            console.log(err);
        }
        try {
            imageFile = fileInterface.fileArray.item(0);
        } catch (err) {
            console.log(err);
        }
        try {
            this.imageReader.readAsDataURL(imageFile);
        } catch (err) {
            console.log(err);
        }
        this.imageReader.onload = () => {
            try {
                imageSize = fileInterface.fileSize;
            } catch (err) {
                console.log(err);
            }
            const base64 = this.imageReader.result + '';
            this.notBmp = base64.slice(IMAGE_TYPE_LOWER_SLICE, IMAGE_TYPE_HIGHER_SLICE);
            this.isTypeCheck = this.typeCheckService.typeCheck(this.notBmp as string);
            this.isBitCheck = this.bitDepthCheckService.bitDepthCheck(imageSize);
            this.imageVerification(this.imageReader, base64, id);
        };
    }

    async imageVerification(imageReader: FileReader, base64: string, id: number) {
        base64 = base64.split(',')[1];

        if (this.isBitCheck || this.isTypeCheck) {
            if (id === 1) {
                this.imagesMessages.msgLeft = "Ceci n'est pas une image bmp de 24 bits";
            } else if (id === 2) {
                this.imagesMessages.msgRight = "Ceci n'est pas une image bmp de 24 bits";
            } else {
                this.imagesMessages.msgLeft = this.imagesMessages.msgRight = "Ceci n'est pas une image bmp de 24 bits";
            }
        } else {
            switch (id) {
                case 1:
                    {
                        this.leftImage.src = encodeURI(imageReader.result as string);
                        this.imagesMessages.msgLeft = '';
                        this.imagesUrl.urlLeft = imageReader.result;
                        this.isLeftInputHidden = this.isDeactivateValidationLeft = false;
                        const img = new Image();
                        img.src = imageReader.result + '';
                        img.onload = () => {
                            this.bgLeftContext.drawImage(img, 0, 0);
                        };
                    }
                    break;

                case 2:
                    {
                        this.rightImage.src = encodeURI(imageReader.result as string);
                        this.imagesMessages.msgRight = '';
                        this.imagesUrl.urlRight = imageReader.result;
                        this.rightInputHidden = this.isDeactivateValidationRight = false;
                        const img = new Image();
                        img.src = imageReader.result + '';
                        img.onload = () => {
                            this.bgRightContext.drawImage(img, 0, 0);
                        };
                    }
                    break;
                default:
                    {
                        this.leftImage.src = encodeURI(imageReader.result as string);
                        this.imagesUrl.urlLeft = this.imagesUrl.urlRight = imageReader.result;
                        this.imagesMessages.msgLeft = this.imagesMessages.msgRight = '';
                        this.isLeftInputHidden =
                            this.rightInputHidden =
                            this.isAllInputHidden =
                            this.isDeactivateValidationLeft =
                            this.isDeactivateValidationRight =
                                false;
                        const img = new Image();
                        img.src = imageReader.result + '';
                        img.onload = () => {
                            this.bgLeftContext.drawImage(img, 0, 0);
                            this.bgRightContext.drawImage(img, 0, 0);
                        };
                    }
                    break;
            }
        }
    }

    deleteImage(id: number) {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: {
                title: 'Confirmation',
                message: "Êtes vous sûre de votre choix ? Vous ne pourrez pas la retelécharger l'image(s) avant d'en avoir mis une autre",
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.isLeftInputHidden = true;
                this.rightInputHidden = true;
                switch (id) {
                    case 0:
                        this.imagesUrl.urlLeft = '';
                        this.imagesUrl.urlRight = '';
                        this.bgLeftContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
                        this.bgRightContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
                        this.canvasMergeLeftContext.fillStyle = 'white';
                        this.canvasMergeLeftContext.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
                        this.canvasMergeRightContext.fillStyle = 'white';
                        this.canvasMergeRightContext.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
                        this.imagesMessages.msgLeft = 'Seules les images du type 24-bits bpm sont acceptées !';
                        this.imagesMessages.msgRight = 'Seules les images du type 24-bits bpm sont acceptées !';
                        this.saveImage();
                        this.isAllInputHidden = true;
                        break;
                    case 1:
                        this.imagesUrl.urlLeft = '';
                        this.bgLeftContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
                        this.canvasMergeLeftContext.fillStyle = 'white';
                        this.canvasMergeLeftContext.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
                        this.saveImage();
                        this.imagesMessages.msgLeft = 'Seules les images du type 24-bits bpm sont acceptées !';
                        break;
                    case 2:
                        this.bgRightContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
                        this.canvasMergeLeftContext.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
                        this.canvasMergeRightContext.fillStyle = 'white';
                        this.saveImage();
                        this.imagesMessages.msgRight = 'Seules les images du type 24-bits bpm sont acceptées !';
                        break;
                }
            }
        });
    }
    async openDialog(): Promise<void> {
        this.canvasMergeLeftContext.drawImage(this.bgLeft.nativeElement, 0, 0);
        this.canvasMergeLeftContext.drawImage(this.cLeft.nativeElement, 0, 0);

        const canvasL = document.createElement('canvas');
        const ctxL = canvasL.getContext('2d');
        this.imgDataL = this.canvasMergeLeftContext.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        canvasL.width = this.imgDataL.width;
        canvasL.height = this.imgDataL.height;
        ctxL.putImageData(this.imgDataL, 0, 0);

        this.canvasMergeRightContext.drawImage(this.bgRight.nativeElement, 0, 0);
        this.canvasMergeRightContext.drawImage(this.cRight.nativeElement, 0, 0);

        const canvasR = document.createElement('canvas');
        const ctxR = canvasR.getContext('2d');
        this.imgDataR = this.canvasMergeRightContext.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        canvasR.width = this.imgDataR.width;
        canvasR.height = this.imgDataR.height;
        ctxR.putImageData(this.imgDataR, 0, 0);

        this.gamesService.gameImgs[0] = canvasL.toDataURL().split(',')[1];
        this.gamesService.gameImgs[1] = canvasR.toDataURL().split(',')[1];

        const canvasLeftUrl = this.cLeft.nativeElement.toDataURL();
        this.differencesMatrixService.canvasLeftUrl = canvasLeftUrl;
        const canvasRightUrl = this.cRight.nativeElement.toDataURL();
        this.differencesMatrixService.canvasRightUrl = canvasRightUrl;
        this.differencesMatrixService.htmlId = this.htmlId;
        this.differencesMatrixService.enlargementRange = this.enlargementSliderService.enlargementValue;
        this.differencesMatrixService.leftUrl = this.imagesUrl.urlLeft;
        this.differencesMatrixService.rightUrl = this.imagesUrl.urlRight;
        this.differencesMatrixService.imageDataL = this.imgDataL;
        this.differencesMatrixService.imageDataR = this.imgDataR;
        this.result = this.differencesMatrixService.imageMatrix();
        this.matrix = this.differencesMatrixService.getImgMat();
        const arrDiff = this.differencesAlgorithmService.differencesLocationArray(this.matrix);
        this.level = this.differencesAlgorithmService.difficultyLevel(this.matrix);
        this.gamesService.gameImgs[2] = this.result.toDataURL().split(',')[1];
        if (this.level !== 'Invalide') {
            const dialog = this.dialog.open(DialogNamePopupComponent, {
                data: { gameName: this.gameName, description: this.description, canvas: this.result, numDiff: arrDiff.length },
            });
            dialog.afterClosed().subscribe(async (res) => {
                if (res) {
                    const date: Date = new Date();
                    const folderName1 = date.getTime();
                    const folderName2 = date.getTime() + 1;
                    const folderName3 = date.getTime() + 2;
                    this.gamesService.postImg(folderName1, folderName2, folderName3);

                    this.gamesService.gameName = res.gameName;
                    this.gamesService.difficulty = this.level;
                    this.gamesService.gameDescr = res.description;
                    this.gamesService.numberOfDiff = arrDiff.length;
                    this.gamesService.arrayDiff = arrDiff;
                    this.gamesService.createNewGame();

                    this.gamesService.gameList.subscribe((listGames) => {
                        this.gamesService.games = listGames as Game[];
                    });
                }
            });
        } else {
            this.deleteImage(0);
        }
    }
}
