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
  
  constructor(private service : BirdserviceService) {

  }
  ngAfterViewInit() {
    this.service.GetData().subscribe((success: boolean) => {
      if (success) {
        this.createChart();
      } 
    });

    setInterval(() => {
      this.service.GetLiveDate()
      this.chart.update();
    },180000)
  }
  createChart(){
    this.chart = new Chart("canvasbird", {
      type: 'line', 
      data: {
        labels: this.service.intervalDataTime, 
	       datasets: [
          {
            data:this.service.intervalDataDba,
            borderColor : '#179ef6',
            pointStyle:false,
            
          }
         ]
      },
      options:{
        scales : {
          x : {
            ticks : {
              color : "#b6012f",
              font : {
                size : 15
              }
            }
          },
          y : {
            ticks : {
              color : "#b6012f",
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
