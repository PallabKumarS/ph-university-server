import httpStatus from 'http-status';
import { StudentModel } from './student.model';
import mongoose from 'mongoose';
import { UserModel } from '../user/user.model';
import { TStudent } from './student.interface';
import { AppError } from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

// get all student from db
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // finding students from database
  const studentQuery = new QueryBuilder(StudentModel.find(), query)
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal();

  return { data, meta };
};

// get single student from db
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

// delete student from db
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

// update student into db
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
