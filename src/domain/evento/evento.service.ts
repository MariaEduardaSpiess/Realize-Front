import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ApiConfig } from '../api/api-config';
import { UsuarioService } from '../usuario/usuario-service';
import { Usuario } from '../usuario/usuario';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class EventoService {

    private _headers: Headers = new Headers();
    private _token: string;
    private _usuario: Usuario;

    constructor(private _http: Http, private _service: UsuarioService, private _apiCfg: ApiConfig) {

        this._service.obtemUsuarioLogado()
            .then(usuarioLogado => {
                this._usuario = usuarioLogado;
            }, err => {
                console.log(err);
            });

        this._token = localStorage.getItem('token');
        this._headers = new Headers();
        // Adiciona o tipo de conteúdo application/json 
        this._headers.append('authtoken', this._token);
        this._headers.append('Content-type', 'application/json');
    }
    
    getEventos(url){
      
        let apiUrl = this._apiCfg.montaUrl(url);

        return this._http
            .get(apiUrl, { headers : this._headers })
            .map(res => res.json())
            .toPromise()
    }

    addParticipante(evento){

        let params = {
            'eventoId': evento,
            'voluntarioId': this._usuario.id 
        }
        
        let apiUrl = this._apiCfg.montaUrl('api/private/v1/evento/addparticipante');
        
        return this._http
            .put(apiUrl, JSON.stringify(params), {headers : this._headers})
            
    }

    removeParticipante(evento){

        let params = {
            'eventoId': evento.id,
            'voluntarioId': this._usuario.id
        }

        let apiUrl = this._apiCfg.montaUrl('api/private/v1/evento/removeparticipante');
        
        return this._http
            .delete(apiUrl, new RequestOptions({ headers: this._headers, body: JSON.stringify(params) }))
    }

    criaEvento(evento){
        
        let apiUrl = this._apiCfg.montaUrl('api/private/v1/evento');
        
        evento.entidade = this._usuario.id;        

        return this._http
            .put(apiUrl, JSON.stringify(evento), { headers: this._headers })
              
    }

    editaEvento(evento){
        
        let apiUrl = this._apiCfg.montaUrl('api/private/v1/evento');
        
        evento.entidade = this._usuario.id;        

        return this._http
            .post(apiUrl, JSON.stringify(evento), { headers: this._headers })
              
    }

    removeEvento(evento){
        let apiUrl = this._apiCfg.montaUrl('api/private/v1/evento');
        evento.entidade = {"id" : this._usuario.id};
        console.log(evento);
        
        return this._http
            .delete(apiUrl, new RequestOptions({ headers: this._headers, body: JSON.stringify(evento)}))

    }

}