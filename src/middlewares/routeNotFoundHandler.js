import { CustomError, ErrorDictionary } from '../utils/errors.js';

export const routeNotFoundHandler = (req, res, next) => {
    next(new CustomError({
        name: ErrorDictionary.NOT_FOUND_ERROR.name,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
        code: ErrorDictionary.NOT_FOUND_ERROR.code,
        statusCode: ErrorDictionary.NOT_FOUND_ERROR.status,
    }));
};