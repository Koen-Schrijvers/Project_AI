import { Component, OnInit } from '@angular/core';
import { LatLng, Map, MapOptions, TileLayer, latLng } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  // Declare variables for the map and key
  options: MapOptions | undefined;
  mymap: Map | undefined;
  key = "4AtM9BWzTzzEWNjdpWWl";

  ngOnInit() {
    // Define your options
    this.options = {
      center: latLng(51.21989, 4.40346),
      zoom: 18,
    };

    // Create a map instance
    this.mymap = new Map('map', this.options);

    // Define the tile layer
    const customTileLayer = new TileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${this.key}`, {
      tileSize: 256 ,
      zoomOffset: 0,
      minZoom: 1,
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
      crossOrigin: false,
    });

    // Add the tile layer to the map
    customTileLayer.addTo(this.mymap);
  }
}
