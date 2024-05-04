import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import { Game } from '@app/services/games/games.model';
import { Action } from '@app/services/video/action.model';

@Injectable({
    providedIn: 'root',
})
export class VideoService {
    arrAction: Action[] = [];
    arrDiff: Vec2[][];
    game: Game;
    name1: string = '';
    name2: string = '';
    winner: string;
    arrDelay: number[] = [];
    modeGame: string;
    timePenalty: number;
    timeBonus: number;
    initialTime: number;
    hostId: string;
    size: number;

    get sizeArr() {
        return this.size;
    }

    get id() {
        return this.hostId;
    }

    get diffs() {
        return this.arrDiff;
    }

    get gameMode() {
        return this.modeGame;
    }

    get penalty() {
        return this.timePenalty;
    }

    get bonus() {
        return this.timeBonus;
    }

    get initialT() {
        return this.initialTime;
    }

    get getGame() {
        return this.game;
    }

    get userName1() {
        return this.name1;
    }

    get userName2() {
        return this.name2;
    }

    get actions() {
        return this.arrAction;
    }

    set sizeAct(val: number) {
        this.size = val;
    }
    set idHost(id: string) {
        this.hostId = id;
    }

    set diffArr(arr: Vec2[][]) {
        this.arrDiff = JSON.parse(JSON.stringify(arr));
    }

    set mode(solo: string) {
        this.modeGame = solo;
    }

    set penalty(time: number) {
        this.timePenalty = time;
    }

    set bonus(time: number) {
        this.timeBonus = time;
    }

    set initialT(time: number) {
        this.initialTime = time;
    }

    set setGame(game: Game) {
        this.game = game;
    }

    set userName1(name: string) {
        this.name1 = name;
    }

    set userName2(name: string) {
        this.name2 = name;
    }

    addAction(action: Action) {
        this.arrAction.push(action);
    }

    getActions() {
        return this.arrAction;
    }

    resetAction() {
        while (this.arrAction.length > 0) {
            this.arrAction.length = 0;
            this.arrDelay.length = 0;
        }
    }

    delayArray(): number[] {
        const arrTime: number[] = [];
        for (const act of this.arrAction) {
            arrTime.push(act.time);
        }
        for (let i = 0; i < arrTime.length - 1; i++) {
            this.arrDelay.push(arrTime[i + 1] - arrTime[i]);
        }
        return this.arrDelay;
    }
}
