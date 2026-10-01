import { Router } from 'express';
import MockController from '../controllers/mock.controller.js';

const router = Router();
const mockController = new MockController();

router.get('/user', mockController.getUser);
router.get('/users', mockController.getUsers);
router.get('/orders', mockController.getOrders);
router.get('/deliveries', mockController.getDeliveries);
router.get('/snapshot', mockController.getSnapshot);

router.post('/seed', mockController.seed);
router.post('/seed/users', mockController.seedUsers);
router.post('/seed/orders', mockController.seedOrders);
router.post('/seed/deliveries', mockController.seedDeliveries);
router.post('/seed/all', mockController.seedAll);

export default router;
