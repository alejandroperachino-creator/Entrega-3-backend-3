import { Router } from 'express';
import OrderController from '../controllers/order.controller.js';

const router = Router();
const orderController = new OrderController();

function bindCrudRoutes(basePath, controller) {
	router.get(basePath, controller.getAll);
	router.get(`${basePath}/:id`, controller.getOrderById);
	router.post(basePath, controller.create);
	router.put(`${basePath}/:id`, controller.update);
	router.delete(`${basePath}/:id`, controller.delete);
}

bindCrudRoutes('/', orderController);

export default router;
