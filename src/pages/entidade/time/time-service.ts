import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { ApiConfig } from '../../../domain/api/api-config';

@Injectable()
export class TimeService {

    http: Http;
    headers: Headers;
    private _token: string;

    constructor(http: Http, private _apiCfg: ApiConfig) { 
        
        this._token = localStorage.getItem('token');
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('authtoken', this._token);
        
    }

    lista(servico) {

        let url = this._apiCfg.montaUrl(servico);            
        return this.http
            .get(url, {headers : this.headers})
            .map(res => res.json())
            .toPromise();
    }

    addVoluntario(voluntario) {
        console.log(voluntario);
        let url = this._apiCfg.montaUrl('api/private/v1/entidade/addtimevoluntario');        
        return this.http
            .put(url, (voluntario), {headers : this.headers }) 
    }

    deletaVoluntario(voluntario){
        console.log(voluntario);
        let url = this._apiCfg.montaUrl('api/private/v1/timevoluntario');
        return this.http
            .delete(url, new RequestOptions({ headers: this.headers, body: JSON.stringify(voluntario) }))
    }
}