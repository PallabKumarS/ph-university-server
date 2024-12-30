import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

// create student controller
const createStudent = catchAsync(async (req, res) => {
  const { password, studentData } = req.body;

  const result = await UserServices.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created successfully',
    data: result,
  });
});

// create teacher controller
const createTeacher = catchAsync(async (req, res) => {
  const { password, teacherData } = req.body;

  const result = await UserServices.createTeacherIntoDB(password, teacherData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher is created successfully',
    data: result,
  });
});

// create admin controller
const createAdmin = catchAsync(async (req, res) => {
  const { password, adminData } = req.body;

  const result = await UserServices.createStudentIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});

// gen personal details
const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;

  const result = await UserServices.getMeFromDB(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});

// change status
const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatusIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated successfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createTeacher,
  createAdmin,
  getMe,
  changeStatus,
};
