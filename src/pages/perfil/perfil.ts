import { Alerta } from './../../domain/alerta/alerta';
import { LoginPage } from './../login/login';
import { DomSanitizer } from '@angular/platform-browser';
import { CameraService } from './../../domain/camera/camera-service';
import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ActionSheetController } from 'ionic-angular';
import { UsuarioService } from '../../domain/usuario/usuario-service';
import { Usuario } from '../../domain/usuario/usuario';
import { Evento } from '../../domain/evento/evento';
import { InfosPage } from './../infos/infos';
import { ModalEditarPerfil } from './modalEditarPerfil';
import { EventoService } from './../../domain/evento/evento.service';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage {

  usuario: Usuario = new Usuario();
  public eventos: Array<Evento>;
  private _api: string;
  public visitante: boolean = false;
  public aviso: string = null;

  constructor(public navCtrl: NavController,
              private _usuarioService: UsuarioService,
              private _eventoService: EventoService,
              public modalCtrl: ModalController,
              private _navParams: NavParams,
              private _cameraService: CameraService,
              private _actionSheetCtrl: ActionSheetController,
              private _sanitizer: DomSanitizer,
              private _alerta: Alerta){
    

    let parametroRecebido = this._navParams.get('entidade');
    if(parametroRecebido != undefined){
      this.visitante = true;
      this.usuario = parametroRecebido;
    } else {
      
      this._usuarioService.obtemUsuarioLogado()
        .then(user => {
          this.usuario = user;
          this.eventos = [];
          if(this.usuario.tipo == 'V'){
            this._api = 'api/private/v1/voluntario/historico';
            this._eventoService.getEventos(this._api)
              .then(res => {
                this.eventos = [];          
                res.forEach(evento => {
                  evento.titulo = evento.titulo.length > 35 ?
                  evento.titulo.substr(0, 35) + '...' : 
                  evento.titulo;
                  this.eventos.push(evento);
                });
                if(res.length == 0){
                  this.aviso = 'Você ainda não participou de nenhum evento! Acesse seu feed para explorar os eventos criados!';
                }
              }, err => {
                  console.log(err);
              });
          }
        });
    }
    this._cameraService.carregaFoto('api/private/v1/usuario/getimagem')
      .then(image => {
        this.usuario.imagem = image;
      })                    
  }

  abreInfos(evento){
    this.navCtrl.push(InfosPage, {evento: evento, participando: true});
  }

  presentModal() {
    let modal = this.modalCtrl.create(ModalEditarPerfil, {'usuario': this.usuario});
    modal.present();
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
                              this.usuario.imagem = this._sanitizer.bypassSecurityTrustUrl(res);
                              this._alerta.exibeAlerta('Sucesso!','Sua nova foto foi adicionada com sucesso!');
                            }, err => {
                              this._alerta.exibeAlerta('Erro!','Algo inesperado aconteceu, tente novamente mais tarde.');
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
                              this.usuario.imagem = this._sanitizer.bypassSecurityTrustUrl(res);
                              this._alerta.exibeAlerta('Sucesso!','Sua nova foto foi adicionada com sucesso!');
                            }, err => {
                              this._alerta.exibeAlerta('Erro!','Algo inesperado aconteceu, tente novamente mais tarde.');
                            })
                        })
                    })
                }
            },{
                text: 'Cancelar',
                role: 'cancel',
                icon: 'close'
            }
        ]
    }).present();
  }

  sair(){
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage);
  }
}
