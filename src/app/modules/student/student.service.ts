import httpStatus from 'http-status';
import { AppError } from '../../middlewares/globalErrorhandler';
import { StudentModel } from './student.model';

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find()
    .populate('admissionSemester')
    .populate('user');
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ _id: id }, { isDeleted: false })
    .populate('admissionSemester')
    .populate('user');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student does not exist');
  }
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await StudentModel.updateOne({ _id: id }, { isDeleted: false })
    .populate('admissionSemester')
    .populate('user');

  if (!result) {
    throw new AppError(404, 'Student does not exist');
  }

  return result;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
