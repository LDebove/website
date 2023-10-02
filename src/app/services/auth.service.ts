import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticatedSubject = new Subject<boolean>();
  authenticated: boolean = false;

  constructor(private http: HttpClient) {
    this.authenticatedSubject.next(false);
    this.authenticatedSubject.subscribe({
      next: (authenticated) => {
        this.authenticated = authenticated;
      }
    });
  }

  authenticate(password: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/authenticate`, { password: password });
  }

  isAuthenticated(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.apiUrl}/authenticate/status`);
  }

  disconnect(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/disconnect`, null);
  }

  getAuthenticated(): boolean {
    return this.authenticated;
  }

  startupAuthentication(): void {
    this.isAuthenticated().subscribe({
      next: (response) => {
        if(response.data.status) {
          this.authenticatedSubject.next(response.data.status);
        } else {
          this.authenticatedSubject.next(false);
        }
      }
    })
  }
}
