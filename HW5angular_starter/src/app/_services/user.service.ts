import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  // Creates a new User
  register(user: User) {
    return this.http.post(`https://discussion-vt.herokuapp.com/user/register`, user);
  }

  // Allows a user to register to a course given an access code
  joinCourse(access: string) {
    return this.http.post('http://localhost:4000/user/joincourse', {accessCode: access});
  }
}
