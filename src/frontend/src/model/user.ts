interface IUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  lastPasswordUpdateDate?: string;
}

export default IUser;
