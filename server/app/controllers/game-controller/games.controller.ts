import { EstablishConnexion } from '@app/db';
import { Game } from '@app/models/game';
import { Request, Response, Router } from 'express';
import * as fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
const mongoDbConnector = new EstablishConnexion();
mongoDbConnector.connectionToDB();
const HTTP_STATUS_ERROR = StatusCodes.BAD_REQUEST;
const HTTP_STATUS_SUCCESS = StatusCodes.OK;

@Service()
export class GamesController {
    router: Router;
    mongoDbConnector: EstablishConnexion;
    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', (req: Request, res: Response) => {
            Game.find({ arrDiff: { $exists: true } })
                .select('-arrDiff')
                .then((game) => res.status(HTTP_STATUS_SUCCESS).json(game))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
        });
        this.router.get('/gamesSelectedField', (req: Request, res: Response) => {
            Game.find({ arrDiff: { $exists: true } })
                .sort({ _id: 1 })
                .select('srcModified srcOriginal arrDiff')
                .then((games) => res.status(HTTP_STATUS_SUCCESS).json(games))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
        });

        this.router.get('/:id', (req, res) => {
            Game.findById(req.params.id)
                .then((game) => res.status(HTTP_STATUS_SUCCESS).json(game))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
        });
        this.router.post('/', (req: Request, res: Response) => {
            const game = new Game({
                title: req.body.title,
                difficulty: req.body.difficulty,
                description: req.body.description,
                numberOfDiff: req.body.numberOfDiff,
                multiplayer: req.body.multiplayer,
                solo: req.body.solo,
                srcClickable: req.body.srcClickable,
                srcModified: req.body.srcModified,
                srcOriginal: req.body.srcOriginal,
                arrDiff: req.body.arrDiff,
            });

            game.save((err, doc) => {
                if (!err) {
                    res.send(doc.title);
                } else {
                    res.send(HTTP_STATUS_ERROR);
                }
            });
        });
        this.router.delete('/:id', (req: Request, res: Response) => {
            Game.findByIdAndDelete(req.params.id)
                .then((game) => res.json(game))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
        });
        this.router.delete('/', (req: Request, res: Response) => {
            Game.deleteMany({})
                .then(() => res.sendStatus(HTTP_STATUS_SUCCESS))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
            fs.readdir('./assets/', (err, files) => {
                if (err) throw err;

                for (const file of files) {
                    fs.unlinkSync(`./assets/${file}`);
                }
            });
        });
        this.router.patch('/reset/:id', (req: Request, res: Response) => {
            Game.updateOne(
                { _id: req.params.id },
                {
                    $set: {
                        multiplayer: [
                            { name: 'Amira', score: '01:00' },
                            { name: 'Jacob', score: '01:10' },
                            { name: 'Clem', score: '01:13' },
                        ],
                        solo: [
                            { name: 'Amira', score: '01:00' },
                            { name: 'Jacob', score: '01:10' },
                            { name: 'Clem', score: '01:13' },
                        ],
                    },
                },
            )
                .then(() => res.sendStatus(HTTP_STATUS_SUCCESS))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
        });
        this.router.patch('/', (req: Request, res: Response) => {
            Game.updateMany(
                {},
                {
                    $set: {
                        multiplayer: [
                            {
                                name: 'Amira',
                                score: '01:00',
                            },
                            {
                                name: 'Jacob',
                                score: '01:02',
                            },
                            {
                                name: 'Clem',
                                score: '01:40',
                            },
                        ],
                        solo: [
                            {
                                name: 'Cédrick',
                                score: '01:10',
                            },
                            {
                                name: 'Marco',
                                score: '01:20',
                            },
                            {
                                name: 'Thierry',
                                score: '01:30',
                            },
                        ],
                    },
                },
            )
                .then(() => res.sendStatus(HTTP_STATUS_SUCCESS))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
        });

        this.router.patch('/updateScores/:id', async (req: Request, res: Response) => {
            Game.updateOne(
                { _id: req.params.id },
                {
                    $set: {
                        solo: [
                            { name: req.body[0].name, score: req.body[0].score },
                            { name: req.body[1].name, score: req.body[1].score },
                            { name: req.body[2].name, score: req.body[2].score },
                        ],
                    },
                },
            )
                .then(() => res.sendStatus(HTTP_STATUS_SUCCESS))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
        });

        this.router.patch('/updateMultiScores/:id', async (req: Request, res: Response) => {
            Game.updateOne(
                { _id: req.params.id },
                {
                    $set: {
                        multiplayer: [
                            { name: req.body[0].name, score: req.body[0].score },
                            { name: req.body[1].name, score: req.body[1].score },
                            { name: req.body[2].name, score: req.body[2].score },
                        ],
                    },
                },
            )
                .then(() => res.status(HTTP_STATUS_SUCCESS).sendStatus(HTTP_STATUS_SUCCESS))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
        });
    }
}
