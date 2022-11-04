import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, BehaviorSubject, catchError, EMPTY } from 'rxjs';


interface emailAvailableResponse {
  available: boolean;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string
}

interface signingResponse {
  user: {
    id: string;
    name: string;
    email: string;
    age: number;
  };
  token: string;
}

interface signinCredentials {
  email: string;
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signedIn$ = new BehaviorSubject(null);
  url = 'http://localhost:3000/users';
  constructor(private http: HttpClient) { }

  emailAvailable(email: string) {
    return this.http.post<emailAvailableResponse>(`${this.url}/email`, {email});
  }

  signup(credentials: SignupCredentials) {
    return this.http.post<signingResponse>(`${this.url}/register`, credentials).pipe(
      tap(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.user.name);
        localStorage.setItem('email', data.user.email);
        this.signedIn$.next(true);
      })
    );
  } 

  signin(credentials: signinCredentials) {
    return this.http.post<signingResponse>(`${this.url}/login`, credentials)
    .pipe(
      tap(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.user.name);
        localStorage.setItem('email', data.user.email);
        this.signedIn$.next(true);
      })
    )
  }

  signout() {
    return this.http.post(`${this.url}/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        this.signedIn$.next(false);
      })
    )
  }

  checkAuth() {
    return this.http.get(`${this.url}/signedin`, {
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    })
    .pipe(
      tap(() => {
        this.signedIn$.next(true);
      }),
      catchError(() => {
        this.signedIn$.next(false)
        return EMPTY;
      })
    )
  }
}
