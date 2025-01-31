import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { updateTeacherValidationSchema } from './teacher.validation';
import { TeacherControllers } from './teacher.controller';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  TeacherControllers.getSingleTeacher,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateTeacherValidationSchema),
  TeacherControllers.updateTeacher,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  TeacherControllers.deleteTeacher,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  TeacherControllers.getAllTeachers,
);

export const TeacherRoutes = router;
