// year semesterCode 4digit number
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { UserModel } from './user.model';

//searching the db for the last student id
const findLastStudentId = async () => {
  const lastStudent = await UserModel.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      id: -1,
    })
    .lean();

  //2030 01 0001
  return lastStudent ? lastStudent.id : '';
};

const existingId = async (id: string) => {
  const lastUser = await UserModel.findOne(
    {
      id: id,
    },
    {
      id: 1,
      _id: 0,
    },
  ).lean();

  return lastUser;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  const lastStudentId = await findLastStudentId();

  let currentId = (0).toString();

  const lastStudentYear = lastStudentId?.substring(0, 4);
  const lastStudentCode = lastStudentId?.substring(4, 6);

  if (lastStudentYear === payload?.year && lastStudentCode === payload?.code) {
    currentId = lastStudentId?.substring(6) || '0000';
  }
  //increment by 1
  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  let finalId = `${payload.year}${payload.code}${incrementId}`;

  let lastUser = await existingId(finalId);

  if (lastUser) {
    const nextId = Number(lastUser?.id) + 1;
    lastUser = await existingId(nextId.toString());
    finalId = `${lastUser?.id}`;
    return lastUser?.id;
  }
  return finalId;
};
