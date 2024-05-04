import { Component, Input, OnInit } from '@angular/core';
import { Constants } from '@app/interfaces/constants';
import { Vec2 } from '@app/interfaces/vec2';
import { ConstantInitialiserService } from '@app/services/constantInitialiser/constant-initialiser.service';
import { HintsService } from '@app/services/hints/hints.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Socket } from 'socket.io-client';

@Component({
    selector: 'app-hints',
    templateUrl: './hints.component.html',
    styleUrls: ['./hints.component.scss'],
})
export class HintsComponent implements OnInit {
    @Input() diffArray: Vec2[][];
    @Input() nbHints: number;
    @Input() isReplay: boolean;
    hints = [1, 2, 3];
    colorSwitches = [true, true, true];
    socket: Socket;
    gain: number;
    tempInit: number;
    penalty: number;
    constructor(
        private socketClientService: SocketClientService,
        private constantInitialiser: ConstantInitialiserService,
        private hintsService: HintsService,
    ) {}

    async ngOnInit(): Promise<void> {
        this.socket = this.socketClientService.socketId;
        this.socketClientService.on('updateHintCounter', (nbHints: number) => {
            for (let i = 0; i < nbHints; i++) {
                this.colorSwitches[i] = false;
            }
        });
        this.socketClientService.on('restartVideo', () => {
            this.colorSwitches = [true, true, true];
        });
        this.constantInitialiser.getConstants().subscribe((data: Constants) => {
            this.penalty = data.timePenalty;
        });
    }
    askHint() {
        this.hintsService.diffArray = this.diffArray;
        this.hintsService.giveHint(this.nbHints);
    }
}
