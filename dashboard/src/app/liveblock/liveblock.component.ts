import { Component, OnInit } from '@angular/core';
import { AsasenseService } from 'src/services/asasense.service';

@Component({
  selector: 'app-liveblock',
  templateUrl: './liveblock.component.html',
  styleUrls: ['./liveblock.component.css']
})
export class LiveblockComponent implements OnInit {

  lastMinute: number[] = []

  constructor(private asasense: AsasenseService) {

    this.asasense.GetLastMinute().subscribe((response) => {
      this.lastMinute = response.data[1]
    })

    setInterval(() => {
      this.asasense.GetLastMinute().subscribe((response) => {
        this.lastMinute = response.data[1]
        console.log('minute passed')
      })
    }, 60000)
  }

  ngOnInit(): void {

  }

  get AverageMinute() {
    return this.asasense.calculateAverage(this.lastMinute)
  }
}
