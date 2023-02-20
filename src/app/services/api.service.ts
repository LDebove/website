import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get(path: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.apiUrl}/${path}`);
  }

  post(path: string, data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/${path}`, data);
  }

  put(path: string, data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.apiUrl}/${path}`, data);
  }

  delete(path: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.apiUrl}/${path}`);
  }
}
