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
export class LineLionComponent implements AfterViewInit{
  chart: any;
  minuteInMilliseconds : number = 60000
  
  constructor(private service : LionserviceService) {

  }
  ngAfterViewInit() {
    this.service.GetFirstChunkDate("27").subscribe((success: boolean) => {
      if (success) {
        this.createChart();
      } 
    });

    setInterval(() => {
      this.service.GetLiveData("27").subscribe((succes : boolean) => {
        if (succes){
          this.chart.update()
        }
      })
    },this.minuteInMilliseconds)
  }
  createChart(){
    this.chart = new Chart("canvas", {
      type: 'line', 
      data: {
        labels: this.service.unixTimeStamp, 
	       datasets: [
          {
            data:this.service.intervalDataDba,
            borderColor : '#fb991a',
            pointStyle:false,
            
          }
         ]
      },
      options:{
        scales : {
          x : {
            ticks : {
              color : "#b6012f"
            }
          },
          y : {
            suggestedMin:50,
            suggestedMax : 90,
              
            ticks : {
              color : "#b6012f"
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
