import mongoose from 'mongoose';
import config from '../../config';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { AcademicSemesterModel } from './../academicSemester/academicSemester.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { generateStudentId } from './user.utils';
import { AppError } from '../../middlewares/globalErrorhandler';
import httpStatus from 'http-status';

const createStudentIntoDB = async (
  password: string,
  payload: Partial<TStudent>,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new Error('Admission semester not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // set generated id
    userData.id = await generateStudentId(admissionSemester);

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

export const UserServices = {
  createStudentIntoDB,
};
