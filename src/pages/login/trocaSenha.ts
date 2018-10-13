import { UsuarioService } from './../../domain/usuario/usuario-service';
import { Component } from '@angular/core';

@Component({
    selector: 'troca-senha-page',
    templateUrl: 'trocaSenha.html'
})
export class TrocaSenhaPage{

    public email: string = '';

    constructor(private _service: UsuarioService){

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
