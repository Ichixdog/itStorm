import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { SignupResponseType } from 'src/types/signup-response.type';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    signupForm = this.fb.group({
      userName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)]],
      agreeTerms: [false, Validators.required]
    })

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }

  signup(): void{
    if(this.signupForm.valid && this.signupForm.value.userName && this.signupForm.value.email && this.signupForm.value.password && this.signupForm.value.agreeTerms){
      this.authService.signup(this.signupForm.value.userName, this.signupForm.value.email, this.signupForm.value.password)
      .subscribe({
        next: (data: SignupResponseType | DefaultResponseType) => {
          let error = null
          if((data as DefaultResponseType).error !== undefined){
            error = (data as DefaultResponseType).message
          }

          const loginResponse = data as SignupResponseType
          if(!loginResponse.accessToken && !loginResponse.refreshToken && !loginResponse.userId){
            error = "Ошибка авторизации"
          }

          if(error){
            this.snackBar.open(error)
            throw new Error(error)
          }

          this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken)
          this.authService.userId = loginResponse.userId
          this.snackBar.open("Регистрация успешна")
          this.router.navigate(["/"])
        },
        error: (errorResponse: HttpErrorResponse) => {
          if(errorResponse.error && errorResponse.error.message){
            this.snackBar.open(errorResponse.error.message)
          } else{
            this.snackBar.open("Регистрация неуспешна")
          }
        }
      })
    }
  }
}
