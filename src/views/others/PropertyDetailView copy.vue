<template>
  <main class="main" id="top">
    
    
    <NavbarComponent active="properties" />


    <section class="property-hero mt-5" :class="{ loaded: isHeroLoaded }">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="property-title">{{ property.title }}</h1>
            <p class="property-location">
              <i class="fas fa-map-marker-alt me-2"></i>{{ property.location }}
            </p>
            <div class="property-price">{{ formatPrice(property.price) }}</div>
            <div class="property-status-badge" :class="statusClass">{{ property.status }}</div>
            <div v-if="property.verified" class="verified-badge mt-3">
              <i class="fas fa-check-circle me-2"></i>Propriedade Verificada
            </div>
            <button
              class="btn favorite-btn mt-3"
              :class="{ favorited: favorites.includes(property.id) }"
              @click="toggleFavorite(property.id)"
              aria-label="Adicionar ou remover dos favoritos"
            >
              <i :class="favorites.includes(property.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
              {{ favorites.includes(property.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos' }}
            </button>
          </div>
          <div class="col-lg-6">
            <Carousel
              :items-to-show="1"
              :wrap-around="true"
              :autoplay="3000"
              :transition="500"
            >
              <Slide v-for="(img, index) in property.images" :key="index">
                <img :src="img" alt="Imagem da propriedade" class="img-fluid rounded" loading="lazy" />
              </Slide>
              <template #addons>
                <Navigation />
                <Pagination />
              </template>
            </Carousel>
          </div>
        </div>
      </div>
    </section>

    <!-- Sticky Sidebar -->
    <div class="sticky-sidebar" :class="{ visible: isSidebarVisible }">
      <div class="sidebar-content">
        <h4>Detalhes Rápidos</h4>
        <ul class="sidebar-details">
          <li><i class="fas fa-bed me-2"></i>{{ property.bedrooms }} Quartos</li>
          <li><i class="fas fa-bath me-2"></i>{{ property.bathrooms }} Banheiros</li>
          <li><i class="fas fa-ruler-combined me-2"></i>{{ property.area }} m²</li>
        </ul>
        <button class="btn btn-contact mt-3" @click="scrollToContact" aria-label="Entrar em contato">
          <i class="fas fa-envelope me-2"></i> Contatar Agente
        </button>
        <a :href="`https://wa.me/244123456789?text=Olá, estou interessado na propriedade ${property.title}`" class="btn btn-whatsapp mt-2" target="_blank" rel="noopener noreferrer" aria-label="Contactar via WhatsApp">
          <i class="fab fa-whatsapp me-2"></i> WhatsApp
        </a>
        <button class="btn btn-chat mt-2" disabled aria-label="Chat temporariamente indisponível">
          <i class="fas fa-comment me-2"></i> Chat com Agente
          <span class="tooltip">Chat temporariamente indisponível</span>
        </button>
      </div>
    </div>

    <!-- 3D Reality View Section -->
    <section class="property-3d-view py-5">
      <div class="container">
        <h2 class="section-title">Visão 360° da Propriedade</h2>
        <p class="section-subtitle text-center mb-4">Explore a casa em uma experiência imersiva de 360°</p>
        <div class="panorama-container" :class="{ visible: panoramaVisible }">
          <div id="panorama" style="height: 500px; width: 100%;"></div>
        </div>
        <div class="virtual-tour-placeholder mt-4 text-center">
          <button class="btn btn-tour" @click="startVirtualTour" aria-label="Iniciar tour virtual">
            <i class="fas fa-vr-cardboard me-2"></i> Iniciar Tour Virtual
          </button>
        </div>
      </div>
    </section>

    <!-- Property Details Section -->
    <section class="property-details py-5">
      <div class="container">
        <h2 class="section-title">Detalhes da Propriedade</h2>
        <div class="row">
          <div class="col-md-6">
            <ul class="details-list">
              <li><i class="fas fa-bed me-2"></i><strong>Quartos:</strong> {{ property.bedrooms }}</li>
              <li><i class="fas fa-bath me-2"></i><strong>Banheiros:</strong> {{ property.bathrooms }}</li>
              <li><i class="fas fa-ruler-combined me-2"></i><strong>Área Total:</strong> {{ property.area }} m²</li>
              <li><i class="fas fa-home me-2"></i><strong>Tipologia:</strong> {{ property.type }}</li>
              <li><i class="fas fa-car me-2"></i><strong>Garagem:</strong> {{ property.garage ? 'Sim' : 'Não' }}</li>
            </ul>
          </div>
          <div class="col-md-6">
            <ul class="details-list">
              <li><i class="fas fa-swimming-pool me-2"></i><strong>Piscina:</strong> {{ property.piscina ? 'Sim' : 'Não' }}</li>
              <li><i class="fas fa-tree me-2"></i><strong>Jardim:</strong> {{ property.jardim ? 'Sim' : 'Não' }}</li>
              <li><i class="fas fa-snowflake me-2"></i><strong>Ar Condicionado:</strong> {{ property.arcondicionado ? 'Sim' : 'Não' }}</li>
              <li><i class="fas fa-building me-2"></i><strong>Estado:</strong> {{ property.status }}</li>
              <li><i class="fas fa-money-bill-wave me-2"></i><strong>Preço:</strong> {{ formatPrice(property.price) }}</li>
            </ul>
          </div>
        </div>
        <div class="property-description mt-4">
          <h3>Descrição Completa</h3>
          <p>{{ property.description }}</p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section py-5" id="contact">
      <div class="container">
        <h2 class="section-title">Entre em Contato</h2>
        <p class="section-subtitle text-center mb-4">Interessado nesta propriedade? Fale com nosso agente!</p>
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="contact-card" :class="{ visible: contactVisible }">
              <form @submit.prevent="submitContactForm">
                <div class="mb-3">
                  <label for="name" class="form-label">Nome</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model="contactForm.name"
                    required
                    aria-describedby="nameHelp"
                    placeholder="Seu Nome"
                  />
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">E-mail</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="contactForm.email"
                    required
                    aria-describedby="emailHelp"
                    placeholder="Seu Email"
                  />
                </div>
                <div class="mb-3">
                  <label for="phone" class="form-label">Telefone</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="phone"
                    v-model="contactForm.phone"
                    placeholder="Seu Telefone"
                  />
                </div>
                <div class="mb-3">
                  <label for="message" class="form-label">Mensagem</label>
                  <textarea
                    class="form-control"
                    id="message"
                    v-model="contactForm.message"
                    rows="5"
                    required
                    aria-describedby="messageHelp"
                    placeholder="Mensagem"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  class="btn btn-contact w-100"
                  :disabled="isContactSubmitting"
                >
                  <i :class="isContactSubmitting ? 'fas fa-spinner fa-spin me-2' : 'fas fa-envelope me-2'"></i>
                  {{ isContactSubmitting ? 'Enviando...' : 'Enviar Mensagem' }}
                </button>
              </form>
              <div class="contact-info mt-4 text-center">
                <p><i class="fas fa-phone me-2"></i>Agente: +244 952 321 174</p>
                <a :href="`https://wa.me/244123456789?text=Olá, estou interessado na propriedade ${property.title}`" class="btn btn-whatsapp mt-2" target="_blank" rel="noopener noreferrer" aria-label="Contactar via WhatsApp">
                  <i class="fab fa-whatsapp me-2"></i> Contactar via WhatsApp
                </a>
                <button class="btn btn-chat mt-2" disabled aria-label="Chat temporariamente indisponível">
                  <i class="fas fa-comment me-2"></i> Chat com Agente
                  <span class="tooltip">Chat temporariamente indisponível</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Similar Properties -->
    <section class="similar-properties py-5">
      <div class="container">
        <h2 class="section-title">Propriedades Semelhantes</h2>
        <Carousel
          :items-to-show="itemsToShow"
          :items-to-scroll="1"
          :wrap-around="true"
          :autoplay="5000"
          :transition="600"
          :breakpoints="carouselBreakpoints"
        >
          <Slide v-for="similar in similarProperties" :key="similar.id">
            <div class="col-12 col-md-4 col-lg-3">
              <div class="property-card" :data-property-id="similar.id" :class="{ visible: similar.visible }">
                <div
                  class="property-image"
                  :style="{ backgroundImage: `url(${similar.image})` }"
                >
                  <button
                    class="favorite-btn"
                    :class="{ favorited: favorites.includes(similar.id) }"
                    @click.stop="toggleFavorite(similar.id)"
                    :aria-label="favorites.includes(similar.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                  >
                    <i :class="favorites.includes(similar.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
                  </button>
                  <div v-if="similar.verified" class="verified-badge">
                    <i class="fas fa-check me-1"></i>Verificada
                  </div>
                  <div class="price-tag">{{ formatPrice(similar.price) }}</div>
                </div>
                <div class="property-info">
                  <h5 class="property-title">{{ similar.title }}</h5>
                  <p class="property-location">
                    <i class="fas fa-map-marker-alt me-1"></i>{{ similar.location }}
                  </p>
                  <div class="property-features">
                    <span><i class="fas fa-bed me-1"></i>{{ similar.bedrooms }} Quartos</span>
                    <span><i class="fas fa-bath me-1"></i>{{ similar.bathrooms }} WC</span>
                    <span><i class="fas fa-ruler-combined me-1"></i>{{ similar.area }}m²</span>
                  </div>
                  <p class="property-status">Estado: {{ similar.status }}</p>
                </div>
              </div>
            </div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
      </div>
    </section>


    <FooterComponent />


    <!-- Notification -->
    <div v-if="notification.message" class="alert">
      <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'info-circle'}`"></i>
      {{ notification.message }}
    </div>
  </main>
</template>

<script setup lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue';
import { ref, onMounted, computed } from 'vue';
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import * as PANOLENS from 'panolens';
import { useRoute } from 'vue-router';
import FooterComponent from '@/components/FooterComponent.vue';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: string;
  verified: boolean;
  description: string;
  type: string;
  garage: boolean;
  piscina: boolean;
  jardim: boolean;
  arcondicionado: boolean;
  visible?: boolean;
}


interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface Notification {
  message: string;
  type: 'success' | 'info';
}

// Static Property Data
const route = useRoute();
const property = ref<Property>({
  id: '1',
  title: 'Moradia T3 Moderna',
  location: 'Luanda, Talatona',
  price: 45000000,
  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  images: [
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585153490-76fb20a0f2c4?auto=format&fit=crop&w=1200&q=80',
  ],
  bedrooms: 3,
  bathrooms: 2,
  area: 150,
  status: 'Pronta para Morar',
  verified: true,
  description: 'Uma moradia T3 moderna localizada no coração de Talatona, com acabamentos de alta qualidade, cozinha equipada, e um amplo quintal. Perfeita para famílias que procuram conforto e sofisticação.',
  type: 'T3',
  garage: true,
  piscina: false,
  jardim: true,
  arcondicionado: true,
});

// Static Similar Properties
const similarProperties = ref<Property[]>([
  {
    id: '2',
    title: 'Casa T4 em Construção',
    location: 'Luanda, Ilha do Cabo',
    price: 32000000,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    images: [],
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    status: 'Em Construção',
    verified: false,
    description: '',
    type: 'T4',
    garage: true,
    piscina: false,
    jardim: false,
    arcondicionado: false,
    visible: false,
  },
  {
    id: '3',
    title: 'Villa Luxuosa T5',
    location: 'Luanda, Miramar',
    price: 75000000,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    images: [],
    bedrooms: 5,
    bathrooms: 4,
    area: 300,
    status: 'Inacabada',
    verified: true,
    description: '',
    type: 'T5',
    garage: true,
    piscina: true,
    jardim: true,
    arcondicionado: true,
    visible: false,
  },
  {
    id: '4',
    title: 'Casa T3 Inacabada',
    location: 'Benguela, Centro',
    price: 55000000,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80',
    images: [],
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    status: 'Inacabada',
    verified: false,
    description: '',
    type: 'T3',
    garage: false,
    piscina: false,
    jardim: false,
    arcondicionado: false,
    visible: false,
  },
]);

// Reactive States
const isHeroLoaded = ref(false);
const showScrollToTop = ref(false);
const isSidebarVisible = ref(false);
const panoramaVisible = ref(false);
const contactVisible = ref(false);
const favorites = ref<string[]>(JSON.parse(localStorage.getItem('favorites') || '[]'));
const isContactSubmitting = ref(false);
const notification = ref<Notification>({ message: '', type: 'info' });

// Contact Form Data
const contactForm = ref<ContactForm>({
  name: '',
  email: '',
  phone: '',
  message: '',
});

// Carousel Settings
const itemsToShow = ref(window.innerWidth < 768 ? 1 : 3);
const carouselBreakpoints = ref({
  0: { itemsToShow: 1, itemsToScroll: 1 },
  768: { itemsToShow: 3, itemsToScroll: 1 },
});

// Computed for Status Class
const statusClass = computed(() => ({
  'status-pronta': property.value.status === 'Pronta para Morar',
  'status-construcao': property.value.status === 'Em Construção',
  'status-inacabada': property.value.status === 'Inacabada',
}));

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(price);
};

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

const scrollToContact = () => {
  const contactSection = document.querySelector('.contact-section');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const toggleFavorite = (propertyId: string) => {
  const isFavorited = favorites.value.includes(propertyId);
  if (isFavorited) {
    favorites.value = favorites.value.filter(id => id !== propertyId);
    showNotification('Removido dos favoritos', 'info');
  } else {
    favorites.value.push(propertyId);
    showNotification('Adicionado aos favoritos', 'success');
  }
  localStorage.setItem('favorites', JSON.stringify(favorites.value));
};

const showNotification = (message: string, type: 'success' | 'info') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: 'info' };
  }, 3000);
};

const submitContactForm = () => {
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) {
    showNotification('Por favor, preencha todos os campos obrigatórios.', 'info');
    return;
  }
  isContactSubmitting.value = true;
  setTimeout(() => {
    isContactSubmitting.value = false;
    showNotification('Mensagem enviada com sucesso!', 'success');
    contactForm.value = { name: '', email: '', phone: '', message: '' };
  }, 1500);
};

const startVirtualTour = () => {
  showNotification('Tour virtual será disponibilizado em breve!', 'info');
};

const updateCarouselItems = () => {
  itemsToShow.value = window.innerWidth < 768 ? 1 : 3;
};

// Lifecycle Hooks
onMounted(() => {
  // Initialize hero section
  setTimeout(() => {
    isHeroLoaded.value = true;
    document.body.style.opacity = '1';
  }, 100);

  // Initialize Panorama
  const panoramaContainer = document.getElementById('panorama');
  if (panoramaContainer && property.value.images.length > 0) {
    const panorama = new PANOLENS.ImagePanorama(property.value.images[0]);
    const viewer = new PANOLENS.Viewer({
      container: panoramaContainer,
      autoRotate: true,
      autoRotateSpeed: 0.5,
      controlBar: true,
    });
    viewer.add(panorama);
  }

  // Initialize Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('panorama-container')) {
            panoramaVisible.value = true;
          } else if (entry.target.classList.contains('contact-card')) {
            contactVisible.value = true;
          } else if (entry.target.classList.contains('property-card')) {
            const id = (entry.target as HTMLElement).dataset.propertyId;
            const property = similarProperties.value.find(p => p.id === id);
            if (property) property.visible = true;
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
    document.querySelectorAll('.panorama-container, .contact-card, .property-card').forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 0.2}s`;
      observer.observe(card);
    });
  }, 100);

  // Scroll events
  const handleScroll = () => {
    isSidebarVisible.value = window.scrollY > 300;
    showScrollToTop.value = window.scrollY > 300;
    // Parallax effect for hero
    const heroImages = document.querySelectorAll('.property-hero img');
    if (heroImages.length) {
      const scrollPosition = window.scrollY;
      heroImages.forEach(image => {
        (image as HTMLElement).style.transform = `translateY(${scrollPosition * 0.2}px)`;
      });
    }
  };
  window.addEventListener('scroll', handleScroll);

  // Window resize for carousel
  window.addEventListener('resize', updateCarouselItems);

  // Cleanup
  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', updateCarouselItems);
  };
});
</script>

<style scoped>
:root {
  --primary-red: #d32f2f;
  --soft-red: rgba(211, 47, 47, 0.1);
  --dark-charcoal: #1a1a2e;
  --medium-gray: #4a4a68;
  --light-bg: #f5f6fa;
  --card-bg: rgba(255, 255, 255, 0.95);
  --glass-bg: rgba(255, 255, 255, 0.9);
  --shadow-light: rgba(26, 26, 46, 0.08);
  --shadow-medium: rgba(26, 26, 46, 0.15);
  --animation-ease: cubic-bezier(0.4, 0, 0.2, 1);
}

.main {
  min-height: 100vh;
  background: var(--light-bg);
}

.property-hero {
  padding: 100px 0 80px;
  background: linear-gradient(135deg, var(--soft-red) 0%, var(--light-bg) 100%);
  position: relative;
  overflow: hidden;
}

.property-hero::before {
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

.property-hero .container {
  position: relative;
  z-index: 1;
}

.property-hero.loaded {
  opacity: 1;
  transform: translateY(0);
}

.property-title {
  font-size: 3rem;
  font-weight: 900;
  color: var(--dark-charcoal);
  margin-bottom: 15px;
  text-shadow: 0 2px 4px var(--shadow-light);
}

.property-location {
  font-size: 1.3rem;
  color: var(--medium-gray);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.property-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-red);
  margin-bottom: 20px;
}

.property-status-badge {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  color: #fff;
}

.status-pronta {
  background: var(--primary-red);
}

.status-construcao {
  background: var(--primary-red);
}

.status-inacabada {
  background: var(--primary-red);
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  color: var(--primary-red);
  font-weight: 600;
  background: var(--soft-red);
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 8px var(--shadow-light);
}

.favorite-btn {
  background: var(--glass-bg);
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  color: var(--medium-gray);
  transition: all 0.3s var(--animation-ease);
  box-shadow: 0 2px 8px var(--shadow-light);
  backdrop-filter: blur(8px);
}

.favorite-btn i {
  margin-right: 8px;
}

.favorite-btn:hover {
  color: var(--primary-red);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-medium);
}

.favorite-btn.favorited {
  color: var(--primary-red);
}

.favorite-btn.favorited i {
  color: var(--primary-red);
}

.property-hero .carousel img {
  border-radius: 16px;
  max-height: 450px;
  object-fit: cover;
  width: 100%;
  transition: transform 0.3s var(--animation-ease);
}

.property-hero .carousel img:hover {
  transform: scale(1.05);
}

.carousel :deep(.carousel__prev),
.carousel :deep(.carousel__next) {
  width: 50px;
  height: 50px;
  background: var(--dark-charcoal);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s var(--animation-ease);
}

.carousel :deep(.carousel__prev:hover),
.carousel :deep(.carousel__next:hover) {
  background: var(--primary-red);
}

.carousel :deep(.carousel__pagination) {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.carousel :deep(.carousel__pagination-button) {
  width: 12px;
  height: 12px;
  background: var(--medium-gray);
  border-radius: 50%;
  margin: 0 6px;
  transition: all 0.3s var(--animation-ease);
}

.carousel :deep(.carousel__pagination-button--active) {
  background: var(--primary-red);
  transform: scale(1.2);
}

.sticky-sidebar {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 300px;
  background: var(--glass-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 20px var(--shadow-light);
  border: 2px solid transparent;
  background-clip: padding-box;
  backdrop-filter: blur(8px);
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s var(--animation-ease);
  z-index: 999;
}

.sticky-sidebar::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, var(--primary-red), var(--soft-red));
  border-radius: 16px;
  z-index: -1;
}

.sticky-sidebar.visible {
  opacity: 1;
  transform: translateX(0);
}

.sidebar-content h4 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 15px;
}

.sidebar-details {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.sidebar-details li {
  font-size: 1rem;
  color: var(--medium-gray);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.sidebar-details i {
  color: var(--primary-red);
}

.btn-contact, .btn-whatsapp, .btn-chat, .btn-tour {
  background: var(--primary-red);
  color: #fff;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 600;
  border: none;
  transition: all 0.3s var(--animation-ease);
  width: 100%;
  text-align: center;
}

.btn-whatsapp {
  background: #25D366;
}

.btn-contact:hover, .btn-whatsapp:hover, .btn-tour:hover {
  background: #b71c1c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-medium);
}

.btn-whatsapp:hover {
  background: #20b354;
}

.btn-chat {
  background: var(--medium-gray);
  cursor: not-allowed;
  position: relative;
}

.btn-chat .tooltip {
  visibility: hidden;
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark-charcoal);
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  white-space: nowrap;
  z-index: 10;
}

.btn-chat:hover .tooltip {
  visibility: visible;
}

.btn-tour {
  background: var(--primary-red);
}

.property-3d-view {
  background: var(--light-bg);
  padding: 80px 0;
}

.panorama-container {
  border-radius: 16px;
  box-shadow: 0 6px 20px var(--shadow-light);
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.5s var(--animation-ease);
}

.panorama-container.visible {
  opacity: 1;
  transform: translateY(0);
}

.virtual-tour-placeholder {
  margin-top: 20px;
}

.section-title {
  font-size: 2.8rem;
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
  width: 60px;
  height: 3px;
  background: var(--primary-red);
  border-radius: 1.5px;
}

.section-subtitle {
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--medium-gray);
  max-width: 800px;
  margin: 0 auto 30px;
}

.property-details {
  background: var(--light-bg);
  padding: 80px 0;
}

.details-list {
  list-style: none;
  padding: 0;
}

.details-list li {
  font-size: 1.1rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.details-list i {
  color: var(--primary-red);
}

.details-list strong {
  margin-left: 10px;
  font-weight: 600;
}

.property-description h3 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--dark-charcoal);
}

.property-description p {
  font-size: 1.1rem;
  color: var(--medium-gray);
  line-height: 1.8;
}

.contact-section {
  background: linear-gradient(135deg, var(--light-bg), var(--soft-red));
  padding: 80px 0;
}

.contact-card {
  background: var(--glass-bg);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 6px 20px var(--shadow-light);
  border: 2px solid transparent;
  background-clip: padding-box;
  backdrop-filter: blur(8px);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.5s var(--animation-ease);
}

.contact-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.contact-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px var(--shadow-medium);
}

.contact-form .form-control {
  border: 1px solid var(--soft-red);
  border-radius: 10px;
  padding: 12px 16px;
  transition: all 0.3s var(--animation-ease);
  color: var(--dark-charcoal);
  background: var(--glass-bg);
}

.contact-form .form-control:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 8px var(--shadow-light);
  outline: none;
}

.form-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark-charcoal);
}

.contact-info p {
  font-size: 1.1rem;
  color: var(--medium-gray);
  margin-bottom: 15px;
}

.contact-info i {
  color: var(--primary-red);
}

.similar-properties {
  background: var(--light-bg);
  padding: 80px 0;
}

.property-card {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px var(--shadow-light);
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: all 0.4s var(--animation-ease);
  opacity: 0;
  transform: translateY(30px);
  margin-bottom: 30px;
  backdrop-filter: blur(8px);
}

.property-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, var(--primary-red), var(--soft-red));
  border-radius: 16px;
  z-index: -1;
}

.property-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.property-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px var(--shadow-medium);
}

.property-image {
  height: 260px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.5s var(--animation-ease);
}

.property-card:hover .property-image {
  transform: scale(1.03);
}

.property-card .favorite-btn {
  position: absolute;
  top: 15px;
  left: 15px;
  background: var(--glass-bg);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--medium-gray);
  transition: all 0.3s var(--animation-ease);
  box-shadow: 0 2px 6px var(--shadow-light);
  backdrop-filter: blur(8px);
}

.property-card .favorite-btn:hover {
  color: var(--primary-red);
  transform: scale(1.1);
}

.property-card .favorite-btn.favorited {
  color: var(--primary-red);
}

.property-card .verified-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--primary-red);
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 2px 8px var(--shadow-light);
}

.property-card .price-tag {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: var(--dark-charcoal);
  color: #fff;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1rem;
  backdrop-filter: blur(8px);
  transition: all 0.3s var(--animation-ease);
}

.property-info {
  padding: 25px;
}

.property-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 10px;
}

.property-card:hover .property-title {
  color: var(--primary-red);
}

.property-location {
  color: var(--medium-gray);
  font-size: 0.95rem;
  margin-bottom: 15px;
}

.property-features {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 0.9rem;
  color: var(--medium-gray);
  font-weight: 500;
  margin-bottom: 10px;
}

.property-status {
  font-size: 0.9rem;
  color: var(--primary-red);
  font-weight: 600;
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
  background: var(--primary-red);
  z-index: 9999;
  animation: fadeIn 0.3s var(--animation-ease);
}

@media (min-width: 1400px) {
  .container {
    max-width: 1320px;
  }
}

@media (max-width: 992px) {
  .property-hero {
    padding: 80px 0 60px;
  }

  .property-title {
    font-size: 2.5rem;
  }

  .property-price {
    font-size: 2rem;
  }

  .sticky-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .property-hero {
    padding: 60px 0 40px;
  }

  .property-title {
    font-size: 2.2rem;
  }

  .property-price {
    font-size: 1.8rem;
  }

  .property-location {
    font-size: 1.2rem;
  }

  .property-status-badge {
    font-size: 0.9rem;
    padding: 8px 20px;
  }

  .panorama-container {
    height: 300px;
  }

  .section-title {
    font-size: 2.2rem;
  }

  .section-subtitle {
    font-size: 1.2rem;
  }

  .details-list li {
    font-size: 1rem;
  }

  .property-description h3 {
    font-size: 1.4rem;
  }

  .property-image {
    height: 220px;
  }
}

@media (max-width: 576px) {
  .property-title {
    font-size: 1.8rem;
  }

  .property-price {
    font-size: 1.6rem;
  }

  .property-location {
    font-size: 1rem;
  }

  .property-hero .carousel img {
    max-height: 300px;
  }

  .panorama-container {
    height: 250px;
  }

  .contact-form .form-control {
    padding: 10px 12px;
  }

  .btn-contact, .btn-whatsapp, .btn-chat, .btn-tour {
    padding: 10px 20px;
  }

  .alert {
    top: 60px;
    right: 15px;
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
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