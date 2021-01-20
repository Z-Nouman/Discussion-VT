// Structure created for a Course, and the Posts and Comments within them.
export class Course {

  courseNumber: number;
  courseDept: string;
  createdBy: {username: string};
  CRN: string;
  season: string;
  year: number;
  public: boolean;
  accessCode: string;
  comments: any[];
  }

export class Comment {
  comment: string;
  firstName: string;
  lastName: string;
  userID: string;
  unique: string;
  }

export class Post {
    commentContent: any[];
    pdf: string;
    firstName: string;
    lastName: string;
    title: string;
    authors: string;
    studentID: string;
}

