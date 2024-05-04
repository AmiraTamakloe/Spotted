import { model, Schema } from 'mongoose';

const gameSchema = new Schema({
    title: String,
    difficulty: String,
    description: String,
    numberOfDiff: Number,
    solo: [
        { name: String, score: String },
        { name: String, score: String },
        { name: String, score: String },
    ],
    multiplayer: [
        { name: String, score: String },
        { name: String, score: String },
        { name: String, score: String },
    ],
    srcClickable: String,
    srcModified: String,
    srcOriginal: String,
    arrDiff: Object,
});

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Game = model('Game', gameSchema);
