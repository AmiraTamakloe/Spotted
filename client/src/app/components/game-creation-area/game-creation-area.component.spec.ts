/* eslint-disable max-lines */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClient, HttpHandler } from '@angular/common/http';
// import { DialogNamePopupComponent } from '@angular/components/dialog-name-popup/dialog-name-popup.component';
import { CUSTOM_ELEMENTS_SCHEMA /** ElementRef */ } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GameCreationAreaComponent } from '@app/components/game-creation-area/game-creation-area.component';
import { DifferencesMatrixService } from '@app/services/differences-matrix/differences-matrix.service';
import { EnlargementSliderService } from '@app/services/enlargement-slider/enlargement-slider.service';
import { GamesService } from '@app/services/games/games.service';

describe('GameCreationAreaComponent', () => {
    let component: GameCreationAreaComponent;
    let fixture: ComponentFixture<GameCreationAreaComponent>;
    let enlargementSliderService: EnlargementSliderService;
    let differencesMatrixService: DifferencesMatrixService;
    let clickEvent: Event;
    let stringMsg: string;
    let click: MouseEvent;
    let tape: KeyboardEvent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, MatIconModule, MatDialogModule, FormsModule, BrowserAnimationsModule],
            declarations: [GameCreationAreaComponent],
            providers: [GamesService, MatDialog, MatDialogModule, HttpClient, HttpHandler, EnlargementSliderService, DifferencesMatrixService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        tape = new KeyboardEvent('t', { code: 'KeyZ' });
        click = new MouseEvent('FakeClick');
        fixture = TestBed.createComponent(GameCreationAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        enlargementSliderService = TestBed.inject(EnlargementSliderService);
        differencesMatrixService = TestBed.inject(DifferencesMatrixService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should test undo', () => {
        component.keyBoardUndo(tape);
        expect(tape.key).toEqual('');
    });
    it('should test redo', () => {
        component.keyBoardRedo(tape);
        expect(tape.key).toEqual('');
    });
    it('should test square 1', () => {
        tape = new KeyboardEvent('t', { key: 'Shift' });
        component.carreOuRectangle(tape);
        expect(component.isRectangle).toEqual(false);
    });
    it('update setting be called and all executed', () => {
        component.updateSettings();
        expect(component.updateSettings).toHaveBeenCalled;
    });
    it('update setting be called and all executed', () => {
        component.clickDown(true, click);
        expect(component.checkArrays).toHaveBeenCalled;
        component.clickDown(false, click);
        expect(component.checkArrays).toHaveBeenCalled;
        component.isCleanUp = true;
        component.clickDown(true, click);
        expect(component.checkArrays).toHaveBeenCalled;
        component.clickDown(false, click);
        expect(component.checkArrays).toHaveBeenCalled;
    });
    it('update setting be called and all executed', () => {
        component.isPainting = true;
        component.mouseMove(true, click);
        expect(component.lastX).toEqual(click.offsetX);
        expect(component.lastY).toEqual(click.offsetY);
        component.mouseMove(false, click);
        expect(component.lastX).toEqual(click.offsetX);
        expect(component.lastY).toEqual(click.offsetY);
        component.isCleanUp = true;
        component.mouseMove(true, click);
        expect(component.lastX).toEqual(click.offsetX);
        expect(component.lastY).toEqual(click.offsetY);
        component.mouseMove(false, click);
        expect(component.lastX).toEqual(click.offsetX);
        expect(component.lastY).toEqual(click.offsetY);
    });
    it('cleaning should update', () => {
        component.cleaning();
        expect(component.isRec).toBe(false);
        expect(component.isCleanUp).toBe(true);
    });
    it('drawing should update', () => {
        component.drawing();
        expect(component.isRec).toBe(false);
        expect(component.isCleanUp).toBe(false);
    });
    it('leavec should update', () => {
        component.leaved();
        expect(component.isPainting).toBe(false);
    });
    it('clickUp should update and call', () => {
        component.clickUp();
        expect(component.isPainting).toBe(false);
        expect(component.saveImage).toHaveBeenCalled;
    });
    it('saveImage should update', () => {
        component.saveImage();
        expect(component.index).toBe(1);
    });
    it('recActivate should update', () => {
        component.recActivate();
        expect(component.isRec).toBe(true);
    });
    it('reverse should call save image', () => {
        component.reverse();
        expect(component.saveImage).toHaveBeenCalled;
    });
    it('undo should call save image', () => {
        component.index = 0;
        component.undo();
        expect(component.index).toEqual(0);
    });
    it('redo should not affect index if higher than length', () => {
        component.historic.length = 1;
        component.index = 4;
        component.redo();
        expect(component.index).toEqual(4);
    });

    it('duplicLeft should call save image', () => {
        component.duplicLeft();
        expect(component.saveImage).toHaveBeenCalled;
    });
    it('duplicRight should call save image', () => {
        component.duplicRight();
        expect(component.saveImage).toHaveBeenCalled;
    });
    it('startRec should call check array', () => {
        component.startRectangle(click);
        expect(component.checkArrays).toHaveBeenCalled;
        expect(component.lastX).toEqual(click.offsetX);
        expect(component.lastY).toEqual(click.offsetY);
    });
    it('moveRec should call save image and undo', () => {
        component.isPainting = true;
        component.moveRectangle(true, click);
        expect(component.saveImage).toHaveBeenCalled;
        expect(component.undo).toHaveBeenCalled;
        component.moveRectangle(false, click);
        expect(component.saveImage).toHaveBeenCalled;
        expect(component.undo).toHaveBeenCalled;
        component.isCleanUp = true;
        component.moveRectangle(true, click);
        expect(component.saveImage).toHaveBeenCalled;
        expect(component.undo).toHaveBeenCalled;
        component.moveRectangle(false, click);
        expect(component.saveImage).toHaveBeenCalled;
        expect(component.undo).toHaveBeenCalled;
    });
    it('moveRec should call save image and undo', () => {
        component.isRectangle = false;
        component.isPainting = true;
        component.moveRectangle(true, click);
        expect(component.saveImage).toHaveBeenCalled;
        expect(component.undo).toHaveBeenCalled;
        component.moveRectangle(false, click);
        expect(component.saveImage).toHaveBeenCalled;
        expect(component.undo).toHaveBeenCalled;
        component.isCleanUp = true;
        component.moveRectangle(true, click);
        expect(component.saveImage).toHaveBeenCalled;
        expect(component.undo).toHaveBeenCalled;
        component.moveRectangle(false, click);
        expect(component.saveImage).toHaveBeenCalled;
        expect(component.undo).toHaveBeenCalled;
    });
    it('endRec should update lastX and lastY and call saveImage', () => {
        component.isPainting = true;
        component.endRectangle(click);
        expect(component.saveImage).toHaveBeenCalled;
        expect(component.lastX).toEqual(click.offsetX);
        expect(component.lastY).toEqual(click.offsetY);
    });
    it('clearArea should call save image', () => {
        component.clearArea();
        expect(component.saveImage).toHaveBeenCalled;
    });

    it('shoulnd not be empty', fakeAsync(() => {
        component.selectBMPImage(clickEvent, 1);
        component.isTypeCheck = true;
        component.isBitCheck = false;
        fixture.detectChanges();
        tick();
        expect(component.notBmp).not.toBe('');
    }));

    it('should display a message if not right type or size for left input', fakeAsync(() => {
        const imageReader = new FileReader();
        component.isBitCheck = true;
        component.isTypeCheck = false;
        component.imageVerification(imageReader, '', 1);
        fixture.detectChanges();
        tick();
        expect(component.imagesMessages.msgLeft).toBe("Ceci n'est pas une image bmp de 24 bits");
    }));

    it('should display a message if not right type or size for right input', fakeAsync(() => {
        const imageReader = new FileReader();
        component.isBitCheck = false;
        component.isTypeCheck = true;
        component.imageVerification(imageReader, '', 2);
        fixture.detectChanges();
        tick();
        expect(component.imagesMessages.msgRight).toBe("Ceci n'est pas une image bmp de 24 bits");
    }));

    it('should display a message if not right type or size for all inputs', fakeAsync(() => {
        const imageReader = new FileReader();
        component.isBitCheck = true;
        component.isTypeCheck = true;
        component.imageVerification(imageReader, '', 0);
        fixture.detectChanges();
        tick();
        expect(component.imagesMessages.msgLeft).toBe("Ceci n'est pas une image bmp de 24 bits");
        expect(component.imagesMessages.msgRight).toBe("Ceci n'est pas une image bmp de 24 bits");
    }));

    it('should enter the case 1', fakeAsync(() => {
        const imageReader = new FileReader();
        const mockFile = new File([''], 'test.bmp', { type: 'image/bmp' });
        imageReader.readAsDataURL(mockFile);
        component.isBitCheck = false;
        component.isTypeCheck = false;
        component.imageVerification(imageReader, '', 1);
        expect(component.imagesMessages.msgLeft).toBe('');
        expect(component.isLeftInputHidden).toBe(false);
        expect(component.isDeactivateValidationLeft).toBe(false);
    }));

    it('should enter the case 2', fakeAsync(() => {
        const imageReader = new FileReader();
        const mockFile = new File([''], 'test.bmp', { type: 'image/bmp' });
        imageReader.readAsDataURL(mockFile);
        component.isBitCheck = false;
        component.isTypeCheck = false;
        component.imageVerification(imageReader, '', 2);
        expect(component.imagesMessages.msgRight).toBe('');
        expect(component.rightInputHidden).toBe(false);
        expect(component.isDeactivateValidationRight).toBe(false);
    }));

    it('should enter the case defualt', fakeAsync(() => {
        const imageReader = new FileReader();
        const mockFile = new File([''], 'test.bmp', { type: 'image/bmp' });
        imageReader.readAsDataURL(mockFile);
        component.isBitCheck = false;
        component.isTypeCheck = false;
        component.imageVerification(imageReader, '', 0);
        expect(component.imagesMessages.msgLeft).toBe('');
        expect(component.imagesMessages.msgRight).toBe('');
        expect(component.isLeftInputHidden).toBe(false);
        expect(component.rightInputHidden).toBe(false);
        expect(component.isAllInputHidden).toBe(false);
        expect(component.isDeactivateValidationLeft).toBe(false);
        expect(component.isDeactivateValidationRight).toBe(false);
    }));

    it('should call deleteImage when clicked', fakeAsync(() => {
        spyOn(component, 'deleteImage');
        component.deleteImage(0);
        const button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();

        tick();

        expect(component.deleteImage).toHaveBeenCalled();
    }));

    it('should call deleteImage and delete all images when clicked', () => {
        component.deleteImage(0);
        const stringUrl = '';
        stringMsg = 'Seules les images du type 24-bits bpm sont acceptées !';
        expect(component.imagesUrl.urlLeft).toEqual(stringUrl);
        expect(component.imagesUrl.urlRight).toEqual(stringUrl);
        expect(component.imagesMessages.msgLeft).toEqual(stringMsg);
        expect(component.imagesMessages.msgRight).toEqual(stringMsg);
    });

    it('should call deleteImage and delete left and right images', () => {
        component.deleteImage(1);
        const stringUrl = '';
        stringMsg = 'Seules les images du type 24-bits bpm sont acceptées !';
        expect(component.imagesUrl.urlLeft).toEqual(stringUrl);
        expect(component.imagesMessages.msgLeft).toEqual(stringMsg);

        component.deleteImage(2);
        expect(component.imagesUrl.urlRight).toEqual(stringUrl);
        expect(component.imagesMessages.msgRight).toEqual(stringMsg);
    });

    it('should call deleteImage and all upload button should appear', () => {
        component.deleteImage(0);
        const uploadBoolean = true;

        expect(component.isLeftInputHidden).toEqual(uploadBoolean);
        expect(component.rightInputHidden).toEqual(uploadBoolean);
        expect(component.isAllInputHidden).toEqual(uploadBoolean);
    });

    it('should call deleteImage and right and left upload button should appear', () => {
        const uploadBoolean = true;

        component.deleteImage(1);
        expect(component.isLeftInputHidden).toEqual(uploadBoolean);
        component.deleteImage(2);
        expect(component.rightInputHidden).toEqual(uploadBoolean);
    });

    it('should not be a empty string', fakeAsync(() => {
        spyOn(component, 'selectBMPImage').withArgs(clickEvent, 1);
        component.selectBMPImage(clickEvent, 1);
        const button = fixture.debugElement.nativeElement.querySelector('input');
        button.click();
        const stringUrl = 'Seules les images du type 24-bits bpm sont acceptées !';

        tick();

        expect(component.imagesMessages.msgLeft).toEqual(stringUrl);
    }));

    it('should return 0 when calling decrement', () => {
        spyOn(enlargementSliderService, 'decrement');
        component.decrement();
        expect(component.enlargementVal).toBe(0);
    });

    it('should return 9 when calling increment', () => {
        spyOn(enlargementSliderService, 'increment');
        component.increment();
        expect(component.enlargementVal).toBe(9);
    });

    it('should call openDialog', fakeAsync(() => {
        component.openDialog();
        flush();
        expect(component.openDialog).toBeDefined();
    }));
    it('should call openDialog', fakeAsync(() => {
        component.level = 'Valid';
        component.openDialog();
        flush();
        expect(component.openDialog).toBeDefined();
    }));

    it('should be equal to the component htmlId', fakeAsync(() => {
        const spy = spyOnProperty(differencesMatrixService, 'id', 'set');
        differencesMatrixService.id = component.htmlId;
        expect(spy).toHaveBeenCalled();
    }));

    it('should be equal to the component imagesUrl.urlLeft', fakeAsync(() => {
        const spy = spyOnProperty(differencesMatrixService, 'leftUrl', 'set');

        differencesMatrixService.leftUrl = '';
        expect(spy).toHaveBeenCalled();
    }));

    it('should be equal to the component imagesUrl.urlRight', fakeAsync(() => {
        const spy = spyOnProperty(differencesMatrixService, 'rightUrl', 'set');
        differencesMatrixService.rightUrl = '';
        expect(spy).toHaveBeenCalled();
    }));

    it('should be 3 when first called', fakeAsync(() => {
        const spy = spyOnProperty(differencesMatrixService, 'enlargementRange', 'set');
        differencesMatrixService.enlargementRange = component.enlargementVal;
        expect(spy).toHaveBeenCalled();
    }));
});
