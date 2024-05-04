import { Request, Response, Router } from 'express';
import * as fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_ERROR = StatusCodes.BAD_REQUEST;

@Service()
export class ConstantsController {
    router: Router;

    constructor() {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.patch('/', async (req: Request, res: Response) => {
            if (!req.body.timeLimit || !req.body.timeGain || !req.body.timePenalty) {
                res.status(HTTP_STATUS_ERROR).send('Empty request');
                return;
            }
            const myJSON = fs.readFileSync('./constants.json');
            const stringJSON = myJSON.toString();
            const answerJSON = JSON.parse(stringJSON);
            answerJSON.timeLimit = req.body.timeLimit;
            answerJSON.timeGain = req.body.timeGain;
            answerJSON.timePenalty = req.body.timePenalty;
            const answer = JSON.stringify(answerJSON);
            fs.writeFileSync('./constants.json', answer, 'utf8');
            res.status(HTTP_STATUS_OK).send(answerJSON);
        });
        this.router.get('/', async (req: Request, res: Response) => {
            const jsonjs = fs.readFileSync('./constants.json');
            const sJson = jsonjs.toString();
            const answerJSON = JSON.parse(sJson);
            res.status(HTTP_STATUS_OK).send(answerJSON);
        });
    }
}
