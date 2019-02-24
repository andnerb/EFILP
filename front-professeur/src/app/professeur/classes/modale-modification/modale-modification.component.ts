import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfesseurService } from '../../professeur.service';
import { Classe } from '../../../app.models';

@Component({
  selector: 'app-modale-modification',
  templateUrl: './modale-modification.component.html',
  styleUrls: ['./modale-modification.component.css']
})
export class ModaleModificationComponent implements OnInit, OnChanges {
  public formEditionClasse: FormGroup = null;
  public isLoading = false;

  @Input() classe: Classe;

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private professeurService: ProfesseurService) {

    this.formEditionClasse = this.fb.group({
      nom: ['', [Validators.required]],
    });

  }

  ngOnInit() {
    if (this.classe) {
      this.formEditionClasse.patchValue({
        nom: this.classe.nom
      })
    }
  }

  ngOnChanges() {
    if (this.classe) {
      this.formEditionClasse.patchValue({
        nom: this.classe.nom
      })
    }
  }

  editerClasse() {
    this.isLoading = true;
    this.professeurService.updateClasse(this.classe.id, this.formEditionClasse.value).subscribe(
      (result) => {
        this.isLoading = false;
        this.activeModal.close('classe_mise_a_jour');
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmitEditerClasse() {
    if (this.formEditionClasse.valid) {
      this.editerClasse();
    } else {
      this.professeurService.markAllFormlementsAsTouched(this.formEditionClasse);
    }
  }
}
