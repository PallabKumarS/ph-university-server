import httpStatus from 'http-status';
import { StudentModel } from './student.model';
import mongoose from 'mongoose';
import { UserModel } from '../user/user.model';
import { TStudent } from './student.interface';
import { AppError } from '../../errors/AppError';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // set query
  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const queryObj = { ...query };

  // searching here for student
  const searchQuery = StudentModel.find({
    $or: [
      'email',
      'name.firstName',
      'name.middleName',
      'name.lastName',
      'presentAddress',
      'permanentAddress',
    ].map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  // filtering here for student
  const excludeFields = ['searchTerm', 'page', 'limit', 'sort', 'fields'];
  excludeFields.forEach((el) => delete queryObj[el]);

  const filterQuery = searchQuery
    .find(queryObj)
    .populate('academicSemester')
    .populate('user')
    .populate('academicDepartment')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  // sorting here for student
  let sort = '-createdAt';

  if (query?.sort) {
    sort = query?.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);

  // limiting and paging the result here
  let page = 1;
  let limit = 2;
  let skip = 0;

  if (query?.limit) {
    limit = Number(query?.limit as string);
  }

  if (query?.page) {
    page = Number(query?.page as string);
    skip = (page - 1) * limit;
  }

  const paginateQuery = sortQuery.skip(skip);

  const limitQuery = paginateQuery.limit(limit);

  // field limiting here for student
  let fields = '-__v';

  if (query?.fields) {
    fields = (query?.fields as string).replace(/,/g, ' ');
  }

  const fieldQuery = await limitQuery.select(fields);

  return fieldQuery;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ _id: id, isDeleted: false })
    .populate('academicSemester')
    .populate('user')
    .populate('academicDepartment')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student does not exist');
  }
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedStudent = await StudentModel.findOneAndUpdate(
      { _id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await UserModel.findOneAndUpdate(
      { id: deletedStudent.id },
      { isDeleted: true },
      { new: true, session },
    )
      .populate('academicSemester')
      .populate('user')
      .populate('academicDepartment')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      });

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingData } = payload;

  const modifiedStudentData: Record<string, unknown> = {
    ...remainingData,
  };

  if (name && Object.keys(name).length > 0) {
    for (const [key, value] of Object.entries(name)) {
      modifiedStudentData[`name.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length > 0) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedStudentData[`localGuardian.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length > 0) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedStudentData[`guardian.${key}`] = value;
    }
  }

  const updatedStudent = await StudentModel.findOneAndUpdate(
    { _id: id },
    modifiedStudentData,
    {
      new: true,
      runValidators: true,
    },
  )
    .populate('academicSemester')
    .populate('user')
    .populate('academicDepartment')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return updatedStudent;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
