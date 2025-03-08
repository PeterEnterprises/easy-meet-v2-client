import { login } from './login';
import { signup } from './signup';
import { refreshToken } from './refresh-token';
import { logout } from './logout';
import { isAuthenticated } from './is-authenticated';
import { getToken } from './get-token';

export const authService = {
  login,
  signup,
  refreshToken,
  logout,
  isAuthenticated,
  getToken
};
