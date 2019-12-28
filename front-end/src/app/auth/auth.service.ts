import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

import { LoginData, SignupData } from "../interfaces/auth.model";

import { environment } from "../../environments/environment";
import User from "../interfaces/user.model";

const URL = `${environment.apiUrl}/auth/`;
@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private token = "";
  private tokenTimeout: any;
  private tokenDetails: { token: string; expiresIn: Date };
  private userId: string;

  constructor(public http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  isAuth() {
    return this.isAuthenticated;
  }

  createUser(authData: SignupData) {
    const { email, password }: LoginData = authData;
    this.http.post<User>(URL + "signup", {
      fiscalCode: authData.fiscalCode,
      name: authData.name,
      surname: authData.surname,
      dateOfBirth: authData.dateOfBirth,
      type: authData.type
    }).subscribe(() => {
      this.loginUser({ email, password });
    });
  }

  loginUser(authData: LoginData) {
    this.http
      .post<{ token: string; expiresIn: number; id: string }>(
        URL + "login",
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        this.authStatusListener.next(true);
        if (token) {
          this.getTokenTimeout(response.expiresIn);
          this.isAuthenticated = true;
          this.userId = response.id;
          this.authStatusListener.next(true);
          const timeStamp = new Date();
          const expirationDate = new Date(
            timeStamp.getTime() + response.expiresIn * 1000
          );
          this.storeAuthData(token, expirationDate, this.userId);
          this.router.navigate([`/users/${response.id}`]);
        }
      });
  }

  getTokenTimeout(expiresIn: number) {
    this.tokenTimeout = setTimeout(() => {
      this.logoutUser();
    }, expiresIn * 1000);
  }

  autoConfigAuthUser() {
    this.tokenDetails = this.getAuthStatus();
    if (!this.tokenDetails) {
      return;
    }
    const timestamp = new Date();
    const expirationDate =
      this.tokenDetails.expiresIn.getTime() - timestamp.getTime();
    if (expirationDate > 0) {
      this.token = this.tokenDetails.token;
      this.isAuthenticated = true;
      this.getTokenTimeout(expirationDate / 1000);
      this.authStatusListener.next(true);
    }
  }

  getAuthStatus() {
    const usertoken = localStorage.getItem("token");
    const tokenExpirationDate = localStorage.getItem("expiresIn");
    const id = localStorage.getItem("userId");

    if (usertoken && tokenExpirationDate) {
      return {
        token: usertoken,
        expiresIn: new Date(tokenExpirationDate),
        userId: id
      };
    }
  }

  storeAuthData(token: string, expiresIn: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiresIn", expiresIn.toISOString());
    localStorage.setItem("userId", userId);
  }

  clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("userId");
  }

  logoutUser() {
    this.token = "";
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimeout);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }
}
