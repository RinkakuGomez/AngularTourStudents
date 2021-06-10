import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

// Component
import {Student} from './student';

// Service
import {STUDENTS} from './mock-students';

//Mock
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private studentUrl = 'api/students';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private messageService: MessageService) {}

  /* 
  * OLD VERSION METHOD
  */
  getOldStudents(): Observable<Student[]>{
    const students = of(STUDENTS);
    this.messageService.add('StudentService: fetched students');

    return students;
  }

  getOldStudent(id:number): Observable<Student>{
    const student = STUDENTS.find(s => s.id === id)!;
    this.messageService.add('StudentService: fetched Student id=${id}');

    return of(student);
  }
  
  /*
  * NEW METHOD
  * USE HTTP API
  */

  /* GET students from the server */
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.studentUrl)
    .pipe(
      tap(_ => this.log('fetched students')),
      catchError(this.handleError<Student[]>('getStudents', []))
    );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getStudentNo404(id: number): Observable<Student> {
    const url = '${this.studentUrl}/?id=${id}';
    
    return this.http.get<Student[]>(url).pipe(
      map(students => students[0]),
      tap(s => {
          const outcome = s ? `fetched` : `did not find`;
          this.log('${outcome} hero id=${id}');
        }),
      catchError(this.handleError<Student>('getStudent id=${id}'))
    );
  }

  /* GET hero by id. Will 404 if id not found */
  getStudent(id: number): Observable<Student> {
    const url = '${this.studentUrl}/${id}';
    
    return this.http.get<Student>(url).pipe(
      tap(_ => this.log('fetched Student id=${id}')),
      catchError(this.handleError<Student>('getStudent id=${id}'))
    );
  }

  /** PUT: update the hero on the server */
  updateStudent(student: Student): Observable<any> {
    return this.http.put(this.studentUrl, student, this.httpOptions).pipe(
      tap(_ => this.log(`updated student id=${student.id}`)),
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  /** POST: add a new student to the server */
  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.studentUrl, student, this.httpOptions).pipe(
      tap((newstudent: Student) => this.log(`added student w/ id=${newstudent.id}`)),
      catchError(this.handleError<Student>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteStudent(id: number): Observable<Student> {
    const url = `${this.studentUrl}/${id}`;

    return this.http.delete<Student>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted Student id=${id}`)),
      catchError(this.handleError<Student>('deleteStudent'))
    );
  }

  /* GET heroes whose name contains search term */
  searchStudents(term: string): Observable<Student[]> {
    //2
    if (!term.trim()) {
      // if not search term, return empty hero array.
      //1
      return of([]);
      //2
    }
    //1
    return this.http.get<Student[]>(`${this.studentUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found students matching "${term}"`) :
        this.log(`no students matching "${term}"`)),
      catchError(this.handleError<Student[]>('searchStudents', []))
    );
    //1
  }
  //1
  //2

  /* 
  *AUXILIAR METHODS
  */
  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  /* Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`StudentService: ${message}`);
  }
}
