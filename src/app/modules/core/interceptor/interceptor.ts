import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/internal/operators';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private router: Router, private authService: AuthService) { }
    refreshToken() {
        this.authService.getRefreshToken().subscribe((data:any) => {
            const token = data.refreshToken;
            localStorage.setItem("token", token);
        }, (error:any) => {
            console.log(error);
        });
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response
                if (token) {
                    const issued = (JSON.parse(atob(token.split('.')[1]))).iat;
                    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
                    const now = Math.floor((new Date).getTime() / 1000);
                    //if token expiring in 5 minutes then refresh it
                    if (now >= (expiry - 300)) {
                        this.refreshToken();
                    } else if (now >= expiry) {
                        //expired
                        localStorage.clear();
                        this.router.navigate(['/']);
                    } else {
                        let time = ((expiry - issued) - 300) * 1000;
                        setTimeout(() => {
                            this.refreshToken();
                        }, time);
                    }
                }
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401 || err.status === 403) {
                    // redirect to the login route
                    localStorage.clear();
                    this.router.navigate(['/']);
                }
            }
        }))
    }
}






