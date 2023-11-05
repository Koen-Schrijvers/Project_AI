import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { dailyOject } from './interfaces/dailyobject';

@Injectable({
  providedIn: 'root'
})
export class AsasenseService {

  constructor(private httpClient: HttpClient) {
    
  }

  private jwtToke: string = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTcsInJvbGUiOiJzdGFuZGFyZF91c2VyIiwiaWF0IjoxNjk4MjI4MDg0LCJleHAiOjE3MDA4MjAwODR9.cVSrc8FdKFIhq965BIRepuJVjKT-6iRCM8GssTBUts0"
  private headers = { 'Authorization': this.jwtToke }
  private meanDay: number = 0;
  private dayDataDba: number[] = []
  private dayDataTime: number[] = []
  private lastMinuteArray: number[] = []

  private unixStartTest: string = '1698136636'
  private unixEndTest: string = '1698316451'

  private currentDate: Date = new Date()

  GetDataWithUnixTime(unixStartTime: string = this.unixStartTest, unixEndTime: string = this.unixEndTest) {
    this.httpClient.get<any>(`https://api-new.asasense.com/ambient/node/17/measurements/${unixStartTime}/${unixEndTime}`, { headers: this.headers })
      .subscribe(
        (response) => {
          this.dayDataTime = response.data[0]
          this.dayDataDba = response.data[1];
          this.meanDay = this.calculateAverage(this.dayDataDba)
        }
      );
  }

  GetLastMinute(): Observable<any> {
    const lastMinute = new Date().getTime() / 1000
    const minuteBefore = lastMinute - 120
    
    try{
      return this.httpClient.get<any>(`https://api-new.asasense.com/ambient/node/17/measurements/${minuteBefore}/${lastMinute}`, { headers: this.headers })
    } catch (error){
      console.log(error)
      throw error
    }
  }

  GetDailyStatistics(){
    try{
      var response = this.httpClient.get<dailyOject[]>(`https://api-new.asasense.com/ambient/node/17/dailystatistics`, { headers: this.headers })
      return response
    } catch (error){
      console.log(error)
      throw error
    }
  }

  get CurrentDate() {
    return Math.floor(this.currentDate.getTime() / 1000);
  }

  get Meanday() {
    return this.meanDay;
  }

  get StartDayUnix() {
    var beginDate = new Date()
    beginDate.setHours(2, 0, 0)
    return Math.floor(beginDate.getTime() / 1000);
  }

  calculateAverage(data: number[]): number {
    if (data.length === 0) {
      return 0;
    }

    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }

    return sum / data.length;
  }



}
