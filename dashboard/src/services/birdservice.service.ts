import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dataObject } from './interfaces/dataObject';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BirdserviceService {

  constructor(private httpClient: HttpClient) {

  }

  //need for every call
  private jwtToke: string = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTcsInJvbGUiOiJzdGFuZGFyZF91c2VyIiwiaWF0IjoxNjk4MjI4MDg0LCJleHAiOjE3MDA4MjAwODR9.cVSrc8FdKFIhq965BIRepuJVjKT-6iRCM8GssTBUts0"
  private headers = { 'Authorization': this.jwtToke }
  convertUtcToLocal(hours: number = 1): Date {
    const utcDate = new Date();
    const localDate = new Date((utcDate.getTime() - (hours * 60 * 60 * 1000)) / 1000);

    return localDate;
  }

  public intervalDataTime: number[] = []
  public unixTimeStamp: string[] = []
  public intervalDataDba: number[] = []


  GetFirstChunkDate(nodeNumber: string): Observable<boolean> {
    const endTimestamp = Math.floor(Date.now() / 1000);
    const startTimestamp = endTimestamp - (2 * 60 * 60);

    return this.httpClient.get<dataObject>(`https://api-new.asasense.com/ambient/node/${nodeNumber}/measurements/${startTimestamp}i/${endTimestamp}`, { headers: this.headers })
      .pipe(map(response => {
        this.intervalDataTime = response.data[0];
        this.unixTimeStamp = this.intervalDataTime.map(e => this.unixTimestampToTime(e))
        this.intervalDataDba = response.data[1];
        return true;
      }));
  }

  GetLiveData(nodeNumber: string): Observable<boolean> {
    const endTimestamp = Date.now() / 1000;
    const intervalInSeconds = 60;
    const startTimestamp = endTimestamp - intervalInSeconds;
    console.log(this.intervalDataDba.length)
    return this.httpClient.get<dataObject>(`https://api-new.asasense.com/ambient/node/${nodeNumber}/measurements/${startTimestamp}i/${endTimestamp}`, { headers: this.headers })
      .pipe(map(response => {

        this.intervalDataTime = response.data[0];
        this.unixTimeStamp.push(...this.intervalDataTime.map(e => this.unixTimestampToTime(e)))
        this.intervalDataDba.push(...response.data[1]);

        return true;
      }));

  }

  getMiddleElement(arr: number[]): number {
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





  //week data
  public dataTime: number[] = []
  public dataDba: number[] = []

  GetWeekData(nodeNumber: string): Observable<boolean> {
    const endTimestamp = Date.now() / 1000;
    const startTimestamp = endTimestamp - (24 * 60 * 60);
    const amountDays = 2
    console.log("weekdata")
    const observ = []
    for (let index = 0; index < amountDays; index++) {
      observ.push(this.httpClient.get<dataObject>(`https://api-new.asasense.com/ambient/node/${nodeNumber}/measurements/${startTimestamp}i/${endTimestamp}`, { headers: this.headers }))
    }
    forkJoin(observ).subscribe((results) => {
      results.forEach((result, index) => {
        //dus nog berekenen van gemiddelde van 5minuten
        console.log(`Result for day ${index + 1}:`, result);
        this.CalculateAverageOverTimeSpan(result.data[0], result.data[1])
      });
    });
  }

  CalculateAverageOverTimeSpan(timeArr: number[], dbArr: number[]) {
    const intervalInSeconds = 5 * 60; // 5 minutes in seconds

    // Ensure that timeArr and dbArr have the same length
    if (timeArr.length !== dbArr.length) {
      throw new Error('Arrays must have the same length');
    }

    const result = [];

    for (let i = 0; i < timeArr.length; i++) {
      const startTime = timeArr[i];
      const endTime = startTime + intervalInSeconds;

      let sumDB = 0;
      let count = 0;

      // Loop through the data within the time span
      for (let j = 0; j < timeArr.length; j++) {
        if (timeArr[j] >= startTime && timeArr[j] < endTime) {
          sumDB += dbArr[j];
          count++;

        }
      }

      // Calculate the average for the time span
      const averageDB = count > 0 ? sumDB / count : 0;

      // Store the result with the midpoint timestamp of the time span
      const midpointTimestamp = startTime + intervalInSeconds / 2;

      this.dataTime.push(midpointTimestamp)
      this.dataDba.push(averageDB)

    }

  }
}
