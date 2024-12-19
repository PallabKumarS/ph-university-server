// year semesterCode 4digit number
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { UserModel } from './user.model';

// student id
export const generateStudentId = async (payload: TAcademicSemester) => {
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

  // checking db for duplicate id
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

// teacher id
export const generateTeacherId = async () => {
  //searching the db for the last teacher id
  const findLastTeacherId = async () => {
    const lastTeacher = await UserModel.findOne(
      {
        role: 'teacher',
      },
      {
        id: 1,
        _id: 0,
      },
    )
      .sort({
        createdAt: -1,
      })
      .lean();

    return lastTeacher?.id ? lastTeacher.id.substring(2) : null;
  };

  let currentId = (0).toString();
  const lastTeacherId = await findLastTeacherId();

  if (lastTeacherId) {
    currentId = lastTeacherId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `T-${incrementId}`;

  return incrementId;
};

// admin id
export const generateAdminId = async () => {
  //searching the db for the last admin id
  const findLastAdminId = async () => {
    const lastAdmin = await UserModel.findOne(
      {
        role: 'admin',
      },
      {
        id: 1,
        _id: 0,
      },
    )
      .sort({
        createdAt: -1,
      })
      .lean();

    return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
  };
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `A-${incrementId}`;
  return incrementId;
};
