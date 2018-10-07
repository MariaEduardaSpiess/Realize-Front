import { NavParams } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  
  
  public tabs;
  public index;
  
  constructor(private _navparam : NavParams)  {
    
      this.tabs = this._navparam.get("tabs");
      this.index = this._navparam.get("index");      
  }

}
