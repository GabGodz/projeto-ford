import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';
import { ParticleBackgroundComponent } from './components/particle-background.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ParticleBackgroundComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cnv-training-platform');
}
