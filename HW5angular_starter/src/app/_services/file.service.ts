import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private displayLoader$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  // Uploads a file to the server
  public upload(fileName: string, fileContent: string, id: string) {
    this.displayLoader$.next(true);
    return this.http.put(`http://localhost:4000/course/upload`, {name: fileName, content: fileContent, courseID: id})
        .pipe(finalize(() => this.displayLoader$.next(false)));
  }

  // Returns the file of the post given the filename
  public download(fileName: string) {
    return this.http.get(`http://localhost:4000/course/getFile/${fileName}`, {responseType: 'blob'});
  }

}
