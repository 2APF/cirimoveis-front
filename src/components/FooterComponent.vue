<template>
    
    <footer>
      <div class="container">
        <div class="row text-center text-md-start">
          <div class="col-md-4 mb-4">
            <h5 class="text-uppercase fw-bold mb-3"><img src="/public/logo-danger.png" alt="Cirimoveis Logo" style="height: 50px; width: 120px;"/></h5>
            <p>A melhor plataforma para compra de casas em Angola. Encontre propriedades verificadas e faça o melhor negócio.</p>
          </div>
          <div class="col-md-4 mb-4">
            <h5 class="text-uppercase text-danger fw-bold mb-3">Links Úteis</h5>
            <ul class="list-unstyled">
              <li>
                <a class="footer-link" href="/we" >Quem Somos</a>
              </li>
              <li>
                <a class="footer-link" href="/properties">Propriedades</a>
              </li>
              <li>
                <a class="footer-link" href="/property-create" >Publicar Casa</a>
              </li>
              <li>
                <a class="footer-link" href="" >Termos de Uso</a>
              </li>

              <li>
                <a class="footer-link" href="" >Políticas de Cookie</a>
              </li>

            </ul>
          </div>
          <div class="col-md-4 mb-4">
            <h5 class="text-uppercase text-danger fw-bold mb-3">Contacto</h5>
            <p><i class="fas fa-envelope me-2"></i>geral@cirimoveis.com</p>
            <p><i class="fas fa-phone me-2"></i>+244 944 970 470</p>
            <p><i class="fas fa-map-marker-alt me-2"></i>Maianga, Luanda, Angola</p>
            <div class="mt-3">
              <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
        <hr class="my-4">
        <div class="text-center">
          <p class="mb-0">&copy; 2025 Cirimoveis. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>

    <!-- <button id="scrollToTopBtn" class="btn btn-danger position-fixed rounded-circle" :style="{ display: showScrollToTop ? 'block' : 'none' }" @click="scrollToTop">
      <i class="fas fa-arrow-up"></i>
    </button> -->

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';


interface FooterLink {
  text: string;
  href: string;
}

const footerLinks = ref<FooterLink[]>([
  { text: 'Início', href: '#hero' },
  { text: 'Propriedades', href: '#properties' },
  { text: 'Sobre Nós', href: '#about' },
  { text: 'Equipe', href: '#team' },
  { text: 'Contato', href: '#contact' },
]);

const showScrollToTop = ref(false);


const scrollToSection = (href: string) => {
  if (href.startsWith('/')) {
    // router.push(href);
  } else {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};
</script>

<style scoped>
:root {
  --primary-red: #d32f2f;
  --soft-red: #ffcccb;
  --light-bg: #f5f7fa;
  --card-bg: #ffffff;
  --dark-charcoal: #1a1a2e;
  --medium-gray: #6b7280;
  --shadow-light: rgba(0, 0, 0, 0.05);
  --shadow-medium: rgba(0, 0, 0, 0.1);
  --animation-ease: cubic-bezier(0.4, 0, 0.2, 1);
}

footer {
  background: var(--card-bg);
  padding: 40px 0;
  margin-top: 80px;
  border-top: 1px solid var(--soft-red);
}

footer .footer-link {
  color: var(--medium-gray);
  text-decoration: none;
  transition: color 0.3s var(--animation-ease);
}

footer .footer-link:hover {
  color: var(--primary-red);
}

footer .social-icon {
  color: var(--dark-charcoal);
  font-size: 1.1rem;
  margin: 0 8px;
  transition: color 0.3s var(--animation-ease);
}

footer .social-icon:hover {
  color: var(--primary-red);
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: var(--light-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--medium-gray);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-red);
}
</style>