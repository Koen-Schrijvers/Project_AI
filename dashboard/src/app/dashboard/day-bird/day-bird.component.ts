import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DayService } from 'src/services/day.service';

@Component({
  selector: 'app-day-bird',
  templateUrl: './day-bird.component.html',
  styleUrls: ['./day-bird.component.css']
})
export class DayBirdComponent implements OnInit {

  chart: any;
  minuteInMilliseconds: number = 60000

  constructor(private service: DayService) { }

  ngOnInit(): void {
    this.service.GetFirstChunkDate("17").subscribe((success: boolean) => {
      if (success) {
        this.createChart();
      }
    });
  }

  createChart() {
    this.chart = new Chart("daybird", {
      type: 'line',
      data: {
        labels: this.service.unixTimeStamp,
        datasets: [
          {
            data: this.service.intervalDataDba,
            borderColor: '#179ef6',
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
              color: "#0A2463",
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
