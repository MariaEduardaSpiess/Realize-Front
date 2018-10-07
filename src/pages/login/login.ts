import { EmailConfigPage } from './../admin/email-config';
import { AdminPage } from './../admin/admin';
import { TrocaSenhaPage } from './trocaSenha';
import { FeedPage } from '../../pages/feed/feed';
import { PerfilPage } from '../../pages/perfil/perfil';
import { MeusEventosPage } from '../../pages/meus-eventos/meus-eventos';
import { CriarPage } from '../../pages/entidade/criar/criar';
import { TimePage } from '../../pages/entidade/time/time';

import { TabsPage } from './../../domain/tabs/tabs';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { TipoPage } from '../cadastro/tipo/tipo';
import { UsuarioService } from '../../domain/usuario/usuario-service';

@Component({
  templateUrl: 'login.html'
})

export class LoginPage {
 
  public  tabs: Array<{root: any, title: string, icon: string}>;
  public index: string;

  public userData = {
    username: '',
    userpassword: ''
  }
  
  constructor( public navCtrl: NavController, 
               public navParams: NavParams, 
               private _service: UsuarioService, 
               private _alertCtrl: AlertController){
  }

  abreTipo(){
    this.navCtrl.push(TipoPage);
  }

  validaLogin(){

     this._service.efetuaLogin(this.userData.username, this.userData.userpassword)
      .subscribe(data=>{
          this._service.obtemUsuarioLogado()
            .then(user => {
              if(user.tipo == 'E'){
                this.tabs = [
                  {root: CriarPage, title: "Criar", icon: "create"},
                  {root: MeusEventosPage, title: "Meus Eventos", icon: "calendar"},                         
                  {root: TimePage, title: "Time", icon: "people"},        
                  {root: PerfilPage, title: "Perfil", icon: "contact"}
                ];
                this.index = '1';
              } else {
                if(user.tipo == 'V'){
                  this.tabs = [
                    {root: FeedPage, title: "Feed", icon: "paper"},
                    {root: MeusEventosPage, title: "Meus Eventos", icon: "calendar"},
                    {root: PerfilPage, title: "Perfil", icon: "contact"}          
                  ]; 
                  this.index = '0';    
                } else {
                  this.tabs = [
                    {root: AdminPage, title: "Admin", icon: "cog"},
                    {root: EmailConfigPage, title: "Email Config", icon: "mail"}                    
                  ]; 
                }          
              }
              this.navCtrl.setRoot(TabsPage,{"tabs" : this.tabs, "index" : this.index});
            });
      },
      error=> {
        console.log(error);
        this._alertCtrl.create({
          title: 'Problema no login',
          subTitle: 'Email ou senha inválidos. Verifique',
          buttons: [{ text: 'Ok'}]
        }).present();
      });
    
    
  }

  trocaSenha(){
    this.navCtrl.push(TrocaSenhaPage);
  }

}
