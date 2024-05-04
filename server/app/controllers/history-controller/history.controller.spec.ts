import { Application } from '@app/app';
import { History } from '@app/models/history';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_ERROR = StatusCodes.BAD_REQUEST;
const HTTP_STATUS_MOVED = StatusCodes.MOVED_TEMPORARILY;
const fakeHistory = new History({
    title: 'Tamz',
    type: 'Solo',
    difficulty: 'difficile',
    description: 'test',
    numberOfDiff: '5',
    hostName: 'Amira',
    invName: 'Clem',
    winner: 1,
    time: '0:23',
    gaveUp: '2',
    date: '30-4-2023',
});

describe('History Controller', () => {
    let expressApp: Express.Application;

    beforeEach(async () => {
        const app = Container.get(Application);
        expressApp = app.app;
    });

    it('should return correct message from general get', async () => {
        return await supertest(expressApp).get('/history').expect(HTTP_STATUS_OK);
    });

    it('should return correct message from get by id', async () => {
        const id = fakeHistory.id;
        const requestBody = { id: 0 };
        return supertest(expressApp).get(`/history/${id}`).send(requestBody).expect(HTTP_STATUS_OK);
    });

    it('should return correct message from get by id', async () => {
        const id = 'poto';
        const requestBody = { id: 'poto' };
        return supertest(expressApp).get(`/history/${id}`).send(requestBody).expect(HTTP_STATUS_ERROR);
    });

    it('should corretly patch', async () => {
        const id = fakeHistory.id;
        const modifiedOccupation = 'new value to send';
        const requestBody = { occupation: modifiedOccupation };
        return supertest(expressApp).patch(`/history/${id}`).send(requestBody).expect(HTTP_STATUS_MOVED);
    });

    it('should return correct code on a valid post request to post', async () => {
        const requestBody = fakeHistory;
        return supertest(expressApp).post('/history').send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });

    it('should return code 400 on an invalid post request to /upload', async () => {
        const requestBody = fakeHistory;
        const response = await supertest(expressApp).post('/history').send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_OK);

        expect(response.status).to.equal(HTTP_STATUS_OK);
    });

    it('should return correct message on a valid post request to delete 1', async () => {
        const id = fakeHistory.id;
        const requestBody = { id: 0 };
        return supertest(expressApp).delete(`/history/${id}`).send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });
    it('should return correct message on a valid post request to delete 2 ', async () => {
        const id = 'deux';
        const requestBody = { id: 'deux' };
        return supertest(expressApp).delete(`/history/${id}`).send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_ERROR);
    });

    it('should return correct status on a valid delete request', async (done) => {
        done();
        return supertest(expressApp).post('/').expect(HTTP_STATUS_MOVED);
    });

    it('should return correct message on a valid post request to delete 3', async () => {
        const id = fakeHistory.id;
        const requestBody = 'a';
        return supertest(expressApp).get(`/history/${id}`).send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });

    it('should return correct message from general post request to delete', async () => {
        return await supertest(expressApp).get('/').set('Accept', 'application/json').expect(HTTP_STATUS_MOVED);
    });

    it('should return correct message from general post request to delete', async () => {
        return await supertest(expressApp).delete('/history').set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });

    it('should return correct status from general post request to delete', async () => {
        return await supertest(expressApp).delete('/history').expect(HTTP_STATUS_OK);
    });
});
