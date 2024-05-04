import { Message } from '@app/interfaces/message';
import { HintVideo } from '@app/interfaces/hint-video';
import { Click } from '@app/interfaces/click';

export class Action {
    type: string;
    time: number;
    click?: Click;
    message?: Message;
    hintSelected?: HintVideo;
    winnerName?: string;
}
