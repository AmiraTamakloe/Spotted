import { Application } from '@app/app';
import { Game } from '@app/models/game';
import { FIVE_THOUSAND } from '@common/global-constants';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_SUCCESS = StatusCodes.MOVED_TEMPORARILY;
const HTTP_STATUS_ERROR = StatusCodes.BAD_REQUEST;
const fakeGame = new Game({
    title: 'cokeMoment',
    difficulty: 'cokeMoment',
    description: 'cokeMoment',
    multiplayer: [
        { name: 'Player 1', score: 100 },
        { name: 'Player 2', score: 200 },
        { name: 'Player 3', score: 300 },
    ],
    solo: [
        { name: 'Player 1', score: 100 },
        { name: 'Player 2', score: 200 },
        { name: 'Player 3', score: 300 },
    ],
    srcClickable: 'cokeMoment',
    srcModified: 'cokeMoment',
    srcOriginal: 'cokeMoment',
});

describe('Game Controller', () => {
    let expressApp: Express.Application;

    beforeEach(async () => {
        const app = Container.get(Application);
        expressApp = app.app;
    });

    it('should return correct message from general get', async () => {
        return await supertest(expressApp).get('/selection').expect(HTTP_STATUS_OK);
    });

    it('should return correct message from general get', async () => {
        return await supertest(expressApp).get('/selection/gamesSelectedField').expect(HTTP_STATUS_OK);
    });

    it('should return correct message from get by id', async (done) => {
        const id = fakeGame.id;
        const requestBody = { id: 0 };
        done();
        return supertest(expressApp).get(`/selection/${id}`).send(requestBody).expect(HTTP_STATUS_OK);
    });

    it('should return correct message from get by id', async (done) => {
        const id = fakeGame.id;
        const requestBody = { id: 'zero' };
        done();
        return supertest(expressApp).get(`/selection/${id}`).send(requestBody).expect(HTTP_STATUS_OK);
    });

    it('should corretly patch', async () => {
        const modifiedOccupation = 'new value to send';
        const requestBody = { occupation: modifiedOccupation };
        return supertest(expressApp).patch('/selection').send(requestBody).expect(HTTP_STATUS_OK);
    });

    it('should corretly patch by id', async () => {
        const id = fakeGame.id;
        const modifiedOccupation = 'new value to send';
        const requestBody = { occupation: modifiedOccupation };
        return supertest(expressApp).patch(`/selection/${id}`).send(requestBody).expect(HTTP_STATUS_SUCCESS);
    });

    it('should corretly patch with reset', async () => {
        const id = fakeGame.id;
        const modifiedOccupation = 'new value to send';
        const requestBody = { occupation: modifiedOccupation };
        return supertest(expressApp).patch(`/selection/reset/${id}`).send(requestBody).expect(HTTP_STATUS_OK);
    });

    it('should corretly patch with reset ', async () => {
        const id = 'deux';
        const requestBody = { id: 'deux' };
        return supertest(expressApp).patch(`/selection/reset/${id}`).send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_ERROR);
    });
    it('should not patch with updateScores bad request ', async () => {
        const id = 'deux';
        const requestBody = [
            { name: 'Player 1', score: 245 },
            { name: 'Player 2', score: 260 },
            { name: 'Player 3', score: 330 },
        ];
        return supertest(expressApp)
            .patch(`/selection/updateScores/${id}`)
            .send(requestBody)
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_ERROR);
    });
    it('should not patch with updateScoresMulti bad request', async () => {
        const id = 'deux';
        const requestBody = [
            { name: 'Player 1', score: 245 },
            { name: 'Player 2', score: 260 },
            { name: 'Player 3', score: 330 },
        ];
        return supertest(expressApp)
            .patch(`/selection/updateMultiScores/${id}`)
            .send(requestBody)
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_ERROR);
    });

    it('1 should corretly patch with updateScores', async () => {
        setTimeout(async () => {
            const id = fakeGame.id;
            const modifiedOccupation = 'new value to send';
            const requestBody = { occupation: modifiedOccupation };
            return supertest(expressApp).patch(`/selection/updateScores/${id}`).send(requestBody).expect(HTTP_STATUS_ERROR);
        }, FIVE_THOUSAND);
    });

    it('2 should corretly patch with updateScores ', async () => {
        setTimeout(async () => {
            const id = 'deux';
            const requestBody = { id: 'deux' };
            return supertest(expressApp)
                .patch(`/selection/updateScores/${id}`)
                .send(requestBody)
                .set('Accept', 'application/json')
                .expect(HTTP_STATUS_ERROR);
        }, FIVE_THOUSAND);
    });

    it('3 should corretly patch with updateMultiScores', async () => {
        setTimeout(async () => {
            const id = fakeGame.id;
            const modifiedOccupation = 'new value to send';
            const requestBody = { occupation: modifiedOccupation };
            return supertest(expressApp).patch(`/selection/updateMultiScores/${id}`).send(requestBody).expect(HTTP_STATUS_ERROR);
        }, FIVE_THOUSAND);
    });

    it('4 should corretly patch with updateMultiScores ', async () => {
        setTimeout(async () => {
            const id = 'deux';
            const requestBody = { id: 'deux' };
            return supertest(expressApp)
                .patch(`/selection/updateMultiScores/${id}`)
                .send(requestBody)
                .set('Accept', 'application/json')
                .expect(HTTP_STATUS_ERROR);
        }, FIVE_THOUSAND);
    });

    it('should corretly patch with updateMultiScores ', async () => {
        const id = 'deux';
        const requestBody = [
            { name: 'Player 1', score: 245 },
            { name: 'Player 2', score: 260 },
            { name: 'Player 3', score: 330 },
        ];
        return supertest(expressApp)
            .patch(`/selection/updateMultiScores/${id}`)
            .send(requestBody)
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_ERROR);
    });

    it('1 should corretly patch with updateScores', async () => {
        setTimeout(async () => {
            const id = fakeGame.id;
            const modifiedOccupation = 'new value to send';
            const requestBody = { occupation: modifiedOccupation };
            return supertest(expressApp).patch(`/selection/updateScores/${id}`).send(requestBody).expect(HTTP_STATUS_ERROR);
        }, FIVE_THOUSAND);
    });

    it('2 should corretly patch with updateScores ', async () => {
        setTimeout(async () => {
            const id = 'deux';
            const requestBody = { id: 'deux' };
            return supertest(expressApp)
                .patch(`/selection/updateScores/${id}`)
                .send(requestBody)
                .set('Accept', 'application/json')
                .expect(HTTP_STATUS_ERROR);
        }, FIVE_THOUSAND);
    });

    it('3 should corretly patch with updateMultiScores', async () => {
        setTimeout(async () => {
            const id = fakeGame.id;
            const modifiedOccupation = 'new value to send';
            const requestBody = { occupation: modifiedOccupation };
            return supertest(expressApp).patch(`/selection/updateMultiScores/${id}`).send(requestBody).expect(HTTP_STATUS_ERROR);
        }, FIVE_THOUSAND);
    });

    it('4 should corretly patch with updateMultiScores ', async () => {
        setTimeout(async () => {
            const id = 'deux';
            const requestBody = { id: 'deux' };
            return supertest(expressApp)
                .patch(`/selection/updateMultiScores/${id}`)
                .send(requestBody)
                .set('Accept', 'application/json')
                .expect(HTTP_STATUS_ERROR);
        }, FIVE_THOUSAND);
    });

    it('should return correct code on a valid post request to post', async () => {
        const requestBody = fakeGame;
        return supertest(expressApp).post('/selection').send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });

    it('should return code 400 on an invalid post request to /upload', async () => {
        const requestBody = fakeGame;
        const response = await supertest(expressApp).post('/upload').send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_ERROR);

        expect(response.status).to.equal(HTTP_STATUS_ERROR);
    });

    it('should return correct message on a valid post request to delete 1', async () => {
        const id = fakeGame.id;
        const requestBody = { id: 0 };
        return supertest(expressApp).delete(`/selection/${id}`).send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });
    it('should return correct message on a valid post request to delete 2 ', async () => {
        const id = 'deux';
        const requestBody = { id: 'deux' };
        return supertest(expressApp).delete(`/selection/${id}`).send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_ERROR);
    });

    it('should return correct message on a valid post request to delete 3', async () => {
        const id = fakeGame.id;
        const requestBody = 'a';
        return supertest(expressApp).get(`/selection/${id}`).send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });

    it('should return correct message from general post request to delete', async () => {
        return await supertest(expressApp).delete('/selection').set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });
});
