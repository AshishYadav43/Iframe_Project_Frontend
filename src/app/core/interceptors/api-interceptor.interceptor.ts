// import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';

// import { catchError } from 'rxjs/operators';
// import { throwError } from 'rxjs';

// import { ToastrService } from 'ngx-toastr';

// import { AuthService } from '../services/auth.service';

// export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
//   const router = inject(Router);
//   const api = inject(AuthService);
//   const toaster = inject(ToastrService);
//   // Clone request to ensure withCredentials is true
//   // const fingerPrint = await api.getFingerprint();
//   const clonedReq = req.clone({
//     withCredentials: true
//   });
//   return next(clonedReq).pipe(
//     catchError((error: HttpErrorResponse) => {
//       const toastRef = toaster.error(error.error?.message);
//       setTimeout(() => {
//         toaster.clear(toastRef.toastId);
//       }, 3000);
//       if (error.status == 401) {
//         router.navigate(['/login']); // 🔄 Redirect to login
//       }
//       // toaster.error(error.error.message);
//       return throwError(() => error);
//     })
//   );
// };


import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, switchMap } from 'rxjs/operators';
import { throwError, from } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../services/auth.service';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const api = inject(AuthService);
  const toaster = inject(ToastrService);  
  return from(api.getFingerprint()).pipe( // 👈 convert Promise to Observable
    switchMap(fingerprint => {
      // Clone request with credentials + fingerprint in body
      let clonedReq = req.clone({ withCredentials: true });

    if (clonedReq.body instanceof FormData) {
        const fd = clonedReq.body as FormData;
        fd.append('fingerprint', fingerprint.fingerprint);
        clonedReq = clonedReq.clone({ body: fd });
      }
      // ✅ If body is a plain object, spread + add
      else if (clonedReq.body && typeof clonedReq.body == 'object') {
        clonedReq = clonedReq.clone({
          body: {
            ...clonedReq.body,
            fingerprint: fingerprint.fingerprint,
          }
        });
      }

      return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          const toastRef = toaster.error(error.error?.message);
          setTimeout(() => toaster.clear(toastRef.toastId), 3000);
          // if (error.status == 401) {
          //   router.navigate(['/login']);
          // }
          return throwError(() => error);
        })
      );
    })
  );
};


