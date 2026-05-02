import express from 'express';
import { Role } from '../../../generated/prisma/browser';
import { StatsController } from './stats.controller';
import auth from '../../middleware/Auth';

const router = express.Router();

router.get(
    '/stats',auth([Role.USER, Role.ADMIN]),StatsController.getDashboardStatsData
)

router.get(
    '/publicstats',StatsController.getPublicStatsData
)



export const StatsRoutes = router;