/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Game } from './games.model';
@Injectable()
export class GamesService {
    selectedGame: Game;
    difficulty: string;
    games: Game[];
    gamesLT: Game[];
    numberOfDiff: number;
    index: number;
    leftPath: string;
    rightPath: string;
    diffPath: string;
    gameName: string;
    gameDescr: string;
    gameImgs: string[] = [];
    createdGame: Game;
    arrayDiff: Vec2[][] = [];
    shuffleIndex: number[];

    readonly baseURL = environment.serverUrl;

    constructor(private http: HttpClient, private socketClientService: SocketClientService) {}

    get gameList() {
        return this.http.get<Game[]>(this.baseURL + '/selection').pipe(
            tap((games) => {
                this.games = games;
            }),
        );
    }
    get gameListLimitedTime() {
        return this.http.get<Game[]>(this.baseURL + '/selection/gamesSelectedField').pipe(
            tap((games) => {
                this.gamesLT = games;
            }),
        );
    }

    get indexGetter(): number {
        return this.index;
    }

    get numberOfGames(): Observable<number> {
        return this.http.get<Game[]>(this.baseURL + '/selection').pipe(
            map((games) => {
                return games.length;
            }),
        );
    }
    get selectedGameGetter(): Game {
        return this.selectedGame;
    }

    set indexSetter(index: number) {
        this.index = index;
    }
    set selectedGameSetter(game: Game) {
        this.selectedGame = game;
    }
    postGame(game: Game) {
        return this.http.post(this.baseURL + '/selection', game);
    }

    gameById(id: string) {
        return this.http.get(this.baseURL + `/selection/${id}`);
    }
    getGameImage(folderName: string) {
        return this.http.get(this.baseURL + `/upload/${folderName}`);
    }
    removeImage(name: string) {
        return this.http.delete(this.baseURL + `/upload/${name}`);
    }

    postImg(folderName1: number, folderName2: number, folderName3: number) {
        let file: string = this.gameImgs[0];
        this.http
            .post(
                `${this.baseURL}/upload`,
                { data: file, folderName: folderName1 },
                {
                    headers: {
                        contentType: 'application/json',
                    },
                },
            )
            .subscribe();

        file = this.gameImgs[1];
        this.http
            .post(
                `${this.baseURL}/upload`,
                { data: file, folderName: folderName2 },
                {
                    headers: {
                        contentType: 'application/json',
                    },
                },
            )
            .subscribe();
        file = this.gameImgs[2];
        this.http
            .post(
                `${this.baseURL}/upload`,
                { data: file, folderName: folderName3 },
                {
                    headers: {
                        contentType: 'application/json',
                    },
                },
            )
            .subscribe();
        this.leftPath = `${folderName1}.bmp`;
        this.rightPath = `${folderName2}.bmp`;
        this.diffPath = `${folderName3}.bmp`;
    }

    patchBestScores(id: string, val: number) {
        this.http
            .patch(
                `${this.baseURL}/selection${id}`,
                {
                    newValue: val,
                },
                {
                    headers: {
                        contentType: 'application/json',
                    },
                },
            )
            .subscribe();
    }
    createNewGame() {
        this.http
            .post(
                `${this.baseURL}/selection`,
                {
                    title: this.gameName,
                    difficulty: this.difficulty,
                    description: this.gameDescr,
                    numberOfDiff: this.arrayDiff.length,
                    multiplayer: [
                        {
                            name: 'Jacob',
                            score: '01:11',
                        },
                        {
                            name: 'Jacob',
                            score: '01:11',
                        },
                        {
                            name: 'Jacob',
                            score: '01:11',
                        },
                    ],
                    solo: [
                        {
                            name: 'Jacob',
                            score: '01:11',
                        },
                        {
                            name: 'Jacob',
                            score: '01:11',
                        },
                        {
                            name: 'Jacob',
                            score: '01:11',
                        },
                    ],
                    srcOriginal: this.leftPath,
                    srcModified: this.rightPath,
                    srcClickable: this.rightPath,
                    arrDiff: this.arrayDiff,
                },
                {
                    headers: {
                        contentType: 'application/json',
                    },
                },
            )
            .subscribe();
    }
    postVector(mousePosition: Vec2, diffArray: Vec2[][]): Observable<HttpResponse<string>> {
        return this.http.post(
            `${this.baseURL}/validation`,
            {
                vec: mousePosition,
                array: diffArray,
            },
            { observe: 'response', responseType: 'text' },
        );
    }
    removeGame(index: number): void {
        const gameId = this.games[index]._id;
        this.http
            .delete(`${this.baseURL}/selection/${gameId}`)
            .pipe(
                tap(() => {
                    this.games.splice(index, 1);
                }),
            )
            .subscribe(() => {
                this.socketClientService.send('gameDeleted', gameId);
                location.reload();
            });
    }
    removeGames() {
        return this.http.delete(`${this.baseURL}/selection`);
    }
    resetGame(id: string) {
        return this.http.patch(`${this.baseURL}/selection/reset/${id}`, {});
    }

    resetGames() {
        return this.http.patch(`${this.baseURL}/selection`, {});
    }

    changeBestTimes(id: string, arrayTimes: string[][]) {
        const value = [
            { name: arrayTimes[1][0], score: arrayTimes[0][0] },
            { name: arrayTimes[1][1], score: arrayTimes[0][1] },
            { name: arrayTimes[1][2], score: arrayTimes[0][2] },
        ];
        return this.http.patch(`${this.baseURL}/selection/updateScores/${id}`, value);
    }

    changeBestTimesMulti(id: string, arrayTimes: string[][]) {
        const value = [
            { name: arrayTimes[1][0], score: arrayTimes[0][0] },
            { name: arrayTimes[1][1], score: arrayTimes[0][1] },
            { name: arrayTimes[1][2], score: arrayTimes[0][2] },
        ];
        return this.http.patch(`${this.baseURL}/selection/updateMultiScores/${id}`, value);
    }
}
