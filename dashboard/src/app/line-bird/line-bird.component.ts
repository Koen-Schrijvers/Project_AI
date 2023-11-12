import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AsasenseService } from 'src/services/asasense.service';
import { dailyOject } from 'src/services/interfaces/dailyobject';

@Component({
  selector: 'app-line-bird',
  templateUrl: './line-bird.component.html',
  styleUrls: ['./line-bird.component.css']
})
export class LineBirdComponent{
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
    
     const month = date.getMonth() + 1

     const day = date.getDate()
     return `${day}-${month}`
   })
   this.data = this.dailyObjects.map(value => value.LAeq)

 }

 createChart(){
   this.chart = new Chart("canvass", {
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
