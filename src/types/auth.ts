export interface AuthUser {
  loggedInID: string;
  loggedInName: string;
  companyID: number;
  companyName: string | null;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  companyID: number;
  companyName: string | null;
  loggedInID: string;
  loggedInName: string;
  isSuccess: boolean;
  errorMessage: string | null;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  userID: string;
}
