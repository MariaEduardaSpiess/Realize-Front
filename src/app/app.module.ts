import { EmailConfigPage } from './../pages/admin/email-config';
import { AdminPage } from './../pages/admin/admin';
import { CidadeEstadoService } from './../domain/cidade-estado/cidade-estado-service';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, NavController } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { TrocaSenhaPage } from './../pages/login/trocaSenha';
import { EditarEventoPage } from './../pages/entidade/editarEvento/editar-evento';
import { FeedPage } from '../pages/feed/feed';
import { PerfilPage } from '../pages/perfil/perfil';
import { MeusEventosPage } from '../pages/meus-eventos/meus-eventos';
import { TabsPage } from '../domain/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { CadastroPage } from '../pages/cadastro/cadastro';
import { TipoPage } from '../pages/cadastro/tipo/tipo';
import { InfosPage } from '../pages/infos/infos';
import { InicialPage } from '../pages/inicial/inicial';
import { CriarPage } from '../pages/entidade/criar/criar';
import { TimePage } from '../pages/entidade/time/time';
import { Add } from '../pages/entidade/time/add/add'

import { LogoComponent } from './../domain/logo/logo.component';
import { Alerta } from './../domain/alerta/alerta';
import { ModalEditarPerfil } from './../pages/perfil/modalEditarPerfil';

import { CameraService } from './../domain/camera/camera-service';
import { UsuarioService } from './../domain/usuario/usuario-service';
import { EventoService } from './../domain/evento/evento.service';
import { TimeService } from './../pages/entidade/time/time-service';
import { SegmentoService } from './../domain/segmento/segmento-service';
import { Loading } from './../domain/loading/loading';
import { ApiConfig } from './../domain/api/api-config';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@NgModule({
  declarations: [
    MyApp,
    FeedPage,
    PerfilPage,
    MeusEventosPage,
    TabsPage,
    LoginPage,
    CadastroPage,
    TipoPage,
    InicialPage,
    InfosPage,
    CriarPage,
    TimePage,    
    LogoComponent,
    EditarEventoPage,
    TrocaSenhaPage,
    Add,
    ModalEditarPerfil,
    AdminPage,
    EmailConfigPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FeedPage,
    PerfilPage,
    MeusEventosPage,
    TabsPage,
    LoginPage,
    CadastroPage,
    TipoPage,
    InfosPage,
    InicialPage,
    CriarPage,
    TimePage,
    EditarEventoPage,
    TrocaSenhaPage,
    Add,
    ModalEditarPerfil,
    AdminPage,
    EmailConfigPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    EventoService,
    TimeService,
    UsuarioService,
    SegmentoService,
    Alerta,
    ApiConfig,
    Loading,
    [NavController],
    Camera,
    CameraService,
    CidadeEstadoService
  ]
})
export class AppModule {}
