import {Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AsasenseService } from 'src/services/asasense.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit{

  @ViewChild('indicator', { static: true }) indicator!: ElementRef<HTMLElement>;
  @Input() node: string = "17"
  lastMinute: number[] = []
  currentIndex: number = 0

  constructor(private asasense: AsasenseService) {}

  ngOnInit(): void {

    

    this.asasense.GetLastMinuteByNode(this.node).subscribe((response) => {
      this.lastMinute = response.data[1]
    })
    //refresh data every minute
    setInterval(() => {
      this.asasense.GetLastMinuteByNode(this.node).subscribe((response) => {
        this.lastMinute = response.data[1]
        this.currentIndex=0
        
      })
    }, 60000)

    setInterval(()=>{
      //update arrow 
      this.updateArrowPosition(this.lastMinute[this.currentIndex])
      this.currentIndex++
      if(this.currentIndex >= this.lastMinute.length){
        this.currentIndex = this.lastMinute.length-1
      }


      
    },125)
  }


  updateArrowPosition(index: number): void {
    const arrow = this.indicator.nativeElement;
    const newPosition = index; 
    arrow.style.bottom = newPosition + '%';
    //text.style.bottom = newPosition + '%';

    //arrow.children[0].innerHTML = lastMinute;
    
  }
  

}
