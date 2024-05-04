/* eslint-disable max-params */
import { Injectable } from '@angular/core';
import { HintVideo } from '@app/interfaces/hint-video';
import { Vec2 } from '@app/interfaces/vec2';
import { DrawService } from '@app/services/draw/draw.service';
import { ModeSoloService } from '@app/services/mode-solo/mode-solo.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Action } from '@app/services/video/action.model';
import { VideoService } from '@app/services/video/video.service';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/global-constants';
@Injectable({
    providedIn: 'root',
})
export class HintsService {
    diffArray: Vec2[][];
    isReplay: boolean;
    constructor(
        private readonly drawService: DrawService,
        public modeSoloService: ModeSoloService,
        private socketClientService: SocketClientService,
        private videoService: VideoService,
    ) {
        this.isReplay = false;
    }

    set diffArraySetter(diffArray: Vec2[][]) {
        this.diffArray = diffArray;
    }

    set status(stat: boolean) {
        this.isReplay = stat;
    }

    giveHint(nbHints: number) {
        if (nbHints < 3) {
            this.drawService.errLContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
            this.drawService.errRContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
            if (this.diffArray.length > 0) {
                const randomIndex = Math.floor(Math.random() * this.diffArray.length);
                this.drawService.blinkHint(this.diffArray[randomIndex], this.drawService.errRContext, nbHints);
                this.drawService.blinkHint(this.diffArray[randomIndex], this.drawService.errLContext, nbHints);
                if (!this.isReplay) {
                    const hintVideo: HintVideo = { nbHint: nbHints, diff: randomIndex };
                    const action: Action = { type: 'hint', time: Date.now(), hintSelected: hintVideo };
                    this.videoService.addAction(action);
                }

                nbHints++;
                this.socketClientService.send('hintUse', { noHints: nbHints, replay: false });
            }
        } else {
            this.socketClientService.send('noMoreHints');
        }
    }

    replayHint(hintUse: number, hintsLeft: number) {
        this.drawService.errLContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.drawService.errRContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.drawService.blinkHint(this.diffArray[hintUse], this.drawService.errRContext, hintsLeft);
        this.drawService.blinkHint(this.diffArray[hintUse], this.drawService.errLContext, hintsLeft);
        hintsLeft++;
        this.socketClientService.send('hintUse', { noHints: hintsLeft, replay: true });
    }
}
