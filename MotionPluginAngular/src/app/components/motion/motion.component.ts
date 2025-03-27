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
  currentAcceleration: number = 0;
  detectionStatus: string = 'Iniciando...';
  
  // Parámetros de detección de pasos
  private stepThreshold: number = 8; // Sensibilidad de detección
  private peakThreshold: number = 10; // Umbral de pico
  private valleyThreshold: number = 6; // Umbral de valle
  
  // Variables de seguimiento
  private lastPeakTime: number = 0;
  private lastAcceleration: number[] = [];
  private isPotentialStep: boolean = false;
  private isWalking: boolean = false;

  constructor(private motionS: MotionService) {}

  ngOnInit(): void {
    this.motionS.startMotionDetection((data: MotionData) => {
      if (data.acceleration) {
        this.processAccelerometerData(
          data.acceleration.x, 
          data.acceleration.y, 
          data.acceleration.z
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection();
  }

  private processAccelerometerData(x: number, y: number, z: number) {
    // Calcular aceleración total
    const totalAcceleration = Math.sqrt(x*x + y*y + z*z);
    this.currentAcceleration = totalAcceleration;

    // Mantener un historial de las últimas aceleraciones
    this.lastAcceleration.push(totalAcceleration);
    if (this.lastAcceleration.length > 5) {
      this.lastAcceleration.shift();
    }

    // Algoritmo de detección de pasos más avanzado
    const currentTime = Date.now();
    const timeDiff = currentTime - this.lastPeakTime;

    // Detectar picos y valles
    if (this.lastAcceleration.length === 5) {
      const [a1, a2, a3, a4, a5] = this.lastAcceleration;
      
      // Identificar un posible pico
      const isPeak = (a3 > a2 && a3 > a4 && a3 > this.peakThreshold);
      
      // Identificar un posible valle
      const isValley = (a3 < a2 && a3 < a4 && a3 < this.valleyThreshold);

      // Lógica de detección de pasos
      if (isPeak && this.isPotentialStep && timeDiff > 50) {
        this.steps++;
        this.lastPeakTime = currentTime;
        this.isWalking = true;
        this.detectionStatus = '¡Caminando!';
      }

      // Actualizar estado de potencial paso
      this.isPotentialStep = isValley;
    }

    // Actualizar estado si no se detectan pasos
    if (timeDiff > 3000) {
      this.isWalking = false;
      this.detectionStatus = 'Detenido';
    }
  }

  // Método para reiniciar los pasos
  resetSteps() {
    this.steps = 0;
    this.detectionStatus = 'Reiniciado';
  }
}