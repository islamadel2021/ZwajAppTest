// _interceptors/error.interceptor.ts

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// ✅ Angular 19: Functional Interceptor بدل Class
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error instanceof HttpErrorResponse) {
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
          console.error(applicationError);
          return throwError(() => applicationError);
        }

        // ✅ معالجة باقي الأخطاء
        const serverError = error.error;
        let modalStateErrors = '';

        if (serverError?.errors && typeof serverError.errors === 'object') {
          for (const key in serverError.errors) {
            modalStateErrors += serverError.errors[key] + '\n';
          }
        }

        // 3️⃣ Unauthorized
        if (error.status === 401) {
          return throwError(() => error.statusText);
        }

        return throwError(
          () => modalStateErrors || serverError || 'خطأ في السيرفر',
        );
      }
      return throwError(() => error);
    }),
  );
};
