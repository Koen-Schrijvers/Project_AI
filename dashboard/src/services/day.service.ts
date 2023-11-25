import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { dataObject } from './interfaces/dataObject';

@Injectable({
  providedIn: 'root'
})
export class DayService {

  constructor(private httpClient: HttpClient) {

  }

  //need for every call
  private jwtToke: string = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTgsInJvbGUiOiJzdGFuZGFyZF91c2VyIiwiaWF0IjoxNzAwNDE5NzI2LCJleHAiOjE3MDMwMTE3MjZ9.mka3hJSZZxOEruZHS2bM1n447uqfV8OKOZozXIuUyHk"
  private headers = { 'Authorization': this.jwtToke }

  private completionSubject = new Subject<boolean>();

  getCompletionObservable(): Observable<boolean> {
    return this.completionSubject.asObservable();
  }

  public intervalDataTime: number[] = []
  public unixTimeStamp: string[] = []
  public intervalDataDba: number[] = []
  
  GetFirstChunkDate(nodeNumber: string): Observable<boolean> {
    const endTimestamp = Math.floor(Date.now() / 1000); // Using Math.floor to ensure an integer value
    const startTimestamp = new Date().setHours(5,0,0) / 1000

    return this.httpClient.get<dataObject>(`https://api-new.asasense.com/ambient/node/${nodeNumber}/measurements/${startTimestamp}i/${endTimestamp}`, { headers: this.headers })
      .pipe(map(response => {
        this.intervalDataTime = response.data[0];
        this.unixTimeStamp = this.intervalDataTime.map(e => this.unixTimestampToTime(e))
        this.intervalDataDba = response.data[1];

        this.completionSubject.next(true);
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

  unixTimestampToTime(unixTimestamp: number): string {
    const milliseconds = unixTimestamp * 1000;

    const date = new Date(milliseconds);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return formattedTime;
  }
}
