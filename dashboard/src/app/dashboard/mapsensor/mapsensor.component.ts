import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapsensor',
  templateUrl: './mapsensor.component.html',
  styleUrls: ['./mapsensor.component.css']
})
export class MapsensorComponent implements OnInit {

  @Input() mapsrc : string = ""

  constructor() { }

  ngOnInit(): void {
  }

}
