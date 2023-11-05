import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto'; // Import 'chart.js/auto' for Chart.js v3
import { AsasenseService } from 'src/services/asasense.service';
import { dailyOject } from 'src/services/interfaces/dailyobject';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent{
  title = 'ng-chart';
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
            borderColor : '#CD5C5C'
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
