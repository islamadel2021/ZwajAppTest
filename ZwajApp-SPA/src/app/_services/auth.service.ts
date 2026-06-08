// auth.service.ts
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5033/api/auth/';

  private http = inject(HttpClient);

  jwtHelper = new JwtHelperService();
  decodedToken: any;

  // ✅ computed signal بيستخدم JwtHelper
  // ✅ بدل computed signal، هنستخدم method عادية مع try/catch
  loggedIn(): boolean {
    try {
      const token = localStorage.getItem('token');
      return !this.jwtHelper.isTokenExpired(token);
    } catch {
      return false;
    }
  }

  login(model: { username: string; password: string }) {
    return this.http
      .post<{ token: string }>(this.baseUrl + 'login', model)
      .pipe(
        tap((response) => {
          if (response?.token) {
            localStorage.setItem('token', response.token);
            this.decodedToken = this.jwtHelper.decodeToken(response.token);
            console.log(this.decodedToken);
          }
        }),
      );
  }

  register(model: { username: string; password: string }) {
    return this.http.post<{ token: string }>(this.baseUrl + 'register', model);
    // .pipe(
    //   tap((response) => {
    //     if (response?.token) {
    //       localStorage.setItem('token', response.token);
    //       this.token.set(response.token);
    //     }
    //   }),
    // );
  }

  logout() {
    localStorage.removeItem('token');
    console.log('تم الخروج');
  }
}
