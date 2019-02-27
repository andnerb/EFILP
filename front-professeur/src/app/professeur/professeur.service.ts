import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {ApiErrorResponse, ApiSuccessResponse, Classe, Media, Question, Reponse} from '../app.models';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../app.models';
import { AuthService } from '../login/auth.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class ProfesseurService {

  constructor(private httpClient: HttpClient, private authService: AuthService) {

  }

  markAllFormlementsAsTouched(form: FormGroup) {
    for (const key in form.controls) {
      if (form.controls.hasOwnProperty(key)) {
        if (form.controls[key] instanceof FormArray) {
          form.controls[key].markAsTouched();
          (<FormArray>form.controls[key]).controls.forEach((form_array_element) => {
            if (form_array_element instanceof FormGroup) {
              this.markAllFormlementsAsTouched(<FormGroup>form_array_element);
            } else if (form_array_element instanceof FormControl) {
              form_array_element.markAsTouched();
            }
          });
        } else if (form.controls[key] instanceof FormGroup) {
          this.markAllFormlementsAsTouched(<FormGroup>form.controls[key]);
        } else {
          form.controls[key].markAsTouched();
        }
      }
    }
  }

  getClasses() {
    return this.httpClient.get<ApiSuccessResponse<Classe[]>>(
      `${environment.api_base_url}/professeurs/${this.authService.getUserInfo().id}/classes`,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<Classe[]>) => {
          return data.results;
        })
      );
  }

  createClasse(classe) {
    return this.httpClient.post<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/professeurs/${this.authService.getUserInfo().id}/classes`,
      classe,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }

  updateClasse(id_classe, data_classe) {
    return this.httpClient.put<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/professeurs/${this.authService.getUserInfo().id}/classes/${id_classe}`,
      data_classe,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }

  deleteClasse(id_classe) {
    return this.httpClient.delete<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/professeurs/${this.authService.getUserInfo().id}/classes/${id_classe}`,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }

  getQCMs() {
    return this.httpClient.get<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/professeurs/${this.authService.getUserInfo().id}/qcms`,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }

  getQCMContent(id_qcm: number) {
    return this.httpClient.get<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/qcms/${id_qcm}`,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
    .pipe(
      map((data: ApiSuccessResponse<any>) => {
        return data.results;
      })
    );
  }

  createQCM(qcm) {
    return this.httpClient.post<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/qcms`,
      qcm,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }

  updateQCM(id_qcm, data_qcm) {
    return this.httpClient.put<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/qcms/${id_qcm}`,
      data_qcm,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }

  deleteQCM(id_qcm) {
    return this.httpClient.delete<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/qcms/${id_qcm}`,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }

  updatePositionQuestionQCM(id_qcm: number, datas: {id: number, position: number}[]) {
    return this.httpClient.patch<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/qcms/${id_qcm}/questions/position`,
      {
        updates: datas
      },
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }

  createQuestion(id_qcm, question: Question) {
    return this.httpClient.post<ApiSuccessResponse<{id_question: number}>>(
      `${environment.api_base_url}/qcms/${id_qcm}/questions`,
      question,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<{id_question: number}>) => {
          return data.results;
        })
      );
  }

  createReponse(id_qcm: number, id_question: number, reponse: Reponse) {
    return this.httpClient.post<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/qcms/${id_qcm}/questions/${id_question}/reponses`,
      reponse,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }

  upsertMedia(id_qcm: number, id_question: number, media: Media) {
    return this.httpClient.post<ApiSuccessResponse<any>>(
      `${environment.api_base_url}/qcms/${id_qcm}/questions/${id_question}/media`,
      media,
      {
        observe: 'body',
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAuthToken()}`
        })
      }
    )
      .pipe(
        map((data: ApiSuccessResponse<any>) => {
          return data.results;
        })
      );
  }
}

