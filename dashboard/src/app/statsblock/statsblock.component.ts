import { Component, Input, OnInit } from '@angular/core';
import { AsasenseService } from 'src/services/asasense.service';

@Component({
  selector: 'app-statsblock',
  templateUrl: './statsblock.component.html',
  styleUrls: ['./statsblock.component.css']
})
export class StatsblockComponent implements OnInit {

  @Input() nodeNumber: string = '';

  constructor(private asasense: AsasenseService) { }

  currentdate: Date = new Date()

  months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  ngOnInit(): void {
    this.asasense.GetDataWithUnixTime(String(this.asasense.StartDayUnix), String(this.asasense.CurrentDate))
  }

  get DayText() {
    const day = this.currentdate.getUTCDate()
    const month = this.currentdate.getUTCMonth()

    return day + ' ' + this.months[month]
  }

  get Meanday() {
    return this.asasense.Meanday
  }
}
