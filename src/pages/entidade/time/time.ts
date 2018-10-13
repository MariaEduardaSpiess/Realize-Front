import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { Add } from './add/add';
import { TimeService } from './time-service';
import { Alerta } from '../../../domain/alerta/alerta';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-time',
  templateUrl: 'time.html'
})
export class TimePage {

  public timeVoluntarios;
  public voluntariosLoaded;
  public aviso: string = '';
  
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private _service: TimeService, private _alerta: Alerta) {
    
      this.listaVoluntarios();
  }

  addVoluntario(){
    let profileModal = this.modalCtrl.create(Add, {showBackdrop: true});
    profileModal.present();
    profileModal.onDidDismiss(() => {
      this.listaVoluntarios();
    });
  }

  deletaIntegrante(voluntario){
    this._service.deletaVoluntario(voluntario)
      .subscribe(() => {
          let indiceVoluntario = this.voluntariosLoaded.indexOf(voluntario);
          this.voluntariosLoaded.splice(indiceVoluntario, 1);
          this.timeVoluntarios = this.voluntariosLoaded;
          this._alerta.exibeAlerta('Sucesso!', 'Integrante deletado com sucesso!');
        }, () => {
          this._alerta.exibeAlerta('Erro', 'O integrante não pôde ser deletado.');
        })
  }

  listaVoluntarios(){
    this._service.lista('api/private/v1/timevoluntario/time')
      .then(res => {
        this.timeVoluntarios = res;
        this.voluntariosLoaded = res;
        console.log(this.timeVoluntarios);
        if(this.timeVoluntarios.lenght == 0){
          this.aviso = 'Não existem voluntários no seu time! Adicione através do botão "Adicionar voluntários", posicionado na parte inferior da tela.';
        }
      })
  }
}
