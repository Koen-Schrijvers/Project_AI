import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DayService } from 'src/services/day.service';
import { map } from 'rxjs/operators';

interface predictionTimestamp {
  first: number;
  last: number;
  prediction: number;
}

@Component({
  selector: 'app-day-lion',
  templateUrl: './day-lion.component.html',
  styleUrls: ['./day-lion.component.css']
})


export class DayLionComponent implements OnInit {

  chart: any;
  lionImage: HTMLImageElement = new Image()// Lion image
  roarTimestamps: predictionTimestamp[] = [];  // Timestamps to draw lions
  minuteInMilliseconds: number = 60000
  updateInterval: number = 4 * this.minuteInMilliseconds;

  constructor(private service: DayService, private http: HttpClient) {
    setTimeout(() => {
      
    }, 15000);
   }

  ngOnInit(): void {
    this.lionImage.src = 'assets/lion2.png';  // Set the path to your lion image
    this.loadTimestamps();
    

    this.service.GetFirstChunkDate("27").subscribe((success: boolean) => {
      if (success) {
        this.createChart();
        this.drawLionsOnChart(this.chart)
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

  getHourAndMinuteFromTimestamp(unixTimestamp:number) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
}

parseCSV(csvData: string): any[] {
    const dataEntries: any[] = [];
    const lines = csvData.split('\n');
    
    lines.forEach((line, index) => {
        if (index === 0) return; // Skip header line
        const columns = line.split(',');
        if (columns.length > 2) {
            const firstTimestamp = parseInt(columns[0]);
            const lastTimestamp = parseInt(columns[1]);
            const prediction = parseFloat(columns[2]);

            if (!isNaN(firstTimestamp) && !isNaN(lastTimestamp) && !isNaN(prediction)) {
                const firstTime = this.getHourAndMinuteFromTimestamp(firstTimestamp);
                const lastTime = this.getHourAndMinuteFromTimestamp(lastTimestamp);
                dataEntries.push({ 
                    first: firstTimestamp,
                    firstTime: firstTime, 
                    last: lastTimestamp, 
                    lastTime: lastTime, 
                    prediction 
                });
            }
        }
    });

    return dataEntries;
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
          //onComplete: () => this.drawLionsOnChart(this.chart)
        }
      }
    });
  }

  drawLionsOnChart(chart: Chart) {
    try {
      console.log("draw lions");
      const ctx = chart.canvas.getContext('2d');
      console.log(ctx)
      if (!ctx) {
          throw new Error('Canvas context is not available');
      }

      const xAxis = chart.scales['x']; 
      const yAxis = chart.scales['y'];
      
      ctx.save();
      console.log(this.roarTimestamps)
      console.log("scales:" + this.chart.scales)
      //console.log(xAxis)
      const data = this.service.unixTimeStampLion
      this.roarTimestamps.forEach(timestamp => {
          const xAs = this.service.unixTimestampToTime(timestamp.first)
          console.log("timestamp" + xAs)
          if (this.service.unixTimeStampLion.includes(xAs) && timestamp.prediction < 0.5) {
            console.log("brul gevonden")
            const index = this.service.unixTimeStampLion.indexOf(xAs);

            const x = xAxis.getPixelForValue(index);
            const y = yAxis.getPixelForValue(50);  
            ctx.drawImage(this.lionImage, x, y, 15, 15);  
          }
          
      });
      ctx.restore();
  } catch (error) {
      console.error('Error in drawLionsOnChart:', error);
  }
}
}
