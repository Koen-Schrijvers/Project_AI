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
import { DashboardComponent } from './dashboard/dashboard.component';
import { BarChartVolumeDisplayer9000Component } from './dashboard/bar-chart-volume-displayer9000/bar-chart-volume-displayer9000.component';
import { OorzaakdashboardComponent } from './oorzaakdashboard/oorzaakdashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    StatsblockComponent,
    LiveblockComponent,
    DashboardComponent,
    BarChartVolumeDisplayer9000Component,
    NavbarComponent,
    ChartComponent,
    ScalebarComponent,
    MapComponent,
    DashboardComponent,
    OorzaakdashboardComponent
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
