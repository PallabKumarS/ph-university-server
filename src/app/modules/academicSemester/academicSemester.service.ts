import QueryBuilder from '../../builder/QueryBuilder';
import {
  academicSemesterNameCodeMapper,
  searchableSemesterFields,
} from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.model';

// create academic semester service
const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemesterModel.create(payload);
  return result;
};

// get all academic semesters service
const getAllAcademicSemestersFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterQuery = new QueryBuilder(AcademicSemesterModel.find(), query)
    .search(searchableSemesterFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await semesterQuery.modelQuery;
  const meta = await semesterQuery.countTotal();

  return {
    meta,
    data,
  };
};

// get single academic semester service
const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemesterModel.findById(id);
  return result;
};

// update academic semester service
const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemesterModel.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
};
