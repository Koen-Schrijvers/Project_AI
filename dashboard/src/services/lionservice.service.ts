import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dataObject } from './interfaces/dataObject';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LionserviceService {

  constructor(private httpClient: HttpClient) {

   }

  //need for every call
  private jwtToke: string = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTcsInJvbGUiOiJzdGFuZGFyZF91c2VyIiwiaWF0IjoxNjk4MjI4MDg0LCJleHAiOjE3MDA4MjAwODR9.cVSrc8FdKFIhq965BIRepuJVjKT-6iRCM8GssTBUts0"
  private headers = { 'Authorization': this.jwtToke }

  convertUtcToLocal(hours:number = 1): Date {
    const utcDate = new Date();
    const localDate = new Date((utcDate.getTime() - (hours*60 * 60 * 1000))/1000);
    
    return localDate;
  }

  public intervalDataTime : number[] = []
  public unixTimeStamp : string [] = []
  public intervalDataDba : number[] = []

  
  GetFirstChunkDate(nodeNumber : string): Observable<boolean> {
    const startTimestamp = new Date().setHours(0,0,0) / 1000
    const endTimestamp = Date.now() / 1000
    console.log(startTimestamp)

    
    return this.httpClient.get<dataObject>(`https://api-new.asasense.com/ambient/node/${nodeNumber}/measurements/${startTimestamp}i/${endTimestamp}`, { headers: this.headers })
    .pipe(map(response => {
      this.intervalDataTime = response.data[0];
      this.unixTimeStamp = this.intervalDataTime.map(e => this.unixTimestampToTime(e))
      this.intervalDataDba = response.data[1];
      console.log(this.intervalDataDba)
      return true;
    }));
  }

  GetLiveData(nodeNumber : string): Observable<boolean> {
    const endTimestamp = Date.now() / 1000;
    const intervalInSeconds = 10;
    const startTimestamp = endTimestamp - intervalInSeconds;
    
    return this.httpClient.get<dataObject>(`https://api-new.asasense.com/ambient/node/${nodeNumber}/measurements/${startTimestamp}i/${endTimestamp}`, { headers: this.headers })
    .pipe(map(response => {
      
      this.intervalDataTime = response.data[0];
      this.unixTimeStamp.push(...this.intervalDataTime.map(e => this.unixTimestampToTime(e)))
      this.intervalDataDba.push(...response.data[1]);

      return true;
    }));
    
  }
  
  getMiddleElement(arr: number[]) : number{
    const length = arr.length;
  
    const middleIndex = Math.floor(length / 2);

    if (length % 2 === 1) {
      return arr[middleIndex];
    } else {
      return arr[middleIndex - 1];
    }
  }


  unixTimestampToTime(unixTimestamp: number): string {
    const milliseconds = unixTimestamp * 1000;
    
    const date = new Date(milliseconds);
  
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    return formattedTime;
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
