import { Request, Response } from 'express';

const requestMock = { body: {}, user: {} } as Request;

let responseObject = {};
const responseMock: Partial<Response> = {
    status: jest.fn().mockImplementation((result) => {
        responseObject = result;
    }),
    sendStatus: jest.fn().mockImplementation((result) => {
        responseObject = result;
    }),
    send: jest.fn().mockReturnValue({
        json: jest.fn().mockImplementation((JSONdata) => {
            responseObject = JSONdata;
        }),
    }),
};

export { requestMock, responseMock };
