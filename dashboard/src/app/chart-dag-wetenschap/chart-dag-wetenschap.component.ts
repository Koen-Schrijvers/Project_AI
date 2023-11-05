import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AsasenseService } from 'src/services/asasense.service';
import { dailyOject } from 'src/services/interfaces/dailyobject';

@Component({
  selector: 'app-chart-dag-wetenschap',
  templateUrl: './chart-dag-wetenschap.component.html',
  styleUrls: ['./chart-dag-wetenschap.component.css']
})
export class ChartDagWetenschapComponent  {

  dailyObjects : dailyOject[] = []
  chart: any;

 
 labels : string[] = []
 data : number[] = []

 constructor(private service : AsasenseService) {
   service.GetDailyStatistics().subscribe((response) => {
     this.dailyObjects = response
     this.FilterOnDays(7)
     this.createChart()
   })
 }
 
 FilterOnDays(amountDays : number){
   this.dailyObjects = this.dailyObjects.slice(Math.max(this.dailyObjects.length-amountDays,1))

   this.labels = this.dailyObjects.map(label => {
     const date = new Date(label.day)
     console.log(date)
     const month = date.getMonth() + 1
     console.log(month)
     const day = date.getDate()
     return `${day}-${month}`
   })
   this.data = this.dailyObjects.map(value => value.LAeq)
   this.labels.forEach(e => console.log(e))
   this.data.forEach(e => console.log(e))
 }

 createChart(){
   this.chart = new Chart("canvas", {
     type: 'line', 
     data: {
       labels: this.labels, 
        datasets: [
         {
           data:this.data,
           borderColor : '#000000'
         }
        ]
     },
     options:{
       plugins:{legend:{
         display : false
       }}
     }
   },
 );
 }
}

