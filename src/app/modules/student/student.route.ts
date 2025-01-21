import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/:studentId',
  auth(USER_ROLE.admin),
  StudentControllers.getSingleStudent,
);

router.delete(
  '/:studentId',
  auth(USER_ROLE.admin),
  StudentControllers.deleteStudent,
);

router.patch(
  '/:studentId',
  auth(USER_ROLE.admin),
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);

router.get('/', auth(USER_ROLE.admin), StudentControllers.getAllStudents);

router.patch(
  '/change-status/:studentId',
  auth(USER_ROLE.admin),
  StudentControllers.statusChange,
);

export const StudentRoutes = router;
