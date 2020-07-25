import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from './../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
      private authService: AuthService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add jwt token to auth header
        const currentUser = this.authService.currentUserValue;
        const isLogged = currentUser && currentUser.token;
        const apiUrl = request.url.startsWith(environment.apiUrl);

        if (isLogged && apiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}
