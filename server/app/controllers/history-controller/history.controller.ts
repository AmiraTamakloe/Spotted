import { EstablishConnexion } from '@app/db';
import { History } from '@app/models/history';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
const mongoDbConnector = new EstablishConnexion();
mongoDbConnector.connectionToDB();
const HTTP_STATUS_ERROR = StatusCodes.BAD_REQUEST;
const HTTP_STATUS_OK = StatusCodes.OK;

@Service()
export class HistoryController {
    router: Router;
    mongoDbConnector: EstablishConnexion;
    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', (req: Request, res: Response) => {
            History.find()
                .then((history) => res.status(HTTP_STATUS_OK).json(history))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
        });
        this.router.get('/:id', (req, res) => {
            History.findById(req.params.id)
                .then((history) => res.status(HTTP_STATUS_OK).json(history))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
        });
        this.router.post('/', (req: Request, res: Response) => {
            const history = new History({
                title: req.body.title,
                type: req.body.type,
                difficulty: req.body.difficulty,
                description: req.body.description,
                numberOfDiff: req.body.numberOfDiff,
                hostName: req.body.hostName,
                invName: req.body.invName,
                winner: req.body.winner,
                time: req.body.time,
                gaveUp: req.body.gaveUp,
                date: req.body.date,
            });

            history.save((err) => {
                if (!err) {
                    res.send(HTTP_STATUS_OK);
                } else {
                    res.send(HTTP_STATUS_ERROR);
                }
            });
        });
        this.router.delete('/:id', (req: Request, res: Response) => {
            History.findByIdAndDelete(req.params.id)
                .then((history) => res.status(HTTP_STATUS_OK).json(history))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
        });
        this.router.delete('/', (req: Request, res: Response) => {
            History.deleteMany({})
                .then(() => res.sendStatus(HTTP_STATUS_OK))
                .catch((err: Error) => res.status(HTTP_STATUS_ERROR).json('Error: ' + err));
        });
    }
}
