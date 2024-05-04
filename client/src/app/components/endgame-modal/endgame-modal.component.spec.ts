// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { SocketTestHelper } from '@app/classes/socket-test-helper';
// import { SocketClientService } from '@app/services/socket-client/socket-client.service';
// import { Socket } from 'socket.io-client';
// import { EndgameModalComponent } from './endgame-modal.component';

// class SocketClientServiceMock extends SocketClientService {
//     // eslint-disable-next-line @typescript-eslint/no-empty-function
//     override connect() {}
// }

// describe('EndgameModalComponent', () => {
//     let component: EndgameModalComponent;
//     let fixture: ComponentFixture<EndgameModalComponent>;
//     let socketServiceMock: SocketClientServiceMock;
//     let socketHelper: SocketTestHelper;

//     beforeEach(async () => {
//         socketHelper = new SocketTestHelper();
//         socketServiceMock = new SocketClientServiceMock();
//         socketServiceMock.socket = socketHelper as unknown as Socket;
//         await TestBed.configureTestingModule({
//             declarations: [EndgameModalComponent],
//             providers: [{ provide: SocketClientService, useValue: socketServiceMock }],
//         }).compileComponents();

//         fixture = TestBed.createComponent(EndgameModalComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should put someone in the first place when same min', () => {
//         component.finalTime = '00:02';
//         component.bestTimeArray = ['00:07', '00:08', '00:10'];
//         component.endGameTime();
//         // const spy = spyOn(component, 'endGameTime');
//         // expect(spy).toHaveBeenCalled();
//         expect(component.bestTimeArray[0]).toEqual(component.finalTime);
//     });

//     it('should put someone in the second place when same min', () => {
//         component.finalTime = '00:08';
//         component.bestTimeArray = ['00:07', '00:09', '00:10'];
//         component.endGameTime();
//         // const spy = spyOn(component, 'endGameTime');
//         // expect(spy).toHaveBeenCalled();
//         expect(component.bestTimeArray[1]).toEqual(component.finalTime);
//     });

//     it('should put someone in the first place when diff min', () => {
//         component.finalTime = '00:02';
//         component.bestTimeArray = ['01:07', '01:08', '01:10'];
//         component.endGameTime();
//         // const spy = spyOn(component, 'endGameTime');
//         // expect(spy).toHaveBeenCalled();
//         expect(component.bestTimeArray[0]).toEqual(component.finalTime);
//     });

//     it('should put someone in the second place when diff min', () => {
//         component.finalTime = '01:08';
//         component.bestTimeArray = ['01:07', '01:09', '01:10'];
//         component.endGameTime();
//         // const spy = spyOn(component, 'endGameTime');
//         // expect(spy).toHaveBeenCalled();
//         expect(component.bestTimeArray[1]).toEqual(component.finalTime);
//     });

//     it('should update best time arrays correctly', () => {
//         // Set up initial input values for the component
//         component.userName = 'Test User';
//         component.bestTimeArray = ['01:30', '02:00', '02:30'];
//         component.finalTime = '02:15';
//         component.bestTimeNameArray = ['User1', 'User2', 'User3'];
//         component.gameName = 'Test Game';

//         // Call the endGameTime method to update the best time arrays
//         component.endGameTime();

//         // Check that the best time arrays have been updated correctly
//         expect(component.bestTimeArray).toEqual(['01:30', '02:00', '02:15']);
//         expect(component.bestTimeNameArray).toEqual(['User1', 'User2', 'Test User']);
//     });

//     /*it('should send message to socket', () => {
//         spyOn(component.socketClientService, 'send');
//         // const onCancelComponent = new EndgameModalComponent(component.socketClientService);
//         component.endGameTime();
//         expect(component.socketClientService.send).toBeTruthy();
//     });*/
// });
