export const USER_ROLES = Object.freeze({
    ADMIN: 'admin',
    USER: 'user',
    DRIVER: 'driver',
    STORE: 'store'
});

export const PRODUCT_STATUS = Object.freeze({
    AVAILABLE: 'available',
    OUT_OF_STOCK: 'out_of_stock',
    INACTIVE: 'inactive'
});

export const ORDER_STATUS = Object.freeze({
    CREATED: 'created',
    ASSIGNED: 'assigned',
    PICKED_UP: 'picked_up',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
});

export const DELIVERY_STATUS = Object.freeze({
    PENDING: 'pending',
    ASSIGNED: 'assigned',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered'
});

export const ORDER_PRIORITY = Object.freeze({
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high'
});

export const MOCK_SEED = Object.freeze({
    MAX : 50,
    DEFAULT: 'default'
});