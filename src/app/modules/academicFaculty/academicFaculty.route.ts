import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get(
  '/:facultyId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AcademicFacultyControllers.getSingleAcademicFaculty,
);

router.patch(
  '/:facultyId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
);

router.delete(
  '/:facultyId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AcademicFacultyControllers.deleteAcademicFaculty,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AcademicFacultyControllers.getAllAcademicFaculties,
);

export const AcademicFacultyRoutes = router;
