import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatchPassword } from '../validators/match-password';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  authForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.email
    ] /* TODO: Don't Forget the async validator here*/),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    passwordConfirmation: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ])
  }, { validators: [this.passwordMatch.validate] })

  constructor(private passwordMatch: MatchPassword, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  showFormErrors() {
    return this.authForm.get('password').touched && 
           this.authForm.get('passwordConfirmation').touched &&
           this.authForm.errors;
  }


  onSubmit() {
    if(this.authForm.invalid) return;
    const creds = {
      name: this.authForm.value.name,
      email: this.authForm.value.email,
      password: this.authForm.value.password
    }
    this.authService.signup(creds).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        if(err.status === 0) {
          this.authForm.setErrors({ noConnection: true });
        } else {
          this.authForm.setErrors({ unknownError: true });
        }
      }
    })
  }
}
