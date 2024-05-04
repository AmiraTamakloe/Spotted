import { Vec2 } from '@app/interfaces/vec2';

export class Game {
    _id: string;
    title: string;
    difficulty: string;
    description: string;
    numberOfDiff: number;
    solo: [{ name: string; score: string }, { name: string; score: string }, { name: string; score: string }];
    multiplayer: [{ name: string; score: string }, { name: string; score: string }, { name: string; score: string }];
    srcClickable: string;
    srcModified: string;
    srcOriginal: string;
    arrDiff: Vec2[][];
}
