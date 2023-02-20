import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from '../models/api-response.model';

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
    return this.http.post<ApiResponse>('https://leodebove.com/php/api.php/authenticate', { password: password });
  }

  isAuthenticated(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>('https://leodebove.com/php/api.php/authenticate/status');
  }

  disconnect(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('https://leodebove.com/php/api.php/disconnect', null);
  }

  getAuthenticated(): boolean {
    return this.authenticated;
  }
}
