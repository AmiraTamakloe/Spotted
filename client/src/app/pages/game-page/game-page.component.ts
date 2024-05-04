/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { Vec2 } from '@app/interfaces/vec2';
import { History } from '@app/services/games-history/games-history.model';
import { HistoryService } from '@app/services/games-history/games-history.service';
import { Game } from '@app/services/games/games.model';
import { GamesService } from '@app/services/games/games.service';
import { HintsService } from '@app/services/hints/hints.service';
import { ModeSoloService } from '@app/services/mode-solo/mode-solo.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { VideoService } from '@app/services/video/video.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
    providers: [GamesService, ModeSoloService, HistoryService],
})
export class GamePageComponent implements OnInit, OnDestroy {
    @ViewChild('htmlId') htmlId: ElementRef;
    posIndex: number;
    game: Game;
    isEndGame: boolean;
    arr: number[];
    differences: number;
    arrayDiff: Vec2[][];
    userName: string;
    nbHints: number;
    isReplay: boolean;
    play: boolean;
    history = new History();
    isQuit: boolean;
    currentDate: string;
    finalTime: string;
    bestTimeArray: string[];
    bestTimeNameArray: string[];
    finalArray: string[][] = [['0'], ['0']];
    gameName: string;
    gameType: string;

    readonly title: string = 'Spotted : trouve les 7 différences';
    constructor(
        public gamesService: GamesService,
        private route: ActivatedRoute,
        public modeSoloService: ModeSoloService,
        public socketClientService: SocketClientService,
        public historyService: HistoryService,
        private router: Router,
        private videoService: VideoService,
        private hintService: HintsService,
        private dialog: MatDialog,
    ) {
        this.nbHints = 0;
        this.isReplay = false;
        this.play = true;
        this.gameType = 'solo';
    }

    async ngOnInit(): Promise<void> {
        await this.gettingGame();
        this.isEndGame = false;
        this.hintService.status = false;
        this.socketClientService.on('userNameSolo', (userName: string) => {
            this.userName = userName;
            this.videoService.userName1 = this.userName;
            this.videoService.winner = this.userName;
        });

        this.socketClientService.on('updateHintCounter', (nbHints: number) => {
            this.nbHints = nbHints;
        });
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        this.currentDate = `${day}-${month}-${year}`;
        this.videoService.mode = 'solo';
    }

    async ngOnDestroy() {
        await this.createHistory();
        this.modeSoloService.foundDifferences = 0;
    }

    async gettingGame() {
        const id = this.route.snapshot.paramMap.get('id');
        this.gamesService.gameById(id).subscribe((res) => {
            this.game = res as Game;
            this.arrayDiff = this.game.arrDiff;
            this.differences = this.game.numberOfDiff;
            this.videoService.setGame = this.game;
            this.videoService.diffArr = this.arrayDiff;
        });
    }

    receiveTime(time: string) {
        this.finalTime = time;
    }

    endGame() {
        if (this.modeSoloService.getNumberOfDifferences() === this.differences) {
            this.isEndGame = true;
            this.isQuit = false;
            if (this.finalTime !== undefined) {
                this.bestTimeInit();
                return true;
            }
            return false;
        } else {
            return false;
        }
    }

    receiveBestTime(time: string[]) {
        if (this.finalArray[0][0] === '0') {
            this.finalArray[0] = time;
        } else if (this.finalArray[0][0] !== '0') {
            this.finalArray[1] = time;
            const id = this.route.snapshot.paramMap.get('id');
            this.gamesService.changeBestTimes(id, this.finalArray).subscribe(() => {});
        }
    }

    bestTimeInit() {
        this.bestTimeArray = [this.game.solo[0].score, this.game.solo[1].score, this.game.solo[2].score];
        this.bestTimeNameArray = [this.game.solo[0].name, this.game.solo[1].name, this.game.solo[2].name];
        this.gameName = this.game.title;
    }

    leaveGame() {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: 'Êtes vous sûre de vouloir quit la partie ? ' },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.isQuit = true;
                this.navigateToDynamicRoute('selection');
            }
        });
    }

    createHistory() {
        this.history.type = 'solo classique';
        this.history.hostName = this.userName;
        this.history.winner = this.isQuit ? 0 : 1;
        this.history.time = this.finalTime;
        this.history.gaveUp = this.isQuit ? 1 : 0;
        this.history.date = this.currentDate;
        this.historyService.postHistory(this.history).subscribe(() => {});
    }
    goHome() {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: 'Êtes vous sûre de vouloir quit la partie ? ' },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.isQuit = true;
                this.socketClientService.send('leave');
                this.navigateToDynamicRoute('home');
            }
        });
    }

    navigateToDynamicRoute(url: string) {
        this.router.navigate([url]);
    }
}
export { GamesService };
