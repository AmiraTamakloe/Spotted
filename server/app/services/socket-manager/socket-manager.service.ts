/* eslint-disable no-console */
import { THOUSAND_MILLISECONDS, TWO_HUNDRED } from '@common/global-constants';
import * as http from 'http';
import * as io from 'socket.io';

export class SocketManager {
    roomSize: number | undefined;
    waitList = new Map();
    room: string;
    soloGame: boolean;
    userMap = new Map();
    gamesMap = new Map();
    socketMap = new Map();
    socketColorMap = new Map();
    private ptrLt: string;
    private sio: io.Server;

    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);

            this.socketMap.set(socket.id, socket);
            socket.on('hintUse', (nbHints) => {
                if (!nbHints.replay) {
                    this.sio.to(socket.id).emit('roomBroadcastMessage', 'Indice utilisé');
                }
                this.sio.to(socket.id).emit('updateHintCounter', nbHints.noHints);
                this.sio.to(socket.id).emit('penaltyTime');
            });

            socket.on('noMoreHints', () => {
                this.sio.to(socket.id).emit('roomBroadcastMessage', "Plus d'hints disponibles");
            });

            socket.on('joinRoom', () => {
                socket.join(socket.id);
                this.socketColorMap.set(socket.id, 'red');
                socket.emit('userNameSolo', this.userMap.get(socket.id));
            });

            socket.on('joinGameRoom', (roomName) => {
                this.socketMap.get(roomName.invId).join(roomName.room);
                if (!this.socketColorMap.has(roomName.hostId)) {
                    this.socketColorMap.set(roomName.hostId, 'red');
                    this.socketColorMap.set(roomName.invId, 'blue');
                }
                if (!this.gamesMap.get(roomName.hostId + roomName.gameId)) {
                    this.gamesMap.set(roomName.hostId + roomName.gameId, new Map());
                }
                this.gamesMap.get(roomName.hostId + roomName.gameId).set(roomName.invId, this.userMap.get(roomName.invId));
                this.sio.to(roomName.invId).emit('joinGame', { gameId: roomName.gameId, hostId: socket.id });
            });

            socket.on('hostJoinGameRoom', (roomName) => {
                socket.join(roomName.room);
                this.waitList.forEach((room) => {
                    if (room.size > 0 && room.has(roomName.invId)) {
                        room.delete(roomName.invId);
                    }
                });
                this.gamesMap.get(roomName.hostId + roomName.gameId).set(socket.id, this.userMap.get(socket.id));
                socket.leave(`wait${roomName.gameId}`);
                this.socketMap.get(roomName.invId).leave(`wait${roomName.gameId}`);
                this.sio.to(`wait${roomName.gameId}`).emit('notPicked', { gameId: roomName.gameId, msg: "You we're not picked" });
                this.sio.to(socket.id + roomName.gameId).emit('gameStarted', [roomName.hostName, roomName.invName, roomName.hostId, roomName.gameId]);
                this.deleteWaitRoom(roomName.gameId);
            });

            socket.on('joinWaitRoom', (roomName) => {
                socket.join(roomName);
                if (!this.waitList.get(roomName)) {
                    this.waitList.set(roomName, new Map());
                }
                this.waitList.get(roomName).set(socket.id, this.userMap.get(socket.id));

                const names: string[] = Array.from(this.waitList.get(roomName).values());
                const idPlayers: string[] = Array.from(this.waitList.get(roomName).keys());
                this.sio.sockets.to(roomName).emit('listUsers', [names, idPlayers]);
                this.sio.to(idPlayers[0]).emit('youreHost');
            });

            socket.on('gameDeleted', (id) => {
                if (this.waitList.get(`wait${id}`)) {
                    this.sio.sockets.to(`wait${id}`).emit('notPicked', { gameId: id, msg: 'Le jeu a été supprimé' });
                }
            });

            socket.on('joinLTWaitlist', () => {
                if (!this.waitList.get(this.ptrLt) || this.waitList.get(this.ptrLt).size === 2) {
                    this.ptrLt = 'ltPtr' + socket.id;
                    this.waitList.set(this.ptrLt, new Map());
                }
                this.waitList.get(this.ptrLt).set(socket.id, this.userMap.get(socket.id));
                socket.join(this.ptrLt);
                const names: string[] = Array.from(this.waitList.get(this.ptrLt).values());
                const idPlayers: string[] = Array.from(this.waitList.get(this.ptrLt).keys());
                this.sio.sockets.to(this.ptrLt).emit('listUsers', [names, idPlayers]);
                if (this.waitList.get(this.ptrLt).size === 2) {
                    this.sio.sockets.to(this.ptrLt).emit('LTGame');
                }
            });

            socket.on('leaveWaitRoomLT', () => {
                this.waitList.forEach((room, key) => {
                    if (room.has(socket.id)) {
                        room.delete(socket.id);
                        if (room.size === 0) {
                            this.waitList.delete(key);
                        } else {
                            const idPlayers: string[] = Array.from(room.keys());
                            const names: string[] = Array.from(room.values());
                            this.sio.sockets.to(key).emit('listUsers', [names, idPlayers]);
                            this.sio.sockets.to(key).emit('stopStartLt');
                            console.log(this.waitList);
                        }
                    }
                });
            });

            socket.on('joinLTGameRoom', (roomName) => {
                socket.join(roomName.room);
                if (!this.socketColorMap.has(roomName.hostId)) {
                    this.socketColorMap.set(roomName.hostId, 'red');
                    this.socketColorMap.set(roomName.invId, 'blue');
                }
                if (!this.gamesMap.get(roomName.hostId + roomName.gameId)) {
                    this.gamesMap.set(roomName.hostId + roomName.gameId, new Map());
                }
                this.gamesMap.get(roomName.hostId + roomName.gameId).set(roomName.invId, this.userMap.get(roomName.invId));
                this.gamesMap.get(roomName.hostId + roomName.gameId).set(roomName.hostId, this.userMap.get(socket.id));
                this.gamesMap.get(roomName.hostId + roomName.gameId).set('invId', roomName.invId);
                this.gamesMap.get(roomName.hostId + roomName.gameId).set('hostId', roomName.hostId);
            });

            socket.on('hostJoinLTGameRoom', (roomName) => {
                socket.join(roomName.room);
                if (!this.gamesMap.get(roomName.hostId + roomName.gameId)) {
                    this.gamesMap.set(roomName.hostId + roomName.gameId, new Map());
                }
                this.gamesMap.get(roomName.hostId + roomName.gameId).set('gameArray', roomName.array);
            });

            socket.on('pageLoaded', () => {
                this.gamesMap.forEach((room, key) => {
                    if (key.endsWith('LTGame') && room.has(socket.id)) {
                        this.sio.to(key).emit('gameStartedLT', {
                            hostName: this.userMap.get(room.get('hostId')),
                            invName: this.userMap.get(room.get('invId')),
                            hostId: room.get('hostId'),
                            array: room.get('gameArray'),
                        });
                    }
                });
            });

            socket.on('playPause', () => {
                this.sio.to(socket.id).emit('playPause');
            });

            socket.on('restartVideo', () => {
                this.sio.to(socket.id).emit('restartVideo');
            });

            socket.on('diffFound', (val) => {
                let newHostVal = val.diffHost;
                let newInvVal = val.diffInv;
                if (socket.id === val.idHost) {
                    newHostVal++;
                } else {
                    newInvVal++;
                }
                this.sio.sockets.to(val.idHost + val.idGame).emit('updatedDiffs', { diffH: newHostVal, diffI: newInvVal });
                this.sio.to(val.idHost + val.idGame).emit('roomBroadcastMessage', `Différence trouvée par ${this.userMap.get(socket.id)}`);
            });

            socket.on('blinkDiff', (val) => {
                const nbDiff = val.position;
                this.sio.sockets.to(val.idHost + val.idGame).emit('blinkDiff', { position: nbDiff });
            });

            socket.on('userName', (userName: string) => {
                this.userMap.set(socket.id, userName);
            });

            socket.on('leave', () => {
                if (this.soloGame === true) {
                    this.soloGame = false;
                }
                socket.leave(this.room);
            });
            socket.on('leaveWaitRoom', (waitRoom) => {
                socket.leave(waitRoom);
            });

            socket.on('roomMessage', (val) => {
                let message: string;
                const userColor = this.socketColorMap.get(socket.id);
                if (val.text.length > TWO_HUNDRED) {
                    val.text = 'MESSAGE TROP LONG';
                    message = `${this.userMap.get(socket.id)} : ${val.text}`;
                    this.sio.to(val.hostId + val.gameId).emit('roomMessage', { text: message, color: userColor });
                } else {
                    message = `${this.userMap.get(socket.id)} : ${val.text}`;
                    if (!this.gamesMap.has(val.hostId + val.gameId)) {
                        this.sio.to(socket.id).emit('roomMessage', { text: message, color: userColor });
                    }
                    this.sio.to(val.hostId + val.gameId).emit('roomMessage', { text: message, color: userColor });
                }
            });

            socket.on('roomBroadcastMessage', (val) => {
                this.sio.to(val.gameId + val.hostId).emit('roomBroadcastMessage', `${this.userMap.get(socket.id)} ${val.text}`);
            });

            socket.on('refused', (ids) => {
                this.socketMap.get(ids.invId).emit('notPicked', { gameId: ids.gameId, msg: "You we're refused" });
                this.waitList.get(`wait${ids.gameId}`).delete(ids.invId);
                const names: string[] = Array.from(this.waitList.get(`wait${ids.gameId}`).values());
                const idPlayers: string[] = Array.from(this.waitList.get(`wait${ids.gameId}`).keys());
                this.sio.sockets.to(`wait${ids.gameId}`).emit('listUsers', [names, idPlayers]);
                this.sio.to(idPlayers[0]).emit('youreHost');
            });

            socket.on('differenceFound', () => {
                this.sio.to(socket.id).emit('roomBroadcastMessage', 'Différence trouvée');
                this.sio.to(socket.id).emit('bonusTime', 'Différence trouvée');
            });

            socket.on('errorFound', (val) => {
                this.sio.to(socket.id).emit('penaltyTime');
                this.sio.to(val.idHost + val.idGame).emit('roomBroadcastMessage', ` Erreur par ${this.userMap.get(socket.id)}`);
            });

            socket.on('soloErrorFound', () => {
                this.sio.to(socket.id).emit('penaltyTime');
                this.sio.to(socket.id).emit('roomBroadcastMessage', ' Erreur');
            });

            socket.on('newTime', (newTime: string) => {
                this.sio.emit('roomBroadcastMessage', newTime);
            });

            socket.on('help', (help: string) => {
                this.sio.emit('roomMessage', help);
            });

            socket.on('verification', () => {
                this.sio.to(socket.id).emit('multiVerification', this.userMap.get(socket.id));
            });

            socket.on('giveUp', (val) => {
                this.gamesMap.forEach((game, key) => {
                    if (game.has(socket.id)) {
                        game.delete(socket.id);
                        this.socketMap
                            .get(Array.from(game.keys())[0])
                            .emit('playerLeft', { quitterName: this.userMap.get(socket.id), quitID: socket.id });
                        this.gamesMap.delete(key);
                    }
                });
                this.sio.to(val.idHost + val.idGame).emit('roomBroadcastMessage', ` ${this.userMap.get(socket.id)} a abandonné la partie`);
            });

            socket.on('updatedConst', (consts) => {
                this.sio.sockets.emit('constsToEveryone', consts);
            });

            socket.on('replayTime', (message) => {
                this.sio.to(socket.id).emit('replayTimeMessage', { text: message.text, color: message.color });
            });

            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
                this.gamesMap.forEach((game, key) => {
                    if (game.has(socket.id)) {
                        game.delete(socket.id);
                        if (game.size > 0) {
                            this.sio.sockets.to(key).emit('playerLeft', this.userMap.get(socket.id));
                            this.sio.sockets.to(key).emit('roomBroadcastMessage', `${this.userMap.get(socket.id)} a quitté`);
                            this.gamesMap.delete(key);
                        } else {
                            this.gamesMap.delete(key);
                        }
                    }
                });
                this.waitList.forEach((room, key) => {
                    if (key.startsWith('ltPtr') && room.has(socket.id)) {
                        room.delete(socket.id);
                        if (room.size === 0) {
                            this.waitList.delete(key);
                        } else {
                            const idPlayers: string[] = Array.from(room.keys());
                            const names: string[] = Array.from(room.values());
                            this.sio.sockets.to(key).emit('listUsers', [names, idPlayers]);
                            this.sio.sockets.to(key).emit('stopStartLt');
                        }
                    } else if (room.has(socket.id)) {
                        let idPlayers: string[] = Array.from(room.keys());
                        room.delete(socket.id);
                        if (room.size > 0) {
                            if (socket.id === idPlayers[0]) {
                                this.sio.sockets.to(key).emit('notPicked', { gameId: key, msg: 'Host quit' });
                                this.waitList.delete(key);
                            } else {
                                idPlayers = Array.from(room.keys());
                                const names: string[] = Array.from(room.values());
                                this.sio.sockets.to(key).emit('listUsers', [names, idPlayers]);
                                this.sio.to(idPlayers[0]).emit('youreHost');
                            }
                        } else {
                            this.waitList.delete(key);
                        }
                    }
                });
                this.socketColorMap.delete(socket.id);
                this.userMap.delete(socket.id);
            });
        });

        setInterval(() => {
            this.emitTime();
        }, THOUSAND_MILLISECONDS);
    }

    emitTime() {
        this.sio.sockets.emit('clock', new Date().toLocaleTimeString());
    }

    deleteWaitRoom(id: string) {
        const path = `wait${id}`;
        this.waitList.delete(path);
    }
}
