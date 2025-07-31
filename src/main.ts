import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { routes } from './app/app.routes'; 

bootstrapApplication(AppComponent, {
  providers: [CookieService, provideRouter(routes)] 
});
