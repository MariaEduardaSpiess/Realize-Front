import { NavController } from 'ionic-angular';
import { Alerta } from './../alerta/alerta';
import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { Usuario } from './usuario';
import { ApiConfig } from '../api/api-config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UsuarioService {

    private _token: string;
    private _headers: Headers = new Headers();
    private pass;
    
    constructor(private _http: Http, private _apiCfg: ApiConfig, private _alerta: Alerta, private _navCtrl: NavController) {
        this._headers = new Headers();
        this._headers.set('Content-type', 'application/json');
    }

    public efetuaLogin(username: string, password: string) {

        let jsonParam : any = JSON.stringify({"username" : username, "password" : password}); 
        console.log(jsonParam);

        let api: string = this._apiCfg.montaUrl("api/login");

        return this._http.post(api, jsonParam, { headers : this._headers })
            .map((res) => {                     
                    var token = res.headers.get('authtoken');
                    if (token) {
                        localStorage.setItem('token', token);
                        return true;
                    } else {
                        return false;
                    }
                });
    }

    obtemUsuarioLogado() {

        this._token = localStorage.getItem('token');

        let api: string = this._apiCfg.montaUrl("api/private/v1/usuario/findByToken");
        // Adiciona o tipo de conteúdo application/json 
        this._headers.set('authtoken', this._token);
        return this._http
            .get(api, { headers : this._headers })
            .map(res => res.json())
            .toPromise()
            
    }

    cadastraUsuario(tipo, usuario: Usuario){

        console.log(usuario);
        let apiUrl: string = this._apiCfg.montaUrl('api/private/v1/' + tipo + '/register');

        return this._http
          .put(apiUrl, JSON.stringify(usuario), { headers: this._headers })
    }

    editaUsuario(usuario){
        let tipo;
        if(usuario.tipo == 'E'){
            tipo = 'entidade';
        }else{
            tipo = 'voluntario';
        }

        let apiUrl: string = this._apiCfg.montaUrl('api/private/v1/'+tipo);
        this._headers.set('authtoken', this._token);
        console.log(usuario);
        return this._http.post(apiUrl, JSON.stringify(usuario), {headers : this._headers});

    }

    getImagemPerfil() {
        this._token = localStorage.getItem('token');
        let api = this._apiCfg.montaUrl("api/private/v1/usuario/getimagem");
        // Adiciona o tipo de conteúdo application/json 
        this._headers.set('authtoken', this._token);
        return this._http
            .get(api, { headers : this._headers })
            .map(res => res.json())
            .toPromise()
    }

    trocaSenha(email){

        this.findByEmail(email).then(user => {
            let params = {
                mailTo: email,
                mailSubject: 'Recuperação de senha',
                mailMessage: 'Sua senha é: ' + user.userPassword
            };
            let api = this._apiCfg.montaUrl('api/private/v1/sendmail/send');
            return this._http.put(api, JSON.stringify(params), {headers : this._headers})
            .subscribe(() => {
                if(this._alerta.exibeAlerta('Sucesso!', 'Sua senha foi enviada ao seu email')){
                    this._navCtrl.pop();
                };
            }, error => {
                    this._alerta.exibeAlerta('Erro!', 'Algo inesperado aconteceu. Tente novamente mais tarde.');
                });
    
            });
    }

    findByEmail(email) {
        let params = {
            "username" : email
        };
        let api = this._apiCfg.montaUrl('api/private/v1/usuario/findByEmail');
        
        return this._http.put(api, JSON.stringify(params), {headers : this._headers})
                            .map(res => res.json())
                            .toPromise();

    }

    getPass() {
        return this.pass;
    }
}