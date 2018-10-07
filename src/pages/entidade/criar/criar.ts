import { DomSanitizer } from '@angular/platform-browser';
import { CameraService } from './../../../domain/camera/camera-service';
import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController, Slides, ActionSheetController } from 'ionic-angular';
import { Http } from '@angular/http';
import { MeusEventosPage } from './../../meus-eventos/meus-eventos';
import { Evento } from '../../../domain/evento/evento';
import { UsuarioService } from './../../../domain/usuario/usuario-service';
import { SegmentoService } from '../../../domain/segmento/segmento-service';
import { EventoService } from '../../../domain/evento/evento.service';
import { Alerta } from '../../../domain/alerta/alerta';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-criar',
  templateUrl: 'criar.html'
})

export class CriarPage {

  @ViewChild('mySlider') slider: Slides;

  public segmentos;
  
  evento: Evento = new Evento();
  public url;

  constructor(public navParams: NavParams, 
              public navCtrl: NavController, 
              private _http: Http, 
              private _alerta: Alerta,
              private _segmentoService: SegmentoService,
              private _eventoService: EventoService,
              private _usuarioService: UsuarioService,
              private _cameraService: CameraService,
              private _sanitizer: DomSanitizer,
              private _actionSheetCtrl: ActionSheetController){
    
    this._segmentoService.buscaSegmento()
        .then(dados => {
          this.segmentos = dados;
        },
            erro => console.log(erro)
        );
  }  
  
  criar(){
  
    this._eventoService.criaEvento(this.evento)
    .subscribe(() => {
        if(this._alerta.exibeAlerta('Sucesso', 'O evento foi criado com sucesso!')){
          this.navCtrl.push(MeusEventosPage);
        };
    }, erro => {
        console.log(erro);
        this._alerta.exibeAlerta('Erro', 'O evento não pôde ser criado. Tente novamente mais tarde.');
    });      
  }

  proximo(){
    this.slider.slideNext();
  }

  opcoesCamera(){
    
    this._actionSheetCtrl.create({
        title: 'Adicionar uma foto de perfil',
        buttons: [
            {
                text: 'Tirar foto',
                icon: 'camera',         
                handler: () => {
                  this._cameraService.tiraFoto()
                    .then(base64 => {
                      this._cameraService.postaFoto(base64, 'api/private/v1/usuario/addimagem')
                        .subscribe( res => {
                          console.log('sucesso upar foto');
                          this._cameraService.carregaFoto('api/private/v1/usuario/getimagem')
                            .then(res => {
                              let url = this._sanitizer.bypassSecurityTrustUrl(res);
                              this.url = url;
                              console.log('sucesso carrega foto');
                            }, err => {
                                console.log('erro carrega foto');
                            })
                        })
                    })
                }
            },{
                text: 'Escolher foto da galeria',
                icon: 'images',
                handler: () => {
                  console.log('Foto da galeria');
                  this._cameraService.escolheGaleria()
                    .then(base64 => {
                      this._cameraService.postaFoto(base64, 'api/private/v1/usuario/addimagem')
                        .subscribe( res => {
                          console.log('sucesso upar foto');
                          this._cameraService.carregaFoto('api/private/v1/usuario/getimagem')
                            .then(res => {
                              let url = this._sanitizer.bypassSecurityTrustUrl(res);
                              this.url = url;
                              console.log('sucesso carrega foto');
                            }, err => {
                                console.log('erro carrega foto');
                            })
                        })
                    })
                }
            },{
                text: 'Cancelar',
                role: 'cancel',
                icon: 'close',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }
        ]
    }).present();
  }
}