import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CadastroPage } from '../cadastro';

@Component ({
    selector: 'page-tipo',
    templateUrl: 'tipo.html'
})

export class TipoPage {

    public tipos = [
        { nome: 'Voluntário', value: 'voluntario' },
        { nome: 'Entidade', value: 'entidade' }
    ];

    constructor(public navCtrl: NavController, public navParams: NavParams){
    }

    abreCadastro(tipo){
        console.log(tipo.value);
        this.navCtrl.push(CadastroPage, {tipoSelecionado: tipo.value});
        
    }
}