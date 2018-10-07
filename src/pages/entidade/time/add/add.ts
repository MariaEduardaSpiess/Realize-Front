import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { TimeService } from '../time-service'
import { Alerta } from '../../../../domain/alerta/alerta';
import { Usuario } from '../../../../domain/usuario/usuario';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'add',
  templateUrl: 'add.html'
})
export class Add {

  public voluntarios: Usuario[];
  public voluntariosLoaded: Usuario[];
  
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private _service: TimeService, private _alerta: Alerta) {
    
    this._service.lista('api/private/v1/timevoluntario/buscanovosvoluntariosparaotime')
      .then(res => {
        this.voluntarios = res;
        this.voluntariosLoaded = res;
      })
  }

  getItems(ev) {
    
    this.onCancel();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.voluntarios = this.voluntarios.filter((voluntario) => {
        return (voluntario.nomeCompleto.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  onCancel(){
    
    this.voluntarios = this.voluntariosLoaded;
  }

  adicionaParticipante(voluntario: Usuario){
    
    this._service.addVoluntario(voluntario)
        .subscribe(() => {
          if(this._alerta.exibeAlerta('Sucesso!','Voluntário adicionado com sucesso!')){
            this.closeModal();
          };
        }, err => {
          if(this._alerta.exibeAlerta('Erro!','Voluntário não pôde ser adicionado.')){
            this.closeModal();
          };
        })
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}