export type UserInfo = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  token: string;
};

export type RegisterData = {
  fullName: string;
  email: string;
  username: string;
  password: string;
};

export type LoginData = {
  password: string;
} & ({ username: string } | { email: string });
