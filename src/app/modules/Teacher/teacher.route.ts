import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { updateTeacherValidationSchema } from './teacher.validation';
import { TeacherControllers } from './teacher.controller';

const router = express.Router();

router.get('/:id', TeacherControllers.getSingleTeacher);

router.patch(
  '/:id',
  validateRequest(updateTeacherValidationSchema),
  TeacherControllers.updateTeacher,
);

router.delete('/:id', TeacherControllers.deleteTeacher);

router.get('/', TeacherControllers.getAllTeachers);

export const TeacherRoutes = router;
