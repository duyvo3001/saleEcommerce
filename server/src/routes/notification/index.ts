import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { NotificationController } from '../../controllers/notification.controller';

export const routerNotification = express.Router();

routerNotification.use(authentication)
routerNotification
    .get('/', asyncHandler(NotificationController.listNotiByUser))
