<template>
  <main class="main" id="top">
    <NavbarComponent active="properties" />

    <section class="property-hero mt-5" :class="{ loaded: isHeroLoaded }">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <h1 class="property-title">{{ ' '+ property.title }}</h1>
            <p class="property-location">
              <i class="fas fa-map-marker-alt me-2"></i>{{ ' '+ property.location }}
            </p>
            <div class="property-price">{{ formatPrice(property.price) }}</div>
            <div class="property-status-badge" :class="statusClass">{{ ' '+ property.status }}</div>


            <div v-if="property.verified" class="verified-badge mt-3 mr-5">
              <i class="fas fa-check-circle me-2"></i>Propriedade Verificada
            </div>

            <button class="btn favorite-btn " :class="{ favorited: isFavorited == true ? true : false }" @click="() => toggleFavorite(property.id)"
              aria-label="Adicionar ou remover dos favoritos">
              <i :class="isFavorited == true ? 'fas fa-heart' : 'far fa-heart'"></i>
              <span class="ms-2">{{ isFavorited == true ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos' }}</span>
            </button>




          </div>
          <div class="col-lg-6">
            <Carousel :items-to-show="1" :wrap-around="true" :autoplay="3500" :transition="600"
              class="property-carousel">
              <Slide v-for="(img, index) in property.images" :key="index">
                <div class="carousel-image-wrapper">
                  <img :src="img" alt="Imagem da propriedade" class="img-fluid rounded-3" loading="lazy" />
                </div>
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

 
    <section class="engagement-details py-6">
      <div class="container">
      <h2 class="section-title">Engajamento da Propriedade</h2>
      <div class="row text-center g-4 mt-5">
        <div class="col-6 col-md-3">
        <div class="engagement-card">
          <i class="fas fa-eye fa-2x text-danger"></i>
          <h5 class="mt-3 text-dark">Visualizações</h5>
          <p class="mb-0">{{ ' '+ property.views }}</p>
        </div>
        </div>
        <div class="col-4 col-md-4">
        <div class="engagement-card">
          <i class="fas fa-heart fa-2x text-danger"></i>
          <h5 class="mt-3 text-dark">Adoros</h5>
          <p class="mb-0">{{ ' '+ property.favoriteCount }}</p>
        </div>
        </div>
        <div class="col-4 col-md-4">
        <div class="engagement-card">
          <i class="fas fa-share-alt fa-2x text-danger"></i>
          <h5 class="mt-3 text-dark">Compartilhamentos</h5>
          <p class="mb-0">-</p>
        </div>
        </div>
        <div class="col-4 col-md-4">
        <!-- <div class="engagement-card">
          <i class="fas fa-comments fa-2x text-danger"></i>
          <h5 class="mt-3 text-dark">Tempo de vista</h5>
          <p class="mb-0">-</p>
        </div> -->
        </div>
      </div>
      </div>
    </section>



    <section class="property-3d-view py-6">
      <div class="container">
        <h2 class="section-title">Visão 360° da Propriedade</h2>
        <p class="section-subtitle text-center mb-5">Explore a casa em uma experiência imersiva de 360°</p>

        <!-- <div class="panorama-wrapper" :class="{ visible: panoramaVisible }">
          <div id="panorama" class="panorama-canvas"></div>
          
          <div v-if="!has360Image && property.images.length > 0" class="panorama-fallback">
            <img :src="property.images[0]" alt="Imagem principal" class="img-fluid rounded-3" />
            <div class="fallback-overlay">
              <i class="fas fa-vr-cardboard"></i>
              <p>Tour 360° não disponível</p>
            </div>
          </div>
        </div> -->

        <div class="virtual-tour-placeholder mt-4 text-center">
          <button class="btn btn-tour" @click="init360Tour" aria-label="Iniciar tour virtual">
            <i class="fas fa-vr-cardboard me-2"></i> Iniciar Tour Virtual
          </button>
        </div>
      </div>
    </section>

    <section class="property-details py-6 bg-light">
      <div class="container">
        <h2 class="section-title">Detalhes da Propriedade</h2>
        <div class="row g-5">
          <div class="col-md-6">
            <ul class="details-list">
              <li><i class="fas fa-bed me-2"></i><strong>Quartos: </strong> {{ ' '+ property.bedrooms }}</li>
              <li><i class="fas fa-bath me-2"></i><strong>Banheiros: </strong> {{ ' '+ property.bathrooms }}</li>
              <li><i class="fas fa-ruler-combined me-2"></i><strong>Área Total: </strong> {{ ' '+ property.area }} m²</li>
              <li><i class="fas fa-home me-2"></i><strong>Tipologia: </strong> -</li>
              <li><i class="fas fa-car me-2"></i><strong>Garagem: </strong> {{ ' '+ property.garage ? 'Sim' : 'Não' }}</li>
            </ul>
          </div>
          <div class="col-md-6">
            <ul class="details-list">
              <li><i class="fas fa-swimming-pool me-2"></i><strong>Piscina:</strong> {{ ' '+ property.piscina ? 'Sim' : 'Não'
                }}
              </li>   
              <li><i class="fas fa-tree me-2"></i><strong>Jardim:</strong> {{ ' '+ property.jardim ? 'Sim' : 'Não' }}</li>
              <li><i class="fas fa-snowflake me-2"></i><strong>Ar Condicionado:</strong> {{ ' '+ property.arcondicionado ?
                'Sim'
                : 'Não' }}</li>
              <li><i class="fas fa-building me-2"></i><strong>Estado:</strong> {{ ' '+ property.status }}</li>
              <li><i class="fas fa-money-bill-wave me-2"></i><strong>Preço:</strong> {{ formatPrice(property.price) }}
              </li>
            </ul>
          </div>
        </div>
        <div class="property-description mt-5">
          <h3>Descrição Completa</h3>
          <p>{{ ' '+ property.description }}</p>
        </div>
      </div>
    </section>

    <section class="contact-section py-6" id="contact">
      <div class="container">
        <h2 class="section-title">Entre em Contato</h2>
        <p class="section-subtitle text-center mb-5">Interessado nesta propriedade? Fale com nosso agente!</p>
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="contact-card" :class="{ visible: contactVisible }">
              <div class="contact-info text-center">
                <p><i class="fas fa-phone me-2"></i><strong>Contacto:</strong> {{ property.phone_one +' | '+ property.phone_two }}</p>
                <!-- <a :href="`https://wa.me/244123456789?text=Olá, estou interessado na propriedade ${property.title}`"
                  class="btn btn-whatsapp mt-3" target="_blank" rel="noopener noreferrer"
                  aria-label="Contactar via WhatsApp">
                  <i class="fab fa-whatsapp me-2"></i> Contactar via WhatsApp
                </a> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="similar-properties py-6 bg-light">
      <div class="container">
        <h2 class="section-title">Propriedades Semelhantes</h2>
        <Carousel :items-to-show="itemsToShow" :items-to-scroll="1" :wrap-around="true" :autoplay="5000"
          :transition="600" :breakpoints="carouselBreakpoints" class="similar-carousel">
          <Slide v-for="similar in similarProperties" :key="similar.id">
            <div class="property-card highlight-card" @click="goToDetail(similar.slug)">
              <div class="property-image highlight-img" :style="{ backgroundImage: `url(${similar.image})` }">
                <!-- <button
                  class="favorite-btn"
                  :class="{ favorited: favorites.includes(similar.id) }"
                  @click.stop="toggleFavorite(similar.id)"
                  :aria-label="favorites.includes(similar.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                >
                  <i :class="favorites.includes(similar.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
                </button> -->
                <div v-if="similar.views >= 100" class="views-badge">
                  <i class="fas fa-fire text-white me-1"></i> Muito Vista
                </div>
                <div v-if="similar.verified" class="verified-badge">
                  <i class="fas fa-check"></i> Verificada
                </div>
                <div class="price-tag">
                  {{ formatPrice(similar.price) }} AOA
                  <!-- <span v-if="similar.type === '2'" class="price-suffix">/mês</span> -->
                </div>
              </div>
              <div class="property-info p-4">
                <h5 class="property-title fw-bold mb-2">{{ similar.title }}</h5>
                <p class="property-location text-muted small mb-3">
                  <i class="fas fa-map-marker-alt"></i> {{ similar.location }}
                </p>
                <!-- <p class="text-muted small mb-3 line-clamp-2">{{ similar.description }}</p> -->
                <div class="property-features features-small mb-3">
                  <span><i class="fas fa-bed"></i> {{ similar.bedrooms }}</span>
                  <span><i class="fas fa-bath"></i> {{ similar.bathrooms }}</span>
                  <span><i class="fas fa-ruler-combined"></i> {{ similar.area }}m²</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    <i class="fas fa-eye me-1"></i>{{ similar.views }}
                  </small>
                  <button class="btn-visit btn-sm" @click.stop="goToDetail(similar.slug)">
                    <i class="fas fa-eye me-1"></i> Ver Detalhes
                  </button>
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

    <div v-if="notification.message" class="alert" :class="`alert-${notification.type}`">
      <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'info-circle'}`"></i>
      {{ notification.message }}
    </div>
  </main>
</template>

<script setup lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue';
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import * as PANOLENS from 'panolens';
import { useRoute, useRouter } from 'vue-router';
import FooterComponent from '@/components/FooterComponent.vue';
import axios from 'axios';
import Cookies from 'js-cookie';

const route = useRoute();
const router = useRouter();
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: string;
  status: string;
  verified: boolean;
  description: string;
  type: string;
  garage: boolean;
  piscina: boolean;
  jardim: boolean;
  arcondicionado: boolean;
  views: number;
  phone_one: string;
  phone_two: string;
  slug: string;

  favoriteCount: number;
  favoriteCheck: boolean;
}

interface Notification {
  message: string;
  type: 'success' | 'info';
}

const property = ref<Property>({
  id: 0, title: '', location: '', price: 0, image: '', images: [],
  bedrooms: 0, bathrooms: 0, area: '', status: '', verified: false,
  description: '', type: '', garage: false, piscina: false, jardim: false, 
  arcondicionado: false, views: 0, phone_one: '', phone_two: '', slug: '',
  favoriteCount: 0, favoriteCheck: false
});

const similarProperties = ref<Property[]>([]);
const isHeroLoaded = ref(false);
const panoramaVisible = ref(false);
const contactVisible = ref(false);
const has360Image = ref(false);
const favorites = ref<number[]>(JSON.parse(localStorage.getItem('favorites') || '[]'));
const notification = ref<Notification>({ message: '', type: 'info' });
const itemsToShow = ref(3);
const carouselBreakpoints = ref({
  0: { itemsToShow: 1 },
  768: { itemsToShow: 2 },
  992: { itemsToShow: 3 }
});

let panoramaViewer: any = null;

// a partir de favoriteCheck
const isFavorited = computed(() => property.value.favoriteCheck);

const statusClass = computed(() => ({
  'status-pronta': property.value.status === 'Pronta para Morar',
  'status-construcao': property.value.status === 'Em Construção',
  'status-inacabada': property.value.status === 'Inacabada',
}));

const parsePhotos = (photosString: string): string[] => {

  try {
    const cleaned = photosString.replace(/\\\//g, '/');
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed.map((p: any) => p.url).filter(Boolean) : [];
  } catch {
    return [];
  }

};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-AO', { minimumFractionDigits: 0 }).format(price) + ' AOA';
};



const toggleFavorite = async (id?: number) => {
  const propertyId = id ?? property.value.id;
  const userId = Cookies.get('user');
  const index = favorites.value.indexOf(propertyId);
  const isFavoriting = index === -1;

  try {
    const token = Cookies.get('token');
    const res = await axios.post(
      `${API_URL}/product/favorite-product`,
      { product_id: propertyId, user_id: userId, status: isFavoriting ? 1 : 0 },
      // { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );

    if (isFavoriting) {
      favorites.value.push(propertyId);
      property.value.favoriteCheck = isFavoriting ? true : false;
      property.value.favoriteCount += 1;
      showNotification('Adicionado aos favoritos', 'success');
    } else {
      
      property.value.favoriteCheck = isFavoriting ? true : false;
      property.value.favoriteCount -= 1;
      favorites.value.splice(index, 1);
      showNotification('Removido dos favoritos', 'info');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
  } catch (error) {
    // console.error('Erro ao atualizar favoritos:', error);
    // save user to login redirect
    localStorage.setItem('redirectAfterLogin', router.currentRoute.value.fullPath);

    router.push({ name: 'app.auth.login' });
    showNotification('Erro ao atualizar favoritos', 'info');
  }
};


// const toggleFavorite = (id?: number) => {
//   const propertyId = id ?? property.value.id;
//   const index = favorites.value.indexOf(propertyId);
//   if (index > -1) {
//     favorites.value.splice(index, 1);
//     showNotification('Removido dos favoritos', 'info');
//   } else {
//     favorites.value.push(propertyId);
//     showNotification('Adicionado aos favoritos', 'success');
//   }
//   localStorage.setItem('favorites', JSON.stringify(favorites.value));
// };


const showNotification = (message: string, type: 'success' | 'info') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: 'info' };
  }, 3000);
};

const init360Tour = async () => {
  if (panoramaViewer) {
    panoramaViewer.dispose();
    panoramaViewer = null;
  }

  await nextTick();
  const container = document.getElementById('panorama');
  if (!container || !property.value.images.length) return;

  const imageUrl = property.value.images[0];
  const panorama = new PANOLENS.ImagePanorama(imageUrl);
  panoramaViewer = new PANOLENS.Viewer({
    container,
    autoRotate: true,
    autoRotateSpeed: 0.3,
    controlBar: true,
    cameraFov: 80,
  });
  panoramaViewer.add(panorama);
  has360Image.value = true;
  panoramaVisible.value = true;
};

const loadProperty = async () => {
  try {
    const token = Cookies.get('token');
    const slug = route.params.slug;
    const response = await axios.get(`${API_URL}/product/show/${slug}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = response.data.product;
    const favorite = response.data;

    // console.log('oo:', response.data)

    const photos = parsePhotos(data.photos);
    property.value = {
      id: data.id,
      title: data.name,
      location: data.address,
      price: data.price,
      image: photos[0] || '/placeholder.jpg',
      images: photos,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      area: data.area,
      status: data.condition === '0' ? 'Novo(a)' : data.condition == '1' ? 'Antigo(a)' : 'Reformado(a)',
      verified: data.verified === '1' || data.verified === 1,
      description: data.description,
      type: data.type === '1' ? 'Venda' : 'Aluguel',
      garage: data.garages === '1',
      piscina: data.swimming_pool === '1',
      jardim: data.garden === '1',
      arcondicionado: data.air_conditioning === '1',
      views: data.views || 0,
      favoriteCount: favorite.favoriteCount || 0,
      favoriteCheck: favorite.favoriteCheck,
      phone_one: data.phone_one || '',
      phone_two: data.phone_two || '',
      slug: data.slug || '',
    };
  } catch (error) {
    console.error('Erro ao carregar propriedade:', error);
  }
};

const loadSimilarProperties = async () => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(`${API_URL}/product/list`, {
      params: { per_page: 10, page: 1 },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = response.data.products || [];
    similarProperties.value = data
      .filter((p: any) => p.id !== parseInt(route.params.id as string))
      .slice(0, 6)
      .map((p: any) => {
        const photos = parsePhotos(p.photos);
        return {
          id: p.id,
          title: p.name,
          location: p.address,
          price: p.price,
          image: photos[0] || '/placeholder.jpg',
          images: [],
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          area: p.area,
          slug: p.slug,
          status: p.condition == '0' ? 'Novo' : p.condition === '1' ? 'Usado' : 'Reformado',
          verified: p.verified === '1' || p.verified === 1,
          description: p.description || '',
          type: p.type === '1' ? '1' : '2',
          garage: false,
          piscina: false,
          jardim: false,
          arcondicionado: false,
          views: p.views || 0
        };
      });
  } catch (error) {
    console.error('Erro ao carregar propriedades semelhantes:', error);
  }
};

// esta pagina e de detalhes de propriedade, quero que actualize quando for para ver outra propriedade
const goToDetail = (slug: string) => {
  router.push({ name: 'app.property.detail', params: { slug } });
};

onMounted(async () => {
  setTimeout(() => isHeroLoaded.value = true, 100);
  await loadProperty();
  await loadSimilarProperties();

  if (property.value.images.length > 0) {
    await nextTick();
    init360Tour();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  setTimeout(() => {
    document.querySelectorAll('.panorama-wrapper, .contact-card, .highlight-card').forEach(el => {
      observer.observe(el);
    });
  }, 200);

  const updateItemsToShow = () => {
    if (window.innerWidth < 768) itemsToShow.value = 1;
    else if (window.innerWidth < 992) itemsToShow.value = 2;
    else itemsToShow.value = 3;
  };
  updateItemsToShow();
  window.addEventListener('resize', updateItemsToShow);

  return () => {
    if (panoramaViewer) panoramaViewer.dispose();
    window.removeEventListener('resize', updateItemsToShow);
  };
});
</script>

<style scoped>
.main {
  min-height: 100vh;
  background: var(--light-bg);
}

.property-hero {
  padding: 120px 0 100px;
  background: linear-gradient(135deg, var(--soft-red) 0%, var(--light-bg) 100%);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.property-hero.loaded {
  opacity: 1;
  transform: translateY(0);
}

.property-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80') center/cover;
  opacity: 0.08;
  z-index: 0;
}

.property-hero .container {
  position: relative;
  z-index: 1;
}

.property-title {
  font-size: 3.4rem;
  font-weight: 900;
  color: var(--dark-charcoal);
  margin-bottom: 16px;
  line-height: 1.1;
}

.property-location {
  font-size: 1.35rem;
  color: var(--medium-gray);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.property-price {
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--primary-red);
  margin-bottom: 20px;
}

.property-status-badge {
  display: inline-block;
  padding: 12px 28px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.05rem;
  color: #fff;
  background: var(--primary-red);
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  font-size: 1.05rem;
  color: var(--primary-red);
  font-weight: 600;

  background: var(--soft-red);
  padding: 10px 20px;
  border-radius: 25px;
  box-shadow: 0 3px 10px var(--shadow-light);
}

.favorite-btn {
  background: white;
  border: 2.5px solid var(--primary-red);
  border-radius: 60px;
  padding: 10px 20px;
  margin-left: 20px;
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--primary-red);
  transition: all 0.4s cubic-bezier(0.34, 0.69, 0.36, 0.98);
  box-shadow: 0 8px 25px rgba(211, 47, 47, 0.18);
}

.favorite-btn:hover {
  background: var(--primary-red);
  color: white;
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 16px 35px rgba(211, 47, 47, 0.28);
}

.favorite-btn.favorited {
  background: var(--primary-red);
  color: white;
}

.property-carousel :deep(.carousel__slide) {
  padding: 0 8px;
}

.carousel-image-wrapper {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px var(--shadow-medium);
}

.carousel-image-wrapper img {
  width: 100%;
  height: 480px;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.carousel-image-wrapper:hover img {
  transform: scale(1.03);
}

.property-carousel :deep(.carousel__prev),
.property-carousel :deep(.carousel__next) {
  width: 56px;
  height: 56px;
  background: rgba(26, 26, 46, 0.85);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  backdrop-filter: blur(8px);
}

.property-carousel :deep(.carousel__prev:hover),
.property-carousel :deep(.carousel__next:hover) {
  background: var(--primary-red);
  transform: translateY(-50%) scale(1.1);
}

.property-carousel :deep(.carousel__pagination) {
  margin-top: 20px;
}

.property-carousel :deep(.carousel__pagination-button) {
  width: 14px;
  height: 14px;
  background: var(--medium-gray);
  border-radius: 50%;
  margin: 0 8px;
  transition: all 0.3s;
}

.property-carousel :deep(.carousel__pagination-button--active) {
  background: var(--primary-red);
  transform: scale(1.3);
}

.property-3d-view {
  background: var(--light-bg);
  padding: 100px 0;
}

.panorama-wrapper {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 35px var(--shadow-medium);
  height: 560px;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.7s ease;
}

.panorama-wrapper.visible {
  opacity: 1;
  transform: translateY(0);
}

.panorama-canvas {
  width: 100% !important;
  height: 100% !important;
}

.panorama-fallback {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 20px;
}

.panorama-fallback img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.65);
}

.fallback-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 2;
}

.fallback-overlay i {
  font-size: 3.5rem;
  margin-bottom: 12px;
  opacity: 0.9;
}

.fallback-overlay p {
  font-size: 1.3rem;
  font-weight: 600;
}

.virtual-tour-placeholder {
  margin-top: 28px;
}

.section-title {
  font-size: 3.2rem;
  font-weight: 800;
  color: var(--dark-charcoal);
  text-align: center;
  margin-bottom: 24px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 5px;
  background: var(--primary-red);
  border-radius: 3px;
  box-shadow: 0 3px 12px rgba(211, 47, 47, 0.25);
}

.section-subtitle {
  font-size: 1.35rem;
  font-weight: 500;
  color: var(--medium-gray);
  max-width: 900px;
  margin: 0 auto 40px;
}

.property-details {
  background: var(--light-bg);
  padding: 100px 0;
}

.details-list {
  list-style: none;
  padding: 0;
}

.details-list li {
  font-size: 1.15rem;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
}

.details-list i {
  color: var(--primary-red);
  font-size: 1.3rem;
}

.details-list strong {
  margin-left: 12px;
  font-weight: 600;
  color: var(--dark-charcoal);
}

.property-description h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 18px;
  color: var(--dark-charcoal);
}

.property-description p {
  font-size: 1.15rem;
  color: var(--medium-gray);
  line-height: 1.9;
}

.contact-section {
  background: linear-gradient(135deg, var(--light-bg), var(--soft-red));
  padding: 100px 0;
}

.contact-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 12px 35px var(--shadow-medium);
  border: 1px solid var(--soft-red);
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.6s ease;
}

.contact-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.contact-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 45px var(--shadow-medium);
}

.contact-info p {
  font-size: 1.2rem;
  color: var(--medium-gray);
  margin-bottom: 18px;
}

.contact-info i {
  color: var(--primary-red);
}

.similar-properties {
  background: var(--light-bg);
  padding: 100px 0;
}

.highlight-card {
  background: var(--card-bg);
  border-radius: 26px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--soft-red);
  transition: all 0.4s ease;
  cursor: pointer;
  margin: 0 12px;
}

.highlight-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px var(--shadow-medium);
}

.highlight-img {
  height: 280px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.5s ease;
}

.highlight-card:hover .highlight-img {
  transform: scale(1.03);
}

.highlight-card .favorite-btn {
  position: absolute;
  top: 18px;
  left: 18px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--medium-gray);
  transition: all 0.3s;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
}

.highlight-card .favorite-btn:hover {
  color: var(--primary-red);
  transform: scale(1.12);
}

.highlight-card .favorite-btn.favorited {
  color: var(--primary-red);
}

.views-badge,
.verified-badge {
  position: absolute;
  top: 18px;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 7px 14px;
  border-radius: 22px;
  z-index: 2;
}

.views-badge {
  left: 18px;
  background: rgba(255, 152, 0, 0.95);
  color: white;
}

.verified-badge {
  right: 18px;
  background: var(--primary-red);
  color: white;
}

.price-tag {
  position: absolute;
  bottom: 18px;
  left: 18px;
  background: rgba(26, 26, 46, 0.92);
  color: white;
  padding: 12px 22px;
  border-radius: 28px;
  font-weight: 700;
  font-size: 1.05rem;
  backdrop-filter: blur(10px);
}

.price-suffix {
  font-size: 0.78rem;
  opacity: 0.9;
}

.property-info {
  padding: 28px;
}

.property-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 12px;
}

.property-location {
  color: var(--medium-gray);
  font-size: 0.98rem;
  margin-bottom: 16px;
}

.property-features.features-small {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 16px;
}

.features-small span {
  background: var(--soft-red);
  padding: 10px 18px;
  border-radius: 22px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.features-small span:hover {
  background: #fce2e2;
  transform: translateY(-2px);
}

.btn-visit {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 0.88rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-visit:hover {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-1px);
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.btn-tour,
.btn-whatsapp {
  background: var(--primary-red);
  color: #fff;
  padding: 14px 32px;
  border-radius: 60px;
  font-weight: 700;
  border: none;
  transition: all 0.4s;
  font-size: 1.15rem;
  box-shadow: 0 8px 25px rgba(211, 47, 47, 0.2);
}

.btn-tour:hover,
.btn-whatsapp:hover {
  background: #b71c1c;
  transform: translateY(-4px);
  box-shadow: 0 16px 35px rgba(211, 47, 47, 0.3);
}

.btn-whatsapp {
  background: #25D366;
}

.btn-whatsapp:hover {
  background: #1da851;
}

.alert {
  position: fixed;
  top: 90px;
  right: 24px;
  padding: 1.2rem 2.2rem;
  border-radius: 12px;
  color: #fff;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  animation: slideIn 0.4s ease;
  backdrop-filter: blur(8px);
}

.alert-success {
  background: linear-gradient(135deg, #43a047, #66bb6a);
}

.alert-info {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(50px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 992px) {
  .property-title {
    font-size: 2.8rem;
  }

  .property-price {
    font-size: 2.3rem;
  }

  .carousel-image-wrapper img {
    height: 380px;
  }
}

@media (max-width: 768px) {
  .property-hero {
    padding: 80px 0 60px;
  }

  .property-title {
    font-size: 2.4rem;
  }

  .property-price {
    font-size: 2rem;
  }

  .carousel-image-wrapper img {
    height: 320px;
  }

  .panorama-wrapper {
    height: 380px;
  }

  .section-title {
    font-size: 2.5rem;
  }

  .highlight-img {
    height: 240px;
  }
}

@media (max-width: 576px) {
  .property-title {
    font-size: 2rem;
  }

  .property-price {
    font-size: 1.8rem;
  }

  .carousel-image-wrapper img {
    height: 280px;
  }

  .panorama-wrapper {
    height: 300px;
  }

  .favorite-btn {
    margin-top: 16px;
    margin-left: 0;
    padding: 12px 28px;
    font-size: 1rem;
  }
}
</style>