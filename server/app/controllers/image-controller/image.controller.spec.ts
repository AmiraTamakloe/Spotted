import { Application } from '@app/app';
import { expect } from 'chai';
import * as fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { SinonSandbox, createSandbox } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';
const HTTP_STATUS_ERROR = StatusCodes.BAD_REQUEST;
const HTTP_STATUS_CREATED = StatusCodes.CREATED;
const HTTP_STATUS_OK = StatusCodes.OK;

describe('Image Controller', () => {
    let expressApp: Express.Application;
    let sandbox: SinonSandbox;
    const content = 'fake file content';

    beforeEach(async () => {
        const app = Container.get(Application);
        expressApp = app.app;
        sandbox = createSandbox();
        fs.writeFileSync('./assets/1679181670315.bmp', content);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return code 201 on a valid post request to /upload', async () => {
        const requestBody = { data: 'Qk02AAAAAAAAADYAAAAAAAACAAAAAQAAAABAAEAAAAAAAD', folderName: 'test' };
        return supertest(expressApp).post('/upload').send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_CREATED);
    });

    it('should return code 400 on a valid post request to /upload', async () => {
        const requestBody = { folderName: 'test' };
        const response = await supertest(expressApp).post('/upload').send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_ERROR);

        expect(response.status).to.equal(HTTP_STATUS_ERROR);
    });

    it('should return correct status from valid get request', async () => {
        return await supertest(expressApp).get('/upload/1679181670317.bmp').expect(HTTP_STATUS_ERROR);
    });

    it('should return correct status from invalid get request', async () => {
        return await supertest(expressApp).get('/upload/82669001.bmp').expect(HTTP_STATUS_ERROR);
    });

    it('should return correct status on a valid delete request', async () => {
        return supertest(expressApp).delete('/upload/1679181670315.bmp').expect(HTTP_STATUS_OK);
    });

    it('should return correct status on an invalid delete request', async () => {
        return supertest(expressApp).delete('/upload/16791.bmp').expect(HTTP_STATUS_ERROR);
    });

    it('should return an BMP image on a valid get request', async () => {
        const response = await supertest(expressApp).get('/upload/1679181670315.bmp').set('Accept', 'image/bmp');
        expect(response.status).to.equal(HTTP_STATUS_OK);
        expect(response.type).to.equal('image/bmp');
        expect(response.body).not.to.equal('');
    });
});
