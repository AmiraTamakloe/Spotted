import { Vec2 } from '@app/interfaces/vec2';

export interface Click {
    clickPos?: Vec2;
    socketId?: string;
    idHost?: string;
    diffIndex?: number;
    diffFound: boolean;
}
