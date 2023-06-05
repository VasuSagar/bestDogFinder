import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
    constructor(private readonly router: Router, private readonly loginService: LoginService) {
    }
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(tap({
            error: (res) => {
                if (res.status === 401) {
                    this.loginService.setIsAuthorized(false);
                    this.router.navigate(['login']);
                }
            }
        }));
    }
}