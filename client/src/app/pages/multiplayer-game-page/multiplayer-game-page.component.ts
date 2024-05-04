/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-params */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { Vec2 } from '@app/interfaces/vec2';
import { History } from '@app/services/games-history/games-history.model';
import { HistoryService } from '@app/services/games-history/games-history.service';
import { Game } from '@app/services/games/games.model';
import { GamesService } from '@app/services/games/games.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { VideoService } from '@app/services/video/video.service';
import { Socket } from 'socket.io-client';

@Component({
    selector: 'app-multiplayer-game-page',
    templateUrl: './multiplayer-game-page.component.html',
    styleUrls: ['./multiplayer-game-page.component.scss'],
    providers: [GamesService, HistoryService],
})
export class MultiplayerGamePageComponent implements OnInit, OnDestroy {
    @ViewChild('htmlId') htmlId: ElementRef;
    game: Game;
    isEndGame: boolean;
    arrayDiff: Vec2[][];
    history = new History();
    firstUser: string;
    secondUser: string;
    isHost: boolean;
    idHost: string;
    diffHost: number;
    diffInv: number;
    userName: string;
    id: string;
    message: string;
    playerQuit: boolean;
    isReplay: boolean;
    currentDate: string;
    quitIndex: number;
    finalTime: string;
    quitID: string;
    bestTimeArray: string[];
    bestTimeNameArray: string[];
    finalArray: string[][];
    gameName: string;
    gameType: string;
    isHistoryCreated: boolean;
    winnerIndicator: string;

    readonly title: string = 'Spotted : trouve les 7 différences';
    private firstUserSocket: Socket;
    constructor(
        public gamesService: GamesService,
        private route: ActivatedRoute,
        public socketClientService: SocketClientService,
        public historyService: HistoryService,
        public dialog: MatDialog,
        private router: Router,
        private videoService: VideoService,
    ) {
        this.isReplay = false;
    }
    async ngOnInit(): Promise<void> {
        await this.gettingGame();
        this.message = 'Bravo';
        this.finalArray = [['0'], ['0']];
        this.quitIndex = 0;
        this.isEndGame = false;
        this.id = this.route.snapshot.paramMap.get('id');
        this.diffHost = 0;
        this.diffInv = 0;
        this.playerQuit = false;
        this.videoService.userName2 = this.secondUser;
        this.videoService.mode = 'multi';
        this.gamesService.gameById(this.id).subscribe((res) => {
            this.game = res as Game;
        });

        this.socketClientService.on('gameStarted', (names: string[]) => {
            this.firstUser = names[0];
            this.secondUser = names[1];
            this.videoService.userName1 = this.firstUser;
            this.videoService.userName2 = this.secondUser;
            this.idHost = names[2];
            this.videoService.idHost = this.idHost;
            this.gamesService.gameById(names[3]).subscribe((res) => {
                this.game = res as Game;
            });
        });
        this.socketClientService.on('updatedDiffs', (diffs: { diffH: number; diffI: number }) => {
            this.diffHost = diffs.diffH;
            this.diffInv = diffs.diffI;
            this.endGame();
        });
        this.socketClientService.on('playerLeft', (val: { quitterName: string; quitID: string }) => {
            this.message = "L'autre joueur a eu peur de tes talents. Bravo";
            this.playerQuit = true;
            this.quitID = val.quitID;
        });
        this.socketClientService.send('verification');
        this.socketClientService.on('multiVerification', (verification: string) => {
            this.winnerIndicator = verification;
        });
        this.isHost = this.socketClientService.socket === this.firstUserSocket ? true : false;
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        this.currentDate = `${day}-${month}-${year}`;
    }

    async ngOnDestroy() {
        if (this.playerQuit || this.isHistoryCreated) {
            return;
        } else this.createHistory();
    }

    async gettingGame() {
        const id = this.route.snapshot.paramMap.get('id');
        this.gamesService.gameById(id).subscribe((res) => {
            this.game = res as Game;
            this.arrayDiff = this.game.arrDiff;
            this.videoService.setGame = this.game;
            this.videoService.diffArr = this.arrayDiff;
        });
    }
    endGame() {
        if (this.diffHost >= this.game.numberOfDiff / 2) {
            this.userName = this.firstUser;
            this.isEndGame = true;
            this.quitIndex = 0;
            this.history.winner = 1;
            if (this.finalTime !== undefined) {
                this.videoService.winner = this.userName;
                this.bestTimeInit();

                return true;
            }
        } else if (this.diffInv >= this.game.numberOfDiff / 2) {
            this.userName = this.secondUser;
            this.isEndGame = true;
            this.videoService.winner = this.userName;
            this.quitIndex = 0;
            this.history.winner = 2;
            if (this.finalTime !== undefined) {
                this.bestTimeInit();
                return true;
            }
        }
        if (this.playerQuit) {
            if (this.quitIndex === 1) this.history.winner = 2;
            else if (this.quitIndex === 2) this.history.winner = 1;
            this.isEndGame = true;
            return true;
        }
        return false;
    }

    createHistory() {
        this.history.type = 'multijoueur classique';
        this.history.hostName = this.firstUser;
        this.history.invName = this.secondUser;
        this.history.time = this.finalTime;
        this.history.gaveUp = this.quitIndex;
        this.history.date = this.currentDate;
        this.historyService.postHistory(this.history).subscribe(() => {});
    }

    receiveBestTime(time: string[]) {
        if (this.finalArray[0][0] === '0') {
            this.finalArray[0] = time;
        } else if (this.finalArray[0][0] !== '0') {
            this.finalArray[1] = time;
            const id = this.route.snapshot.paramMap.get('id');
            this.gamesService.changeBestTimesMulti(id, this.finalArray).subscribe((res) => {
                // eslint-disable-next-line no-console
                console.log(res);
            });
        }
    }

    bestTimeInit() {
        this.bestTimeArray = [this.game.multiplayer[0].score, this.game.multiplayer[1].score, this.game.multiplayer[2].score];
        this.bestTimeNameArray = [this.game.multiplayer[0].name, this.game.multiplayer[1].name, this.game.multiplayer[2].name];
        this.gameName = this.game.title;
        this.gameType = '1 vs 1';
    }

    leaveGame() {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: 'Êtes vous sûre de vouloir quit la partie ? ' },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.socketClientService.send('giveUp', {
                    idHost: this.idHost,
                    idGame: this.id,
                });
                if (this.idHost === this.socketClientService.socket.id) {
                    this.quitIndex = 1;
                    this.history.winner = 2;
                } else {
                    this.quitIndex = 2;
                    this.history.winner = 1;
                }
                this.isHistoryCreated = true;
                this.createHistory();
                this.router.navigate(['selection']);
            }
        });
    }

    receiveTime(time: string) {
        this.finalTime = time;
    }
}
export { GamesService };
