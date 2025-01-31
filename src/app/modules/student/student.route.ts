import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.get(
  '/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentControllers.getSingleStudent,
);

router.delete(
  '/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentControllers.deleteStudent,
);

router.patch(
  '/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentControllers.getAllStudents,
);

router.patch(
  '/change-status/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentControllers.statusChange,
);

export const StudentRoutes = router;
