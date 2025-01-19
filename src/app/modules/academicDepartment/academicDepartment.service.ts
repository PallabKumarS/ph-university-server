import httpStatus from 'http-status';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartmentModel } from './academicDepartment.model';
import { AppError } from '../../errors/AppError';

// create academic department into db
const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartmentModel.create(payload);
  return result;
};

// get all academic department
const getAllAcademicDepartmentsFromDB = async () => {
  const result =
    await AcademicDepartmentModel.find().populate('academicFaculty');
  return result;
};

// get single academic department from db
const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result =
    await AcademicDepartmentModel.findById(id).populate('academicFaculty');

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department does not exist',
    );
  }

  return result;
};

// update department into db
const updateAcademicDepartmentIntoDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const isDepartmentExist = await AcademicDepartmentModel.findById(id);

  if (!isDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This department does not exist!');
  }

  // checking for same update
  if (
    payload.name === isDepartmentExist.name &&
    payload.academicFaculty?.toString() ===
      isDepartmentExist.academicFaculty.toString()
  ) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Make some changes to update !',
    );
  }

  // checking for duplicate semester
  const isDuplicateDepartment = await AcademicDepartmentModel.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (isDuplicateDepartment) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Department already exists !',
    );
  }

  const result = await AcademicDepartmentModel.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return result;
};

// delete academic department from db
const deleteAcademicDepartmentFromDB = async (id: string) => {
  const isDepartmentExist = await AcademicDepartmentModel.findById(id);

  // checking if department exists or not
  if (!isDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This department does not exist!');
  }
  const result = await AcademicDepartmentModel.findByIdAndDelete(id);
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentsFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
  deleteAcademicDepartmentFromDB,
};
