import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dataObject } from './interfaces/dataObject';
import { Observable, Subject, catchError, forkJoin, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LionserviceService {

  constructor(private httpClient: HttpClient) {

  }

  //need for every call
  private jwtToke: string = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTgsInJvbGUiOiJzdGFuZGFyZF91c2VyIiwiaWF0IjoxNzAwNDE5NzI2LCJleHAiOjE3MDMwMTE3MjZ9.mka3hJSZZxOEruZHS2bM1n447uqfV8OKOZozXIuUyHk"
  private headers = { 'Authorization': this.jwtToke }
  
  private completionSubject = new Subject<boolean>();

  getCompletionObservable(): Observable<boolean> {
    return this.completionSubject.asObservable();
  }

  convertUtcToLocal(hours: number = 1): Date {
    const utcDate = new Date((new Date().getTime() - (10 * 24 * 60 * 60 * 1000)));
    const localDate = new Date((utcDate.getTime() - (hours * 60 * 60 * 1000)) / 1000);

    return localDate;
  }

  public intervalDataTime: number[] = []
  public unixTimeStamp: string[] = []
  public intervalDataDba: number[] = []


  GetFirstChunkDate(nodeNumber: string): Observable<boolean> {
    const endTimestamp = Math.floor(Date.now() / 1000); // Using Math.floor to ensure an integer value
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

    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedTime = `${day.toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

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


  GetWeekData(nodeNumber: string) {
    let endTimestamp = Date.now() / 1000;
    let startTimestamp = endTimestamp - (24 * 60 * 60);
    const amountDays = 7
    const observ = []
    for (let index = 0; index < amountDays; index++) {
      observ.push(this.httpClient.get<dataObject>(`https://api-new.asasense.com/ambient/node/${nodeNumber}/measurements/${startTimestamp}i/${endTimestamp}`, { headers: this.headers }))
      endTimestamp = endTimestamp - (24 * 60 * 60);
      startTimestamp = startTimestamp  - (24 * 60 * 60);
    }
   
    return forkJoin(observ).pipe(
      map(results => {
        results.forEach((result, index) => {
          //console.log(`Result for day ${index + 1}:`, result);
          const data = this.CalculateAverageOverTimeSpan(result.data[0], result.data[1]);
        
          const arrayUnix = data.tijdArr;
          const arrayDba = data.avgDba;
          this.intervalDataDba.unshift(...arrayDba);
          this.unixTimeStamp.unshift(...arrayUnix.map(e => this.unixTimestampToTime(e)))
        });
        this.completionSubject.next(true);
        return true; // Assuming success if we reach here
      }),
      catchError(error => {
        console.error('Error in fetching week data:', error);
        return of(false); // Returning false in case of an error
      })
    );
  }

  CalculateAverageOverTimeSpan(timeArr: number[], dbArr: number[]) {
    const intervalInSeconds = 5 * 60; // 10 minutes in seconds
    const tijdArr: number[] = [];
    const avgDba: number[] = [];

    let startBlock = timeArr[0];
    let endBlock = startBlock + intervalInSeconds;

    let dbValuesSum = 0;
    let countDb = 0;

    for (let i = 0; i < timeArr.length; i++) {
        if (timeArr[i] >= startBlock && timeArr[i] <= endBlock) {
            dbValuesSum += dbArr[i];
            countDb++;
        }

        if (timeArr[i] >= endBlock) {
            // new block
            let averageOfBlock = dbValuesSum / countDb;
            avgDba.push(averageOfBlock);

            // Use the midpoint between startBlock and endBlock as the timestamp
            const midpointTimestamp = (startBlock + endBlock) / 2;
            tijdArr.push(midpointTimestamp);

            dbValuesSum = 0;
            countDb = 0;

            startBlock = timeArr[i];
            endBlock = startBlock + intervalInSeconds;
        }
    }

   
   
    return { tijdArr, avgDba };
}
}
