import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';
import { MotionData } from '../Model/MotionData.model';



@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private accelListener?: PluginListenerHandle;

  constructor() { }

  async startMotionDetection(callback: (data: MotionData) => void) {
    // Request motion permissions
    this.accelListener = await Motion.addListener('accel', (event) => {
      const motionData: MotionData = {
        acceleration: event.acceleration
      };
      callback(motionData);
    });
  }

  async stopMotionDetection() {
    if (this.accelListener) {
      await this.accelListener.remove();
    }
  }
}
