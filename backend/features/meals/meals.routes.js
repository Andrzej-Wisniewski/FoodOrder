import express from 'express';
import { getMeals } from './meals.controller.js';

const router = express.Router();

router.get('/', getMeals);

export default router;
