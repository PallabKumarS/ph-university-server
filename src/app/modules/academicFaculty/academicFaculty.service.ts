import httpStatus from 'http-status';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyModel } from './academicFaculty.model';
import { AppError } from '../../errors/AppError';

// create faculty into db
const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(payload);
  return result;
};

// get all faculties from db
const getAllAcademicFacultiesFromDB = async () => {
  const result = await AcademicFacultyModel.find();
  return result;
};

// get single faculty from db
const getSingleAcademicFacultyFromDB = async (id: string) => {
  const result = await AcademicFacultyModel.findById(id);

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department does not exist',
    );
  }

  return result;
};

// update faculty into db
const updateAcademicFacultyIntoDB = async (
  id: string,
  payload: Partial<TAcademicFaculty>,
) => {
  // checking if the faculty exists or not
  const isFacultyExists = await AcademicFacultyModel.findById(id);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty does not exist');
  }

  // checking for same update
  if (payload.name === isFacultyExists.name) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Make some changes to update !',
    );
  }

  // checking for duplicate semester
  const isDuplicateFaculty = await AcademicFacultyModel.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (isDuplicateFaculty) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Faculty already exists !');
  }

  const result = await AcademicFacultyModel.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return result;
};

// delete faculty from db
const deleteAcademicFacultyFromDB = async (id: string) => {
  // checking if the faculty exists or not
  const isFacultyExists = await AcademicFacultyModel.findById(id);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty does not exist');
  }

  const result = await AcademicFacultyModel.findByIdAndDelete(id);
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultiesFromDB,
  getSingleAcademicFacultyFromDB,
  updateAcademicFacultyIntoDB,
  deleteAcademicFacultyFromDB,
};
