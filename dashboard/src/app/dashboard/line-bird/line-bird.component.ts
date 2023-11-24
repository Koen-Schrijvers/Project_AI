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
              color: "#5A1A84",
              font: {
                size: 15
              }
            }
          },
          y: {
            suggestedMin: 40,
            suggestedMax: 70,
            ticks: {
              color: "#5A1A84",
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
