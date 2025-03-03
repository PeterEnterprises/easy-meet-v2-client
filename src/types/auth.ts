import { User } from './user';

export interface LoginVariables {
  usernameOrEmail: string;
  password: string;
}

export interface SignupVariables {
  input: {
    userName: string;
    email: string;
    password: string;
  };
}

export interface RefreshTokenVariables {
  token: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type LoginResponse = AuthResponse;
export type SignupResponse = AuthResponse;
export type RefreshTokenResponse = AuthResponse;
