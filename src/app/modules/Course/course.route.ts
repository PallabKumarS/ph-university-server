import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/:id', auth(USER_ROLE.admin), CourseControllers.getSingleCourse);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.delete('/:id', auth(USER_ROLE.admin), CourseControllers.deleteCourse);

router.put(
  '/:courseId/assign-teachers',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.teachersWithCourseValidationSchema),
  CourseControllers.assignTeachersWithCourse,
);

router.patch(
  '/:courseId/remove-teachers',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.teachersWithCourseValidationSchema),
  CourseControllers.removeTeachersFromCourse,
);

router.get('/', auth(USER_ROLE.admin), CourseControllers.getAllCourses);

export const CourseRoutes = router;
