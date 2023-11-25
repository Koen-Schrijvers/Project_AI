import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DayService } from 'src/services/day.service';

@Component({
  selector: 'app-day-lion',
  templateUrl: './day-lion.component.html',
  styleUrls: ['./day-lion.component.css']
})
export class DayLionComponent implements OnInit {

  chart: any;
  minuteInMilliseconds: number = 60000
  updateInterval: number = 5 * this.minuteInMilliseconds; // 5 minutes in milliseconds

  constructor(private service: DayService) { }

  ngOnInit(): void {
    this.service.GetFirstChunkDate("27").subscribe((success: boolean) => {
      if (success) {
        this.createChart();

        setInterval(() => {
          this.service.GetLiveData("27").subscribe((success: boolean) => {
            if(success){
              this.chart.update();
              console.log("leeuwen update")
            }
          })
        },this.updateInterval)
      }
    });
    
  }
  createChart() {
    this.chart = new Chart("daylion", {
      type: 'line',
      data: {
        labels: this.service.unixTimeStamp,
        datasets: [
          {
            data: this.service.intervalDataDba,
            borderColor: '#8c0225',
            pointStyle: false,
            borderWidth : 1
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            ticks: {
              color: "#b6012f",
              font: {
                size: 15
              }
            }
          },
          y: {
            min : 40,
            max : 90,
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
            suggestedMax: 70,
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
