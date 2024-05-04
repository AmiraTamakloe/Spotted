import { HttpException } from '@app/classes/http/http.exception';
import { ConstantsController } from '@app/controllers/constants-controller/constants.controllers';
import { GamesController } from '@app/controllers/game-controller/games.controller';
import { ImageController } from '@app/controllers/image-controller/image.controller';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { HistoryController } from './controllers/history-controller/history.controller';
import { ValidationController } from './controllers/validation-controller/validation.controllers';
@Service()
export class Application {
    app: express.Application;
    private readonly internalError: number = StatusCodes.INTERNAL_SERVER_ERROR;

    // eslint-disable-next-line max-params
    constructor(
        private readonly gamesController: GamesController,
        private readonly validationController: ValidationController,
        private readonly imageController: ImageController,
        private readonly constantsController: ConstantsController,
        private readonly historyController: HistoryController,
    ) {
        this.app = express();
        this.config();

        this.bindRoutes();
    }

    bindRoutes(): void {
        this.app.use('/selection', this.gamesController.router);
        this.app.use('/configuration', this.gamesController.router);
        this.app.use('/upload', this.imageController.router);
        this.app.use('/validation', this.validationController.router);
        this.app.use('/constants', this.constantsController.router);
        this.app.use('/history', this.historyController.router);
        this.app.use('*', (req, res) => {
            res.redirect('/');
        });
        this.errorHandling();
    }

    private config(): void {
        this.app.use(express.json({ limit: '2mb' }));
        this.app.use(express.urlencoded({ limit: '2mb', extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    private errorHandling(): void {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: HttpException = new HttpException('Not Found');
            next(err);
        });

        if (this.app.get('env') === 'development') {
            this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
