import { Injectable } from '@angular/core';
import { ref, push, get } from 'firebase/database';
import { database } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // Save a new point
  savePoint(point: { name: string, coordinates: string, description: string }) {
    const pointsRef = ref(database, 'points');
    return push(pointsRef, point);
  }

  // Get all points (sekali ambil)
  async getPoints(): Promise<any> {
    const pointsRef = ref(database, 'points');
    const snapshot = await get(pointsRef);
    return snapshot.val();
  }

}
