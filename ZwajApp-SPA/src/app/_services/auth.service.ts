// auth.service.ts
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5033/api/auth/';

  private http = inject(HttpClient);

  private token = signal<string | null>(localStorage.getItem('token'));

  // computed signal بيرجع true/false
  isLoggedIn = computed(() => !!this.token());

  login(model: { username: string; password: string }) {
    return this.http
      .post<{ token: string }>(this.baseUrl + 'login', model)
      .pipe(
        tap((response) => {
          if (response?.token) {
            localStorage.setItem('token', response.token);
            this.token.set(response.token);
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
    this.token.set(null); // ✅ نمسح الـ signal
    console.log('تم الخروج');
  }
}
