import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/interfaces/vec2';
import { Game } from '@app/services/games/games.model';
import { Action } from '@app/services/video/action.model';
import { VideoService } from './video.service';

describe('VideoService', () => {
    let service: VideoService;
    let action: Action;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VideoService);
        action = new Action();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get and set properties', () => {
        const vec2Array: Vec2[][] = [[{ x: 1, y: 2 }], [{ x: 3, y: 4 }]];
        const game = new Game();

        service.sizeAct = 5;
        service.idHost = '123';
        service.diffArr = vec2Array;
        service.mode = 'solo';
        service.penalty = 10;
        service.bonus = 20;
        service.initialT = 30;
        service.setGame = game;
        service.userName1 = 'Alice';
        service.userName2 = 'Bob';
        const expectedInitialTime = 30;
        const expectedBonus = 20;
        const expectedPenality = 10;
        const expectedSizeArray = 5;

        expect(service.sizeArr).toBe(expectedSizeArray);
        expect(service.id).toBe('123');
        expect(service.diffs).toEqual(vec2Array);
        expect(service.gameMode).toBe('solo');
        expect(service.penalty).toBe(expectedPenality);
        expect(service.bonus).toBe(expectedBonus);
        expect(service.initialT).toBe(expectedInitialTime);
        expect(service.getGame).toBe(game);
        expect(service.userName1).toBe('Alice');
        expect(service.userName2).toBe('Bob');
    });

    it('should add action', () => {
        service.addAction(action);
        expect(service.getActions()).toEqual([action]);
    });

    it('should reset action', () => {
        service.addAction(action);
        service.resetAction();
        expect(service.getActions()).toEqual([]);
    });

    it('should calculate delay array', () => {
        const action1 = new Action();
        const action2 = new Action();
        service.addAction(action1);
        service.addAction(action);
        service.addAction(action2);
        const delays = service.delayArray();
        expect(delays).toEqual([NaN, NaN]);
    });

    it('should get actions', () => {
        const action1 = new Action();
        const action2 = new Action();
        service.addAction(action1);
        service.addAction(action2);
        expect(service.actions).toEqual([action1, action2]);
    });
});
