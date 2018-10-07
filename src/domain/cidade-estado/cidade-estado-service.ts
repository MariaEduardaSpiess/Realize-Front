import { Injectable } from '@angular/core';
import { ApiConfig } from './../api/api-config';
import { Http } from '@angular/http';

@Injectable()
export class CidadeEstadoService{

    constructor(private _http: Http, private _apiCfg: ApiConfig){
        
    }

    pegaPaises(){
        
        let api = this._apiCfg.montaUrl('api/public/v1/endereco/listPaises');
        
        return this._http.get(api)
            .map(res => res.json())
            .toPromise()
    }

    pegaEstados(paisid){

        let api = this._apiCfg.montaUrl('api/public/v1/endereco/listEstados?paisid=' + paisid);

        return this._http.get(api)
            .map(res => res.json())
            .toPromise()
    }

    pegaCidades(estadoid){

        let api = this._apiCfg.montaUrl('api/public/v1/endereco/listCidades?estadoid=');

        return this._http.get(api  + estadoid)
            .map(res => res.json())
            .toPromise()
    }
}