import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TeacherServices } from './teacher.service';

const getSingleTeacher = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TeacherServices.getSingleTeacherFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher is retrieved successfully',
    data: result,
  });
});

const getAllTeachers = catchAsync(async (req, res) => {
  const result = await TeacherServices.getAllTeachersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All teachers are retrieved successfully',
    data: result,
  });
});

const updateTeacher = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { teacherData } = req.body;
  const result = await TeacherServices.updateTeacherIntoDB(id, teacherData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher is updated successfully',
    data: result,
  });
});

const deleteTeacher = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TeacherServices.deleteTeacherFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher is deleted successfully',
    data: result,
  });
});

export const TeacherControllers = {
  getAllTeachers,
  getSingleTeacher,
  deleteTeacher,
  updateTeacher,
};
