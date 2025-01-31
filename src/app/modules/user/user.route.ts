import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../student/student.validation';
import { UserControllers } from './user.controller';
import { teacherValidations } from '../Teacher/teacher.validation';
import { AdminValidations } from '../Admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.superAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-teacher',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.superAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(teacherValidations.createTeacherValidationSchema),
  UserControllers.createTeacher,
);

router.post(
  '/create-admin',
  auth(USER_ROLE.superAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.get('/me', auth('student', 'teacher', 'admin'), UserControllers.getMe);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

export const UserRoutes = router;
