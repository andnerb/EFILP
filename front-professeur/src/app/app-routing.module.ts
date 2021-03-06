import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { AuthGuard } from './guard/auth.guard';
import { ProfesseurComponent } from './professeur/professeur.component';
import { HomeComponent } from './professeur/home/home.component';
import { ClassesComponent } from './professeur/classes/classes.component';
import { ClassesComponent as StatistiquesClassesComponent } from './professeur/statistiques/classes/classes.component';
import { QcmsComponent } from './professeur/qcms/qcms.component';
import { QcmQuestionsComponent } from './professeur/qcms/qcm-questions/qcm-questions.component';
import { GestionCompteComponent } from './professeur/gestion-compte/gestion-compte.component';
import { SessionsComponent } from './professeur/sessions/sessions.component';
import {PresentationComponent} from './professeur/presentation/presentation.component';
import {StatistiquesComponent} from './professeur/statistiques/statistiques.component';
import {ElevesComponent} from './professeur/statistiques/eleves/eleves.component';
import {FormRegistrationComponent} from './login/form-registration/form-registration.component';

/*
** Ce fichier contient les routes vers les composants racines tel que
* le login, les classes, etc...
*/
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: LoginComponent,
    children: [
      { path: 'login', component: LoginFormComponent },
      { path: 'registration', component: FormRegistrationComponent },
    ]
  },
  { path: 'professeur', redirectTo: 'professeur/home', pathMatch: 'full' },
  {
    path: 'professeur',
    component: ProfesseurComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'gestion-compte', component: GestionCompteComponent },
      { path: 'classes', component: ClassesComponent },
      { path: 'qcms', component: QcmsComponent },
      { path: 'sessions', component: SessionsComponent },
      { path: 'qcms/:id', component: QcmQuestionsComponent },
      { path: 'presentation/:id', component: PresentationComponent },
      { path: 'statistiques', component: StatistiquesComponent },
      { path: 'statistiques/classes', component: StatistiquesClassesComponent },
      { path: 'statistiques/eleves', component: ElevesComponent },
    ]
  },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

