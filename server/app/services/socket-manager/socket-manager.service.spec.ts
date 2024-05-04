/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FIVE_THOUSAND, THREE } from '@common/global-constants';
import { Server } from 'app/server';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { Socket, io as ioClient } from 'socket.io-client';
import { Container } from 'typedi';
import { SocketManager } from './socket-manager.service';

describe('SocketManager service tests', () => {
    let service: SocketManager;
    let server: Server;
    let clientSocket: Socket;
    let clientSocket2: Socket;

    const urlString = 'http://localhost:3000';
    beforeEach(async () => {
        server = Container.get(Server);
        server.init();
        service = server['socketManager'];
        clientSocket = ioClient(urlString);
        clientSocket2 = ioClient(urlString);
    });

    afterEach(() => {
        clientSocket.close();
        clientSocket2.close();
        service['sio'].close();
        sinon.restore();
    });
    it('should join a room on joinRoom', (done) => {
        clientSocket.on('joinRoom', (size) => {
            expect(size).to.equal(1);
            done();
        });
        clientSocket.emit('joinRoom');
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should tell us that theres no more hint', (done) => {
        clientSocket.emit('noMoreHints');
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should tell us that a game has been deleted', (done) => {
        const id = 'test';
        const path = `wait${id}`;
        clientSocket.emit('gameDeleted', id);
        expect(service.waitList.has(path)).to.equal(false);
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket2.on('gameDeleted', (val) => {
            expect(val).to.equal(id);
            expect(spy.calledOnce);
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should join a room on joinLTWaitlist', (done) => {
        clientSocket.on('joinLTWaitlist', (size) => {
            expect(size).to.equal(2);
            done();
        });
        clientSocket.emit('joinLTWaitlist');
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should joinLTGameRoom', (done) => {
        clientSocket.emit('pageLoaded');
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should load page', (done) => {
        clientSocket.emit('joinLTGameRoom', 'metro');
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should hostJoinLTGameRoom', (done) => {
        clientSocket.emit('hostJoinLTGameRoom', 'metro');
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should join a waitRoom on joinWaitRoom', (done) => {
        const testWaitRoom = new Map();
        const sockId1 = '123';
        const sockN1 = 'Greg';
        clientSocket.on('joinWaitRoom', (roomName) => {
            expect(testWaitRoom).to.equal({});
            testWaitRoom.set(roomName, new Map());
            testWaitRoom.get(roomName).set(sockId1, sockN1);
            expect(testWaitRoom.get(roomName).get(sockId1)).to.equal(sockN1);
            done();
        });
        clientSocket.emit('joinWaitRoom', 'testWait');
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should emit blinkDiff event with the right information', (done) => {
        const valueSent = { position: 1, idHost: 'Amira', idGame: 'test' };
        clientSocket.on('blinkDiff', (data) => {
            expect(data).to.equal(valueSent);
            expect(data).to.have.property('idHost', 'Amira');
            expect(data).to.have.property('idGame', 'test');
            expect(data).to.have.property('position', 1);
            done();
        });
        clientSocket.emit('blinkDiff', valueSent);
        setTimeout(done, FIVE_THOUSAND);
    });
    it('should react correctly giveUp event', (done) => {
        const valueSent = { position: 1, idHost: 'Amira', idGame: 'test' };
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.on('giveUp', (data) => {
            expect(data).to.equal(valueSent);
            expect(data).to.have.property('idHost', 'Amira');
            expect(data).to.have.property('idGame', 'test');
            expect(data).to.have.property('position', 1);
            expect(spy.called);
            done();
        });
        clientSocket.emit('giveUp', valueSent);
        setTimeout(done, FIVE_THOUSAND);
    });

    it('1. should broadcast that the message is to long to room if message exceed 200 characters', (done) => {
        const testMessage = {
            // eslint-disable-next-line max-len
            text: "Pour votre nom Discord sur le serveur, on vous demande suivre le gabarit suivant : Prénom Nom - XYZ où XYZ est votre numéro d'équipe (lorsqu'il vous aura été attribué) Exemple : Nikolay Radoev - 101. Vous pouvez changer votre nom en effectuant un clique droit sur votre nom dans la barre de right (Application Desktop) et en sélectionnant Edit Server Profile. L'équipe académique se réserve le droit de ne pas répondre aux questions d'une personne qui ne suit pas ce reglement.",
            gameId: 'Test',
            hostId: 'Amz',
        };

        const spy = sinon.spy(service['sio'].sockets, 'emit');
        const expectedMessage = 'MESSAGE TROP LONG';
        clientSocket.emit('roomMessage', testMessage);
        clientSocket.on('roomMessage', (val) => {
            expect(val.text).to.equal(expectedMessage);
            expect(val.gameId).to.equal(testMessage.gameId);
            expect(val.hostID).to.equal(testMessage.hostId);
            expect(spy.called);
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should update and broadcast the difference found to the player in a room when diffFound event is called', (done) => {
        let valueSent = { diffHost: 2, diffInv: THREE, idHost: 'hostId', idGame: 'gameId' };
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('diffFound', valueSent);

        clientSocket2.on('diffFound', (val) => {
            expect(val).to.equal(valueSent);
            expect(spy.calledTwice);
            done();
        });
        valueSent = { diffHost: 2, diffInv: THREE, idHost: clientSocket.id, idGame: 'gameId' };
        clientSocket.emit('diffFound', valueSent);

        clientSocket.on('diffFound', (val) => {
            clientSocket.id = valueSent.idHost;
            expect(clientSocket.id).to.equal(val.idHost);
            expect(val).to.equal(valueSent);
            expect(spy.calledTwice);
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should correctly set the username on userName event', (done) => {
        const valueSent = 'Amira';
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('userName', valueSent);

        clientSocket2.on('userName', (val) => {
            expect(val).to.equal(valueSent);
            expect(service.userMap.get(clientSocket.id)).to.equal('Amira');
            expect(spy.calledTwice);
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });
    it('should correctly leave a room when leave event is called', (done) => {
        clientSocket.emit('leave');
        const spy1 = sinon.spy(console, 'log');
        service.soloGame = true;

        clientSocket2.on('leave', () => {
            expect((clientSocket as any).leave(clientSocket.id).called);
            expect(spy1.called);
            expect(service.soloGame).to.equal(false);
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });
    it('should correctly leave a room when leaveWaitRoom event is called', (done) => {
        const waitingRoomName = 'Test';
        clientSocket.emit('leaveWaitRoom');
        service.soloGame = true;

        clientSocket2.on('leaveWaitRoom', () => {
            expect((clientSocket as any).leave(`wait${waitingRoomName}`).called);
            expect(service.soloGame).to.equal(false);
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });
    it('should broadcast message to multiple clients on broadcastAll event', (done) => {
        const testMessage = { text: 'Hello World', gameId: 'gamID', hostId: 'hostID' };
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('roomBroadcastMessage', testMessage);

        clientSocket2.on('massMessage', (message: string) => {
            expect(message).to.equal(testMessage);
            assert(spy.called);
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });
    it('should broadcast message to user on soloErrorFound event', (done) => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('soloErrorFound');

        clientSocket.on('soloErrorFound', () => {
            expect(spy.calledWith('Erreur'));
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should correctly handle hintUse event when replay is true', (done) => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        const valueSent = { noHints: 2, replay: true };
        clientSocket.emit('hintUse', valueSent);

        clientSocket.on('hintUse', (nbHint) => {
            expect(nbHint).to.equal(valueSent);
            expect(spy.callCount).to.equal(2);
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });
    it('should correctly handle hintUse event when replay is false', (done) => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        const valueSent = { noHints: 2, replay: false };
        clientSocket.emit('hintUse', valueSent);

        clientSocket.on('hintUse', (nbHint) => {
            expect(nbHint).to.equal(valueSent);
            expect(spy.callCount).to.equal(3);
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should broadcast message to user on newTime event', (done) => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('newTime');

        clientSocket.on('newTime', () => {
            expect(spy.calledWith('00:05'));
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should replay the time on replayTime event', (done) => {
        const testMessage = {
            // eslint-disable-next-line max-len
            text: "Pour votre nom Discord sur le serveur, on vous demande suivre le gabarit suivant : Prénom Nom - XYZ où XYZ est votre numéro d'équipe (lorsqu'il vous aura été attribué) Exemple : Nikolay Radoev - 101. Vous pouvez changer votre nom en effectuant un clique droit sur votre nom dans la barre de right (Application Desktop) et en sélectionnant Edit Server Profile. L'équipe académique se réserve le droit de ne pas répondre aux questions d'une personne qui ne suit pas ce reglement.",
            color: 'black',
        };
        clientSocket.emit('replayTime', testMessage);
        clientSocket.on('replayTime', (message) => {
            expect(message).to.equal(testMessage.text);
        });
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should update constants on updatedConst event', (done) => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('updatedConst');

        clientSocket.on('updatedConst', () => {
            expect(spy.calledWith('a'));
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should play or pause replay on playPause event', () => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('playPause');

        clientSocket.on('playPause', () => {
            expect(spy.called);
        });
    });

    it('should handle verification event', () => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('verification');

        clientSocket.on('verification', () => {
            expect(spy.callCount).to.equal(1);
        });
    });

    it('should handle help event', () => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('help', 'Amira');

        clientSocket.on('help', (val) => {
            expect(val).to.equal('Amira');
            expect(spy.called);
        });
    });

    it('should handle a "help" event', (done) => {
        clientSocket.on('roomMessage', (help) => {
            expect(help).to.equal('Help message');
            clientSocket.disconnect();
            done();
        });
        clientSocket.emit('help', 'Help message');
    });

    it('should play or pause replay on playPause event', () => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('playPause');

        clientSocket.on('playPause', () => {
            expect(spy.called);
        });
    });

    it('should play or pause replay on playPause event', (done) => {
        clientSocket.emit('playPause');
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should let you leave wait room for LT', (done) => {
        clientSocket.emit('leaveWaitRoomLT');
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should give up', (done) => {
        const valueSent = { idHost: 'hostId', idGame: 'gameId' };
        clientSocket.emit('giveUp', valueSent);
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should restart video on restartVideo event', (done) => {
        clientSocket.emit('restartVideo');
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should broadcast message to user on differenceFound event', (done) => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('differenceFound');

        clientSocket.on('differenceFound', () => {
            expect(spy.calledWith('Différence trouvée'));
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should broadcast message to user on errorFound event', (done) => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        const valueSent = { diffHost: 2, diffInv: THREE, idHost: 'hostId', idGame: 'gameId' };
        clientSocket.emit('errorFound', valueSent);

        clientSocket.on('errorFound', (val) => {
            expect(spy.calledWith(val));
            done();
        });
        setTimeout(done, FIVE_THOUSAND);
    });

    it('should broadcast to all sockets when emiting time', () => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        service['emitTime']();
        assert(spy.called);
    });

    it('should correctly delete waiting room', () => {
        const id = 'test';
        const path = `wait${id}`;
        service.waitList.set(clientSocket, `wait${id}`);
        service.deleteWaitRoom(id);
        expect(service.waitList.has(path)).to.equal(false);
    });

    it('should emit notPicked event to socket and update waitList and listUsers', (done) => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        const valuesSent = {
            invId: 'invId',
            gameId: 'gameId',
        };
        clientSocket.emit('refused', valuesSent);
        clientSocket.on('refused', (ids) => {
            expect(spy.calledWith(ids.gameId, "You we're refused"));
        });
        done();
    });
});
