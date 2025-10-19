<template>
    <main class="main" id="top">
      <NavbarComponent />
    
      <!-- Hero Section -->
      <section class="hero-section text-center">
        <div class="container-lg mt-3">
          <h1 class="display-4 fw-bold mb-3">POLÍTICAS E TERMOS</h1>
          <p class="fs-2 text-muted">
            Sua privacidade e segurança são nossas prioridades. Leia abaixo os termos de uso da nossa plataforma, incluindo a Política de Privacidade, Política de Cookies e os Termos e Condições.
          </p>
        </div>
      </section>
  
      <!-- Política de Cookies -->
      <section class="cookie-policy py-5">
        <div class="container-lg">
          <h2 class="text-center mb-4">Política de Cookies</h2>
          <p>Utilizamos cookies para oferecer uma experiência mais personalizada. Ao continuar navegando em nosso site, você concorda com o uso de cookies.</p>
          <p>Os cookies permitem que nossa plataforma se lembre de suas preferências e interações, o que melhora sua experiência durante o uso do nosso serviço.</p>
          <p><strong>Para mais detalhes, consulte nossa <a href="#">Política de Cookies completa</a>.</strong></p>
        </div>
      </section>
  
      <!-- Termos de Confidencialidade -->
      <section class="confidentiality-terms py-5">
        <div class="container-lg">
          <h2 class="text-center mb-4">Termos de Confidencialidade</h2>
          <p>Garantimos que todos os dados pessoais fornecidos são mantidos em total confidencialidade. As informações compartilhadas são utilizadas exclusivamente para a melhoria da sua experiência no serviço.</p>
          <p>Não compartilhamos seus dados com terceiros sem seu consentimento expresso, exceto nos casos de integração com parceiros para funcionalidades específicas, como links para sites de parceiros.</p>
        </div>
      </section>
  
      <!-- Termos e Condições -->
      <section class="terms-conditions py-5">
        <div class="container-lg">
          <h2 class="text-center mb-4">Termos e Condições</h2>
          <p>Ao utilizar nossa plataforma, você concorda com os seguintes termos:</p>
          <ul>
            <li>Você deve ser maior de 18 anos para utilizar o serviço.</li>
            <li>Não está permitido o uso da plataforma para fins ilegais ou prejudiciais a terceiros.</li>
            <li>O conteúdo fornecido pela plataforma, incluindo textos, gráficos, vídeos e software, são propriedade da nossa empresa.</li>
          </ul>
          <p>Para mais detalhes, consulte os <a href="#">Termos e Condições completos</a>.</p>
        </div>
      </section>
  
      <!-- Propriedade Intelectual -->
      <section class="intellectual-property py-5">
        <div class="container-lg">
          <h2 class="text-center mb-4">Propriedade Intelectual</h2>
          <p>Todos os direitos de propriedade intelectual, incluindo patentes, marcas registradas e direitos autorais, são de propriedade exclusiva da nossa empresa.</p>
          <p>Qualquer uso não autorizado do conteúdo da plataforma, sem permissão explícita, é estritamente proibido e pode resultar em ações legais.</p>
        </div>
      </section>
  
      <!-- Exclusividade dos Dados do Usuário -->
      <section class="user-data py-5 bg-light">
        <div class="container-lg">
          <h2 class="text-center mb-4">Exclusividade dos Dados</h2>
          <p>Acreditamos na proteção total dos dados dos nossos usuários. Todas as informações que você compartilha conosco são armazenadas de forma segura e não são compartilhadas com terceiros sem a sua permissão.</p>
          <p>Se você optar por utilizar nossos serviços de integração com parceiros, como links para sites externos, o compartilhamento de dados será estritamente controlado e de sua responsabilidade.</p>
        </div>
      </section>
  
      <!-- Comunicação e Notificações -->
      <section class="communication-notifications py-5">
        <div class="container-lg">
          <h2 class="text-center mb-4">Comunicação e Notificações</h2>
          <p>Utilizamos suas informações para notificações relacionadas à plataforma, como atualizações de serviços, mudanças nos termos e novos recursos.</p>
          <p>Você pode ajustar suas preferências de notificação a qualquer momento em seu painel de configurações.</p>
        </div>
      </section>
  
      <FooterComponent />
    </main>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import NavbarComponent from '@/components/NavbarComponent.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  </script>
  
  <style scoped>
  /* Hero Section */
  .hero-section {
    padding: 5rem 0;
  }
  
  /* Seções de Políticas */
  section {
    padding: 3rem 0;
  }
  
  section.bg-light {
  }
  
  h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #333;
  }
  
  ul {
    list-style-type: disc;
    margin-left: 20px;
  }
  
  a {
    color: #007bff;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  /* Container */
  .container-lg {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 15px;
  }
  
  .text-center {
    text-align: center;
  }
  
  .fs-2 {
    font-size: 1.25rem;
    color: #666;
  }
  
  .text-muted {
    color: #aaa;
  }
  
  .fs-3 {
    font-size: 2.25rem;
    font-weight: 600;
    color: #007bff;
  }
  
  .bg-light {
    background-color: #f8f9fa;
  }
  </style>
  