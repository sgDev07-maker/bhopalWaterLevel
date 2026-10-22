import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
} from '../types/auth';
import { requestJson } from './http';

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return requestJson<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      userName: payload.userName,
      password: payload.password,
    }),
  });
}

export function changePassword(payload: ChangePasswordRequest): Promise<unknown> {
  return requestJson('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({
      oldPassword: payload.oldPassword,
      newPassword: payload.newPassword,
      confirmPassword: payload.confirmPassword,
      userID: payload.userID,
    }),
  });
}
