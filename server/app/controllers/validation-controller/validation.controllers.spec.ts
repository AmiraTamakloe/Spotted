import { Application } from '@app/app';
import { ValidationService } from '@app/services/validation/validation.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';
const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_ERROR = StatusCodes.BAD_REQUEST;

describe('Validation Service', () => {
    let expressApp: Express.Application;
    let validationService: SinonStubbedInstance<ValidationService>;

    beforeEach(async () => {
        validationService = createStubInstance(ValidationService);
        const app = Container.get(Application);
        expressApp = app.app;
    });

    it('should return true on a valid post request to /', async () => {
        const requestBody = {
            vec: { x: 246, y: 75 },
            array: [
                [
                    { x: 342, y: 97 },
                    { x: 123, y: 129 },
                    { x: 222, y: 220 },
                    { x: 98, y: 301 },
                    { x: 456, y: 306 },
                ],
                [
                    { x: 201, y: 64 },
                    { x: 189, y: 184 },
                    { x: 24, y: 206 },
                    { x: 398, y: 321 },
                    { x: 403, y: 407 },
                ],
                [
                    { x: 84, y: 206 },
                    { x: 111, y: 126 },
                    { x: 272, y: 367 },
                    { x: 623, y: 29 },
                    { x: 503, y: 195 },
                ],
            ],
        };
        return supertest(expressApp)
            .post('/validation')
            .send(requestBody)
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.text).to.equal('false');
            });
    });

    it('should return error on invalid post request to /', async () => {
        const requestBody = { vec: { x: 450, y: 380 } };
        validationService.isDifference.throws(new Error('invalid request'));
        return supertest(expressApp).post('/validation').send(requestBody).set('Accept', 'application/json').expect(HTTP_STATUS_ERROR);
    });
});
