import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Hero -->
      <section class="hero-section">
        <div class="container">
          <div class="row align-items-center min-vh-100">
            <div class="col-lg-6 col-md-12 order-lg-1 order-2">
              <div class="hero-content">
                <h1 class="hero-title">
                  Transforme sua
                  <span class="gradient-text">Comunicação</span>
                  com CNV
                </h1>
                <p class="hero-subtitle">
                  Plataforma inovadora de treinamento em Comunicação Não Violenta 
                  para empresas, utilizando cenários de RPG e Inteligência Artificial.
                </p>
                <div class="hero-buttons">
                  <a routerLink="/register" class="btn btn-primary btn-lg me-lg-3 mb-2 mb-lg-0">
                    <i class="fas fa-rocket me-2"></i>
                    Começar Agora
                  </a>
                  <a routerLink="/login" class="btn btn-outline-light btn-lg">
                    <i class="fas fa-sign-in-alt me-2"></i>
                    Fazer Login
                  </a>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-md-12 order-lg-2 order-1">
              <div class="hero-image">
                <div class="floating-cards-container">
                  <div class="floating-card">
                    <i class="fas fa-users fa-3x mb-3"></i>
                    <h4>Comunicação Eficaz</h4>
                    <p>Desenvolva habilidades de comunicação não violenta</p>
                  </div>
                  <div class="floating-card delay-1">
                    <i class="fas fa-lightbulb fa-3x mb-3"></i>
                    <h4>Aprendizado Inteligente</h4>
                    <p>IA personalizada para seu desenvolvimento</p>
                  </div>
                  <div class="floating-card delay-2">
                    <i class="fas fa-trophy fa-3x mb-3"></i>
                    <h4>Resultados Comprovados</h4>
                    <p>Melhore suas relações profissionais</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção de Recursos -->
      <section class="features-section">
        <div class="container">
          <div class="row">
            <div class="col-12 text-center mb-5">
              <div class="features-header">
                <h2 class="section-title">Por que escolher nossa plataforma?</h2>
                <p class="section-subtitle">Tecnologia de ponta para transformar a comunicação empresarial</p>
              </div>
            </div>
          </div>
          <div class="row g-4">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="fas fa-bullseye"></i>
                </div>
                <h4>Cenários Personalizados</h4>
                <p>IA cria situações baseadas no seu perfil profissional</p>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="fas fa-comments"></i>
                </div>
                <h4>Feedback Inteligente</h4>
                <p>Análise em tempo real das suas escolhas comunicativas</p>
              </div>
            </div>
            <div class="col-lg-4 col-md-12 col-sm-12">
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="fas fa-gamepad"></i>
                </div>
                <h4>Gamificação</h4>
                <p>Sistema de pontuação que torna o aprendizado envolvente</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção de Benefícios -->
      <section class="benefits-section">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6 col-md-12 order-lg-1 order-2">
              <div class="benefits-content">
                <h2 class="section-title">Benefícios da CNV</h2>
                <div class="benefit-item">
                  <i class="fas fa-check-circle"></i>
                  <div>
                    <h5>Melhora na Comunicação</h5>
                    <p>Desenvolva habilidades para se expressar de forma clara e empática</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <i class="fas fa-check-circle"></i>
                  <div>
                    <h5>Resolução de Conflitos</h5>
                    <p>Aprenda a mediar e resolver conflitos de forma construtiva</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <i class="fas fa-check-circle"></i>
                  <div>
                    <h5>Ambiente de Trabalho Saudável</h5>
                    <p>Crie um ambiente mais colaborativo e produtivo</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <i class="fas fa-check-circle"></i>
                  <div>
                    <h5>Liderança Eficaz</h5>
                    <p>Desenvolva habilidades de liderança baseadas na empatia</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-md-12 order-lg-2 order-1">
              <div class="stats-grid">
                <div class="stat-card">
                  <h3>95%</h3>
                  <p>Melhoria na comunicação</p>
                </div>
                <div class="stat-card">
                  <h3>87%</h3>
                  <p>Redução de conflitos</p>
                </div>
                <div class="stat-card">
                  <h3>92%</h3>
                  <p>Satisfação dos funcionários</p>
                </div>
                <div class="stat-card">
                  <h3>78%</h3>
                  <p>Aumento da produtividade</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção de Chamada para Ação -->
      <section class="cta-section">
        <div class="container">
          <div class="row">
            <div class="col-12 text-center">
              <h2 class="cta-title">Pronto para transformar sua comunicação?</h2>
              <p class="cta-subtitle">Junte-se a milhares de profissionais que já melhoraram suas habilidades</p>
              <a routerLink="/register" class="btn btn-primary btn-lg">
                <i class="fas fa-rocket me-2"></i>
                Começar Treinamento Gratuito
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      position: relative;
      z-index: 1;
      overflow-x: hidden;
    }
    
    .hero-section {
      padding: 100px 0 50px;
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
    
    .hero-content {
      animation: slideInLeft 1s ease-out;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 40px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }
    
    .gradient-text {
      background: linear-gradient(45deg, #00d4ff, #0099cc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    
    .hero-buttons {
      margin-top: 2rem;
    }
    
    .btn-primary {
      background: linear-gradient(45deg, #00d4ff, #0099cc);
      border: none;
      padding: 12px 30px;
      border-radius: 50px;
      font-weight: 600;
      transition: all 0.3s ease;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    
    .btn-primary:hover,
    .btn-primary:focus {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(0, 212, 255, 0.4);
    }
    
    .btn-primary:active {
      transform: translateY(-1px);
    }
    
    .btn-outline-light {
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      padding: 12px 30px;
      border-radius: 50px;
      font-weight: 600;
      transition: all 0.3s ease;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    
    .btn-outline-light:hover,
    .btn-outline-light:focus {
      background: rgba(255, 255, 255, 0.1);
      border-color: #00d4ff;
      color: #00d4ff;
      transform: translateY(-3px);
    }
    
    .btn-outline-light:active {
      transform: translateY(-1px);
    }
    
    .hero-image {
      position: relative;
      height: 500px;
      animation: slideInRight 1s ease-out;
    }
    
    .floating-card {
      position: absolute;
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      color: #fff;
      animation: float 6s ease-in-out infinite;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .floating-card:hover {
      transform: translateY(-10px) scale(1.05);
    }
    
    .hero-section {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .floating-cards-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      gap: 40px;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 700px;
      z-index: 10;
      flex-wrap: nowrap;
    }
    
    .floating-card {
      flex: 0 0 auto;
      width: 160px;
      min-width: 160px;
      position: relative;
    }
    
    .floating-card:nth-child(1) {
      z-index: 3;
      background: rgba(0, 212, 255, 0.15);
      border: 1px solid rgba(0, 212, 255, 0.3);
      box-shadow: 0 15px 40px rgba(0, 212, 255, 0.2);
    }
    
    .floating-card:nth-child(1):hover {
      box-shadow: 0 25px 50px rgba(0, 212, 255, 0.4);
      border-color: rgba(0, 212, 255, 0.5);
    }
    
    .floating-card:nth-child(2) {
      z-index: 3;
      animation-delay: -2s;
      background: rgba(0, 255, 150, 0.15);
      border: 1px solid rgba(0, 255, 150, 0.3);
      box-shadow: 0 15px 40px rgba(0, 255, 150, 0.2);
    }
    
    .floating-card:nth-child(2):hover {
      box-shadow: 0 25px 50px rgba(0, 255, 150, 0.4);
      border-color: rgba(0, 255, 150, 0.5);
    }
    
    .floating-card:nth-child(3) {
      z-index: 3;
      animation-delay: -4s;
      background: rgba(0, 150, 255, 0.15);
      border: 1px solid rgba(0, 150, 255, 0.3);
      box-shadow: 0 15px 40px rgba(0, 150, 255, 0.2);
    }
    
    .floating-card:nth-child(3):hover {
      box-shadow: 0 25px 50px rgba(0, 150, 255, 0.4);
      border-color: rgba(0, 150, 255, 0.5);
    }
    
    .floating-card:nth-child(1) i {
      color: #00d4ff;
    }
    
    .floating-card:nth-child(2) i {
      color: #00ff96;
    }
    
    .floating-card:nth-child(3) i {
      color: #0096ff;
    }
    
    .floating-card h4 {
      font-size: 1.1rem;
      margin-bottom: 10px;
    }
    
    .floating-card p {
      font-size: 0.9rem;
      opacity: 0.8;
      margin: 0;
    }
    
    .features-section {
      padding: 100px 0;
      background: rgba(255, 255, 255, 0.02);
    }
    
    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 1rem;
    }
    
    .section-subtitle {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 3rem;
    }
    
    .features-header {
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 40px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: inline-block;
      margin: 0 auto;
    }
    
    .features-header .section-title {
      margin-bottom: 1rem;
    }
    
    .features-header .section-subtitle {
      margin-bottom: 0;
    }
    
    .feature-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 24px;
      padding: 48px 32px;
      text-align: center;
      color: #fff;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      position: relative;
      overflow: hidden;
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    
    .feature-card.animate-in:nth-child(1) {
      animation: fadeInUp 0.8s ease-out 0.2s forwards;
    }
    
    .feature-card.animate-in:nth-child(2) {
      animation: fadeInUp 0.8s ease-out 0.4s forwards;
    }
    
    .feature-card.animate-in:nth-child(3) {
      animation: fadeInUp 0.8s ease-out 0.6s forwards;
    }
    
    .feature-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(0, 153, 204, 0.02));
      opacity: 0;
      transition: opacity 0.4s ease;
      z-index: -1;
    }
    
    .feature-card:hover {
      transform: translateY(-12px);
      box-shadow: 0 24px 48px rgba(0, 212, 255, 0.25);
      border-color: rgba(0, 212, 255, 0.4);
    }
    
    .feature-card:hover::before {
      opacity: 1;
    }
    
    .feature-icon {
      width: 88px;
      height: 88px;
      background: linear-gradient(135deg, #00d4ff, #0099cc);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 2.2rem;
      color: #fff;
      box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
      transition: all 0.3s ease;
    }
    
    .feature-card:hover .feature-icon {
      transform: scale(1.1);
      box-shadow: 0 12px 32px rgba(0, 212, 255, 0.4);
    }
    
    .feature-card h4 {
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 16px;
      color: #fff;
    }
    
    .feature-card p {
      font-size: 1rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }
    
    .benefits-section {
      padding: 100px 0;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      position: relative;
    }
    
    .benefits-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 153, 204, 0.05));
      z-index: -1;
    }
    
    .benefits-content {
      padding-right: 2rem;
    }
    
    .benefit-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 30px;
      color: #fff;
      opacity: 0;
      transform: translateX(-30px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    
    .benefit-item.animate-in {
      opacity: 1;
      transform: translateX(0);
    }
    
    .benefit-item.animate-in:nth-child(1) {
      transition-delay: 0.2s;
    }
    
    .benefit-item.animate-in:nth-child(2) {
      transition-delay: 0.4s;
    }
    
    .benefit-item.animate-in:nth-child(3) {
      transition-delay: 0.6s;
    }
    
    .benefit-item.animate-in:nth-child(4) {
      transition-delay: 0.8s;
    }
    
    .benefit-item i {
      color: #00d4ff;
      font-size: 1.5rem;
      margin-right: 20px;
      margin-top: 5px;
      flex-shrink: 0;
    }
    
    .benefit-item h5 {
      font-size: 1.2rem;
      margin-bottom: 8px;
    }
    
    .benefit-item p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 30px 20px;
      text-align: center;
      color: #fff;
      opacity: 0;
      transform: translateX(30px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out, all 0.3s ease;
    }
    
    .stat-card.animate-in {
      opacity: 1;
      transform: translateX(0);
    }
    
    .stat-card:hover {
      transform: scale(1.05);
      border-color: rgba(0, 212, 255, 0.3);
    }
    
    .stat-card h3 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #00d4ff;
      margin-bottom: 10px;
    }
    
    .stat-card p {
      font-size: 0.9rem;
      opacity: 0.8;
      margin: 0;
    }
    
    .cta-section {
      padding: 100px 0;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      position: relative;
      text-align: center;
    }
    
    .cta-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 153, 204, 0.05));
      z-index: -1;
    }
    
    .cta-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 1rem;
      opacity: 1;
      transform: translateY(0);
    }
    
    .cta-subtitle {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 2rem;
      opacity: 1;
      transform: translateY(0);
    }
    
    .cta-section .btn {
      opacity: 1;
      transform: translateY(0);
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @media (max-width: 992px) {
      .hero-title {
        font-size: 3rem;
      }
      
      .hero-content {
        padding: 30px;
      }
      
      .floating-cards-container {
        flex-direction: column;
        gap: 20px;
        position: static;
        transform: none;
        margin-top: 30px;
      }
      
      .floating-card {
        position: static;
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
      }
      
      .hero-image {
        height: auto;
        margin-top: 30px;
      }
      
      .section-title {
        font-size: 2.2rem;
      }
      
      .features-header {
        padding: 30px;
      }
      
      .feature-card {
        padding: 40px 24px;
      }
      
      .benefits-content {
        padding-right: 0;
        margin-bottom: 40px;
      }
    }
    
    @media (max-width: 768px) {
      .hero-section {
        padding: 80px 0 40px;
      }
      
      .hero-title {
        font-size: 2.2rem;
        line-height: 1.3;
      }
      
      .hero-subtitle {
        font-size: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .hero-content {
        padding: 25px;
        margin-bottom: 30px;
      }
      
      .hero-buttons {
        display: flex;
        flex-direction: column;
        gap: 15px;
        align-items: center;
      }
      
      .hero-buttons .btn {
        width: 100%;
        max-width: 280px;
        margin: 0;
      }
      
      .floating-card {
        padding: 20px;
        width: 100%;
        max-width: 280px;
      }
      
      .floating-card h4 {
        font-size: 1rem;
      }
      
      .floating-card p {
        font-size: 0.85rem;
      }
      
      .floating-card i {
        font-size: 2rem !important;
      }
      
      .features-section,
      .benefits-section,
      .cta-section {
        padding: 60px 0;
      }
      
      .section-title {
        font-size: 1.8rem;
        margin-bottom: 0.8rem;
      }
      
      .section-subtitle {
        font-size: 1rem;
        margin-bottom: 2rem;
      }
      
      .features-header {
        padding: 25px 20px;
      }
      
      .feature-card {
        padding: 30px 20px;
        margin-bottom: 20px;
      }
      
      .feature-icon {
        width: 70px;
        height: 70px;
        font-size: 1.8rem;
        margin-bottom: 20px;
      }
      
      .feature-card h4 {
        font-size: 1.2rem;
        margin-bottom: 12px;
      }
      
      .feature-card p {
        font-size: 0.9rem;
      }
      
      .benefit-item {
        margin-bottom: 25px;
        flex-direction: column;
        text-align: center;
      }
      
      .benefit-item i {
        margin-right: 0;
        margin-bottom: 10px;
        margin-top: 0;
      }
      
      .benefit-item h5 {
        font-size: 1.1rem;
      }
      
      .benefit-item p {
        font-size: 0.9rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }
      
      .stat-card {
        padding: 25px 15px;
      }
      
      .stat-card h3 {
        font-size: 2rem;
      }
      
      .stat-card p {
        font-size: 0.85rem;
      }
      
      .cta-title {
        font-size: 1.8rem;
        margin-bottom: 0.8rem;
      }
      
      .cta-subtitle {
        font-size: 1rem;
        margin-bottom: 1.5rem;
      }
    }
    
    @media (max-width: 480px) {
      .hero-title {
        font-size: 1.8rem;
      }
      
      .hero-subtitle {
        font-size: 0.9rem;
      }
      
      .hero-content {
        padding: 20px;
      }
      
      .floating-card {
        padding: 15px;
        max-width: 250px;
      }
      
      .floating-card h4 {
        font-size: 0.9rem;
      }
      
      .floating-card p {
        font-size: 0.8rem;
      }
      
      .section-title {
        font-size: 1.5rem;
      }
      
      .section-subtitle {
        font-size: 0.9rem;
      }
      
      .features-header {
        padding: 20px 15px;
      }
      
      .feature-card {
        padding: 25px 15px;
      }
      
      .feature-icon {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
      }
      
      .feature-card h4 {
        font-size: 1.1rem;
      }
      
      .feature-card p {
        font-size: 0.85rem;
      }
      
      .benefit-item h5 {
        font-size: 1rem;
      }
      
      .benefit-item p {
        font-size: 0.85rem;
      }
      
      .stat-card {
        padding: 20px 10px;
      }
      
      .stat-card h3 {
        font-size: 1.8rem;
      }
      
      .cta-title {
        font-size: 1.5rem;
      }
      
      .cta-subtitle {
        font-size: 0.9rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  constructor() {}
  
  ngOnInit() {
    this.setupScrollAnimations();
  }
  
  private setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
     setTimeout(() => {
       const animatedElements = document.querySelectorAll(
         '.feature-card, .benefit-item, .stat-card'
       );
       
       animatedElements.forEach(el => {
         observer.observe(el);
       });
     }, 100);
  }
}