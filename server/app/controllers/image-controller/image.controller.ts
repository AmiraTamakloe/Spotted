import { Request, Response, Router } from 'express';
import * as fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { promisify } from 'util';

const HTTP_STATUS_CREATED = StatusCodes.CREATED;
const HTTP_STATUS_ERROR = StatusCodes.BAD_REQUEST;
const HTTP_STATUS_SUCCESS = StatusCodes.OK;

@Service()
export class ImageController {
    router: Router;
    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', async (req: Request, res: Response) => {
            const image = req.body.data;
            const uri = req.body.folderName;
            try {
                const writeFileAsync = promisify(fs.writeFile);
                const binData = Buffer.from(image, 'base64');
                await writeFileAsync(`assets/${uri}.bmp`, binData, 'binary');
                res.sendStatus(HTTP_STATUS_CREATED);
            } catch (ERROR) {
                res.sendStatus(HTTP_STATUS_ERROR);
            }
        });
        this.router.delete('/:folderName', (req: Request, res: Response) => {
            const fileName = req.params.folderName;
            fs.unlink(`./assets/${fileName}`, (err) => {
                if (!err) {
                    res.sendStatus(HTTP_STATUS_SUCCESS);
                } else {
                    res.sendStatus(HTTP_STATUS_ERROR);
                }
            });
        });

        this.router.get('/:folderName', (req: Request, res: Response) => {
            const imageName = req.params.folderName;
            try {
                const imageAsBase64 = fs.readFileSync(`./assets/${imageName}`, 'base64');
                res.status(HTTP_STATUS_SUCCESS).setHeader('Content-Type', 'image/bmp').send(JSON.stringify(imageAsBase64));
            } catch (ERROR) {
                res.sendStatus(HTTP_STATUS_ERROR);
            }
        });
    }
}
