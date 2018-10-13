import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { Evento } from '../../../domain/evento/evento';
import { SegmentoService } from '../../../domain/segmento/segmento-service';
import { EventoService } from '../../../domain/evento/evento.service';
import { Alerta } from '../../../domain/alerta/alerta';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-editar-evento',
  templateUrl: 'editar-evento.html'
})

export class EditarEventoPage {

  public segmentos;
  
  evento: Evento = new Evento();
  public url: string;

  constructor(public navParams: NavParams, 
              public navCtrl: NavController, 
              private _alerta: Alerta,
              private _segmentoService: SegmentoService,
              private _eventoService: EventoService){
    
    this.evento = this.navParams.get('evento');
    
    this._segmentoService.buscaSegmento()
        .then(dados => {
          this.segmentos = dados;
        },
            erro => console.log(erro)
        );
  }  
  
  editar(){
  
    this._eventoService.editaEvento(this.evento)
        .subscribe(() => {
            if(this._alerta.exibeAlerta('Sucesso', 'O evento foi editado com sucesso!')){
                this.navCtrl.pop();
            };
        }, erro => {
            console.log(erro);
            if(this._alerta.exibeAlerta('Erro', 'O evento não pôde ser editado. Tente novamente mais tarde.')){
                this.navCtrl.pop();
            };
        });      
  }
}