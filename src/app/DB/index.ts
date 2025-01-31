import { USER_ROLE } from '../modules/User/user.constant';
import { UserModel } from '../modules/User/user.model';

const superUser = {
  id: '0001',
  email: 'pallabkumar26@gmail.com',
  password: '@superAdmin',
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await UserModel.findOne({
    role: USER_ROLE.superAdmin,
  });

  if (!isSuperAdminExits) {
    await UserModel.create(superUser);
  }
};

export default seedSuperAdmin;
