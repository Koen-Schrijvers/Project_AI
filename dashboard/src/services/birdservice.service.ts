import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dataObject } from './interfaces/dataObject';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';

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
  public unixTimeStamp: number[] = []
  public intervalDataDba: number[] = []


  GetFirstChunkDate(nodeNumber: string): Observable<boolean> {
    let endTimestamp = Math.floor(Date.now() / 1000);
    let startTimestamp = endTimestamp - (12 * 60 * 60);


    const observ = []
    for (let index = 0; index < 2; index++) {
      observ.push(this.httpClient.get<dataObject>(`https://api-new.asasense.com/ambient/node/${nodeNumber}/measurements/${startTimestamp}i/${endTimestamp}`, { headers: this.headers }))
      endTimestamp = endTimestamp - (12 * 60 * 60);
      startTimestamp = startTimestamp - (12 * 60 * 60);
      console.log("loop: " + index + " van: " + this.unixTimestampToTime(startTimestamp) + " tot: " + this.unixTimestampToTime(endTimestamp))
    }

    return forkJoin(observ).pipe(
      map(responses => {
        responses.forEach(response => {
          // Process each response
          const data = this.CalculateAverageOverTimeSpan(response.data[0], response.data[1])
          console.log("data" + data)
          this.unixTimeStamp.push(...data.tijdArr);
          this.intervalDataDba.push(...data.avgDba);
          console.log("lengte: " + this.intervalDataDba.length)
        });
        return true;
      }))
  }


  unixTimestampToTime(unixTimestamp: number): string {
    const milliseconds = unixTimestamp * 1000;

    const date = new Date(milliseconds);

    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedTime = `${day.toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return formattedTime;
  }

  //week data
  public dataTime: number[] = []
  public dataTimeConverted: string[] = []
  public dataDba: number[] = []

  GetWeekData(nodeNumber: string) {
    const endTimestamp = Date.now() / 1000;
    const startTimestamp = endTimestamp - (2 * 60 * 60);
    const amountDays = 1
    console.log("weekdata")
    const observ = []
    for (let index = 0; index < amountDays; index++) {
      observ.push(this.httpClient.get<dataObject>(`https://api-new.asasense.com/ambient/node/${nodeNumber}/measurements/${startTimestamp}i/${endTimestamp}`, { headers: this.headers }))
    }
    return forkJoin(observ).pipe(
      map(results => {
        results.forEach((result, index) => {
          console.log(`Result for day ${index + 1}:`, result);
          this.CalculateAverageOverTimeSpan(result.data[0], result.data[1]);
        });
        return true; // Assuming success if we reach here
      }),
      catchError(error => {
        console.error('Error in fetching week data:', error);
        return of(false); // Returning false in case of an error
      })
    );
  }

  CalculateAverageOverTimeSpan(timeArr: number[], dbArr: number[]) {
    const intervalInSeconds = 1 * 10 * 60; // 5 minutes in seconds
    let tijdArr = []
    let avgDba = []


    for (let i = 0; i < timeArr.length; i++) {
      const startTime = timeArr[i];
      const endTime = startTime + intervalInSeconds;

      let sumDB = 0;
      let count = 0;

      // Loop through the data within the time span
      for (let j = i; j < timeArr.length; j++) {
        if (timeArr[j] >= startTime && timeArr[j] < endTime) {
          sumDB += dbArr[j];
          count++;

        }
        if (timeArr[j] >= endTime) {
          break;
        }

      }

      // Calculate the average for the time span
      const averageDB = count > 0 ? sumDB / count : 0;

      // Store the result with the midpoint timestamp of the time span
      const midpointTimestamp = startTime + intervalInSeconds / 2;
      tijdArr.push(midpointTimestamp)
      console.log(tijdArr)
      avgDba.push(averageDB)

    }
    return { tijdArr, avgDba }

  }
}
