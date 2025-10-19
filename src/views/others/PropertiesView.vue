<template>
  <main class="main" id="top">
    
    <NavbarComponent active="properties" />

    
    <section id="home" class="hero d-flex align-items-center" :class="{ loaded: isHeroLoaded }">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center hero-content">
            <h1>Encontre a Casa dos Seus Sonhos</h1>
            <!-- <p>Propriedades verificadas em todo Angola, prontas para transformar sua visão em realidade</p> -->
          </div>
        </div>
      </div>
    </section>


    <div class="container">
      <div class="filters">
        <h3 class="filters-title">Pesquise o Seu Imóvel Ideal</h3>
        <div class="row g-3">
          <div class="col-lg-2 col-md-4 col-sm-6 position-relative">
            <input
              type="text"
              class="form-control"
              placeholder="Pesquisar Província"
              v-model="filters.province"
              @input="filterCities"
              @focus="showCitySuggestions = true"
              @blur="delayHideCitySuggestions"
              aria-label="Pesquisar Província"
            >
            <ul class="city-suggestions" v-if="showCitySuggestions && filteredCities.length">
              <li
                v-for="city in filteredCities"
                :key="city"
                @mousedown.prevent="selectCity(city)"
                class="city-suggestion-item"
              >
                {{ city }}
              </li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-4 col-sm-6" v-for="filter in selectFilters" :key="filter.label">
            <select
              class="form-select"
              :aria-label="filter.label"
              v-model="filters[filter.key]"
              @change="handleFilterChange($event)"
            >
              <option v-for="option in filter.options" :value="option" :key="option">
                {{ option }}
              </option>
            </select>
          </div>
          <div class="col-lg-2 col-md-4 col-sm-6">
            <div class="form-check mt-3" v-for="checkbox in checkboxFilters" :key="checkbox.id">
              <input
                class="form-check-input"
                type="checkbox"
                :id="checkbox.id"
                v-model="filters[checkbox.id]"
              >
              <label class="form-check-label" :for="checkbox.id">{{ checkbox.label }}</label>
            </div>
          </div>
          <div class="col-lg-2 col-md-4 col-sm-12">
            <button
              class="btn filter-btn w-100"
              @click="applyFilters"
              :disabled="isFiltering"
            >
              <i :class="isFiltering ? 'fas fa-spinner fa-spin me-2' : 'fas fa-search me-2'"></i>
              {{ isFiltering ? 'Pesquisando...' : 'Pesquisar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    

    <section id="propriedades" class="properties-section py-5">
      <div class="container">
        <!-- <h2 class="section-title">Todas as Propriedades</h2> -->
        <div class="row">
          <div
            class="col-12 col-md-4 col-lg-4"
            v-for="property in properties"
            :key="property.id"
          >
            <div
              class="property-card"
              :data-property-id="property.id"
              :class="{ visible: property.visible }"
              @click="showPropertyDetails(property)"
            >
              <div
                class="property-image"
                :style="{ backgroundImage: `url(${property.image})` }"
              >
                <button
                  class="favorite-btn"
                  :class="{ favorited: favorites.includes(property.id) }"
                  @click.stop="toggleFavorite(property.id)"
                >
                  <i :class="favorites.includes(property.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
                </button>
                <div v-if="property.verified" class="verified-badge">
                  <i class="fas fa-check me-1"></i>Verificada
                </div>
                <div class="price-tag">{{ property.price }}</div>
              </div>
              <div class="property-info">
                <h5 class="property-title">{{ property.title }}</h5>
                <p class="property-location">
                  <i class="fas fa-map-marker-alt me-1"></i>{{ property.location }}
                </p>
                <div class="property-features">
                  <span><i class="fas fa-bed me-1"></i>{{ property.bedrooms }} Quartos</span>
                  <span><i class="fas fa-bath me-1"></i>{{ property.bathrooms }} WC</span>
                  <span><i class="fas fa-ruler-combined me-1"></i>{{ property.area }}m²</span>
                </div>
                <p class="property-status">Estado: {{ property.status }}</p>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    
    <FooterComponent />

    <!-- Floating Filter Button -->
    <button
      class="floating-filter-btn"
      :class="{ visible: showFloatingButton }"
      id="floatingFilterBtn"
      title="Filtrar Casas"
      @click="scrollToFilters"
    >
      <i class="fas fa-filter fa-lg"></i>
    </button>

    <!-- Scroll to Top Button -->
    <button
      id="scrollToTopBtn"
      class="btn btn-danger position-fixed rounded-circle"
      :style="{ display: showScrollToTop ? 'block' : 'none' }"
      @click="scrollToTop"
    >
      <i class="fas fa-arrow-up"></i>
    </button>

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
import router from '@/router';
import { ref, onMounted, computed } from 'vue';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

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
}

interface Filter {
  label: string;
  key: string;
  options: string[];
}

interface Filters {
  [key: string]: string | boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  social: { platform: string; link: string; icon: string }[];
}


const isHeroLoaded = ref(false);
const isFiltering = ref(false);
const showFloatingButton = ref(false);
const showScrollToTop = ref(false);
const showCitySuggestions = ref(false);
const favorites = ref<string[]>(JSON.parse(localStorage.getItem('favorites') || '[]'));
const citySearchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const notification = ref({
  message: '',
  type: 'success' as 'success' | 'info',
});

// City Search
const cities = ref<string[]>([
  'Luanda', 'Benguela', 'Huíla', 'Cabinda', 'Huambo', 'Moxico', 'Namibe', 'Lobito',
  'Lubango', 'Kuito', 'Malanje', 'Uíge', 'Sumbe', 'N’dalatando', 'M’banza-Kongo'
]);
const filteredCities = ref<string[]>([]);

// Filters
const selectFilters = ref<Filter[]>([
  {
    label: 'Preço (AOA)',
    key: 'price',
    options: ['Preço (AOA)', 'Até 5M Kz', '5M - 10M Kz', '10M - 25M Kz', '25M - 50M Kz', '50M - 100M Kz', '100M - 200M Kz', 'Mais de 200M Kz'],
  },
  {
    label: 'Estado',
    key: 'status',
    options: ['Estado', 'Em Construção', 'Inacabada', 'Pronta'],
  },
  {
    label: 'Tipologia',
    key: 'type',
    options: ['Tipologia', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6+'],
  },
  {
    label: 'Área',
    key: 'area',
    options: ['Área', 'Até 50m²', '50m² - 100m²', '100m² - 200m²', '200m² - 500m²', 'Mais de 500m²'],
  }
]);

const checkboxFilters = ref([
  { id: 'verified', label: 'Apenas Verificadas' },
]);

const filters = ref<Filters>({
  province: '',
  price: 'Preço (AOA)',
  status: 'Estado',
  type: 'Tipologia',
  bedrooms: 'Quartos',
  bathrooms: 'WC',
  area: 'Área',
  garage: 'Garagem',
  verified: false,
  piscina: false,
  jardim: false,
  arcondicionado: false,
});

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
  },
]);

// Computed property for featured properties
const featuredProperties = computed(() => properties.value.slice(0, 6));

// Carousel settings
const itemsToShow = ref(window.innerWidth < 768 ? 1 : 3);
const carouselBreakpoints = ref({
  0: {
    itemsToShow: 1,
    itemsToScroll: 1,
  },
  768: {
    itemsToShow: 3,
    itemsToScroll: 1,
  },
});

// Team Members Data
const teamMembers = ref<TeamMember[]>([
  {
    id: '1',
    name: 'Ana Silva',
    role: 'Gestora Imobiliária',
    bio: 'Com mais de 10 anos de experiência, Ana especializa-se em encontrar residências perfeitas em Luanda e arredores.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    social: [
      { platform: 'linkedin', link: '#', icon: 'fab fa-linkedin-in' },
      { platform: 'twitter', link: '#', icon: 'fab fa-twitter' },
    ],
  },
  {
    id: '2',
    name: 'João Mendes',
    role: 'Corretor de Imóveis',
    bio: 'João é dedicado a proporcionar um serviço excepcional, ajudando clientes a encontrar casas em Benguela e Huíla.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    social: [
      { platform: 'linkedin', link: '#', icon: 'fab fa-linkedin-in' },
      { platform: 'instagram', link: '#', icon: 'fab fa-instagram' },
    ],
  },
  {
    id: '3',
    name: 'Maria Costa',
    role: 'Consultora de Investimentos',
    bio: 'Maria foca em investimentos imobiliários, garantindo alto retorno para clientes em todo Angola.',
    image: 'https://images.unsplash.com/photo-1485206412256-7016b7798b1c?auto=format&fit=crop&w=400&q=80',
    social: [
      { platform: 'linkedin', link: '#', icon: 'fab fa-linkedin-in' },
      { platform: 'facebook', link: '#', icon: 'fab fa-facebook-f' },
    ],
  },
  {
    id: '4',
    name: 'Pedro Almeida',
    role: 'Diretor de Marketing',
    bio: 'Pedro lidera estratégias de marketing inovadoras para promover propriedades exclusivas da Cirimoveis.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    social: [
      { platform: 'linkedin', link: '#', icon: 'fab fa-linkedin-in' },
      { platform: 'twitter', link: '#', icon: 'fab fa-twitter' },
    ],
  },
]);

// Methods
const updateCarouselItems = () => {
  itemsToShow.value = window.innerWidth < 768 ? 1 : 3;
};

const scrollToSection = (href: string) => {
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const scrollToFilters = () => {
  const filtersSection = document.querySelector('.filters');
  if (filtersSection) {
    filtersSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const updateFilterBorder = (element: HTMLSelectElement) => {
  element.style.borderColor = element.value && element.value !== element.options[0].value ? 'var(--primary-red)' : '#e5e7eb';
};

const handleFilterChange = (event: Event) => {
  const target = event.target;
  if (target && target instanceof HTMLSelectElement) {
    updateFilterBorder(target);
  }
};

const filterCities = () => {
  const province = filters.value.province;
  const searchTerm = typeof province === 'string' ? province.toLowerCase().trim() : '';
  if (searchTerm) {
    filteredCities.value = cities.value.filter(city =>
      city.toLowerCase().includes(searchTerm)
    ).slice(0, 5);
  } else {
    filteredCities.value = [];
  }
};

const selectCity = (city: string) => {
  filters.value.province = city;
  filteredCities.value = [];
  showCitySuggestions.value = false;
};

const delayHideCitySuggestions = () => {
  citySearchTimeout.value = setTimeout(() => {
    showCitySuggestions.value = false;
  }, 200);
};

const applyFilters = () => {
  isFiltering.value = true;
  setTimeout(() => {
    isFiltering.value = false;
    showNotification('Filtros aplicados!', 'success');
  }, 1500);
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

const showPropertyDetails = (property: Property) => {
//  alert(`Detalhes:\n${property.title}\n${property.location}\nPreço: ${property.price}`);

router.push({ name: 'app.property.detail', params: { id: property.id } })
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

  // Initialize Intersection Observer for property and team cards
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const propertyId = (entry.target as HTMLElement).dataset.propertyId;
          const property = properties.value.find(p => p.id === propertyId);
          if (property) {
            property.visible = true;
            (entry.target as HTMLElement).style.animation = 'fadeInUp 0.6s ease forwards';
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe property and team cards
  setTimeout(() => {
    document.querySelectorAll('.property-card, .team-card').forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
      observer.observe(card);
    });
  }, 100);

  // Scroll events
  const handleScroll = () => {
    showFloatingButton.value = window.scrollY > 400;
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

  // Initialize favorites from localStorage
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
    if (citySearchTimeout.value) {
      clearTimeout(citySearchTimeout.value);
    }
  };
});
</script>

<style scoped> 

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

.hero p {
  font-size: 1.3rem;
  color: var(--medium-gray);
  margin-bottom: 30px;
  font-weight: 500;
}

.filters {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 8px 30px var(--shadow-light);
  margin-top: -40px;
  position: relative;
  z-index: 10;
  border: 1px solid var(--soft-red);
  transition: box-shadow 0.3s var(--animation-ease);
}

.filters:hover {
  box-shadow: 0 12px 40px var(--shadow-medium);
}

.filters-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 20px;
  text-align: center;
  position: relative;
}

.filters-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: var(--primary-red);
}

.city-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--soft-red);
  border-radius: 8px;
  box-shadow: 0 3px 10px var(--shadow-light);
  list-style: none;
  margin: 5px 0 0 0;
  padding: 0;
  z-index: 1000;
  max-height: 180px;
  overflow-y: auto;
}

.city-suggestion-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.2s var(--animation-ease);
}

.city-suggestion-item:hover {
  background: var(--soft-red);
  color: var(--primary-red);
}

.filter-btn {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  color: #fff;
  font-weight: 600;
  transition: all 0.3s var(--animation-ease);
  box-shadow: 0 3px 10px rgba(211, 47, 47, 0.2);
}

.filter-btn:hover {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-2px);
}

.form-select,
.form-control {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 14px;
  transition: all 0.3s var(--animation-ease);
  color: var(--dark-charcoal);
  background-color: var(--card-bg);
}

.form-select:focus,
.form-control:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 0 0.15rem rgba(211, 47, 47, 0.1);
}

.form-check-input:checked {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
}

.form-check-label {
  color: var(--dark-charcoal);
  font-weight: 500;
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
}

.section-intro {
  font-size: 1rem;
  color: var(--medium-gray);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
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

.floating-filter-btn {
  position: fixed;
  bottom: 60px;
  right: 20px;
  z-index: 1000;
  background: var(--primary-red);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(211, 47, 47, 0.2);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s var(--animation-ease);
}

.floating-filter-btn.visible {
  opacity: 1;
  transform: translateY(0);
}

.floating-filter-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 12px rgba(211, 47, 47, 0.3);
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

  .filters {
    padding: 20px;
    margin: 15px 0;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.4rem;
  }

  .hero p {
    font-size: 1.1rem;
  }

  .filters {
    margin: 15px;
    padding: 20px;
    border-radius: 12px;
  }

  .filters-title {
    font-size: 1.3rem;
  }

  .filter-btn {
    margin-top: 15px;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1.1rem;
  }

  .section-intro {
    font-size: 0.95rem;
  }

  .property-image {
    height: 220px;
  }

  .floating-filter-btn {
    bottom: 50px;
    right: 15px;
    width: 48px;
    height: 48px;
  }

  .filters .row > div {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 576px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .filters {
    padding: 15px;
    margin: 10px;
  }

  .filter-btn {
    width: 100%;
    margin-top: 15px;
  }

  .property-info {
    padding: 20px;
  }

  .floating-filter-btn {
    bottom: 45px;
    right: 10px;
  }

  .filters .row > div {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .city-suggestions {
    max-width: 100%;
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