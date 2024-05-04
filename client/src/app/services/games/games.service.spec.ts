// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { TestBed } from '@angular/core/testing';
// import { of } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { Game } from './games.model';
// import { GamesService } from './games.service';

// describe('GamesService', () => {
//     let service: GamesService;
//     const game1 = new Game();
//     const game2 = new Game();
//     const game3 = new Game();
//     const gameNew = new Game();
//     let httpClientSpy: jasmine.SpyObj<HttpClient>;
//     const baseURL = environment.serverUrl;

//     beforeEach(() => {
//         httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);
//         TestBed.configureTestingModule({
//             providers: [GamesService, { provide: HttpClient, useValue: httpClientSpy }],
//             imports: [HttpClientModule],
//         });
//         service = TestBed.inject(GamesService);
//         service.selectedGame = game1;
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('get gameList should return game list and update this.games', (done) => {
//         const mockGameList: Game[] = [game1, game2, game3];
//         httpClientSpy.get.and.returnValue(of(mockGameList));

//         service.gameList.subscribe((games) => {
//             expect(games).toEqual(mockGameList);
//             expect(service.games).toEqual(mockGameList);
//             done();
//         });
//     });

//     it('getGameById should return a game based on its id', (done) => {
//         const mockGame: Game = game1;
//         httpClientSpy.get.and.returnValue(of(mockGame));
//         service.gameById('1').subscribe({
//             next: (games) => {
//                 expect(games).toEqual(game1);
//                 done();
//             },
//         });
//     });
//     it('postGame should post a game', (done) => {
//         const mockNewGame: Game = gameNew;
//         httpClientSpy.post.and.returnValue(of(mockNewGame));
//         service.postGame(mockNewGame).subscribe({
//             next: (games) => {
//                 expect(games).toEqual(mockNewGame);
//                 done();
//             },
//         });
//     });
//     it('setIndex should change the index', () => {
//         const newIndex = 5;
//         service.index = newIndex;
//         const checkIndex = service.index;
//         expect(checkIndex).toEqual(newIndex);
//     });

//     it('get numberOfGames should update the games array and return the correct number of games', (done) => {
//         const mockGameList: Game[] = [game1, game2, game3];
//         httpClientSpy.get.and.returnValue(of(mockGameList));

//         spyOnProperty(service, 'gameList', 'get').and.returnValue(of(mockGameList));

//         service.numberOfGames.subscribe((numberOfGames) => {
//             expect(numberOfGames).toEqual(mockGameList.length);
//             expect(service.games).toEqual(undefined);
//             done();
//         });
//     });

//     it('getSelectedGame should return the right game', () => {
//         const myGame = new Game();
//         myGame.title = 'hello';
//         myGame.description = 'hello';
//         myGame.difficulty = 'hello';
//         myGame.solo = [
//             { name: 'string', score: 'string' },
//             {
//                 name: 'string',
//                 score: 'string',
//             },
//             {
//                 name: 'string',
//                 score: 'string',
//             },
//         ];
//         myGame.multiplayer = [
//             { name: 'string', score: 'string' },
//             {
//                 name: 'string',
//                 score: 'string',
//             },
//             {
//                 name: 'string',
//                 score: 'string',
//             },
//         ];
//         myGame.srcClickable = 'hello';
//         myGame.srcModified = 'hello';
//         myGame.srcModified = 'hello';
//         service.selectedGame = myGame;
//         const checkGame = service.selectedGame;
//         expect(checkGame).toEqual(myGame);
//     });

//     it('get indexGetter should return correct index', () => {
//         const testIndex = 4;
//         service.index = testIndex;
//         expect(service.indexGetter).toEqual(testIndex);
//     });

//     it('get selectedGameGetter should return the correct selected game', () => {
//         service.selectedGameSetter = game2;
//         expect(service.selectedGameGetter).toEqual(game2);
//     });

//     it('set indexSetter should set the correct index', () => {
//         const testIndex = 5;
//         service.indexSetter = testIndex;
//         expect(service.indexGetter).toEqual(testIndex);
//     });

//     it('set selectedGameSetter should set the correct selected game', () => {
//         service.selectedGameSetter = game3;
//         expect(service.selectedGameGetter).toEqual(game3);
//     });

//     it('postImg should post images and set the paths', (done) => {
//         httpClientSpy.post.and.returnValue(of({}));
//         const folderName1 = 1;
//         const folderName2 = 2;
//         const folderName3 = 3;

//         service.postImg(folderName1, folderName2, folderName3);

//         expect(httpClientSpy.post.calls.count()).toBe(3);
//         expect(httpClientSpy.post.calls.argsFor(0)).toEqual([
//             `${service.baseURL}/upload`,
//             { data: undefined, folderName: folderName1 },
//             { headers: { contentType: 'application/json' } },
//         ]);
//         expect(httpClientSpy.post.calls.argsFor(1)).toEqual([
//             `${service.baseURL}/upload`,
//             { data: undefined, folderName: folderName2 },
//             { headers: { contentType: 'application/json' } },
//         ]);
//         expect(httpClientSpy.post.calls.argsFor(2)).toEqual([
//             `${service.baseURL}/upload`,
//             { data: undefined, folderName: folderName3 },
//             { headers: { contentType: 'application/json' } },
//         ]);
//         expect(service.leftPath).toEqual(`${folderName1}.bmp`);
//         expect(service.rightPath).toEqual(`${folderName2}.bmp`);
//         expect(service.diffPath).toEqual(`${folderName3}.bmp`);
//         done();
//     });

//     it('createNewGame should post a new game', () => {
//         httpClientSpy.post.and.returnValue(of({}));
//         const folderName1 = 1;
//         const folderName2 = 2;
//         const folderName3 = 3;
//         service.leftPath = `${folderName1}.bmp`;
//         service.rightPath = `${folderName2}.bmp`;
//         service.diffPath = `${folderName3}.bmp`;
//         service.gameName = 'myGame';
//         service.difficulty = 'easy';
//         service.gameDescr = 'my game description';
//         service.arrayDiff = [[{ x: 0, y: 0 }], [{ x: 1, y: 1 }]];
//         httpClientSpy.post.and.returnValue(of({}));
//         const expectedRequestBody = {
//             title: service.gameName,
//             difficulty: service.difficulty,
//             description: service.gameDescr,
//             numberOfDiff: service.arrayDiff.length,
//             multiplayer: [
//                 {
//                     name: 'Jacob',
//                     score: '01:11',
//                 },
//                 {
//                     name: 'Jacob',
//                     score: '01:11',
//                 },
//                 {
//                     name: 'Jacob',
//                     score: '01:11',
//                 },
//             ],
//             solo: [
//                 {
//                     name: 'Jacob',
//                     score: '01:11',
//                 },
//                 {
//                     name: 'Jacob',
//                     score: '01:11',
//                 },
//                 {
//                     name: 'Jacob',
//                     score: '01:11',
//                 },
//             ],
//             srcOriginal: service.leftPath,
//             srcModified: service.rightPath,
//             srcClickable: service.rightPath,
//             arrDiff: service.arrayDiff,
//         };
//         service.createNewGame();
//         expect(httpClientSpy.post.calls.count()).toBe(1);
//         expect(httpClientSpy.post.calls.argsFor(0)).toEqual([
//             `${service.baseURL}/selection`,
//             expectedRequestBody,
//             { headers: { contentType: 'application/json' } },
//         ]);
//     });

//     it('postVector should post a vector and array', (done) => {
//         const mousePosition = { x: 0, y: 0 };
//         const diffArray = [[{ x: 0, y: 0 }]];
//         httpClientSpy.post.and.returnValue(of({}));
//         const expectedRequestBody = {
//             vec: mousePosition,
//             array: diffArray,
//         };
//         service.postVector(mousePosition, diffArray).subscribe((res) => {
//             expect(res.status).toEqual(undefined);
//             expect(httpClientSpy.post.calls.count()).toBe(1);
//             expect(httpClientSpy.post.calls.argsFor(0)).toEqual([
//                 `${service.baseURL}/validation`,
//                 expectedRequestBody,
//                 { observe: 'response', responseType: 'text' },
//             ]);
//             done();
//         });
//     });

//     it('removeGame should remove a game', () => {
//         httpClientSpy.delete.and.returnValue(of({}));
//         const index = 1;
//         service.games = [game1, game2, game3];
//         service.removeGame(index);
//         expect(httpClientSpy.delete.calls.count()).toBe(2);
//         expect(httpClientSpy.delete.calls.argsFor(0)).toEqual([baseURL + '/selection/undefined']);
//         expect(httpClientSpy.delete.calls.argsFor(1)).toEqual([baseURL + '/selection/undefined']);
//     });
// });
