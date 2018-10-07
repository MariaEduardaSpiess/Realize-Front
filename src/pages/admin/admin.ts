import { Alerta } from './../../domain/alerta/alerta';
import { ApiConfig } from './../../domain/api/api-config';
import { PerfilPage } from './../perfil/perfil';
import { Usuario } from './../../domain/usuario/usuario';
import { Http, Headers } from '@angular/http';
import { NavParams, NavController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
    selector: 'page-admin',
    templateUrl: './admin.html'
})
export class AdminPage{

    public entidades;
    public aviso: string = 'Não existem entidades aguardando aprovação!';
    private _headers: Headers = new Headers;

    constructor(private _http: Http, private _navCtrl: NavController, private _apiCfg: ApiConfig, private _alerta: Alerta){
        
        let token = localStorage.getItem('token');

        this._headers.append('authtoken', token);
        
        let apiUrl = this._apiCfg.montaUrl('api/private/v1/entidade/desabilitadas');

        this._http.get(apiUrl, {headers : this._headers})
            .map(res => res.json())
            .toPromise()
            .then(res => {
                this.entidades = res;
                if(this.entidades.lenght == 0){
                    this.aviso = null;
                }
            })
    }

    abrePerfil(entidade){
        this._navCtrl.push(PerfilPage, {'entidade': entidade});
    }

    aprovarEntidade(entidade){

        this._headers.append('Content-Type', 'application/json');
        
        let apiUrl = this._apiCfg.montaUrl('api/private/v1/entidade/habilitaentidade');

        this._http.post(apiUrl, JSON.stringify(entidade), {headers : this._headers})
            .subscribe(() => {
                this._alerta.exibeAlerta('Sucesso', 'A entidade foi habilitada com sucesso!');
            }, err => {
                console.log(err);
            })
    }

}