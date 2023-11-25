import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { AsasenseService } from 'src/services/asasense.service';
import { BirdserviceService } from 'src/services/birdservice.service';
import { dailyOject } from 'src/services/interfaces/dailyobject';
import { LionserviceService } from 'src/services/lionservice.service';

@Component({
  selector: 'app-line-lion',
  templateUrl: './line-lion.component.html',
  styleUrls: ['./line-lion.component.css']
})
export class LineLionComponent implements AfterViewInit {
  chart: any;
  minuteInMilliseconds: number = 60000

  constructor(private service: LionserviceService) {

  }
  ngAfterViewInit() {

    this.service.GetWeekData("27").subscribe((success: boolean) => {
      if (success) {
        this.createChart();
        
      }
    });

  }
  createChart() {
    this.chart = new Chart("canvas", {
      type: 'line',
      data: {
        labels: this.service.unixTimeStamp,
        datasets: [
          {
            data: this.service.intervalDataDba,
            borderColor: '#8c0225',
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
              maxTicksLimit: 7,
              color: "#b6012f",
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
            suggestedMax: 80,
            ticks: {
              color: "#b6012f",
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
