import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';
import { SignupResponseType } from 'src/types/signup-response.type';
import { UserInfoType } from 'src/types/user-info.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public UserIdKey: string = 'UserId';

  public isLogged$: Subject<boolean> = new Subject<boolean>()
  private isLogged: boolean = false
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasTokens());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey)

    if(this.isLogged === true){
      console.log("logged")
    }
   }

  login(email: string, password: string, rememberMe: boolean): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + "login", {
      email,
      password,
      rememberMe
    })
  }

  signup(name: string, email: string, password: string): Observable<SignupResponseType | DefaultResponseType> {
    return this.http.post<SignupResponseType | DefaultResponseType>(environment.api + "signup", {
      name,
      email,
      password
    })
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens()
    if(tokens && tokens.refreshToken){
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + "refresh", {refreshToken: tokens.refreshToken})
    }
    throw throwError(() => "Cant use token")
  }

  getIsLogged(): boolean{
    return this.isLogged
  }

  public setTokens(accessToken: string, refreshToken: string){
    localStorage.setItem(this.accessTokenKey, accessToken)
    localStorage.setItem(this.refreshTokenKey, refreshToken)
    this.isLogged = true
    this.isLogged$.next(true)
    this.isLoggedInSubject.next(true)
  }

  public removeTokens(){
    localStorage.removeItem(this.accessTokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    this.isLogged = false
    this.isLogged$.next(false)
    this.isLoggedInSubject.next(false)
  }

  private hasTokens(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  public logout(){
    this.removeTokens()
    this.isLogged = false
    this.isLogged$.next(false)
  }

  public getTokens(): {
    accessToken: string | null
    refreshToken: string | null
  } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType>{
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + "users")
  }

  get userId(): null | string {
    return localStorage.getItem(this.UserIdKey)
  }

  set userId(id: string | null){
    if(id){
      localStorage.setItem(this.UserIdKey, id)
    } else{
      localStorage.removeItem(this.UserIdKey)
    }
  }

}
