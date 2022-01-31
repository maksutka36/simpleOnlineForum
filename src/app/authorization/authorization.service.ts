import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData, LoginData } from './auth.model'
import { Observable, Subject } from 'rxjs';
import { host } from '../hostModel/hostModel'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private username!: string;
  private email!: string;
  isAuth = false;
  userId!: string | null;
  private token?: string;
  private authStatusListener = new Subject<boolean>()
  

  constructor(
    private http: HttpClient,
    private router: Router) { }

  getToken(){
    return this.token
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable()
  }

  createUser(email: string, username: string, password: string,){
    const authData: AuthData = {email: email, username: username, password: password}
    this.http.post(`${host}/auth/registration`, authData)
      .subscribe((response) =>{
        this.login(authData.email, authData.password)
      },
      (error) => {
        this.authStatusListener.next(false)
      })
  }

  login(email:string, password: string){
    const loginData: LoginData = {email: email, password: password}
    console.log(loginData)
    this.http
    .post<{token: string, expiresIn:number, username: string, email: string, userId: string}>(`${host}/auth/login`, loginData)
    .subscribe((response) =>{
      const token = response.token;
      const email = response.email;
      const username = response.username
      const userId = response.userId
      this.token = token;
      this.email = email;
      this.username = username
      if(token){
        this.isAuth = true;
        this.userId = userId
        const expiresInDuration = response.expiresIn
        this.setAuthTimer(expiresInDuration)
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate, username, email, userId)
        this.router.navigate(['/'])
      }
    },
    (error) => {
      this.authStatusListener.next(false)
      console.log("error", error.error.message)
    })
  }

  autoAuthUser(){
    const authInfo = this.getAuthData();
    const now = new Date();
    if(localStorage.getItem("token")){
      const expiresIn = authInfo!.expirationDate.getTime() - now.getTime();
      if(expiresIn > 0){
        this.isAuth = true;
        this.token = authInfo?.token;
        this.email = authInfo?.email!;
        this.userId = authInfo?.userId!;
        this.username = authInfo?.username!;
        this.setAuthTimer(expiresIn / 1000)
      }
    }
  }

  logout(){
    this.token = null as any;
    this.isAuth = false;
    this.userId = null;
    this.clearAuthData()
    this.router.navigate(['/'])
  }

  private setAuthTimer(duration: number){
    setTimeout(() =>{this.logout()},duration * 1000)
  }

  private saveAuthData(token: string, expirationDate: Date, username: string, email: string, userId: string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("username", username)
    localStorage.setItem("email", email)
    localStorage.setItem("userId", userId)
  }

  private clearAuthData(){
    localStorage.removeItem("token")
    localStorage.removeItem("expiration")
    localStorage.removeItem("username")
    localStorage.removeItem("email")
    localStorage.removeItem("userId")
    this.router.navigate([''])

  }

  private getAuthData(){
    const token = localStorage.getItem("token")
    const expirationDate = localStorage.getItem("expiration")
    const username = localStorage.getItem("username")
    const email = localStorage.getItem("email")
    const userId = localStorage.getItem("userId")
    if( !token || !expirationDate){
      return ;
    }
    return{
      token: token,
      expirationDate: new Date(expirationDate),
      username: username,
      email: email,
      userId: userId
    }
  }

}
