import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TipoPage } from '../cadastro/tipo/tipo';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-inicial',
  templateUrl: 'inicial.html'
})
export class InicialPage {

  constructor(public navCtrl: NavController) {
      
  }

  abreTipo(){
    this.navCtrl.push(TipoPage);
  }

  abreLogin(){
    this.navCtrl.setRoot(LoginPage);
  }
}
