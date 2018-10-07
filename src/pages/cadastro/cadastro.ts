import { DomSanitizer } from '@angular/platform-browser';
import { CameraService } from './../../domain/camera/camera-service';
import { CidadeEstadoService } from './../../domain/cidade-estado/cidade-estado-service';
import { FeedPage } from './../feed/feed';
import { Loading } from './../../domain/loading/loading';
import { InicialPage } from './../inicial/inicial';
import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController, Slides, ActionSheetController } from 'ionic-angular';
import { Usuario } from '../../domain/usuario/usuario';
import { UsuarioService } from '../../domain/usuario/usuario-service';
import { Alerta } from '../../domain/alerta/alerta';
import { SegmentoService } from '../../domain/segmento/segmento-service';

@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html'
})

export class CadastroPage {

  @ViewChild('mySlider') slider: Slides;

  private _tipo : string; 
  usuario: Usuario = new Usuario();
  public segmentos;
  public entidade: boolean = false;
  public loading;
  public cidades;
  public estados;
  public paises;
  
  
  constructor(public navParams: NavParams, 
              public navCtrl: NavController,
              private _alerta: Alerta,
              private _service: UsuarioService,
              private _segmentoService: SegmentoService,
              private _loadingCtrl : Loading,
              private _serviceCidadeEstado: CidadeEstadoService,
              private _actionSheetCtrl: ActionSheetController,
              private _cameraService: CameraService,
              private _sanitizer: DomSanitizer){
  
    this._tipo = this.navParams.get('tipoSelecionado');

    if (this._tipo == 'entidade'){
      this.entidade = true;
    }
    
    this._segmentoService.buscaSegmento()
      .then(dados => {
        this.segmentos = dados;
      },
          erro => console.log(erro)
      );

    this._serviceCidadeEstado.pegaPaises()
      .then(res => {
        this.paises = res;
      });
  }

  proximo(){
    this.slider.slideNext();
  }

  cadastrar(){

    this.loading = this._loadingCtrl.exibirLoading();

    this._service.cadastraUsuario(this._tipo, this.usuario)
      .subscribe(() => {
        console.log('Usuário salvo com sucesso');
        if(this._tipo == 'voluntario'){
          this.loading.dismiss();
          this._alerta.exibeAlerta('Sucesso!', 'Voluntário cadastrado!')
          if(this._service.efetuaLogin(this.usuario.email, this.usuario.userPassword)){
            this.navCtrl.setRoot(FeedPage);
          }
        } else {
          this.loading.dismiss();
          this._alerta.exibeAlerta('Entidade aguardando aprovação', 'Entidade aguardando aprovação do administrador. Você receberá um email quando o cadastro for aprovado.')
          this.navCtrl.setRoot(InicialPage);
        }
      }, erro => {
        this.loading.dismiss();
        console.log(erro);
        this._alerta.exibeAlerta('Erro!', 'Algo inesperado aconteceu, tente novamente mais tarde')
        this.navCtrl.setRoot(InicialPage);
      });
  }

  selecionaPais(pais){
    
    this._serviceCidadeEstado.pegaEstados(pais.id)
    .then(res => {
      this.estados = res;
    })
  }

  selecionaEstado(estado){
    
    this._serviceCidadeEstado.pegaCidades(estado.id)
      .then(res => {
        this.cidades = res;
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
                this._cameraService.postaFoto(base64, 'api/private/v1/usuario/addimagem')
                  .subscribe( res => {
                    console.log('sucesso upar foto');
                    this._cameraService.carregaFoto('api/private/v1/usuario/getimagem')
                      .then(res => {
                        this.usuario.imagem = this._sanitizer.bypassSecurityTrustUrl(res);
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
                        this.usuario.imagem = this._sanitizer.bypassSecurityTrustUrl(res);
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