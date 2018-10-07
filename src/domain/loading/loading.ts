import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class Loading {

    public loading;

    constructor(private _loadingCtrl: LoadingController){

    }

    exibirLoading() {
        this.loading = this._loadingCtrl.create({
          content: 'Carregando...'
        });
      
        this.loading.present();

        return this.loading;
    }
}