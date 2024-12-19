export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'teacher';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};
