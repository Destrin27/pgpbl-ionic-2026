import { Component, OnInit, inject } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../data.service';

const iconUrl = 'assets/icon/marker-icon.png';



const iconDefault = L.icon({

  iconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: false,
})
export class MapsPage implements OnInit {

  map!: L.Map;
  pointsLayer = L.layerGroup();   // <-- tambahan: wadah marker dari Firebase

  private dataService = inject(DataService);

  constructor() { }

  ngOnInit() {
    if (!this.map) {
      setTimeout(() => {
        this.map = L.map('map').setView([-7.7956, 110.3695], 13);

        var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        });

        osm.addTo(this.map);

        this.pointsLayer.addTo(this.map);   // <-- tambahan

        // marker
        L.marker([-7.7956, 110.3695]).addTo(this.map)
          .bindPopup('yogyakarta')
          .openPopup();

        this.loadPoints();
      });
    }
  }

  // <-- tambahan: dipanggil setiap kali halaman ditampilkan lagi
  ionViewWillEnter() {
    if (this.map) {
      this.map.invalidateSize();
      this.loadPoints();
    }
  }

  async loadPoints() {
    try {
      const points: any = await this.dataService.getPoints();
      console.log('points dari firebase:', points);

      this.pointsLayer.clearLayers();   // <-- tambahan: hindari marker dobel

      for (const key in points) {
        if (points.hasOwnProperty(key)) {
          const point = points[key];
          const coordinates = point.coordinates.split(',').map((c: string) => parseFloat(c));
          const marker = L.marker(coordinates as L.LatLngExpression).addTo(this.pointsLayer);
          marker.bindPopup(`${point.name}`);
        }
      }

      this.map.on('popupopen', (e) => {
        const popup = e.popup;
      });
    } catch (error) {
      console.error('Gagal memuat points:', error);
    }
  }

}
