import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { AsasenseService } from 'src/services/asasense.service';
import { dailyOject } from 'src/services/interfaces/dailyobject';
import { LionserviceService } from 'src/services/lionservice.service';

@Component({
  selector: 'app-line-lion',
  templateUrl: './line-lion.component.html',
  styleUrls: ['./line-lion.component.css']
})
export class LineLionComponent implements AfterViewInit{
  chart: any;
  
  constructor(private service : LionserviceService) {

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
    this.chart = new Chart("canvas", {
      type: 'line', 
      data: {
        labels: this.service.intervalDataTime, 
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
