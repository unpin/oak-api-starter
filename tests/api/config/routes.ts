const BASE_URL = "http://localhost:8000";

export const Auth = {
  signup: `${BASE_URL}/auth/signup`,
  signin: `${BASE_URL}/auth/signin`,
  deleteAccount: `${BASE_URL}/account/delete`,
};

export const Users = {
  getAll: `${BASE_URL}/users`,
  getOne: (_id: string) => `${BASE_URL}/users/${_id}`,
  deleteOne: (_id: string) => `${BASE_URL}/users/${_id}`,
  deleteMany: `${BASE_URL}/users`,
  updateOne: (_id: string) => `${BASE_URL}/users/${_id}`,
};
