import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export const JWT_TOKEN = "jwt_token"
export const REFRESH_TOKEN = "refresh_token"

export interface AuthError {
  errors: {
    code: string,
    field: string,
    message: string
  }[],
  message: string;
}

export interface AuthToken {
  jwt_token: string,
  refresh_token: string
}

export interface Tokens {
  keys: string[]
}

export interface Portfolio {
  name: string,
  total_value: number,
  stocks: Stock[]
}

export interface Stock {
  name: string,
  qty: number,
  average_cost: number,
  realized_value: number,
  unrealized_value: number,
  total_value: number
}

export interface Trade {
  seller: string,
  buyer: string,
  broker: string,
  stock: string,
  qty: number,
  action: string,
  price: number,
  time: string
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  constructor(public http: HttpClient, private jwt: JwtHelperService) { }

  isAuthenticated() {
    const authToken = this.getAuthToken();
    return ! this.jwt.isTokenExpired(authToken.jwt_token);
  }

  getTokens() {
    const url = `${environment.exchangeUrl}/auth/key`;
    return this.http.get(url);
  }

  authenticate(username: string, password: string): Observable<AuthToken> {
    const url = `${environment.exchangeUrl}/auth/login`;
    const data = {
      email: username,
      password: password
    };
    return this.http
      .post<AuthToken>(url, data)
      .pipe(tap(authToken => this.setAuthToken(authToken)));
  }

  refreshAuthentication() {
    const url = `${environment.exchangeUrl}/auth/jwt-token/refresh`;
    const token = this.getAuthToken().jwt_token;
    const headers = new HttpHeaders()
      .append("Authorization", `Bearer ${token}`)
      .append("Content-Type", `application/json`)
    return this.http.get(url, {headers});
  }

  getUserPortfolio(): Observable<Portfolio> {
    const token = this.getAuthToken().jwt_token;
    const url = `${environment.exchangeUrl}/user/portfolio`;
    const headers = new HttpHeaders()
      .append("Authorization", `Bearer ${token}`)
      .append("Content-Type", `application/json`)
    return this.http.get<Portfolio>(url, {headers});
  }

  getTeamPortfolio(): Observable<Portfolio> {
    const token = this.getAuthToken().jwt_token;
    const url = `${environment.exchangeUrl}/team/portfolio`;
    const headers = new HttpHeaders()
      .append("Authorization", `Bearer ${token}`)
      .append("Content-Type", `application/json`)
    return this.http.get<Portfolio>(url, {headers});
  }

  getUserTrades(stock: string): Observable<Trade[]> {
    const token = this.getAuthToken().jwt_token;
    const url = `${environment.exchangeUrl}/stock/${stock}/trade`;
    const headers = new HttpHeaders()
      .append("Authorization", `Bearer ${token}`)
      .append("Content-Type", `application/json`)
    return this.http
      .get<{trades: Trade[]}>(url, {headers})
      .pipe(map(t => t.trades));
  }

  getAuthToken(): AuthToken {
    const jwt_token = localStorage.getItem(JWT_TOKEN);
    const refresh_token = localStorage.getItem(REFRESH_TOKEN);
    return <AuthToken> {
      jwt_token: jwt_token,
      refresh_token: refresh_token
    };
  }

  setAuthToken(authToken: AuthToken): void {
    localStorage.setItem(JWT_TOKEN, authToken.jwt_token);
    localStorage.setItem(REFRESH_TOKEN, authToken.refresh_token);
  }

  delAuthToken(): void {
    localStorage.removeItem(JWT_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }
}
