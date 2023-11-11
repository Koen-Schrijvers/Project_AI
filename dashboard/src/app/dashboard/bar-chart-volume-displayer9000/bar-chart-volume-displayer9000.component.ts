import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-bar-chart-volume-displayer9000',
  templateUrl: './bar-chart-volume-displayer9000.component.html',
  styleUrls: ['./bar-chart-volume-displayer9000.component.css']
})
export class BarChartVolumeDisplayer9000Component implements OnInit {
  @ViewChild('barGraph') barGraph!: ElementRef;
  @ViewChild('latestDBA') latestDBA!: ElementRef;
  private ws!: WebSocket;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    // It's assumed that generateGradient function is defined somewhere in your code
    // let tertBarChartCtx = this.barGraph.nativeElement.getContext('2d');
    // ... (rest of the chart initialization code)

    this.initializeWebSocket();
  }

  initializeWebSocket(): void {
    this.ws = new WebSocket('ws://localhost:8080');

    this.ws.addEventListener('open', () => {
      console.log('Connected to server');
      this.ws.send('Hello, server!');
    });

    this.ws.addEventListener('message', (event) => {
      console.log(`Received message: ${event.data}`);
      const data = JSON.parse(event.data);

      if (!data) return;

      this.updateBarGraph(data);
      this.updateLatestDBA(data.dBA);
    });

    this.ws.addEventListener('error', (event) => {
      console.error('WebSocket error:', event);
    });

    this.ws.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event);
    });
  }

  updateBarGraph(data: { dBA: number }): void {
    const minDBA = 40;
    const maxDBA = 80;
    let normalizedDBA = (data.dBA - minDBA) / (maxDBA - minDBA);
    normalizedDBA = Math.min(Math.max(normalizedDBA, 0), 1);

    const maxGraphHeight = 300; // Height of the bar graph in pixels
    const barHeight = maxGraphHeight * normalizedDBA;

    this.renderer.setStyle(this.barGraph.nativeElement.firstChild, 'height', `${barHeight}px`);
  }

  updateLatestDBA(dBA: number): void {
    this.latestDBA.nativeElement.innerText = `${dBA.toPrecision(3)} dBA`;
  }
}
