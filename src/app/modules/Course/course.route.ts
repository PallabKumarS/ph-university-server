import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  CourseControllers.getSingleCourse,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  CourseControllers.deleteCourse,
);

router.put(
  '/:courseId/assign-teachers',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidations.teachersWithCourseValidationSchema),
  CourseControllers.assignTeachersWithCourse,
);

router.patch(
  '/:courseId/remove-teachers',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidations.teachersWithCourseValidationSchema),
  CourseControllers.removeTeachersFromCourse,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  CourseControllers.getAllCourses,
);

export const CourseRoutes = router;
