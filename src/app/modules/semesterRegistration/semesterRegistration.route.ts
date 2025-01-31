import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-semester-registration',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);

router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistration,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SemesterRegistrationController.getSingleSemesterRegistration,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SemesterRegistrationController.deleteSemesterRegistration,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SemesterRegistrationController.getAllSemesterRegistrations,
);

export const semesterRegistrationRoutes = router;
