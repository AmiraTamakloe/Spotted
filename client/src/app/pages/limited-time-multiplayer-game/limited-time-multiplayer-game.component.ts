/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { History } from '@app/services/games-history/games-history.model';
import { HistoryService } from '@app/services/games-history/games-history.service';
import { Game } from '@app/services/games/games.model';
import { GamesService } from '@app/services/games/games.service';
import { ModeSoloService } from '@app/services/mode-solo/mode-solo.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { first, firstValueFrom, tap } from 'rxjs';

@Component({
    selector: 'app-limited-time-multiplayer-game',
    templateUrl: './limited-time-multiplayer-game.component.html',
    styleUrls: ['./limited-time-multiplayer-game.component.scss'],
    providers: [GamesService, HistoryService],
})
export class LimitedTimeMultiplayerGameComponent implements OnInit, OnDestroy {
    games: Game[];
    isEndGame: boolean;
    userName: string;
    firstUser: string;
    secondUser: string;
    quitterName: string = '';
    isHost: boolean;
    idHost: string;
    diffHost: number = 0;
    diffInv: number = 0;
    score: number = 0;
    shuffledIndex: number[];
    id: string = 'LTGame';
    history = new History();
    currentDate: string;
    quitIndex: number;
    finalTime: string;
    playerQuit: boolean;
    quitID: string;
    isHistoryCreated: boolean;
    nbHints: number;
    message: string;

    readonly title: string = 'Spotted : trouve les 7 différences';
    constructor(
        public gamesService: GamesService,
        public modeSoloService: ModeSoloService,
        public socketClientService: SocketClientService,
        public historyService: HistoryService,
        private router: Router,
        private dialog: MatDialog,
    ) {
        this.nbHints = 0;
    }

    async ngOnInit(): Promise<void> {
        this.isEndGame = false;
        this.socketClientService.send('pageLoaded');
        this.socketClientService.on('gameStartedLT', async (gameInfo: { hostName: string; invName: string; hostId: string; array: number[] }) => {
            this.firstUser = gameInfo.hostName;
            this.secondUser = gameInfo.invName;
            this.idHost = gameInfo.hostId;
            this.shuffledIndex = gameInfo.array;
            await firstValueFrom(
                this.gamesService.gameListLimitedTime.pipe(
                    first(),
                    tap(async (res) => {
                        this.games = res as Game[];
                        if (this.games.length === 0) {
                            this.socketClientService.send('leave');
                            this.router.navigate(['config']);
                            window.alert('Aucune jeu disponible');
                        }
                    }),
                ),
            );
            this.games = await this.shuffle(this.games, this.shuffledIndex);
        });
        this.socketClientService.on('updatedDiffs', (diffs: { diffH: number; diffI: number }) => {
            this.diffHost = diffs.diffH;
            this.diffInv = diffs.diffI;
            this.score = diffs.diffH + diffs.diffI;
            this.games.shift();
            if (this.games.length === 0) this.isEndGame = true;
            this.endGame();
        });
        this.socketClientService.on('updateHintCounter', (nbHints: number) => {
            this.nbHints = nbHints;
        });
        this.socketClientService.on('playerLeft', (quitterInfo: { quitterName: string; quitID: string }) => {
            this.message = "L'autre joueur t'as abandonné ! Poursuis champion !";
            this.quitterName = quitterInfo.quitterName;
            this.playerQuit = true;
            this.quitID = quitterInfo.quitID;
        });
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

    createHistory() {
        this.history.type = 'multijoueur temps limité';
        this.history.hostName = this.userName;
        this.history.time = this.finalTime;
        this.history.gaveUp = this.quitIndex;
        this.history.date = this.currentDate;
        this.historyService.postHistory(this.history).subscribe(() => {});
    }

    timeOut() {
        this.isEndGame = true;
    }

    receiveTime(time: string) {
        this.finalTime = time;
    }

    endGame() {
        if (this.isEndGame) {
            this.isEndGame = true;
            if (this.quitterName) {
                this.userName = this.quitterName === this.firstUser ? this.secondUser : this.firstUser;
            } else this.userName = this.firstUser + ' et ' + this.secondUser;
            return true;
        } else {
            return false;
        }
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
                this.navigateToDynamicRoute('home');
            }
        });
    }

    navigateToDynamicRoute(url: string) {
        this.router.navigate([url]);
    }

    shuffle(games: Game[], indexShuffled: number[]) {
        const shuffledGames = indexShuffled.map((index) => games[index]);
        for (let i = 0; i < games.length; i++) {
            games[i] = shuffledGames[i];
        }
        return shuffledGames;
    }
}
