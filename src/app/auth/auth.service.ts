import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface emailAvailableResponse {
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'http://localhost:3000/users';
  constructor(private http: HttpClient) { }

  emailAvailable(email: string) {
    return this.http.post<emailAvailableResponse>(`${this.url}/email`, {email});
  }
}
