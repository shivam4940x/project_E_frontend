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
type UserPayloadAccount = {
  email?: string;
  password?: string;
  profile: {
    dob?: string;
    gender?: string;
    country?: string;
    language?: string;
  };
};
export type { LoginFormData, signupFormData, UserPayload, UserPayloadAccount };
