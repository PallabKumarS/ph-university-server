import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/:id', CourseControllers.getSingleCourse);

router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.delete('/:id', CourseControllers.deleteCourse);

router.put(
  '/:courseId/assign-teachers',
  validateRequest(CourseValidations.teachersWithCourseValidationSchema),
  CourseControllers.assignTeachersWithCourse,
);

router.delete(
  '/:courseId/remove-teachers',
  validateRequest(CourseValidations.teachersWithCourseValidationSchema),
  CourseControllers.removeTeachersFromCourse,
);

router.get('/', CourseControllers.getAllCourses);

export const CourseRoutes = router;
