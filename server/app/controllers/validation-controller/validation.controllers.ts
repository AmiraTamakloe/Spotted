import { ValidationService } from '@app/services/validation/validation.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_ERROR = StatusCodes.BAD_REQUEST;

@Service()
export class ValidationController {
    router: Router;

    constructor(public validationService: ValidationService) {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.post('/', async (req: Request, res: Response) => {
            const mousePosition = req.body.vec;
            const diffArray = req.body.array;
            if (diffArray === undefined || mousePosition === undefined) {
                res.status(HTTP_STATUS_ERROR).send('error');
            }
            const isDiff: boolean = this.validationService.isDifference(mousePosition, diffArray);
            res.status(HTTP_STATUS_OK).send(isDiff);
        });
    }
}
