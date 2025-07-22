import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-particle-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #container class="particle-container"></div>
  `,
  styles: [`
    .particle-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background: #111526;
      overflow: hidden;
    }
  `]
})
export class ParticleBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef;
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private mouse = new THREE.Vector2();
  private animationId!: number;
  private particleCount = 1000;
  private positions!: Float32Array;
  private velocities!: Float32Array;

  ngOnInit(): void {
    this.initThree();
    this.createParticles();
    this.setupEventListeners();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private initThree(): void {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 100;

    // Render
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x111526, 1);
    this.container.nativeElement.appendChild(this.renderer.domElement);
  }

  private createParticles(): void {
    const geometry = new THREE.BufferGeometry();
    
    this.positions = new Float32Array(this.particleCount * 3);
    this.velocities = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Posições aleatórias
      this.positions[i3] = (Math.random() - 0.5) * 200;
      this.positions[i3 + 1] = (Math.random() - 0.5) * 200;
      this.positions[i3 + 2] = (Math.random() - 0.5) * 200;
      
      // Velocidades aleatórias
      this.velocities[i3] = (Math.random() - 0.5) * 0.02;
      this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      
      // Cores 
      colors[i3] = 0.0; 
      colors[i3 + 1] = 0.8 + Math.random() * 0.2; 
      colors[i3 + 2] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    //partículas
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Atualiza posições das partículas
    const positions = this.particles.geometry.attributes['position'].array as Float32Array;
    
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Movimento base das partículas
      positions[i3] += this.velocities[i3];
      positions[i3 + 1] += this.velocities[i3 + 1];
      positions[i3 + 2] += this.velocities[i3 + 2];
      
      // Aplica efeito magnético do mouse
      const mouseInfluence = 20;
      const mouseX = this.mouse.x * 100;
      const mouseY = this.mouse.y * 100;
      
      const dx = mouseX - positions[i3];
      const dy = mouseY - positions[i3 + 1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouseInfluence) {
        const force = (mouseInfluence - distance) / mouseInfluence;
        positions[i3] += dx * force * 0.01;
        positions[i3 + 1] += dy * force * 0.01;
      }
      
      // Reseta partículas que saem dos limites da tela
      if (positions[i3] > 100) positions[i3] = -100;
      if (positions[i3] < -100) positions[i3] = 100;
      if (positions[i3 + 1] > 100) positions[i3 + 1] = -100;
      if (positions[i3 + 1] < -100) positions[i3 + 1] = 100;
    }
    
    this.particles.geometry.attributes['position'].needsUpdate = true;
    
    // rotação
    this.particles.rotation.y += 0.001;
    
    this.renderer.render(this.scene, this.camera);
  }
}