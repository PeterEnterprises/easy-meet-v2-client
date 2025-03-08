import { getUser } from './get-user';
import { getUsers } from './get-users';
import { getUsersPaginated } from './get-users-paginated';
import { getCurrentUser } from './get-current-user';
import { updateUser } from './update-user';
import { deleteUser } from './delete-user';

export const userService = {
  getUser,
  getUsers,
  getUsersPaginated,
  getCurrentUser,
  updateUser,
  deleteUser
};
