import { SafeUrl } from '@angular/platform-browser';

export class ApiSuccessResponse<T extends Object> {
  constructor(
    public results: T,
    public message: string,
    public code: number) {}
}

export class ApiErrorResponse {
  constructor(
    public message: string | string[],
    public code: number) {}
}

export class ApiAuthResponse {
  constructor(
    public token: string) {}
}

export class User {
  constructor(
    public id: number,
    public role: string,
    public username: string,
    public nom: string,
    public prenom: string) {}
}

export class Classe {
  constructor(
    public id: number,
    public professeur: number,
    public date_creation: string,
    public nom: string) {}
}

export class Media {
  public safeUrl: SafeUrl;

  constructor(
    public id: number,
    public url: string,
    public type: string) {}
}

export class Reponse {
  constructor(
    public id: number,
    public nom: string,
    public est_valide: boolean) {}
}

export class Question {
  constructor(
    public id: number,
    public titre: string,
    public duree: number,
    public position: number,
    public reponses: Reponse[],
    public media?: Media) {}
}

export class QCM {
  constructor(
    public id: number,
    public professeur: number,
    public nom: string,
    public questions: Question[]) {}
}

export class Session {
  constructor(
    public id: number,
    public nom_session: string,
    public classe: number,
    public qcm: number) {}
}
