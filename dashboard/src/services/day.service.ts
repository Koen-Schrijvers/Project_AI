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
  private jwtToke: string = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTgsInJvbGUiOiJzdGFuZGFyZF91c2VyIiwiaWF0IjoxNzA0NDE3MTU2LCJleHAiOjE3MDcwMDkxNTZ9.k1-RP99I_ZnzPNUUe2s3uKdL1cAB5famFQx0C9YxhH8"
  private headers = { 'Authorization': this.jwtToke }

  private completionSubject = new Subject<boolean>();

  private month : number = 105 * 24 * 60 * 60

  getCompletionObservable(): Observable<boolean> {
    return this.completionSubject.asObservable();
  }

  public intervalDataTime: number[] = []
  public unixTimeStamp: string[] = []
  
  public unixTimeStampLion: string[] = []
  public unixTimeStampBird: string[] = []

  public intervalDataDba: number[] = [] // maar 1 var voor beide?

  public intervalDataDbaBird: number[] = []
  public intervalDataDbaLion: number[] = []

  GetFirstChunkDate(nodeNumber: string): Observable<boolean> {
    //const endTimestamp = Math.floor(Date.now() / 1000); // Using Math.floor to ensure an integer value
    //const startTimestamp = new Date((new Date().getTime() - (10 * 24 * 60 * 60 * 1000))).setHours(5,0,0) / 1000

    const startDate = new Date('2023-10-02T00:00:00Z'); // Start of October 2nd, 2023 in UTC
    const endDate = new Date('2023-10-02T23:59:59Z'); // End of October 2nd, 2023 in UTC

    const endTimestamp = (Math.floor(endDate.getTime() / 1000)) //-this.month;
    const startTimestamp = (startDate.setHours(0,0,0) / 1000)//- this.month;


    return this.httpClient.get<dataObject>(`https://api-new.asasense.com/ambient/node/${nodeNumber}/measurements/${startTimestamp}i/${endTimestamp}`, { headers: this.headers })
      .pipe(map(response => {
        let intervalDataTime: number[] = response.data[0]
        if (nodeNumber == "17") {
          this.intervalDataDbaBird = response.data[1]
          this.unixTimeStampBird = intervalDataTime.map(e => this.unixTimestampToTime(e))
        }
        else {
          this.intervalDataDbaLion = response.data[1]
          this.unixTimeStampLion = intervalDataTime.map(e => this.unixTimestampToTime(e))
        }
        //this.unixTimeStamp = this.intervalDataTime.map(e => this.unixTimestampToTime(e))
        //this.intervalDataDba = response.data[1];

        this.completionSubject.next(true);
        return true;
      }));
  }

  GetLiveData(nodeNumber: string): Observable<boolean> {
    const endTimestamp = Date.now() / 1000;
    const intervalInSeconds = 4 * 60;
    const startTimestamp = endTimestamp - intervalInSeconds;

  

    return this.httpClient.get<dataObject>(`https://api-new.asasense.com/ambient/node/${nodeNumber}/measurements/${startTimestamp}i/${endTimestamp}`, { headers: this.headers })
      .pipe(map(response => {
        let intervalDataTime: number[] = response.data[0]
        if (nodeNumber == "17") {
          this.intervalDataDbaBird.push(...response.data[1]);
          this.unixTimeStampBird.push(...intervalDataTime.map(e => this.unixTimestampToTime(e)))
        }
        else {
          this.intervalDataDbaLion.push(...response.data[1]);
          this.unixTimeStampLion.push(...intervalDataTime.map(e => this.unixTimestampToTime(e)))
        }

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
  unixTimestampToTimeString(unixTimestamp: string): string {
    // Parse the input string to a number
    const timestampNumber = parseFloat(unixTimestamp);
    
    // Check if parsing was successful
    if (isNaN(timestampNumber)) {
      return 'Invalid Timestamp';
    }
  
    // Convert the timestamp to milliseconds
    const milliseconds = timestampNumber * 1000;
  
    const date = new Date(milliseconds);
  
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
    return formattedTime;
  }
}
