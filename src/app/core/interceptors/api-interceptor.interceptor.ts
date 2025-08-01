import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toaster = inject(ToastrService);//  const toaster = inject(ToastrService)
  // Clone request to ensure withCredentials is true
  const clonedReq = req.clone({
    withCredentials: true
  });
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const toastRef = toaster.error(error.error?.message);
      setTimeout(() => {
        toaster.clear(toastRef.toastId);
      }, 3000);
      if (error.status === 401) {
        router.navigate(['/login']); // 🔄 Redirect to login
      }
      // toaster.error(error.error.message);
      return throwError(() => error);
    })
  );
};
