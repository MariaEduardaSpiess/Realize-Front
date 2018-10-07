import { NavController } from 'ionic-angular';
import { Alerta } from './../../domain/alerta/alerta';
import { UsuarioService } from './../../domain/usuario/usuario-service';
import { Component } from '@angular/core';

@Component({
    selector: 'troca-senha-page',
    templateUrl: 'trocaSenha.html'
})
export class TrocaSenhaPage{

    public email: string = '';

    constructor(private _service: UsuarioService, private _alerta: Alerta, private _navCtrl: NavController){

    }
    
    trocaSenha(){
        this._service.trocaSenha(this.email);
/*        .subscribe(() => {
                this._alerta.exibeAlerta('Sucesso!', 'Uma nova senha foi enviada ao seu email', this._navCtrl.pop());
        }, error => {
                this._alerta.exibeAlerta('Erro!', 'Algo inesperado aconteceu. Tente novamente mais tarde.', '');
            });
        }, error => {
            this._alerta.exibeAlerta('Erro!', 'Algo inesperado aconteceu. Tente novamente mais tarde.', '');
        });*/
    }
}
