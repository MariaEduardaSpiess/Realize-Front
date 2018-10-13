import { Injectable } from '@angular/core';

@Injectable()
export class ApiConfig {

    //public baseUrl: string = 'http://familiaspiess.ddns.net:9595/';
    public baseUrl: string = 'http://ec2-34-229-45-56.compute-1.amazonaws.com:8080/';

    //public baseUrl: string = 'http://192.168.0.14:9191/';
    //public baseUrl: string = 'http://pc-duda:9191/';
    //public baseUrl: string = 'http://localhost:8080/';
    
    public montaUrl(enviroment: string){
        return this.baseUrl + enviroment;
    }
}