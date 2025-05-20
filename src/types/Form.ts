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

export type { LoginFormData, signupFormData, };
