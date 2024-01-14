import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DayService } from 'src/services/day.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-day-lion',
  templateUrl: './day-lion.component.html',
  styleUrls: ['./day-lion.component.css']
})
export class DayLionComponent implements OnInit {

  chart: any;
  lionImage: HTMLImageElement = new Image()// Lion image
  roarTimestamps: number[] = [];  // Timestamps to draw lions
  minuteInMilliseconds: number = 60000
  updateInterval: number = 4 * this.minuteInMilliseconds;

  constructor(private service: DayService, private http: HttpClient) { }

  ngOnInit(): void {
    this.lionImage.src = 'assets/lion2.png';  // Set the path to your lion image
    this.loadTimestamps();
    this.service.GetFirstChunkDate("27").subscribe((success: boolean) => {
      if (success) {
        this.createChart();
      //  setInterval(() => {
      //    this.service.GetLiveData("27").subscribe((success: boolean) => {
      //      if(success){
      //        this.chart.update();
      //        console.log("leeuwen update");
      //      }
      //    })
      //  }, this.updateInterval)
      }
    });
  }

  loadTimestamps() {
    this.http.get('assets/aggregated_data.csv', { responseType: 'text' })
      .pipe(
        map(csvData => this.parseCSV(csvData))
      )
      .subscribe(timestamps => {
        this.roarTimestamps = timestamps;
      });
  }

  parseCSV(csvData: string): number[] {
    const timestamps: number[] = [];
    const lines = csvData.split('\n');
    
    lines.forEach((line, index) => {
      if (index === 0) return; // Skip header line
      const columns = line.split(',');
      if (columns.length > 0) {
        const timestamp = parseInt(columns[0]);
        if (!isNaN(timestamp)) {
          timestamps.push(timestamp);
        }
      }
    });

    return timestamps;
  }

  createChart() {
    this.chart = new Chart("daylion", {
      type: 'line',
      data: {
        labels: this.service.unixTimeStampLion,
        datasets: [
          {
            data: this.service.intervalDataDbaLion,
            borderColor: '#8c0225',
            pointStyle: false,
            borderWidth : 1
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
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
        },
        animation: {
          duration: 0, // Disable animation
          onComplete: () => this.drawLionsOnChart(this.chart)
        }
      }
    });
  }

  drawLionsOnChart(chart: Chart) {
    console.log("draw lions");
    const ctx = chart.ctx;  
    const xAxis = chart.scales['x']; 
    const yAxis = chart.scales['y'];  

    ctx.save();
    this.roarTimestamps.forEach(timestamp => {
      const x = xAxis.getPixelForValue(timestamp);
      const y = yAxis.getPixelForValue(50);  // Example y-value, adjust as needed
      ctx.drawImage(this.lionImage, x, y, 30, 30);  // Adjust size as needed
    });
    ctx.restore();
  }
  
}
