<template>
  <main class="main" id="top">
    
    <NavbarComponent active="we" />


    <!-- Hero Section -->
    <section id="sobre" class="hero d-flex align-items-center mt-3" :class="{ loaded: isHeroLoaded }">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center hero-content">
            <h1>Sobre a Cirimoveis</h1>
            <p class="lead">Construindo o futuro do mercado imobiliário angolano com inovação, transparência e paixão</p>
            <button class="btn btn-hero mt-4" @click="scrollToMission" aria-label="Conheça nossa história">
              <i class="fas fa-arrow-down me-2"></i> Conheça Nossa História
            </button>
          </div>
        </div>
      </div>
    </section>

    
    
    <section class="mission-vision-values py-5">
      <div class="container">
        <h2 class="section-title">Nossa Essência</h2>
        <p class="section-subtitle text-center">Os pilares que sustentam nossa missão de transformar vidas</p>
        <div class="row g-4">
          <div class="col-lg-4 col-md-6">
            <div class="mv-card mission" :class="{ visible: cardsVisible.mission }">
              <div class="mv-icon">
                <i class="fas fa-bullseye"></i>
              </div>
              <h3>Missão</h3>
              <p>Facilitar o acesso a propriedades verificadas em Angola, conectando pessoas aos seus lares ideais com confiança e excelência.</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="mv-card vision" :class="{ visible: cardsVisible.vision }">
              <div class="mv-icon">
                <i class="fas fa-eye"></i>
              </div>
              <h3>Visão</h3>
              <p>Ser a referência número um no mercado imobiliário angolano, liderando com inovação e impacto social positivo.</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-12">
            <div class="mv-card values" :class="{ visible: cardsVisible.values }">
              <div class="mv-icon">
                <i class="fas fa-heart"></i>
              </div>
              <h3>Valores</h3>
              <ul class="values-list">
                <li><i class="fas fa-check-circle me-2"></i> Transparência</li>
                <li><i class="fas fa-check-circle me-2"></i> Excelência</li>
                <li><i class="fas fa-check-circle me-2"></i> Inovação</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Open Section -->
    <section class="why-open-section py-5">
      <div class="container">
        <h2 class="section-title">Por Que Somos Abertos</h2>
        <p class="section-subtitle text-center">Nosso compromisso com um mercado imobiliário acessível e inclusivo</p>
        <div class="row g-4">
          <div class="col-lg-6">
            <div class="why-open-content" :class="{ visible: whyOpenVisible }">
              <p>Na Cirimoveis, acreditamos que encontrar um lar deve ser uma experiência aberta e acessível. Mantemos nossa plataforma aberta para garantir que qualquer pessoa, em qualquer canto de Angola, possa explorar propriedades sem barreiras, com informações claras e confiáveis.</p>
              <p>Nosso modelo aberto promove transparência, permitindo que clientes, corretores e parceiros colaborem livremente, fortalecendo a confiança e a comunidade no mercado imobiliário.</p>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="why-open-image" :style="{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80')` }" :class="{ visible: whyOpenVisible }"></div>
          </div>
        </div>
      </div>
    </section>

    
    <section class="impulse-section py-5">
      <div class="container">
        <h2 class="section-title">Nosso Impulso</h2>
        <p class="section-subtitle text-center">A paixão que nos leva a redefinir o mercado imobiliário</p>
        <div class="row">
          <div class="col-lg-6 order-lg-2">
            <div class="impulse-content" :class="{ visible: impulseVisible }">
              <h3>Inovação e Impacto</h3>
              <p>Cada imóvel que listamos é uma oportunidade de transformar vidas. Nosso impulso vem de usar tecnologia de ponta, como buscas avançadas e tours virtuais, para criar experiências únicas. Estamos comprometidos em oferecer soluções que não apenas atendam, mas superem as expectativas dos nossos clientes.</p>
              <p>Nosso objetivo é construir um mercado imobiliário mais dinâmico, sustentável e centrado nas pessoas, com impacto positivo em cada comunidade que servimos.</p>
              <button class="btn btn-impulse mt-3"  aria-label="Ver nosso roadmap">
                <i class="fas fa-rocket me-2"></i> Veja Nosso Futuro
              </button>
            </div>
          </div>
          <div class="col-lg-6 order-lg-1">
            <div class="impulse-image" :style="{ backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80')` }" :class="{ visible: impulseVisible }"></div>
          </div>
        </div>
      </div>
    </section>


    <!-- Call to Action Section -->
    <section class="cta-section py-5">
      <div class="container text-center">
        <h2 class="section-title">Faça Parte da Nossa Missão</h2>
        <p class="section-subtitle">Junte-se à revolução imobiliária em Angola</p>
        <button class="btn btn-cta mt-4" @click="contactUs" aria-label="Entrar em contato">
          <i class="fas fa-envelope me-2"></i> Entre em Contato
        </button>
      </div>
    </section>


    <FooterComponent />

    <!-- Notification -->
    <div v-if="notification.message" class="alert" :class="notification.type">
      <i :class="notification.type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle'"></i>
      {{ notification.message }}
    </div>
  </main>
</template>

<script setup lang="ts">
import FooterComponent from '@/components/FooterComponent.vue';
import NavbarComponent from '@/components/NavbarComponent.vue';
import { ref, onMounted } from 'vue';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';




interface FooterLink {
  text: string;
  href: string;
}

const isHeroLoaded = ref(false);
const showScrollToTop = ref(false);
const cardsVisible = ref({
  mission: false,
  vision: false,
  values: false,
});
const whyOpenVisible = ref(false);
const impulseVisible = ref(false);
const notification = ref({
  message: '',
  type: 'success' as 'success' | 'info',
});


// Methods
const scrollToSection = (href: string) => {
  if (href.startsWith('/')) {
    window.location.href = href;
  } else {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

const scrollToMission = () => {
  const missionSection = document.querySelector('.mission-vision-values');
  if (missionSection) {
    missionSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const contactUs = () => {
  showNotification('Redirecionando para contato...', 'success');
  setTimeout(() => {
    window.location.href = 'mailto:info@cirimoveis.ao';
  }, 1000);
};

const showNotification = (message: string, type: 'success' | 'info') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: 'success' };
  }, 3000);
};

// Lifecycle Hooks
onMounted(() => {
  // Initialize hero section
  setTimeout(() => {
    isHeroLoaded.value = true;
    document.body.style.opacity = '1';
  }, 100);
 
  // Initialize Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('mv-card')) {
            const cardType = entry.target.classList.contains('mission') ? 'mission' :
                            entry.target.classList.contains('vision') ? 'vision' : 'values';
            cardsVisible.value[cardType] = true;
          } else if (entry.target.classList.contains('why-open-content') || entry.target.classList.contains('why-open-image')) {
            whyOpenVisible.value = true;
          } else if (entry.target.classList.contains('impulse-content') || entry.target.classList.contains('impulse-image')) {
            impulseVisible.value = true;
          } 
          (entry.target as HTMLElement).style.animation = 'fadeInUp 0.6s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  // Observe elements
  setTimeout(() => {
    document.querySelectorAll('.mv-card').forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 0.2}s`;
      observer.observe(card);
    });
    document.querySelectorAll('.why-open-content, .why-open-image').forEach(card => {
      observer.observe(card);
    });
    document.querySelectorAll('.impulse-content, .impulse-image').forEach(card => {
      observer.observe(card);
    });
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
      (item as HTMLElement).dataset.index = index.toString();
      (item as HTMLElement).style.transitionDelay = `${index * 0.2}s`;
      observer.observe(item);
    }); 
  }, 100);

  // Scroll events
  const handleScroll = () => {
    showScrollToTop.value = window.scrollY > 300;
    // Parallax effect for impulse image
    const impulseImage = document.querySelector('.impulse-image');
    if (impulseImage) {
      const scrollPosition = window.scrollY;
      (impulseImage as HTMLElement).style.backgroundPositionY = `${scrollPosition * 0.2}px`;
    }
  };
  window.addEventListener('scroll', handleScroll);
 
  // Cleanup
  return () => {
    window.removeEventListener('scroll', handleScroll); 
  };
});
</script>

<style scoped>

.hero {
  background: linear-gradient(135deg, var(--soft-red) 0%, var(--light-bg) 100%);
  padding: 120px 0;
  min-height: 70vh;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80') no-repeat center/cover;
  opacity: 0.08;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s var(--animation-ease);
}

.hero.loaded .hero-content {
  opacity: 1;
  transform: translateY(0);
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--dark-charcoal);
  margin-bottom: 20px;
  line-height: 1.2;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.hero .lead {
  font-size: 1.3rem;
  color: var(--medium-gray);
  font-weight: 500;
}

.btn-hero {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  color: #fff;
  padding: 12px 28px;
  border-radius: 50px;
  font-weight: 700;
  border: none;
  transition: all 0.3s var(--animation-ease);
  box-shadow: 0 3px 10px rgba(211, 47, 47, 0.2);
}

.btn-hero:hover {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(211, 47, 47, 0.3);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--dark-charcoal);
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background: var(--primary-red);
  border-radius: 1px;
}

.section-subtitle {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--medium-gray);
  margin-bottom: 15px;
  text-align: center;
}

.mission-vision-values {
  padding: 60px 0;
}

.mv-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 6px 20px var(--shadow-light);
  border: 1px solid var(--soft-red);
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s var(--animation-ease);
}

.mv-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.mv-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px var(--shadow-medium);
}

.mv-icon {
  font-size: 2.5rem;
  color: var(--primary-red);
  margin-bottom: 20px;
}

.mv-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 15px;
}

.mv-card p, .values-list {
  font-size: 1rem;
  color: var(--medium-gray);
}

.values-list {
  list-style: none;
  padding: 0;
  text-align: left;
}

.values-list li {
  font-size: 0.95rem;
  margin-bottom: 10px;
  color: var(--dark-charcoal);
}

.impulse-section {
  background: linear-gradient(135deg, var(--light-bg), var(--soft-red));
  padding: 60px 0;
}

.impulse-content, .impulse-image {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s var(--animation-ease);
}

.impulse-content.visible, .impulse-image.visible {
  opacity: 1;
  transform: translateY(0);
}

.impulse-content h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 20px;
}

.impulse-content p {
  font-size: 1rem;
  color: var(--medium-gray);
  margin-bottom: 20px;
}

.btn-impulse {
  background: var(--primary-red);
  color: #fff;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 600;
  border: none;
  transition: all 0.3s var(--animation-ease);
}

.btn-impulse:hover {
  background: #b71c1c;
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(211, 47, 47, 0.3);
}
.why-open-image, .impulse-image {
  height: 450px;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  box-shadow: 0 6px 20px var(--shadow-light);
  position: relative;
  z-index: 1;
}


.timeline {
  position: relative;
  padding: 60px 0;
  max-width: 800px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, var(--primary-red), var(--soft-red));
  border-radius: 2px;
  z-index: 0;
}

.timeline-item {
  position: relative;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s var(--animation-ease);
  z-index: 1;
}

.timeline-item.active {
  opacity: 1;
  transform: translateY(0);
}

.timeline-item-left .timeline-content {
  margin-right: 80px;
  text-align: right;
}

.timeline-item-right .timeline-content {
  margin-left: 80px;
}

.timeline-content {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px var(--shadow-light);
  position: relative;
  width: calc(50% - 40px);
  backdrop-filter: blur(8px);
}

.timeline-content h3 {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--primary-red);
}

.timeline-content h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--dark-charcoal);
  margin-bottom: 10px;
}

.timeline-content p {
  font-size: 1rem;
  color: var(--medium-gray);
}

.timeline-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: var(--primary-red);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 3px 10px rgba(211, 47, 47, 0.3);
  z-index: 2;
}

.timeline-item-left .timeline-icon {
  right: -25px;
}

.timeline-item-right .timeline-icon {
  left: -25px;
}

.partners-section {
  padding: 80px 0;
}

.partner-card {
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 6px 20px var(--shadow-light);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.5s var(--animation-ease);
}

.partner-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.partner-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px var(--shadow-medium);
}

.partner-logo {
  width: 150px;
  height: 80px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 15px;
}

.partner-content {
  text-align: center;
}

.partner-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 10px;
}

.partner-description {
  font-size: 0.95rem;
  color: var(--medium-gray);
  margin-bottom: 15px;
}

.partner-link {
  font-size: 0.9rem;
  color: var(--primary-red);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s var(--animation-ease);
}

.partner-link:hover {
  color: #b71c1c;
}

.testimonials-section {
  background: var(--light-bg);
  padding: 80px 0;
}

.testimonial-card {
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 6px 20px var(--shadow-light);
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.5s var(--animation-ease);
}

.testimonial-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.testimonial-image {
  width: 80px;
  height: 80px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.testimonial-content {
  flex: 1;
}

.testimonial-text {
  font-size: 1rem;
  color: var(--medium-gray);
  font-style: italic;
  margin-bottom: 15px;
}

.testimonial-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--dark-charcoal);
}

.testimonial-role {
  font-size: 0.95rem;
  color: var(--primary-red);
}

.carousel {
  padding: 0 50px;
}

.carousel :deep(.carousel__prev),
.carousel :deep(.carousel__next) {
  width: 50px;
  height: 50px;
  background: var(--dark-charcoal);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  transition: background 0.3s var(--animation-ease);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel :deep(.carousel__prev:hover),
.carousel :deep(.carousel__next:hover) {
  background: var(--primary-red);
}

.carousel :deep(.carousel__slide) {
  padding: 0 20px;
}

.cta-section {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  padding: 80px 0;
  color: #fff;
}

.cta-section .section-title,
.cta-section .section-subtitle {
  color: #fff;
}

.cta-section .section-title::after {
  background: #fff;
}

.btn-cta {
  background: var(--card-bg);
  color: var(--primary-red);
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 700;
  border: none;
  transition: all 0.3s var(--animation-ease);
}

.btn-cta:hover {
  background: #fff;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}
 
.alert {
  position: fixed;
  top: 80px;
  right: 20px;
  padding: 1rem 2rem;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px var(--shadow-medium);
  z-index: 9999;
  animation: fadeIn 0.3s var(--animation-ease);
}

.alert.success {
  background: #4caf50;
}

.alert.info {
  background: #2196f3;
}

@media (min-width: 1400px) {
  .container {
    max-width: 1320px;
  }
}

@media (max-width: 992px) {
  .hero {
    padding: 100px 0;
    min-height: 60vh;
  }

  .hero h1 {
    font-size: 3rem;
  }

  .hero .lead {
    font-size: 1.2rem;
  }

  .timeline::before {
    left: 30px;
  }

  .timeline-item-left .timeline-content,
  .timeline-item-right .timeline-content {
    width: calc(100% - 60px);
    margin-left: 60px;
    margin-right: 20px;
    text-align: left;
  }

  .timeline-item-left .timeline-icon,
  .timeline-item-right .timeline-icon {
    left: 5px;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }

  .hero .lead {
    font-size: 1.1rem;
  }

  .why-open-image, .impulse-image {
    height: 300px;
    margin-top: 20px;
  }

  .section-title {
    font-size: 2.2rem;
  }

  .section-subtitle {
    font-size: 1.2rem;
  }

  .mv-card {
    padding: 20px;
  }

  .mv-icon {
    font-size: 2.2rem;
  }

  .timeline-content {
    padding: 20px;
  }
}

@media (max-width: 576px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero .lead {
    font-size: 1rem;
  }

  .why-open-image, .impulse-image {
    height: 200px;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .mv-card h3 {
    font-size: 1.4rem;
  }

  .timeline::before {
    left: 20px;
  }

  .timeline-item-left .timeline-content,
  .timeline-item-right .timeline-content {
    width: calc(100% - 50px);
    margin-left: 50px;
    margin-right: 15px;
  }

  .timeline-item-left .timeline-icon,
  .timeline-item-right .timeline-icon {
    left: -5px;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .alert {
    top: 60px;
    right: 15px;
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }

  .partner-logo {
    width: 120px;
    height: 60px;
  }
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

::-webkit-scrollbar {
  width: 6px;
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