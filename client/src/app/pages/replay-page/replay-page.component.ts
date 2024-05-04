/* eslint-disable max-params */
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { Vec2 } from '@app/interfaces/vec2';
import { Game } from '@app/services/games/games.model';
import { GamesService } from '@app/services/games/games.service';
import { HintsService } from '@app/services/hints/hints.service';
import { ModeSoloService } from '@app/services/mode-solo/mode-solo.service';
import { SpeedSliderService } from '@app/services/replay-speed/replay-speed.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Action } from '@app/services/video/action.model';
import { VideoService } from '@app/services/video/video.service';
import { FIFTEEN } from '@common/global-constants';
import { Socket } from 'socket.io-client';

@Component({
    selector: 'app-replay-page',
    templateUrl: './replay-page.component.html',
    styleUrls: ['./replay-page.component.scss'],
})
export class ReplayPageComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('htmlId') htmlId: ElementRef;
    @ViewChild('cpa') playComponent: PlayAreaComponent;
    socket: Socket;
    game: Game;
    isEndGame: boolean;
    differences: number;
    arrayDiff: Vec2[][];
    difficulty: string;
    userName1: string;
    userName2: string;
    message: string;
    action: Action;
    actionsArray: Action[];
    delayArray: number[];
    replaySpeed: number;
    mode: string;
    diffHost: number;
    diffInv: number;
    play: boolean;
    timeout: ReturnType<typeof setTimeout>;
    idx: number;
    actStart: number;
    intTime: number;
    ifExist: boolean;
    originalImageSrc: string;
    modifiedImageSrc: string;
    interval: ReturnType<typeof setInterval>;
    interval2: ReturnType<typeof setInterval>;
    timeRemaining: number;
    readonly title: string = 'Spotted : trouve les 7 différences';
    constructor(
        public gamesService: GamesService,
        public modeSoloService: ModeSoloService,
        public dialog: MatDialog,
        public socketClientService: SocketClientService,
        private router: Router,
        private videoService: VideoService,
        private hintService: HintsService,
        private speedSliderService: SpeedSliderService,
    ) {
        this.game = JSON.parse(JSON.stringify(this.videoService.getGame));
        this.originalImageSrc = this.game.srcOriginal;
        this.modifiedImageSrc = this.game.srcModified;
        this.replaySpeed = 1;
        this.diffHost = 0;
        this.diffInv = 0;
        this.mode = videoService.gameMode;
        this.hintService.status = true;
        this.play = true;
        this.ifExist = true;
    }

    async ngOnInit(): Promise<void> {
        this.isEndGame = false;
        this.socket = this.socketClientService.socketId;
        this.userName1 = this.videoService.userName1;
        this.userName2 = this.videoService.userName2;
        this.actionsArray = JSON.parse(JSON.stringify(this.videoService.getActions()));
        this.delayArray = this.videoService.delayArray();
        this.arrayDiff = JSON.parse(JSON.stringify(this.videoService.diffs));
        this.videoService.sizeAct = this.actionsArray.length;
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    ngAfterViewInit(): void {
        this.socketClientService.on('restartVideo', () => {
            this.restart();
        });
        this.actStart = Date.now();
        this.intTime = this.delayArray[0];
        this.idx = 0;
        this.interval = setInterval(() => {
            this.replay(1);
            this.actStart = Date.now();
            this.intTime = this.delayArray[0] / this.replaySpeed;
        }, this.delayArray[0] / this.replaySpeed);
    }

    endGame() {
        this.isEndGame = true;
    }

    leaveGame() {
        this.socketClientService.send('leave');
        this.navigateToDynamicRoute('selection');
    }

    goHome() {
        this.socketClientService.send('leave');
        this.navigateToDynamicRoute('home');
    }

    navigateToDynamicRoute(url: string) {
        this.router.navigate([url]);
    }

    replay(actIdx: number) {
        if (actIdx < this.videoService.sizeArr) {
            this.idx = actIdx;
            this.action = this.actionsArray[actIdx];
            this.actStart = Date.now();
            this.intTime = this.delayArray[actIdx] / this.replaySpeed;
            this.dispatch(this.action);

            clearInterval(this.interval);
            this.interval = setInterval(() => {
                this.replay(actIdx + 1);
            }, this.delayArray[actIdx] / this.replaySpeed);
        }
        return;
    }
    dispatch(act: Action) {
        switch (act.type) {
            case 'gameStarted':
                break;
            case 'msg':
                this.socketClientService.send('replayTime', { text: act.message.text, color: act.message.color });
                break;
            case 'click':
                if (act.click.clickPos !== undefined) {
                    this.playComponent.isDifference(act.click.clickPos);
                } else {
                    const pos = this.arrayDiff[act.click.diffIndex][0];
                    this.playComponent.isDifference(pos);
                }
                if (act.click.diffFound) {
                    if (act.click.socketId === this.videoService.id) {
                        this.diffHost++;
                    } else {
                        this.diffInv++;
                    }
                }
                break;
            case 'cheat':
                this.playComponent.isCheatMode = !this.playComponent.isCheatMode;
                this.playComponent.cheatMode();
                break;
            case 'hint':
                this.hintService.replayHint(act.hintSelected.diff, act.hintSelected.nbHint);
                break;
            case 'endGame':
                this.endGame();
                break;
        }
    }

    decrement() {
        this.replaySpeed = this.speedSliderService.decrement();
        clearInterval(this.interval);
        clearInterval(this.interval2);
        this.timeRemaining = this.intTime - (Date.now() - this.actStart);
        this.interval = setInterval(() => {
            this.actStart = Date.now();
            this.intTime = this.delayArray[this.idx] / this.replaySpeed;
            this.replay(this.idx + 1);
        }, this.timeRemaining / this.replaySpeed);
    }

    increment() {
        this.replaySpeed = this.speedSliderService.increment();
        clearInterval(this.interval);
        clearInterval(this.interval2);
        this.timeRemaining = this.intTime - (Date.now() - this.actStart);
        this.interval = setInterval(() => {
            this.actStart = Date.now();
            this.intTime = this.delayArray[this.idx] / this.replaySpeed;
            this.replay(this.idx + 1);
        }, this.timeRemaining / this.replaySpeed);
    }

    restart() {
        this.arrayDiff = JSON.parse(JSON.stringify(this.videoService.diffs));
        this.isEndGame = false;
        clearInterval(this.interval);
        this.ifExist = !this.ifExist;
        setTimeout(() => {
            this.ifExist = !this.ifExist;
            this.diffHost = 0;
            this.diffInv = 0;
            if (this.mode === 'solo') {
                this.modeSoloService.restart();
            }
            this.interval = setInterval(() => {
                this.replay(1);
            }, this.delayArray[0] / this.replaySpeed);
        }, FIFTEEN);
    }

    playPause() {
        this.play = !this.play;
        this.socketClientService.send('playPause');
        if (!this.play) {
            clearInterval(this.interval);
            clearInterval(this.interval2);
            this.timeRemaining = this.intTime - (Date.now() - this.actStart);
        } else {
            this.interval2 = setInterval(() => {
                this.actStart = Date.now();
                this.intTime = this.delayArray[this.idx] / this.replaySpeed;
                this.replay(this.idx + 1);
            }, this.timeRemaining / this.replaySpeed);
        }
    }
}
export { GamesService };
