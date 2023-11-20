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
export class LineBirdComponent{
  chart: any;
  minuteInMilliseconds : number = 60000

  constructor(private service : BirdserviceService) {

  }
  ngAfterViewInit() {
    this.service.GetFirstChunkDate("17").subscribe((success: boolean) => {
      if (success) {
        this.createChart();
      } 
    });

    setInterval(() => {
      this.service.GetLiveData("17").subscribe((succes : boolean) => {
        if (succes){
          this.chart.update()
        }
      })
    },this.minuteInMilliseconds)
  }
  createChart(){
    this.chart = new Chart("canvasbird", {
      type: 'line', 
      data: {
        labels: this.service.unixTimeStamp, 
	       datasets: [
          {
            data:this.service.intervalDataDba,
            borderColor : '#179ef6',
            pointStyle:false,
            
          }
         ]
      },
      options:{
        animation:false,
        scales : {
          x : {
            ticks : {
              maxTicksLimit: 15,
              color : "#5A1A84",
              font : {
                size : 15
              }
            }
          },
          y : {
            suggestedMin:55,
            suggestedMax : 80,
              
            ticks : {
              color : "#5A1A84",
              font : {
                size : 15
              }
            }
          },
        },
        responsive : true,
        plugins:{legend:{
          display : false
        }}
      }
    },
  );
  }
}
