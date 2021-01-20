import { Role } from './role';

export class User {
    username: string;
    _id: string;
    password: string;
    role: Role;
    token?: string;
    courses: string[];
    firstName: string;
    lastName: string;
   }
