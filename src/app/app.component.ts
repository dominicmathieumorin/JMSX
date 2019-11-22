import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExchangeService } from './exchange.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public router: Router, private exchange: ExchangeService) {
    
  }

  logOut() {
    this.exchange.delAuthToken();
    this.router.navigate(["/login"])
  }
}
