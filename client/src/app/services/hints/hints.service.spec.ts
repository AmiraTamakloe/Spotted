import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/interfaces/vec2';
import { DrawService } from '@app/services/draw/draw.service';
import { ModeSoloService } from '@app/services/mode-solo/mode-solo.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { VideoService } from '@app/services/video/video.service';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from 'src/global-constants/global-constants';
import { HintsService } from './hints.service';

describe('HintsService', () => {
    let service: HintsService;
    let drawServiceSpy: jasmine.SpyObj<DrawService>;
    let modeSoloServiceSpy: jasmine.SpyObj<ModeSoloService>;
    let socketClientServiceSpy: jasmine.SpyObj<SocketClientService>;
    let videoServiceSpy: jasmine.SpyObj<VideoService>;

    beforeEach(() => {
        const clearRectSpy = jasmine.createSpy('clearRect');
        const mockContext: Partial<CanvasRenderingContext2D> = {
            clearRect: clearRectSpy,
        };

        drawServiceSpy = jasmine.createSpyObj('DrawService', ['blinkHint']);
        drawServiceSpy.errLContext = mockContext as CanvasRenderingContext2D;
        drawServiceSpy.errRContext = mockContext as CanvasRenderingContext2D;

        modeSoloServiceSpy = jasmine.createSpyObj('ModeSoloService', ['']);
        socketClientServiceSpy = jasmine.createSpyObj('SocketClientService', ['send']);
        videoServiceSpy = jasmine.createSpyObj('VideoService', ['addAction']);

        TestBed.configureTestingModule({
            providers: [
                HintsService,
                { provide: DrawService, useValue: drawServiceSpy },
                { provide: ModeSoloService, useValue: modeSoloServiceSpy },
                { provide: SocketClientService, useValue: socketClientServiceSpy },
                { provide: VideoService, useValue: videoServiceSpy },
            ],
        });

        service = TestBed.inject(HintsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('giveHint', () => {
        it('should not give hint if nHints >= 3', () => {
            service.giveHint(3);
            expect(socketClientServiceSpy.send).toHaveBeenCalledWith('noMoreHints');
            expect(drawServiceSpy.errLContext.clearRect).not.toHaveBeenCalled();
        });

        it('should give hint if nHints < 3 and diffArray is not empty', () => {
            service.diffArraySetter = [[{ x: 0, y: 0 }], [{ x: 1, y: 1 }]];
            const randomValue = 0.5;
            spyOn(Math, 'random').and.returnValue(randomValue);
            service.giveHint(1);
            expect(drawServiceSpy.errLContext.clearRect).toHaveBeenCalledWith(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
            expect(drawServiceSpy.errRContext.clearRect).toHaveBeenCalledWith(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
            expect(drawServiceSpy.blinkHint).toHaveBeenCalledTimes(2);
            expect(socketClientServiceSpy.send).toHaveBeenCalledWith('hintUse', { noHints: 2, replay: false });
            expect(videoServiceSpy.addAction).toHaveBeenCalled();
        });

        it('should not give hint if nHints < 3 and diffArray is empty', () => {
            service.diffArraySetter = [];
            service.giveHint(1);
            expect(drawServiceSpy.errLContext.clearRect).toHaveBeenCalled();
        });
    });

    describe('replayHint', () => {
        it('should replay hint', () => {
            service.diffArraySetter = [[{ x: 0, y: 0 }], [{ x: 1, y: 1 }]];
            service.replayHint(0, 1);
            expect(drawServiceSpy.errLContext.clearRect).toHaveBeenCalledWith(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
            expect(drawServiceSpy.errRContext.clearRect).toHaveBeenCalledWith(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
            expect(drawServiceSpy.blinkHint).toHaveBeenCalledTimes(2);
            expect(socketClientServiceSpy.send).toHaveBeenCalledWith('hintUse', { noHints: 2, replay: true });
        });
    });

    describe('diffArraySetter', () => {
        it('should set diffArray', () => {
            const testArray: Vec2[][] = [[{ x: 0, y: 0 }], [{ x: 1, y: 1 }]];
            service.diffArraySetter = testArray;
            expect(service['diffArray']).toEqual(testArray);
        });
    });

    describe('status', () => {
        it('should set isReplay status', () => {
            service.status = true;
            expect(service['isReplay']).toBeTrue();
            service.status = false;
            expect(service['isReplay']).toBeFalse();
        });
    });
});
