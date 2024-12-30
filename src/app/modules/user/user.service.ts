/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { AcademicSemesterModel } from './../academicSemester/academicSemester.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import {
  generateAdminId,
  generateStudentId,
  generateTeacherId,
} from './user.utils';
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { TTeacher } from '../Teacher/teacher.interface';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { TeacherModel } from '../Teacher/teacher.model';
import { TAdmin } from '../Admin/admin.interface';
import { AdminModel } from '../Admin/admin.model';

// creating student into db
const createStudentIntoDB = async (
  password: string,
  payload: Partial<TStudent>,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);

  // set student role and email
  userData.role = 'student';
  userData.email = payload.email;

  // find academic semester info
  const academicSemester = await AcademicSemesterModel.findById(
    payload.academicSemester,
  );

  if (!academicSemester) {
    throw new Error('Admission semester not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // set generated id
    userData.id = await generateStudentId(academicSemester);

    // create a user (first transaction)
    const newUser = await UserModel.create([userData], { session });

    // create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set id, _id as user
    payload.id = newUser[0]?.id;
    payload.user = newUser[0]?._id; // reference _id

    // create a student (second transaction)
    const newStudent = await StudentModel.create([payload], { session });

    if (!newStudent?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent[0];
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err; // Re-throw the error to ensure it is handled appropriately
  }
};

// create teacher into db
const createTeacherIntoDB = async (
  password: string,
  payload: Partial<TTeacher>,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);

  // set role and email
  userData.role = 'teacher';
  userData.email = payload.email;

  // find academic semester info
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new Error('Academic department not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // set generated id
    userData.id = await generateTeacherId();

    // create a user (first transaction)
    const newUser = await UserModel.create([userData], { session });

    // create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set id, _id as user
    payload.id = newUser[0]?.id;
    payload.user = newUser[0]?._id; // reference _id

    // create a student (second transaction)
    const newTeacher = await TeacherModel.create([payload], { session });

    if (!newTeacher?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newTeacher[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// create admin into db
const createAdminIntoDB = async (
  password: string,
  payload: Partial<TAdmin>,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);

  // set role and email
  userData.role = 'admin';
  userData.email = payload.email;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // set generated id
    userData.id = await generateAdminId();

    // create a user (first transaction)
    const newUser = await UserModel.create([userData], { session });

    // create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set id, _id as user
    payload.id = newUser[0]?.id;
    payload.user = newUser[0]?._id; // reference _id

    // create a student (second transaction)
    const newAdmin = await AdminModel.create([payload], { session });

    if (!newAdmin?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// get personal details from db
const getMeFromDB = async (userId: string, role: string) => {
  let result = null;
  if (role === 'student') {
    result = await StudentModel.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await AdminModel.findOne({ id: userId }).populate('user');
  }

  if (role === 'teacher') {
    result = await TeacherModel.findOne({ id: userId }).populate('user');
  }

  return result;
};

// change status in user
const changeStatusIntoDB = async (id: string, payload: { status: string }) => {
  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createAdminIntoDB,
  createTeacherIntoDB,
  getMeFromDB,
  changeStatusIntoDB,
};
