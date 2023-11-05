import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StatsblockComponent } from './statsblock/statsblock.component';
import { HttpClientModule } from '@angular/common/http';
import { LiveblockComponent } from './liveblock/liveblock.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BarChartVolumeDisplayer9000Component } from './dashboard/bar-chart-volume-displayer9000/bar-chart-volume-displayer9000.component';

@NgModule({
  declarations: [
    AppComponent,
    StatsblockComponent,
    LiveblockComponent,
    DashboardComponent,
    BarChartVolumeDisplayer9000Component
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
