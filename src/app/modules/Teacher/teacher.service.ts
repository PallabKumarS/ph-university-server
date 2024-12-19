/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TeacherSearchableFields } from './teacher.constant';
import { TeacherModel } from './teacher.model';
import { TTeacher } from './teacher.interface';
import { AppError } from '../../errors/AppError';
import { UserModel } from '../user/user.model';

const getAllTeachersFromDB = async (query: Record<string, unknown>) => {
  const TeacherQuery = new QueryBuilder(
    TeacherModel.find().populate('academicDepartment'),
    query,
  )
    .search(TeacherSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await TeacherQuery.modelQuery;
  return result;
};

const getSingleTeacherFromDB = async (id: string) => {
  const result = await TeacherModel.findById(id).populate('academicDepartment');

  return result;
};

const updateTeacherIntoDB = async (id: string, payload: Partial<TTeacher>) => {
  const { name, ...remainingTeacherData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingTeacherData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await TeacherModel.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteTeacherFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedTeacher = await TeacherModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedTeacher) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Teacher');
    }

    // get user _id from deletedTeacher
    const userId = deletedTeacher.user;

    const deletedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedTeacher;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const TeacherServices = {
  getAllTeachersFromDB,
  getSingleTeacherFromDB,
  updateTeacherIntoDB,
  deleteTeacherFromDB,
};
