import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-academic-department',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get(
  '/:departmentId',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.teacher,
  ),
  AcademicDepartmentControllers.getSingleAcademicDepartment,
);

router.patch(
  '/:departmentId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
);

router.delete(
  '/:departmentId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AcademicDepartmentControllers.deleteAcademicDepartment,
);

router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.teacher,
  ),
  AcademicDepartmentControllers.getAllAcademicDepartments,
);

export const AcademicDepartmentRoutes = router;
