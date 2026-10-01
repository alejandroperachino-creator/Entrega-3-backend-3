import { CustomError, ErrorDictionary } from '../utils/errors.js';

const normalizeError = (error) => {
    let formattedError = error;

    if (error?.name === 'CastError') {
        formattedError = new CustomError({
            name: ErrorDictionary.INVALID_ID_ERROR.name,
            message: ErrorDictionary.INVALID_ID_ERROR.message,
            code: ErrorDictionary.INVALID_ID_ERROR.code,
            statusCode: ErrorDictionary.INVALID_ID_ERROR.status,
            cause: error
        });
    }

    if (error?.type === 'entity.parse.failed' || error?.name === 'SyntaxError') {
        formattedError = new CustomError({
            name: ErrorDictionary.INVALID_JSON_ERROR.name,
            message: ErrorDictionary.INVALID_JSON_ERROR.message,
            code: ErrorDictionary.INVALID_JSON_ERROR.code,
            statusCode: ErrorDictionary.INVALID_JSON_ERROR.status,
            cause: error
        });
    }

    if (error?.name === 'ValidationError') {
        formattedError = new CustomError({
            name: ErrorDictionary.VALIDATION_ERROR.name,
            message: error.message || ErrorDictionary.VALIDATION_ERROR.message,
            code: ErrorDictionary.VALIDATION_ERROR.code,
            statusCode: ErrorDictionary.VALIDATION_ERROR.status,
            cause: error
        });
    }

    if (error?.name === 'JsonWebTokenError') {
        formattedError = new CustomError({
            name: ErrorDictionary.AUTHENTICATION_ERROR.name,
            message: 'Token inválido',
            code: ErrorDictionary.AUTHENTICATION_ERROR.code,
            statusCode: ErrorDictionary.AUTHENTICATION_ERROR.status,
            cause: error
        });
    }

    if (error?.name === 'TokenExpiredError') {
        formattedError = new CustomError({
            name: ErrorDictionary.TOKEN_EXPIRED_ERROR.name,
            message: 'Token expirado',
            code: ErrorDictionary.TOKEN_EXPIRED_ERROR.code,
            statusCode: ErrorDictionary.TOKEN_EXPIRED_ERROR.status,
            cause: error
        });
    }

    if (error?.code === 11000) {
        formattedError = new CustomError({
            name: ErrorDictionary.RESOURCE_CONFLICT_ERROR.name,
            message: 'Registro duplicado',
            code: ErrorDictionary.RESOURCE_CONFLICT_ERROR.code,
            statusCode: 409,
            cause: error
        });
    }

    if (!(formattedError instanceof CustomError)) {
        formattedError = new CustomError({
            name: ErrorDictionary.INTERNAL_SERVER_ERROR.name,
            message: error?.message || ErrorDictionary.INTERNAL_SERVER_ERROR.message,
            code: ErrorDictionary.INTERNAL_SERVER_ERROR.code,
            statusCode: ErrorDictionary.INTERNAL_SERVER_ERROR.status,
            cause: error
        });
    }

    return formattedError;
};

export const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    const normalizedError = normalizeError(error);
    const statusCode = normalizedError?.statusCode || normalizedError?.status || ErrorDictionary.INTERNAL_SERVER_ERROR.status;

    const payload = {
        success: false,
        status: statusCode >= 500 ? 'error' : 'fail',
        error: {
            code: normalizedError?.code || ErrorDictionary.INTERNAL_SERVER_ERROR.code,
            message: normalizedError?.message || ErrorDictionary.INTERNAL_SERVER_ERROR.message,
        },
        timestamp: new Date().toISOString()
    };

    if (normalizedError?.details) {
        payload.error.details = normalizedError.details;
    }

    if (process.env.NODE_ENV !== 'production' && normalizedError?.stack) {
        payload.stack = normalizedError.stack;
    }

    return res.status(statusCode).json(payload);
};