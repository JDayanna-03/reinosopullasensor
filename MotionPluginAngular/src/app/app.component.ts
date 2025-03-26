import { Component } from '@angular/core';
import { MotionComponent } from './components/motion/motion.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports:[MotionComponent]
})
export class AppComponent {
  title = 'angular-motion';
}
