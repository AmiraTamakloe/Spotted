import { model, Schema } from 'mongoose';

const historySchema = new Schema({
    title: String,
    type: String,
    difficulty: String,
    description: String,
    numberOfDiff: Number,
    hostName: String,
    invName: String,
    winner: Number,
    time: String,
    gaveUp: Number,
    date: String,
});

// eslint-disable-next-line @typescript-eslint/naming-convention
export const History = model('History', historySchema);
