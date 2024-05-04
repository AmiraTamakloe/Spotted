import { Application } from '@app/app';
import { StatusCodes } from 'http-status-codes';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_ERROR = StatusCodes.BAD_REQUEST;

describe('Constants Controller', () => {
    let expressApp: Express.Application;

    beforeEach(async () => {
        const app = Container.get(Application);
        expressApp = app.app;
    });

    it('should return correct message from general get', async () => {
        return await supertest(expressApp).get('/constants').expect(HTTP_STATUS_OK);
    });

    it('should corretly patch', async () => {
        const requestBody = { timeLimit: 50, timeGain: 10, timePenalty: 10 };
        return supertest(expressApp).patch('/constants').send(requestBody).expect(HTTP_STATUS_OK);
    });

    it('should return wrong code on a invalid post request to post', async () => {
        const requestBody = { timeLimit: undefined, timeGain: undefined, timePenalty: undefined };
        return supertest(expressApp).patch('/constants').send(requestBody).expect(HTTP_STATUS_ERROR);
    });
});
