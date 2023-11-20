import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StatsblockComponent } from './statsblock/statsblock.component';
import { HttpClientModule } from '@angular/common/http';
import { LiveblockComponent } from './liveblock/liveblock.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ChartComponent } from './chart/chart.component';
import { ScalebarComponent } from './scalebar/scalebar.component';
import { MapComponent } from './map/map.component';
import { PiechartComponent } from './piechart/piechart.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OorzaakdashboardComponent } from './oorzaakdashboard/oorzaakdashboard.component';
import { ChartDagWetenschapComponent } from './chart-dag-wetenschap/chart-dag-wetenschap.component';
import { LineBirdComponent } from './dashboard/line-bird/line-bird.component';
import { BarChartComponent } from './dashboard/bar-chart/bar-chart.component';
import { LineLionComponent } from './dashboard/line-lion/line-lion.component';
import { MapsensorComponent } from './dashboard/mapsensor/mapsensor.component';

@NgModule({
  declarations: [
    AppComponent,
    StatsblockComponent,
    LiveblockComponent,
    DashboardComponent,
    NavbarComponent,
    ChartComponent,
    ScalebarComponent,
    MapComponent,
    PiechartComponent,
    SearchbarComponent,
    OorzaakdashboardComponent,
    ChartDagWetenschapComponent,
    LineBirdComponent,
    BarChartComponent,
    LineLionComponent,
    MapsensorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
