import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit {

  chart: any;
  constructor() { }

  ngOnInit(): void {
    this.createChart()
  }
  items: any[] = [
    { label: 'natuur', value: 30 },
    { label: 'wegverkeer', value: 20 },
    { label: 'spoorverkeer', value: 10},
    { label: 'achtergrond', value: 40}
  ];
  createChart(){
    this.chart = new Chart("MyChart", {
      type: 'doughnut', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['natuur', 'wegverkeer','spoorverkeer','achtergrond'],
	       datasets: [{
    label: 'My First Dataset',
    data: [300, 240, 100, 432],
    backgroundColor: [
      'red',
      'pink',
      'green',
			'yellow'		
    ],
    hoverOffset: 4
  }],
      },
      options: {
        plugins : {
          legend:{
            display : false
          }
        },
        aspectRatio:2.5
      }

    });
  }
}
