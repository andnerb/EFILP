import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiAuthResponse, ApiErrorResponse, ApiSuccessResponse } from '../app.models';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../app.models';

@Injectable()
export class AuthService {
  private token: string = null;
  private professeur: User = null;

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
    if (cookieService.check('token')) {
      this.token = this.cookieService.get('token');
    }
  }

  getAuthToken() {
    return this.token;
  }

  logout() {
    this.cookieService.delete('token', '/');
    this.professeur = null;
    this.token = null;
  }

  setUserInfo(professeur: User) {
    this.professeur = professeur;
  }

  getUserInfo(): User {
    return this.professeur;
  }

  sendAuthRequest(login_datas) {
    return this.httpClient.post<ApiAuthResponse>(
      `${environment.api_base_url}/login_check`,
      login_datas,
      {
        observe: 'body',
        responseType: 'json'
      }
    )
      .pipe(
        map((data: ApiAuthResponse) => {
          this.token = data.token;
          this.cookieService.set('token', data.token, null, '/');
          return data;
        })
      );
  }

  getCurrentUser() {
    return this.httpClient.get<ApiSuccessResponse<User>>(
      `${environment.api_base_url}/professeurs/current`,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<User>) => {
          return data.results;
        }),
        catchError((data: ApiErrorResponse) => {
          return of(data);
        })
      );
  }

}
