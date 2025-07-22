import { Component, signal, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  element: HTMLElement;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy, AfterViewInit {
  protected readonly title = signal('projeto-angular');
  
  constructor(private router: Router) {}
  
  private particles: Particle[] = [];
  private animationId: number = 0;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private container: HTMLElement | null = null;
  
  ngOnInit() {
    // Component initialization
  }
  
  ngAfterViewInit() {
    this.initParticles();
    this.animate();
    this.setupMouseTracking();
  }
  
  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  private initParticles() {
    this.container = document.getElementById('particles-container');
    if (!this.container) return;
    
    const particleCount = 80;
    const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];
    
    for (let i = 0; i < particleCount; i++) {
      const particle: Particle = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.7 + 0.3,
        element: this.createParticleElement()
      };
      
      this.particles.push(particle);
      this.container.appendChild(particle.element);
    }
  }
  
  private createParticleElement(): HTMLElement {
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.borderRadius = '50%';
    element.style.pointerEvents = 'none';
    element.style.transition = 'all 0.1s ease-out';
    return element;
  }
  
  private setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }
  
  private animate() {
    this.updateParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  goToLogin() {
    this.router.navigate(['/login']);
  }
  
  goToRegister() {
    this.router.navigate(['/register']);
  }
  
  private updateParticles() {
    if (!this.container) return;
    
    this.particles.forEach(particle => {
      // Calculate distance to mouse
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Enhanced magnetic effect - attract particles to mouse when close
      if (distance < 120 && distance > 5) {
        const force = (120 - distance) / 120;
        const magneticStrength = 0.01;
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        particle.vx += normalizedDx * force * magneticStrength;
        particle.vy += normalizedDy * force * magneticStrength;
      }
      
      // Apply gentle damping to prevent excessive speeds
      const maxSpeed = 0.3;
      const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      
      if (currentSpeed > maxSpeed) {
        particle.vx = (particle.vx / currentSpeed) * maxSpeed;
        particle.vy = (particle.vy / currentSpeed) * maxSpeed;
      }
      
      // Add slight random drift to maintain natural movement
      particle.vx += (Math.random() - 0.5) * 0.002;
      particle.vy += (Math.random() - 0.5) * 0.002;
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Keep particles within screen bounds with smooth wrapping
      const margin = 50;
      if (particle.x < -margin) {
        particle.x = window.innerWidth + margin;
      } else if (particle.x > window.innerWidth + margin) {
        particle.x = -margin;
      }
      
      if (particle.y < -margin) {
        particle.y = window.innerHeight + margin;
      } else if (particle.y > window.innerHeight + margin) {
        particle.y = -margin;
      }
      
      // Update visual properties based on mouse distance
      const proximityOpacity = distance < 100 ? Math.min(1, (100 - distance) / 100 * 0.8 + 0.4) : particle.opacity;
      const proximitySize = distance < 100 ? particle.size * (1 + (100 - distance) / 200) : particle.size;
      
      // Apply styles
      particle.element.style.left = `${particle.x}px`;
      particle.element.style.top = `${particle.y}px`;
      particle.element.style.width = `${proximitySize}px`;
      particle.element.style.height = `${proximitySize}px`;
      particle.element.style.backgroundColor = particle.color;
      particle.element.style.opacity = proximityOpacity.toString();
      particle.element.style.boxShadow = distance < 100 ? `0 0 ${proximitySize * 2}px ${particle.color}` : 'none';
    });
  }
}
