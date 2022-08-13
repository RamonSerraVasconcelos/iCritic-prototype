import ResponseError from '@src/ts/classes/response-error';
import { Request } from 'express';

const emailValidationRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const checkEmptyRequestBody = (req: Request) => {
    if (Object.keys(req.body).length === 0)
        throw new ResponseError('No data informed!', 400);
};

const checkEmptyValue = (value: string | number) => {
    if (value === '' || !value.toString().replace(/\s/g, '').length)
        throw new ResponseError('Please, fill all fields!', 400);
};

const hasValueMinLength = (value: string, lengthSize: number) => {
    return value.replace(/\s/g, '').length >= lengthSize;
};

const hasValueMaxLength = (value: string, lengthSize: number) => {
    return value.replace(/\s/g, '').length <= lengthSize;
};

const isEmpty = (value: string | number) => {
    return (
        value === '' ||
        value === null ||
        value === undefined ||
        !value.toString().replace(/\s/g, '').length
    );
};

const validateEmail = (email: string) => {
    if (!email.match(emailValidationRegex))
        throw new ResponseError('Invalid email!', 400);
};

const validateDate = (dateStr: string) => {
    if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return false;
    }

    const date = new Date(dateStr);

    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        return false;
    }

    return date.toISOString().startsWith(dateStr);
};

const validateNumber = (input: string) => {
    return /^\d+\.\d+$|^\d+$/.test(input);
};

export {
    checkEmptyRequestBody,
    checkEmptyValue,
    hasValueMinLength,
    hasValueMaxLength,
    isEmpty,
    validateEmail,
    validateDate,
    validateNumber,
};
