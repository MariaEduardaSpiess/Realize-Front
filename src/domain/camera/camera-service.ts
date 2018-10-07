import { Loading } from './../loading/loading';
import { ApiConfig } from './../api/api-config';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';

@Injectable()
export class CameraService {

    private _headers: Headers;
    private _token: string;
    private _loading;

    constructor(private _http: Http, private _camera: Camera, private _apiCfg: ApiConfig){

        this._token = localStorage.getItem('token');
        
        this._headers = new Headers();
        this._headers.set('Content-Type','text/plain');
        this._headers.set('authtoken', this._token);
    }

    escolheGaleria(){
        
        const options: CameraOptions = {
            quality: 100,
            sourceType: this._camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this._camera.DestinationType.DATA_URL,
            encodingType: this._camera.EncodingType.JPEG,
            mediaType: this._camera.MediaType.PICTURE
        }
        
        return this._camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            console.log(base64Image);
            return base64Image;
        });
    }

    tiraFoto(){
        
        const options: CameraOptions = {
            quality: 100,
            destinationType: this._camera.DestinationType.DATA_URL,
            encodingType: this._camera.EncodingType.JPEG,
            mediaType: this._camera.MediaType.PICTURE
        }
        
        return this._camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            console.log(base64Image);
            return base64Image;
        });
    }

    postaFoto(base64Image, api){
        
        let apiUrl = this._apiCfg.montaUrl(api);
        return this._http
            .post(apiUrl, base64Image, {headers : this._headers})
    }
    
    carregaFoto(api) {

        let apiUrl = this._apiCfg.montaUrl(api);
        
        return this._http.get(apiUrl, {headers : this._headers})
            .map(res => res.text())
            .toPromise()
    }
}