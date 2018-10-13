import { Alerta } from './../../domain/alerta/alerta';
import { ApiConfig } from './../../domain/api/api-config';
import { Http, Headers } from '@angular/http';
import { Component } from '@angular/core';

@Component({
    selector: 'page-email-config',
    templateUrl: './email-config.html'
})
export class EmailConfigPage{

    private _headers: Headers = new Headers;
    private _apiUrl;
    public protocolo: string;

    public cfgEmail = {
        hostName: '',
        smtpPort: 0,
        ssl: false,
        tls: false,
        charSet: '',
        userName: '',
        password: '',
        mailFrom: '',
        mailAdm: ''
    }

    constructor(private _http: Http, private _apiCfg: ApiConfig, private _alerta: Alerta){
        
        let token = localStorage.getItem('token');

        this._headers.append('authtoken', token);
        this._headers.append('Content-Type', 'application/json');

        this._apiUrl = this._apiCfg.montaUrl('api/private/v1/config/email');

        this._http.get(this._apiUrl, {headers : this._headers})
            .map(res => res.json())
            .toPromise()
            .then(res => {
                this.cfgEmail = res;
                console.log(res);
                console.log(this.cfgEmail);
                console.log('sucesso get cfg');
            })
    }

    salvarCfg(){

        if(this.protocolo == 'SSL'){
            this.cfgEmail.ssl = true;
            this.cfgEmail.tls = false;

            this._http.post(this._apiUrl, JSON.stringify(this.cfgEmail), {headers : this._headers})
            .subscribe(() => {
                console.log('sucesso alteração config');
            }, err => {
                console.log(err);
            })
        } else {
            this.cfgEmail.ssl = false;
            this.cfgEmail.tls = true;

            this._http.post(this._apiUrl, JSON.stringify(this.cfgEmail), {headers : this._headers})
            .subscribe(() => {
                this._alerta.exibeAlerta('Sucesso!', 'Sucesso na mudança das configurações!')
            }, err => {
                console.log(err);
            })
        }
        
    }

}