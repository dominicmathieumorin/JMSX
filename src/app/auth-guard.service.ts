
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ExchangeService } from './exchange.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public exchange: ExchangeService, public router: Router) { }
  canActivate(): boolean {
    if (!this.exchange.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}