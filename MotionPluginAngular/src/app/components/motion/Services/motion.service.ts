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
    try {
      // Solicitar permisos de movimiento

      // Agregar listener para datos de acelerómetro
      this.accelListener = await Motion.addListener('accel', (event) => {
        const motionData: MotionData = {
          acceleration: event.acceleration
        };
        callback(motionData);
      });
    } catch (error) {
      console.error('Error iniciando detección de movimiento:', error);
    }
  }

  async stopMotionDetection() {
    if (this.accelListener) {
      await this.accelListener.remove();
    }
  }
}
