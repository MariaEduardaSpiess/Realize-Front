import { Loading } from './../../domain/loading/loading';
import { CameraService } from './../../domain/camera/camera-service';
import { Alerta } from './../../domain/alerta/alerta';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventoService } from './../../domain/evento/evento.service';
import { Evento } from './../../domain/evento/evento';
import { InfosPage } from './../infos/infos';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class FeedPage {

  public eventos: Array<Evento>;  
  eventosLoaded: Evento[];
  private _loading;

  constructor(public navCtrl: NavController,
              private _service: EventoService,
              private _alerta: Alerta,
              private _cameraService: CameraService,
              private _loadingCtrl: Loading) {

    this._loading = this._loadingCtrl.exibirLoading();
  }
  
  ionViewWillEnter(){
    this.getEventos();
  }

  getItems(ev) {

    this.onCancel();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.eventos = this.eventos.filter((evento) => {
        return (evento.titulo.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  onCancel(){
    
    this.eventos = this.eventosLoaded;
  }

  getEventos(){
    
    this._service.getEventos('api/private/v1/voluntario/feedeventos')
      .then(res => {
        this.eventos = [];
        res.forEach(evento => {
          evento.titulo = evento.titulo.length > 27 ?
          evento.titulo.substr(0, 27) + '...' : 
          evento.titulo;
          this._cameraService.carregaFoto('api/private/v1/evento/getimagem?id=' + evento.id)
          .then(image => {
            evento.imagem = image;
            this.eventos.push(evento);
          })  
          console.log(this.eventos);
        });
        this._loading.dismiss();
      }, () => {
          this._alerta.exibeAlerta('Erro', 'Algo inesperado aconteceu.');
        });
  }

  abreInfos(evento){
    this.navCtrl.push(InfosPage, {evento: evento});
  }
}
