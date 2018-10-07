import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class Alerta{

    constructor(private _alertCtrl: AlertController){
        
    }

    exibeAlerta(title: string, msg: string){

        this._alertCtrl.create({
            title: title,
            subTitle: msg,
            buttons: [{ 
                text: 'Ok'
            }]
        }).present();

    }
}