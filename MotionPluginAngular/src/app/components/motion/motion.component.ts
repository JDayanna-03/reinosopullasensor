import { Component, OnInit, OnDestroy } from '@angular/core';
import { MotionService } from './Services/motion.service';
import { MotionData } from './Model/MotionData.model';

@Component({
  selector: 'app-motion',
  templateUrl: './motion.component.html',
  styleUrl: './motion.component.scss'
})
export class MotionComponent implements OnInit, OnDestroy {
  steps: number = 0;
  totalAcceleration: number = 0;
  stepThreshold: number = 20; // Ajusta este valor según tu dispositivo

  // Variables para detección de pasos
  private lastAcceleration: number = 0;
  private lastStepTime: number = 0;
  private stepDetected: boolean = false;

  constructor(private motionS: MotionService) {}

  ngOnInit(): void {
    this.startStepDetection();
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection();
  }

  private startStepDetection() {
    this.motionS.startMotionDetection((data: MotionData) => {
      if (data.acceleration) {
        this.processMotionData(
          data.acceleration.x, 
          data.acceleration.y, 
          data.acceleration.z
        );
      }
    });
  }

  private processMotionData(x: number, y: number, z: number) {
    // Calcular la aceleración total
    const acceleration = Math.sqrt(x*x + y*y + z*z);
    this.totalAcceleration = acceleration;

    const currentTime = Date.now();

    // Detectar pasos basado en cambios de aceleración
    if (
      Math.abs(acceleration - this.lastAcceleration) > this.stepThreshold && 
      (currentTime - this.lastStepTime) > 250 // Prevenir sobre-conteo
    ) {
      this.steps++;
      this.lastStepTime = currentTime;
      this.stepDetected = true;
    }

    this.lastAcceleration = acceleration;
  }

  resetSteps() {
    this.steps = 0;
  }
}