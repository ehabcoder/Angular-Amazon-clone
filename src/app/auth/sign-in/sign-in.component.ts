import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  authForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]), 
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ])
  })
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.authForm.invalid) return;
    const creds = {
      email: this.authForm.controls.email.value,
      password: this.authForm.controls.password.value,
    }
    this.authService.signin(creds).subscribe({
      next: () => {
        this.router.navigateByUrl('/home');
      }, 
      error: ({error, status}) => {
        if(error === "Unable to login") {
          this.authForm.setErrors({credentials: true});
        }
        if(status === 0) {
          this.authForm.setErrors({noConnection: true})
        }
      }
    })
  }
}
