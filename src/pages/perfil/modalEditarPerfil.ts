import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams, Slides } from 'ionic-angular';
import { Alerta } from './../../domain/alerta/alerta';
import { SegmentoService } from './../../domain/segmento/segmento-service';
import { UsuarioService } from './../../domain/usuario/usuario-service';
import { Usuario } from '../../domain/usuario/usuario';

@Component({
    selector: 'modal-editar-perfil',
    templateUrl: './modalEditarPerfil.html'
})
export class ModalEditarPerfil {

    @ViewChild('mySlider') slider: Slides;
    
    public usuario: Usuario;
    public segmentos;
    public novaSenha: string = '';

    constructor(private _viewCtrl: ViewController, private _navParams: NavParams, private _segmentoService: SegmentoService, private _usuarioService: UsuarioService, private _alerta: Alerta){
        
        this.usuario = this._navParams.get('usuario');

        this._segmentoService.buscaSegmento()
        .then(dados => {
          this.segmentos = dados;
        },
            erro => console.log(erro)
        );
    }

    closeModal(){
        this._viewCtrl.dismiss();
    }

    editaPerfil(trocaSenha){
        
        if(trocaSenha){
            if(this.novaSenha == this.usuario.userPassword){
                this._alerta.exibeAlerta('Senhas Iguais!', 'Sua nova senha é igual sua antiga senha.')
            } else {
                this._alerta.exibeAlerta('Senhas em branco!', 'Sua nova senha não pode ser nula.')
            }
        } else {
            
            this._usuarioService.editaUsuario(this.usuario)
                .subscribe(() => {
                    this._alerta.exibeAlerta('Sucesso', 'O seu perfil foi atualizado com sucesso!');
                    this.closeModal();
                })
        }

    }
    
    proximo(){
        this.slider.slideNext();
    }
}