type LoginFormData = {
  email: string;
  password: string;
};
type signupFormData = {
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
};
type UserPayload = {
  username: string;
  profile: {
    avatar?: string;
    firstName?: string;
    about?: string;
    lastName?: string;
    phone?: number;
  };
};
export type { LoginFormData, signupFormData, UserPayload };
