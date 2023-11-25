import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AsasenseService } from 'src/services/asasense.service';
import { BirdserviceService } from 'src/services/birdservice.service';
import { dailyOject } from 'src/services/interfaces/dailyobject';

@Component({
  selector: 'app-line-bird',
  templateUrl: './line-bird.component.html',
  styleUrls: ['./line-bird.component.css']
})
export class LineBirdComponent {
  chart: any;
  minuteInMilliseconds: number = 60000

  constructor(private service: BirdserviceService) {

  }
  ngAfterViewInit() {

    this.service.GetWeekData("17").subscribe((success: boolean) => {
      if (success) {
        this.createChart();
        
      }
    });

    
  }

  createChart() {
    this.chart = new Chart("canvasbird", {
      type: 'line',
      data: {
        labels: this.service.unixTimeStamp,
        datasets: [
          {
            data: this.service.intervalDataDba,
            borderColor: '#179ef6',
            pointStyle: false,

          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            ticks: {
              maxTicksLimit : 7,
              color: "#0A2463",
              font: {
                size: 15
              }
            }
          },
          y: {
            max : 80,
            title: {
              display: true,
              text: 'dBA',
              color : "#000000",
              font : {
                size : 15,
                weight : "bold",
              }
          },
            suggestedMin: 40,
            ticks: {
              color: "#0A2463",
              font: {
                size: 15
              }
            }
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    },
    );
  }
}
