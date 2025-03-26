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
  
  private stepThreshold: number = 10; // Sensitivity for step detection
  private lastPeakTime: number = 0;
  private lastAcceleration: number = 0;

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
    // Calculate total acceleration
    const totalAcceleration = Math.sqrt(x*x + y*y + z*z);
    this.currentAcceleration = totalAcceleration;

    // Simple step detection algorithm
    const currentTime = Date.now();
    const timeDiff = currentTime - this.lastPeakTime;

    // Check for significant change in acceleration
    if (
      Math.abs(totalAcceleration - this.lastAcceleration) > this.stepThreshold &&
      timeDiff > 300 // Prevent over-counting
    ) {
      this.steps++;
      this.lastPeakTime = currentTime;
    }

    this.lastAcceleration = totalAcceleration;
  }

  // Optional method to reset step count
  resetSteps() {
    this.steps = 0;
  }
}