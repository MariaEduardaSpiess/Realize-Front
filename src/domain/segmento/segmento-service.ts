import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ApiConfig } from '../api/api-config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SegmentoService {

    private _apiUrl: string;
    private _token: string;
    private _headers: Headers = new Headers();

    constructor(private _http: Http, private _apiCfg: ApiConfig){ 

        this._token = localStorage.getItem('token');        
        this._apiUrl = this._apiCfg.montaUrl('api/private/v1/segmento');
        this._headers = new Headers();
        // Adiciona o tipo de conteúdo application/json 
        this._headers.append('authtoken', this._token);
        this._headers.append('Content-Type', 'application/json');
        // Make the HTTP request:
    }

    buscaSegmento(){

        return this._http
            .get(this._apiUrl, {headers : this._headers})
            .map(res => res.json())
            .toPromise();
    }
}