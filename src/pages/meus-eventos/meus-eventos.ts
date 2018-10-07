import { PerfilPage } from './../perfil/perfil';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Alerta } from './../../domain/alerta/alerta';
import { UsuarioService } from './../../domain/usuario/usuario-service';
import { InfosPage } from './../infos/infos';
import { EventoService } from './../../domain/evento/evento.service';
import { Evento } from './../../domain/evento/evento';

@Component({
  selector: 'page-meus-eventos',
  templateUrl: 'meus-eventos.html'
})

export class MeusEventosPage {

  public eventos: Array<Evento>;
  private _api: string;
  public tipo: string;
  public aviso: string = '';

  constructor(public navCtrl: NavController, private _eventoService: EventoService, private _usuarioService: UsuarioService, private _alerta: Alerta, private _navParams: NavParams) {

    this.eventos = new Array<Evento>();
    
    this._usuarioService.obtemUsuarioLogado()
      .then(user => {
        this.tipo = user.tipo;
        if(this.tipo == 'E'){
          this._api = 'api/private/v1/entidade/meuseventos';
          this.ionViewWillEnter();
        } else {
          if(this.tipo == 'V'){
            this._api = 'api/private/v1/voluntario/meuseventos';
            this.ionViewWillEnter();
          } else {
            //this._alerta.exibeAlerta('Erro','Algo inesperado aconteceu.');
            console.log('erro')
          }
        }
      });
  }

  ionViewWillEnter(){
    
    if (this._api != undefined){
      this.getEventos();
    }
  }

  abreInfos(evento){
    this.navCtrl.push(InfosPage, {evento: evento, participando: true});
  }

  getEventos(){
    
    this._eventoService.getEventos(this._api)
      .then(res => {
        this.eventos = [];
        res.forEach(evento => {
          evento.titulo = evento.titulo.length > 20 ?
          evento.titulo.substr(0, 20) + '...' : 
          evento.titulo;
          this.eventos.push(evento);
        });
        if(res.length == 0){
          if(this.tipo == 'E'){
            this.aviso = 'Você ainda não possui eventos cadastrados! Vá para a página de criação para cadastrar novos eventos!';
          } else {
            if(this.tipo == 'V'){
              this.aviso = 'Você ainda não se inscreveu em nenhum evento! Acesse seu feed para explorar os eventos criados!';
            }
          }
        }
      }, err => {
        this._alerta.exibeAlerta('Erro','Algo inesperado aconteceu.');
      });
  }
}
