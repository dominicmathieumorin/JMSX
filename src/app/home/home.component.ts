import { Component, OnInit } from '@angular/core';
import { Portfolio, ExchangeService, Stock } from '../exchange.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userPortfolio: Portfolio;
  teamPortfolio: Portfolio;

  displayedColumns = ["name", "qty", "avg", "realized", "unrealized", "total"];
  userTableData: Stock[] = [];
  teamTableData: Stock[] = [];

  constructor(private exchange: ExchangeService) { }

  ngOnInit() {
    this.getUserPortfolio();
    this.getTeamPortfolio();
  }

  getUserPortfolio() {
    this.exchange
      .getUserPortfolio()
      .subscribe(portfolio => {
        this.userPortfolio = portfolio;
        this.userTableData = portfolio.stocks;
      })
  }

  getTeamPortfolio() {
    this.exchange
      .getTeamPortfolio()
      .subscribe(portfolio => {
        this.teamPortfolio = portfolio;
        this.teamTableData = portfolio.stocks;
      })
  }

  getHref(stock: Stock): string {
    return `/stock/${stock.name}`;
  }

}
