import { AfterViewInit, Component } from '@angular/core';
import { AsasenseService } from 'src/services/asasense.service';
import { dailyOject } from 'src/services/interfaces/dailyobject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'dashboard';

  constructor(){
  }

  ngAfterViewInit() {
    
  }


  
}
