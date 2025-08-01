import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr'; 

import { routes } from './app.routes';

import { apiInterceptorInterceptor } from './core/interceptors/api-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideHttpClient(withInterceptors([apiInterceptorInterceptor])), provideRouter(routes), provideClientHydration(withEventReplay()),
      provideAnimations(), 
  provideToastr({          
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
    }),  ]
};
