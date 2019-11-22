import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Trade, ExchangeService } from '../exchange.service';
import { mergeMap, tap } from 'rxjs/operators';
import * as Highcharts from 'highcharts/highstock';
const data = require('./data.json')

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  stock: string;
  trades: Trade[] = [];
  displayedColumns: (keyof Trade)[] = ['stock', 'price', 'qty'];

  Highcharts = Highcharts; // required
  chartConstructor = 'stockChart'; // optional string, defaults to 'chart'
  chartOptions = {
    navigator: {
      enabled: false
    },
    series: [{
      data: data,
      id: 'dataseries'
    }, {
      type: 'flags',
      data: [{
        x: Date.UTC(2012, 11, 1),
        title: 'BUY',
        text: 'Some event with a description'
      }, {
        x: Date.UTC(2013, 11, 12),
        title: 'SELL',
        text: 'Some event with a description'
      }, {
        x: Date.UTC(2014, 11, 22),
        title: 'SELL',
        text: 'Some event with a description'
      }],
      onSeries: 'dataseries',
      shape: 'circlepin',
      width: 16
    }],
    credits: { enabled: false }
  }; // required
  chartCallback = function (chart) { } // optional function, defaults to null
  updateFlag = false; // optional boolean
  oneToOneFlag = true; // optional boolean, defaults to false
  runOutsideAngular = false; // optional boolean, defaults to false

  constructor(private route: ActivatedRoute, private exchange: ExchangeService) { }

  ngOnInit() {
    this.route.params.pipe(
      tap(p => this.stock = p.stock),
      mergeMap(p => this.getTrades(p.stock))
    ).subscribe(trades => this.trades = trades);

  }

  getTrades(stock: string): Observable<Trade[]> {
    return this.exchange.getUserTrades(stock);
  }

}
