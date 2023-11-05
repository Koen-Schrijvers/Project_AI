import { Component, OnInit } from '@angular/core';
import { AsasenseService } from 'src/services/asasense.service';

@Component({
  selector: 'app-scalebar',
  templateUrl: './scalebar.component.html',
  styleUrls: ['./scalebar.component.css']
})
export class ScalebarComponent implements OnInit {
  lastMinute: number[] = []

  constructor(private asasense: AsasenseService) {

    this.asasense.GetLastMinute().subscribe((response) => {
      this.lastMinute = response.data[1]
      this.updateArrowPosition(this.AverageMinute)
    })
    
    setInterval(() => {
      this.asasense.GetLastMinute().subscribe((response) => {
        this.lastMinute = response.data[1]
        this.updateArrowPosition(this.AverageMinute)
      })
    }, 60000)
  }
  ngOnInit(): void {
   
  }
  updateArrowPosition(index: number): void {
    const arrow = document.querySelector('.arrow') as HTMLElement;
    const newPosition = index; 
    arrow.style.left = newPosition + '%';
  }

  get AverageMinute() {
    return this.asasense.calculateAverage(this.lastMinute)
  }
}
