import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { API_BASE_URL, IS_AUTHORIZED_STORAGE_KEY } from '../utils/api-constants';
import { LoginRequest } from '../utils/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post<any>(this.baseUrl + "/auth/login", loginRequest, {
      responseType: 'text', observe: 'response',
      withCredentials: true
    } as any);
  }

  logout(): Observable<any> {
    return this.http.post<any>(this.baseUrl + "/auth/logout", {}, {
      responseType: 'text', observe: 'response',
      withCredentials: true
    } as any);
  }

  /**
   * Storing boolean which identifies whether user is logged in
   * Instead of boolean value, Token & NGRX Store/Localstorage should be used to store token   
   */
  setIsAuthorized(isAuthorized: boolean): void {
    localStorage.setItem(IS_AUTHORIZED_STORAGE_KEY, JSON.stringify(isAuthorized));
  }

  getIsAuthorized(): boolean {
    return Boolean(JSON.parse(localStorage.getItem(IS_AUTHORIZED_STORAGE_KEY) ?? 'false'));
  }

  clearIsAuthorized(): void {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return this.getIsAuthorized();
  }
}
