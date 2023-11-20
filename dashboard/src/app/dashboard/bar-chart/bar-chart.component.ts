import {Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AsasenseService } from 'src/services/asasense.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit{

  @ViewChild('indicatorLion', { static: true }) indicatorLions!: ElementRef<HTMLElement>;
  @ViewChild('indicatorBirds', { static: true }) indicatorBirds!: ElementRef<HTMLElement>;
  @Input() node: string = "17"
  lastMinuteBirds: number[] = []
  lastMinuteLions: number[] = []
  currentIndexBirds: number = 0
  currentIndexLions: number = 0
  minValue: number = 30;
  maxValue: number = 100;
  BarScale: number = this.maxValue - this.minValue;

  constructor(private asasense: AsasenseService) {}

  ngOnInit(): void {
    this.asasense.GetLastMinuteByNode("17").subscribe((response) => {
      this.lastMinuteBirds = response.data[1]
    })
    this.asasense.GetLastMinuteByNode("27").subscribe((response) => {
      this.lastMinuteLions = response.data[1]
    })
    //refresh data every minute
    setInterval(() => {
      console.log("ophaal moment")
      
      this.asasense.GetLastMinuteByNode("17").subscribe((response) => {

        this.lastMinuteBirds = response.data[1]
        this.currentIndexBirds=0
      })
      this.asasense.GetLastMinuteByNode("27").subscribe((response) => {
        this.lastMinuteLions = response.data[1]
        this.currentIndexLions=0
      })
    }, 60000)

    setInterval(()=>{
      //update arrow 
      this.updateArrowPosition(this.lastMinuteLions[this.currentIndexLions], this.lastMinuteBirds[this.currentIndexBirds] )
      this.currentIndexLions++
      this.currentIndexBirds++
      if(this.currentIndexBirds >= this.lastMinuteBirds.length){
        this.currentIndexBirds = this.lastMinuteBirds.length-1
      }
      if(this.currentIndexLions >= this.lastMinuteLions.length){
        this.currentIndexLions = this.lastMinuteLions.length-1
      }
    },125)
  }

  updateArrowPosition(Lions_dBA: number, Birds_dBA: number): void {
    const arrowBirds = this.indicatorBirds.nativeElement;
    const arrowLions = this.indicatorLions.nativeElement;
    const newPositionLions = ((Lions_dBA-this.minValue)/(this.BarScale))*100; 
    const newPositionBirds = ((Birds_dBA-this.minValue)/(this.BarScale))*100; 
    arrowBirds.style.bottom = newPositionBirds + "%";
    arrowLions.style.bottom = newPositionLions + "%";
    //text.style.bottom = newPosition + '%';

    //arrow.children[0].innerHTML = lastMinute;
    
  }
  

}
