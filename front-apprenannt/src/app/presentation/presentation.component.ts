import { Component, OnInit } from '@angular/core';
import { SessionService} from '../session.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit {

  private socket;
  private currentTimestamp: number;
  private endTimestamp: number;

  public step: string;
  public formCollectParticipant: FormGroup = null;
  public formCollectUsername: FormGroup = null;
  public question: any = null;
  public chrono: any = null;

  constructor(private sessionService: SessionService,
              private fb: FormBuilder,
              private router: Router,) {
    this.step = 'LOADING';

    if (!this.sessionService.getSession()) {
      this.router.navigate(['login']);
    }

    this.formCollectParticipant = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]]
    });

    this.formCollectUsername = this.fb.group({
      username: ['', [Validators.required]]
    });

    if (this.sessionService.getCookieParticipantData()) {

      this.sessionService.collectExistingParticipantSession(this.sessionService.getCookieParticipantData().id).subscribe(
        (data) => {
          this.sessionService.setParticipant(data.results);
          this.step = 'WAITING_FOR_SESSION_START';
          this.connectionSessionWebsocket();
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.step = 'ASK_INFO_PARTICIPANT';
    }
  }

  static getTimestamp() {
    return ((new Date()).getTime() / 1000);
  }

  ngOnInit() {
  }

  onSubmitCollectParticipant() {
    if (this.formCollectParticipant.valid) {
      this.sessionService.collectNewParticipantSession(this.formCollectParticipant.value.nom, this.formCollectParticipant.value.prenom).subscribe(
        (data) => {
          console.log(data);
          this.sessionService.setParticipant(data.results);
          this.sessionService.setCookieParticipantData(data.results);
          this.step = 'WAITING_FOR_SESSION_START';
          this.connectionSessionWebsocket();
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.formCollectParticipant.controls.prenom.markAsTouched();
      this.formCollectParticipant.controls.nom.markAsTouched();
    }
  }

  onSubmitCollectUsername() {
    if (this.formCollectUsername.valid) {
      this.step = 'WAITING_FOR_SESSION_START';
      this.socket.emit('SET_USERNAME', {
        id_participant: this.sessionService.getParticipant().id,
        username: this.formCollectUsername.value.username
      });
    } else {
      this.formCollectUsername.controls.username.markAsTouched();
    }
  }

  connectionSessionWebsocket() {
    this.socket = io.connect('http://localhost:8080');

    this.socket.on('SESSION_ID_REQUESTED', () => {
      console.log('ID SESSION requested');
      this.socket.emit('SESSION_ID', this.sessionService.getSession().id);
    });

    this.socket.on('PARTICIPANT_ID_REQUESTED', () => {
      console.log('ID PARTIIPANT requested');
      this.socket.emit('PARTICIPANT_ID', this.sessionService.getParticipant().id);
    });

    this.socket.on('REQUEST_USERNAME', () => {
      this.step = 'ASK_USERNAME';
    });

    this.socket.on('START_MEDIA', (question) => {
      this.step = 'MEDIA';
      this.question = question;
      console.log(question);
    });

    this.socket.on('NOTICE_SKIP_MEDIA', () => {
      this.step = 'LOADING';
    });

    this.socket.on('QUESTION_STARTED', (question) => {
      this.question = question;
      this.currentTimestamp = PresentationComponent.getTimestamp();
      this.endTimestamp = PresentationComponent.getTimestamp() + question.duree;
      this.chrono = setInterval(() => {
        const timestamp = PresentationComponent.getTimestamp();
        if (Math.trunc(this.endTimestamp - timestamp) > 0) {
          this.currentTimestamp = timestamp;
        } else {
          this.currentTimestamp = this.endTimestamp;
        }
      }, 250);
      this.step = 'QUESTION';
    });

    this.socket.on('QUESTION_SKIPPED', () => {
      clearTimeout(this.chrono);
      this.chrono = null;
      this.step = 'LOADING';
    });

    this.socket.on('QUESTION_TIMEOUT', () => {
      clearTimeout(this.chrono);
      this.chrono = null;
      this.step = 'LOADING';
    });

    this.socket.on('TOP_3', (top_3) => {

    });

    this.socket.on('QCM_ENDED', () => {
      this.router.navigate(['login']);
    });
  }
}
