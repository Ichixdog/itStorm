import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
    rememberMe: [false]
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }

  login(): void{
    if(this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password){
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
      .subscribe({
        next: (data: LoginResponseType | DefaultResponseType) => {
          let error = null
          if((data as DefaultResponseType).error !== undefined){
            error = (data as DefaultResponseType).message
          }

          const loginResponse = data as LoginResponseType
          if(!loginResponse.accessToken && !loginResponse.refreshToken && !loginResponse.userId){
            error = "Ошибка авторизации"
          }

          if(error){
            this.snackBar.open(error)
            throw new Error(error)
          }

          this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken)
          this.authService.userId = loginResponse.userId
          this.snackBar.open("Авторизация успешна")
          this.router.navigate(["/"])
        },
        error: (errorResponse: HttpErrorResponse) => {
          if(errorResponse.error && errorResponse.error.message){
            this.snackBar.open(errorResponse.error.message)
          } else{
            this.snackBar.open("Ошибка авторизации")
          }
        }
      })
    }
  }

}
