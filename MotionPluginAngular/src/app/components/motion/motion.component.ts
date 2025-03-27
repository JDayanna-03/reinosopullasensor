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
  acceleration: number = 0;
  private stepThreshold: number = 3.5; // Acceleration threshold for detecting a step
  private lastStepTime: number = 0;
  private stepCooldown: number = 300; // Minimum time between steps (ms)

  constructor(private motionService: MotionService) {}

  ngOnInit(): void {
    this.motionService.startMotionDetection(this.detectSteps.bind(this));
  }

  ngOnDestroy(): void {
    this.motionService.stopMotionDetection();
  }

  private detectSteps(data: MotionData): void {
    if (data.acceleration) {
      // Calculate total acceleration magnitude
      const totalAcceleration = Math.sqrt(
        data.acceleration.x ** 2 + 
        data.acceleration.y ** 2 + 
        data.acceleration.z ** 2
      );

      // Update acceleration display
      this.acceleration = Number(totalAcceleration.toFixed(2));

      // Step detection logic
      const currentTime = Date.now();
      if (
        totalAcceleration > this.stepThreshold && 
        currentTime - this.lastStepTime > this.stepCooldown
      ) {
        this.steps++;
        this.lastStepTime = currentTime;
      }
    }
  }
}