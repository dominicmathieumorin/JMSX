import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthError, AuthToken, ExchangeService } from '../exchange.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usernameError = "";
  passwordError = "";
  passwordInputType = "password"
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
  
  constructor(public router: Router, private exchange: ExchangeService) {
  }

  showPassword() {
    this.passwordInputType = "text"
  }

  hidePassword() {
    this.passwordInputType = "password"
  }

  private clearLoginFormErrors() {
    this.loginForm.controls['username'].setErrors(null);
    this.loginForm.controls['password'].setErrors(null);
    this.usernameError = ""
    this.passwordError = ""
  }
  
  login() {
    this.clearLoginFormErrors();
    const username = this.loginForm.get("username").value;
    const password = this.loginForm.get("password").value;
    this.exchange
      .authenticate(username, password)
      .subscribe(r => this.authSuccess(r), e => this.authFailure(e));
  }

  private authSuccess(token: AuthToken) {
    this.router.navigate(["/home"])
  }

  private authFailure(error: HttpErrorResponse) {
    const e: AuthError = error.error;
    const uError = e.errors.find(e => e.field == 'email');
    const pError = e.errors.find(e => e.field == 'password');

    if (uError) {
      this.loginForm.controls['username'].setErrors({server: true});
      this.usernameError = uError.message;
    }

    if (pError) {
      this.loginForm.controls['password'].setErrors({server: true});
      this.passwordError = pError.message;
    }
    
  }

}
