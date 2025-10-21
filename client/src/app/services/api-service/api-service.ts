import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService{
    private http = inject(HttpClient);

    private handleAPIError(err: HttpErrorResponse){
        const message: string = err.error?.message || 'Internal Server Error';
        return throwError(() => message);
    }

    post<T>(url: any, body: any): Observable<T> {
        return this.http.post<T>(url, body).pipe(
            catchError(this.handleAPIError)
        )
    }

    get<T>(url: any): Observable<T> {
        return this.http.get<T>(url).pipe(
            catchError(this.handleAPIError)
        )
    }

    patch<T>(url: any, body: any): Observable<T> {
        return this.http.patch<T>(url, body).pipe(
            catchError(this.handleAPIError)
        )
    }
}
