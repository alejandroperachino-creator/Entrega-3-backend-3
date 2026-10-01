export const EErrors = Object.freeze({
    ROUTING_ERROR: 1,
    INVALID_TYPE_ERROR: 2,
    DATABASE_ERROR: 3,
    NOT_FOUND_ERROR: 4,
    BAD_REQUEST_ERROR: 5,
    UNAUTHORIZED_ERROR: 6,
    FORBIDDEN_ERROR: 7,
    VALIDATION_ERROR: 8,
    AUTHENTICATION_ERROR: 9,
    INTERNAL_SERVER_ERROR: 10,
    UNKNOWN_ERROR: 11,
});

export const ErrorDictionary = Object.freeze({
    ROUTING_ERROR: { name: 'ROUTING_ERROR', code: 'ROUTING_ERROR', status: 404, message: 'Error de enrutamiento' },
    INVALID_TYPE_ERROR: { name: 'INVALID_TYPE_ERROR', code: 'INVALID_TYPE_ERROR', status: 400, message: 'Tipo de dato inválido' },
    INVALID_ID_ERROR: { name: 'INVALID_ID_ERROR', code: 'INVALID_ID_ERROR', status: 400, message: 'Id inválido' },
    INVALID_JSON_ERROR: { name: 'INVALID_JSON_ERROR', code: 'INVALID_JSON_ERROR', status: 400, message: 'JSON inválido' },
    DATABASE_ERROR: { name: 'DATABASE_ERROR', code: 'DATABASE_ERROR', status: 500, message: 'Error de base de datos' },
    NOT_FOUND_ERROR: { name: 'NOT_FOUND_ERROR', code: 'NOT_FOUND_ERROR', status: 404, message: 'Recurso no encontrado' },
    BAD_REQUEST_ERROR: { name: 'BAD_REQUEST_ERROR', code: 'BAD_REQUEST_ERROR', status: 400, message: 'Solicitud incorrecta' },
    UNAUTHORIZED_ERROR: { name: 'UNAUTHORIZED_ERROR', code: 'UNAUTHORIZED_ERROR', status: 401, message: 'No autorizado' },
    FORBIDDEN_ERROR: { name: 'FORBIDDEN_ERROR', code: 'FORBIDDEN_ERROR', status: 403, message: 'Acceso prohibido' },
    VALIDATION_ERROR: { name: 'VALIDATION_ERROR', code: 'VALIDATION_ERROR', status: 400, message: 'Error de validación' },
    AUTHENTICATION_ERROR: { name: 'AUTHENTICATION_ERROR', code: 'AUTHENTICATION_ERROR', status: 401, message: 'Error de autenticación' },
    TOKEN_EXPIRED_ERROR: { name: 'TOKEN_EXPIRED_ERROR', code: 'TOKEN_EXPIRED_ERROR', status: 401, message: 'Token expirado' },
    PERMISSION_DENIED_ERROR: { name: 'PERMISSION_DENIED_ERROR', code: 'PERMISSION_DENIED_ERROR', status: 403, message: 'Permiso denegado' },
    RESOURCE_CONFLICT_ERROR: { name: 'RESOURCE_CONFLICT_ERROR', code: 'RESOURCE_CONFLICT_ERROR', status: 409, message: 'Conflicto de recurso' },
    RATE_LIMIT_EXCEEDED_ERROR: { name: 'RATE_LIMIT_EXCEEDED_ERROR', code: 'RATE_LIMIT_EXCEEDED_ERROR', status: 429, message: 'Límite de solicitudes excedido' },
    SERVICE_UNAVAILABLE_ERROR: { name: 'SERVICE_UNAVAILABLE_ERROR', code: 'SERVICE_UNAVAILABLE_ERROR', status: 503, message: 'Servicio no disponible' },
    INTERNAL_SERVER_ERROR: { name: 'INTERNAL_SERVER_ERROR', code: 'INTERNAL_SERVER_ERROR', status: 500, message: 'Error interno del servidor' },
    UNKNOWN_ERROR: { name: 'UNKNOWN_ERROR', code: 'UNKNOWN_ERROR', status: 500, message: 'Error desconocido' },
    USER_NOT_FOUND_ERROR: { name: 'USER_NOT_FOUND_ERROR', code: 'USER_NOT_FOUND_ERROR', status: 404, message: 'Usuario no encontrado' },
    ORDER_NOT_FOUND_ERROR: { name: 'ORDER_NOT_FOUND_ERROR', code: 'ORDER_NOT_FOUND_ERROR', status: 404, message: 'Orden no encontrada' },
    PRODUCT_NOT_FOUND_ERROR: { name: 'PRODUCT_NOT_FOUND_ERROR', code: 'PRODUCT_NOT_FOUND_ERROR', status: 404, message: 'Producto no encontrado' },
    CART_NOT_FOUND_ERROR: { name: 'CART_NOT_FOUND_ERROR', code: 'CART_NOT_FOUND_ERROR', status: 404, message: 'Carrito no encontrado' },
    DELIVERY_NOT_FOUND_ERROR: { name: 'DELIVERY_NOT_FOUND_ERROR', code: 'DELIVERY_NOT_FOUND_ERROR', status: 404, message: 'Entrega no encontrada' },
    ADMIN_CREATION_FORBIDDEN: { name: 'ADMIN_CREATION_FORBIDDEN', code: 'ADMIN_CREATION_FORBIDDEN', status: 403, message: 'No se puede crear un admin desde este endpoint' },
});

export class CustomError extends Error {
    constructor({
    name = ErrorDictionary.INTERNAL_SERVER_ERROR.name,
    message = ErrorDictionary.INTERNAL_SERVER_ERROR.message,
    code = ErrorDictionary.INTERNAL_SERVER_ERROR.code,
    statusCode = ErrorDictionary.INTERNAL_SERVER_ERROR.status,
    cause,
    details,
    } = {}) {
    super(message);
    this.name = name;
    this.code = code;
    this.statusCode = statusCode;
    this.status = statusCode;
    this.cause = cause ?? null;
    this.details = details;
    this.isOperational = true;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
    }
}

export const createError = (name, message, status, code, details, cause) => new CustomError({
    name,
    message,
    statusCode: status,
    code,
    details,
    cause,
});

export function asyncHandler(handler) {
    return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
    };
}

export default ErrorDictionary;
