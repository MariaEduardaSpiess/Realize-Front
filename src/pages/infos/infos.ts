import { Alerta } from './../../domain/alerta/alerta';
import { PerfilPage } from './../perfil/perfil';
import { DomSanitizer } from '@angular/platform-browser';
import { CameraService } from './../../domain/camera/camera-service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { PopoverController, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http } from '@angular/http'
import { EditarEventoPage } from './../entidade/editarEvento/editar-evento';
import { Evento } from '../../domain/evento/evento';
import { UsuarioService } from '../../domain/usuario/usuario-service';
import { Usuario } from '../../domain/usuario/usuario';
import { EventoService } from '../../domain/evento/evento.service';

declare var google;

@Component({
    selector: 'page-infos',
    templateUrl: 'infos.html'
})

export class InfosPage {
    
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    
    public evento: Evento = new Evento();
    public usuario: Usuario = new Usuario();
    public lat;
    public lng;   
    public edit;
    public endCompleto;
    public participando: boolean = false;
    public entidade: boolean = false;
    
    constructor(public popoverCtrl: PopoverController, 
        public navCtrl: NavController, 
        public alertCtrl: AlertController,
        public navParams: NavParams,
        private _http: Http,
        private _service: UsuarioService,
        private _eventoService: EventoService,
        private _cameraService: CameraService,
        private _sanitizer: DomSanitizer,
        private _actionSheetCtrl: ActionSheetController,
        private _alerta: Alerta){
            
        this.evento = this.navParams.get('evento');
        this.evento.titulo = this.evento.titulo.length > 20 ?
        this.evento.titulo.substr(0, 20) + '...' : 
        this.evento.titulo;

        this._cameraService.carregaFoto('api/private/v1/evento/getimagem?id=' + this.evento.id)
            .then(image => {
                this.evento.imagem = this._sanitizer.bypassSecurityTrustUrl(image);
            })   

        this.participando = this.navParams.get('participando');

        this._service.obtemUsuarioLogado()
            .then(res => {
                this.usuario = res;
                if(this.usuario.tipo == 'E'){
                    this.edit = 'create';
                    this.entidade = true;
                } else {
                    if(this.usuario.tipo == 'V'){
                        this.participando ? this.edit = 'close' : this.edit = 'add';                 
                    } else {
                      console.log(Error);
                    }
                }
            });
    }

    converteEnd(){
        let api = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + this.evento.endLogradouro + ',' + this.evento.endNumero + ',' + this.evento.endCidade + ',' + this.evento.endEstado;
        
        return this._http.get(api)
            .map(res => res.json())
            .toPromise()
    }

    ngOnInit(){
        this.converteEnd()
        .then(res => {
            this.endCompleto = res.results["0"].formatted_address;
            this.lat = res.results["0"].geometry.location.lat;
            this.lng = res.results["0"].geometry.location.lng;
            this.loadMap();
        });
    }
 
    loadMap(){

        let latLng = new google.maps.LatLng(this.lat, this.lng);
            
        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter()
        });

    }

    showConfirm() {

        if(this.usuario.tipo == 'V'){
            if(this.participando){
                let sairEvento = this.alertCtrl.create({
                    title: 'Cancelar participação neste Evento?',
                    message: 'Você deseja cancelar sua participação neste evento?',
                    buttons: [
                        {
                            text: 'Não',
                            handler: () => {
                            }
                        },
                        {
                            text: 'Sim',
                            handler: () => {
                            this.deletaParticipante();
                            }
                        }
                    ]
                });
                sairEvento.present();    
            } else {
                let confirm = this.alertCtrl.create({
                  title: 'Participar deste Evento?',
                  message: 'Você deseja participar deste evento? A confirmação fará com que você seja inscrito no evento. O cancelamento só poderá ser realizado até 3 dias antes da data do Evento.',
                  buttons: [
                    {
                      text: 'Cancelar',
                      handler: () => {
                      }
                    },
                    {
                      text: 'Participar',
                      handler: () => {
                        this.addParticipante();                        
                      }
                    }
                  ]
                });
                confirm.present();
            }
        } else {
            this.navCtrl.push(EditarEventoPage, {evento: this.evento});
        }
    }

    addParticipante(){

        if(this.evento.selecao == true){
            this._eventoService.addParticipante(this.evento.id)
                .subscribe(() => {
                    this.participando = true;
                    this.edit = 'close';
                    this._alerta.exibeAlerta('Sucesso','Você foi inscrito no evento com sucesso!')
                }, erro => {
                    this._alerta.exibeAlerta('Entrevista','Para participar deste evento você precisa passar por uma seleção, a entidade responsável por este evento irá entrar em contato com você!')
                });
        } else {
            this._eventoService.addParticipante(this.evento.id)
                .subscribe(() => {
                    this.participando = true;
                    this.edit = 'close';
                    this._alerta.exibeAlerta('Sucesso','Você foi inscrito no evento com sucesso!')
                }, erro => {
                    this._alerta.exibeAlerta('Erro','Algo inesperado aconteceu. Tente novamente mais tarde.')
                });
        }
    }

    deletaParticipante(){

        this._eventoService.removeParticipante(this.evento)
            .subscribe(() => {
                this.participando = false;
                this.edit = 'add';
            }, erro => console.log(erro));
    }

    deletaEvento(){
        this._eventoService.removeEvento(this.evento)
            .subscribe(() => {
                console.log('Sucesso')
            }, erro => {
                console.log(erro)
            })
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
                          this._cameraService.postaFoto(base64, 'api/private/v1/usuario/addimagem?id='+this.evento.id)
                            .subscribe( res => {
                              console.log('sucesso upar foto');
                              this._cameraService.carregaFoto('api/private/v1/usuario/getimagem?id='+this.evento.id)
                                .then(res => {
                                  let url = this._sanitizer.bypassSecurityTrustUrl(res);
                                  this.evento.imagem = url;
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
                          this._cameraService.postaFoto(base64, 'api/private/v1/evento/addimagem?id=' + this.evento.id)
                            .subscribe( res => {
                              console.log('sucesso upar foto');
                              this._cameraService.carregaFoto('api/private/v1/evento/getimagem?id=' + this.evento.id)
                                .then(res => {
                                  let url = this._sanitizer.bypassSecurityTrustUrl(res);
                                  this.evento.imagem = url;
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

    abrePerfil(evento){
        this.navCtrl.push(PerfilPage, {entidade: evento.entidade});
    }
}