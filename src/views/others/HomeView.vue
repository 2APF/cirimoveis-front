<template>
  <main class="main" id="top">
    <NavbarComponent active="home" />

    <!-- Hero Section -->
    <section id="home" class="hero d-flex align-items-center mt-5" :class="{ loaded: isHeroLoaded }">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center hero-content">
            <h1>Descubra o Seu <span class="text-danger">Imóvel</span> Perfeito em <span class="text-danger">Angola</span></h1>
            <p>Explore casas, apartamentos e terrenos verificados com a Cirimoveis</p>
            <div class="hero-actions mt-4">
              <button class="btn visit-btn" @click="scheduleVisit">
                <i class="fas fa-calendar-alt me-2"></i> Agendar Visita
              </button>
              <div class="quick-links mt-3">
                <router-link to="/propriedades?type=casa" class="btn quick-link-btn">Casas</router-link>
                <router-link to="/propriedades?type=apartamento" class="btn quick-link-btn">Apartamentos</router-link>
                <router-link to="/propriedades?type=terreno" class="btn quick-link-btn">Terrenos</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Property Section -->
    <section class="featured-property-section py-5">
      <div class="container">
        <h2 class="section-title">Imóvel em Destaque</h2>
        <div class="row">
          <div class="col-12" v-if="highlightedProperty">
            <div class="featured-property-card" :data-property-id="highlightedProperty.id" :class="{ visible: highlightedProperty.visible }">
              <div class="row g-0">
                <div class="col-md-6">
                  <div class="featured-property-image" :style="{ backgroundImage: `url(${highlightedProperty.image})` }">
                    <button class="favorite-btn" :class="{ favorited: favorites.includes(highlightedProperty.id) }" @click.stop="toggleFavorite(highlightedProperty.id)">
                      <i :class="favorites.includes(highlightedProperty.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
                    </button>
                    <div v-if="highlightedProperty.verified" class="verified-badge">
                      <i class="fas fa-check me-1"></i>Verificada
                    </div>
                    <div class="price-tag">{{ highlightedProperty.price }}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="featured-property-info">
                    <h3 class="property-title">{{ highlightedProperty.title }}</h3>
                    <p class="property-location"><i class="fas fa-map-marker-alt me-1"></i>{{ highlightedProperty.location }}</p>
                    <p class="property-description">{{ highlightedProperty.description }}</p>
                    <div class="property-features">
                      <span><i class="fas fa-bed me-1"></i>{{ highlightedProperty.bedrooms }} Quartos</span>
                      <span><i class="fas fa-bath me-1"></i>{{ highlightedProperty.bathrooms }} WC</span>
                      <span><i class="fas fa-ruler-combined me-1"></i>{{ highlightedProperty.area }}m²</span>
                    </div>
                    <p class="property-status">Estado: {{ highlightedProperty.status }}</p>
                    <router-link :to="{ name: 'app.property.detail', params: { id: highlightedProperty.id } }" class="btn details-btn">Ver Detalhes</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Most Viewed Properties Carousel -->
    <section class="carousel-section py-5">
      <div class="container">
        <h2 class="section-title">Propriedades Mais Vistas</h2>
        <Carousel :items-to-show="itemsToShow" :items-to-scroll="1" :wrap-around="true" :autoplay="5000" :transition="600" :breakpoints="carouselBreakpoints">
          <Slide v-for="property in mostViewedProperties" :key="property.id">
            <div class="col-12">
              <div class="property-card" :data-property-id="property.id" :class="{ visible: property.visible }">
                <div class="property-image" :style="{ backgroundImage: `url(${property.image})` }">
                  <button class="favorite-btn" :class="{ favorited: favorites.includes(property.id) }" @click.stop="toggleFavorite(property.id)">
                    <i :class="favorites.includes(property.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
                  </button>
                  <div v-if="property.verified" class="verified-badge">
                    <i class="fas fa-check me-1"></i>Verificada
                  </div>
                  <div class="price-tag">{{ property.price }}</div>
                </div>
                <div class="property-info">
                  <h5 class="property-title">{{ property.title }}</h5>
                  <p class="property-location"><i class="fas fa-map-marker-alt me-1"></i>{{ property.location }}</p>
                  <div class="property-features">
                    <span><i class="fas fa-bed me-1"></i>{{ property.bedrooms }} Quartos</span>
                    <span><i class="fas fa-bath me-1"></i>{{ property.bathrooms }} WC</span>
                    <span><i class="fas fa-ruler-combined me-1"></i>{{ property.area }}m²</span>
                  </div>
                  <p class="property-status">Estado: {{ property.status }}</p>
                  <router-link :to="{ name: 'app.property.detail', params: { id: property.id } }" class="btn details-btn">Ver Detalhes</router-link>
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

    
    <section class="carousel-section py-5 bg-light">
      <div class="container">
        <h2 class="section-title">Propriedades Mais Amadas</h2>
        <Carousel :items-to-show="itemsToShow" :items-to-scroll="1" :wrap-around="true" :autoplay="5000" :transition="600" :breakpoints="carouselBreakpoints">
          <Slide v-for="property in mostLovedProperties" :key="property.id">
            <div class="col-12">
              <div class="property-card" :data-property-id="property.id" :class="{ visible: property.visible }">
                <div class="property-image" :style="{ backgroundImage: `url(${property.image})` }">
                  <button class="favorite-btn" :class="{ favorited: favorites.includes(property.id) }" @click.stop="toggleFavorite(property.id)">
                    <i :class="favorites.includes(property.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
                  </button>
                  <div v-if="property.verified" class="verified-badge">
                    <i class="fas fa-check me-1"></i>Verificada
                  </div>
                  <div class="price-tag">{{ property.price }}</div>
                </div>
                <div class="property-info">
                  <h5 class="property-title">{{ property.title }}</h5>
                  <p class="property-location"><i class="fas fa-map-marker-alt me-1"></i>{{ property.location }}</p>
                  <div class="property-features">
                    <span><i class="fas fa-bed me-1"></i>{{ property.bedrooms }} Quartos</span>
                    <span><i class="fas fa-bath me-1"></i>{{ property.bathrooms }} WC</span>
                    <span><i class="fas fa-ruler-combined me-1"></i>{{ property.area }}m²</span>
                  </div>
                  <p class="property-status">Estado: {{ property.status }}</p>
                  <router-link :to="{ name: 'app.property.detail', params: { id: property.id } }" class="btn details-btn">Ver Detalhes</router-link>
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

    
    <section class="carousel-section py-5">
      <div class="container">
        <h2 class="section-title">Propriedades Verificadas</h2>
        <Carousel :items-to-show="itemsToShow" :items-to-scroll="1" :wrap-around="true" :autoplay="5000" :transition="600" :breakpoints="carouselBreakpoints">
          <Slide v-for="property in verifiedProperties" :key="property.id">
            <div class="col-12">
              <div class="property-card" :data-property-id="property.id" :class="{ visible: property.visible }">
                <div class="property-image" :style="{ backgroundImage: `url(${property.image})` }">
                  <button class="favorite-btn" :class="{ favorited: favorites.includes(property.id) }" @click.stop="toggleFavorite(property.id)">
                    <i :class="favorites.includes(property.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
                  </button>
                  <div v-if="property.verified" class="verified-badge">
                    <i class="fas fa-check me-1"></i>Verificada
                  </div>
                  <div class="price-tag">{{ property.price }}</div>
                </div>
                <div class="property-info">
                  <h5 class="property-title">{{ property.title }}</h5>
                  <p class="property-location"><i class="fas fa-map-marker-alt me-1"></i>{{ property.location }}</p>
                  <div class="property-features">
                    <span><i class="fas fa-bed me-1"></i>{{ property.bedrooms }} Quartos</span>
                    <span><i class="fas fa-bath me-1"></i>{{ property.bathrooms }} WC</span>
                    <span><i class="fas fa-ruler-combined me-1"></i>{{ property.area }}m²</span>
                  </div>
                  <p class="property-status">Estado: {{ property.status }}</p>
                  <router-link :to="{ name: 'app.property.detail', params: { id: property.id } }" class="btn details-btn">Ver Detalhes</router-link>
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
    <div v-if="notification.message" class="alert" :class="notification.type">
      <i :class="notification.type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle'"></i>
      {{ notification.message }}
    </div>
  </main>
</template>


<script setup lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue';
import { ref, onMounted, computed } from 'vue';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import { useRouter } from 'vue-router';
import FooterComponent from '@/components/FooterComponent.vue';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: string;
  verified: boolean;
  visible: boolean;
  description?: string;
  views?: number;
  favoritesCount?: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  social: { platform: string; link: string; icon: string }[];
  visible: boolean;
}

const router = useRouter();
const isHeroLoaded = ref(false);
const showScrollToTop = ref(false);
const favorites = ref<string[]>(JSON.parse(localStorage.getItem('favorites') || '[]'));
const notification = ref({ message: '', type: 'success' as 'success' | 'info' });

// Properties Data
const properties = ref<Property[]>([
  {
    id: '1',
    title: 'Moradia T3 Moderna',
    location: 'Luanda, Talatona',
    price: '45M Kz',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    status: 'Pronta para Morar',
    verified: true,
    visible: false,
    description: 'Uma moradia T3 moderna com acabamentos de alta qualidade, ideal para famílias que buscam conforto.',
    views: 1200,
    favoritesCount: 150,
  },
  {
    id: '2',
    title: 'Casa T4 em Construção',
    location: 'Luanda, Ilha do Cabo',
    price: '32M Kz',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    status: 'Em Construção',
    verified: false,
    visible: false,
    description: 'Casa T4 em construção com design contemporâneo, localizada numa área privilegiada.',
    views: 800,
    favoritesCount: 90,
  },
  {
    id: '3',
    title: 'Villa Luxuosa T5',
    location: 'Luanda, Miramar',
    price: '75M Kz',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    bedrooms: 5,
    bathrooms: 4,
    area: 300,
    status: 'Inacabada',
    verified: true,
    visible: false,
    description: 'Villa T5 luxuosa com vista para o mar, perfeita para quem busca exclusividade.',
    views: 1500,
    favoritesCount: 200,
  },
  {
    id: '4',
    title: 'Casa T3 Inacabada',
    location: 'Benguela, Centro',
    price: '55M Kz',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    status: 'Inacabada',
    verified: false,
    visible: false,
    description: 'Casa T3 com potencial para personalização, localizada no coração de Benguela.',
    views: 600,
    favoritesCount: 50,
  },
  {
    id: '5',
    title: 'Casa T2 Pronta',
    location: 'Huambo, Periferia',
    price: '28M Kz',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    status: 'Pronta para Morar',
    verified: true,
    visible: false,
    description: 'Casa T2 compacta e pronta para morar, ideal para casais ou pequenas famílias.',
    views: 900,
    favoritesCount: 120,
  },
  {
    id: '6',
    title: 'Moradia T4 em Construção',
    location: 'Cabinda, Centro',
    price: '38M Kz',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    status: 'Em Construção',
    verified: false,
    visible: false,
    description: 'Moradia T4 em construção, com amplo espaço e localização central.',
    views: 700,
    favoritesCount: 80,
  },
]);

// Computed Properties for Carousels
const highlightedProperty = computed(() => properties.value.find(p => p.id === '3')); // Highlight Villa Luxuosa T5
const mostViewedProperties = computed(() => properties.value.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6));
const mostLovedProperties = computed(() => properties.value.sort((a, b) => (b.favoritesCount || 0) - (a.favoritesCount || 0)).slice(0, 6));
const verifiedProperties = computed(() => properties.value.filter(p => p.verified).slice(0, 6));



// Carousel Settings
const itemsToShow = ref(window.innerWidth < 768 ? 1 : 3);
const carouselBreakpoints = ref({
  0: { itemsToShow: 1, itemsToScroll: 1 },
  768: { itemsToShow: 3, itemsToScroll: 1 },
});

// Methods
const updateCarouselItems = () => {
  itemsToShow.value = window.innerWidth < 768 ? 1 : 3;
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

const scheduleVisit = () => {
  showNotification('Agendamento de visita iniciado! Entraremos em contato em breve.', 'success');
  // Add logic to open a contact form or redirect to a scheduling page
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
          const propertyId = (entry.target as HTMLElement).dataset.propertyId;
          const property = properties.value.find(p => p.id === propertyId);
          
          if (property) {
            property.visible = true;
          }
          
          (entry.target as HTMLElement).style.animation = 'fadeInUp 0.6s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe property and team cards
  setTimeout(() => {
    document.querySelectorAll('.property-card, .team-card, .featured-property-card').forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
      observer.observe(card);
    });
  }, 100);

  // Scroll events
  const handleScroll = () => {
    showScrollToTop.value = window.scrollY > 300;
  };
  window.addEventListener('scroll', handleScroll);

  // Window resize for carousel
  window.addEventListener('resize', updateCarouselItems);

  // Initialize price tag hover effects
  document.querySelectorAll('.price-tag').forEach(tag => {
    const original = tag.textContent || '';
    tag.addEventListener('mouseenter', () => {
      tag.innerHTML = `<i class="fas fa-money-bill-wave me-1"></i>${original}`;
    });
    tag.addEventListener('mouseleave', () => {
      tag.textContent = original;
    });
  });

  // Initialize favorites
  favorites.value.forEach(id => {
    const btn = document.querySelector(`[data-property-id="${id}"] .favorite-btn`);
    if (btn) {
      btn.querySelector('i')?.classList.replace('far', 'fas');
      btn.classList.add('favorited');
    }
  });

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
  --soft-red: #ffcccb;
  --light-bg: #f5f7fa;
  --card-bg: #ffffff;
  --dark-charcoal: #1a1a2e;
  --medium-gray: #6b7280;
  --shadow-light: rgba(0, 0, 0, 0.05);
  --shadow-medium: rgba(0, 0, 0, 0.1);
  --animation-ease: cubic-bezier(0.4, 0, 0.2, 1);
}

.main {
  min-height: 100vh;
  background: var(--light-bg);
}

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
  opacity: 0.1;
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

.hero p {
  font-size: 1.3rem;
  color: var(--medium-gray);
  margin-bottom: 30px;
  font-weight: 500;
}

.visit-btn {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  color: #fff;
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  transition: all 0.3s var(--animation-ease);
  box-shadow: 0 3px 10px rgba(211, 47, 47, 0.2);
}

.visit-btn:hover {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-2px);
}

.quick-links {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-link-btn {
  background: var(--card-bg);
  color: var(--dark-charcoal);
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 500;
  border: 1px solid var(--soft-red);
  transition: all 0.3s var(--animation-ease);
}

.quick-link-btn:hover {
  background: var(--primary-red);
  color: #fff;
  border-color: var(--primary-red);
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

.featured-property-card {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px var(--shadow-light);
  transition: all 0.4s var(--animation-ease);
  border: 1px solid var(--soft-red);
  opacity: 0;
  transform: translateY(20px);
  margin-bottom: 30px;
}

.featured-property-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.featured-property-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px var(--shadow-medium);
}

.featured-property-image {
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.featured-property-info {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.featured-property-info .property-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--dark-charcoal);
}

.featured-property-info .property-description {
  font-size: 1rem;
  color: var(--medium-gray);
}

.property-card {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px var(--shadow-light);
  transition: all 0.4s var(--animation-ease);
  border: 1px solid var(--soft-red);
  opacity: 0;
  transform: translateY(20px);
  margin-bottom: 30px;
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

.favorite-btn {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  transition: all 0.3s var(--animation-ease);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.favorite-btn:hover {
  color: var(--primary-red);
  transform: scale(1.1);
}

.favorite-btn.favorited {
  color: var(--primary-red);
}

.verified-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--primary-red);
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.2);
}

.price-tag {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: rgba(26, 26, 46, 0.9);
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
  font-size: 1.25rem;
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
  font-size: 0.85rem;
  color: var(--primary-red);
  font-weight: 600;
}

.details-btn {
  background: var(--primary-red);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s var(--animation-ease);
}

.details-btn:hover {
  background: #b71c1c;
  transform: translateY(-2px);
}

.carousel-section {
  padding: 60px 0;
}

.carousel {
  padding: 0 40px;
}

.carousel :deep(.carousel__prev),
.carousel :deep(.carousel__next) {
  width: 40px;
  height: 40px;
  background: rgba(26, 26, 46, 0.7);
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
  padding: 0 15px;
}

.bg-light {
  background: #f9fafb;
}

.team-section {
  background: linear-gradient(135deg, var(--light-bg), var(--soft-red));
  padding: 60px 0;
}

.team-card {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px var(--shadow-light);
  transition: all 0.4s var(--animation-ease);
  border: 1px solid var(--soft-red);
  opacity: 0;
  transform: translateY(20px);
  margin-bottom: 30px;
}

.team-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px var(--shadow-medium);
}

.team-image {
  height: 220px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.team-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent, rgba(26, 26, 46, 0.8));
  opacity: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: opacity 0.3s var(--animation-ease);
  padding-bottom: 20px;
}

.team-card:hover .team-overlay {
  opacity: 1;
}

.team-social .social-icon {
  color: #fff;
  font-size: 1.3rem;
  margin: 0 12px;
  transition: all 0.3s var(--animation-ease);
}

.team-social .social-icon:hover {
  color: var(--primary-red);
  transform: scale(1.15);
}

.team-info {
  padding: 25px;
  text-align: center;
}

.team-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 8px;
}

.team-role {
  font-size: 1rem;
  color: var(--primary-red);
  margin-bottom: 10px;
  font-weight: 600;
}

.team-bio {
  font-size: 0.9rem;
  color: var(--medium-gray);
  margin-bottom: 0;
}

.alert {
  position: fixed;
  top: 80px;
  right: 15px;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 3px 10px var(--shadow-medium);
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
    max-width: 1280px;
  }
}

@media (max-width: 992px) {
  .hero {
    padding: 80px 0;
    min-height: 60vh;
  }
  .hero h1 {
    font-size: 2.8rem;
  }
  .featured-property-image {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.4rem;
  }
  .hero p {
    font-size: 1.1rem;
  }
  .section-title {
    font-size: 2rem;
  }
  .featured-property-image {
    height: 250px;
  }
  .property-image {
    height: 220px;
  }
}

@media (max-width: 576px) {
  .hero h1 {
    font-size: 2rem;
  }
  .hero p {
    font-size: 1rem;
  }
  .visit-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  .quick-link-btn {
    padding: 6px 16px;
    font-size: 0.85rem;
  }
  .featured-property-image {
    height: 200px;
  }
  .featured-property-info {
    padding: 20px;
  }
  .property-info {
    padding: 20px;
  }
  .alert {
    top: 50px;
    right: 10px;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
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