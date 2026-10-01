import { Router } from 'express';
import deliveryController from '../controllers/delivery.controller.js';

const router = Router();

router.get('/', deliveryController.getAll);
router.get('/:id', deliveryController.getById);
router.post('/', deliveryController.create);
router.put('/:id', deliveryController.update);
router.delete('/:id', deliveryController.delete);

export default router;
