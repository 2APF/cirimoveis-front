<template>
  <main class="main" id="top">
    <NavbarComponent active="home" />

    <section id="home" class="hero d-flex align-items-center" :class="{ loaded: isHeroLoaded }">
      <div class="container mt-5">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center hero-content">
            <h1>Descubra o Seu <span class="text-danger">Imóvel</span> Perfeito em <span class="text-danger">Angola</span></h1>
            <p class="lead">Casas verificadas, visitas virtuais e suporte 24h. Sua jornada começa aqui.</p>
            <button class="btn visit-btn mt-4" @click="goToProperties">
              <i class="fas fa-search me-2"></i> Procurar Imóveis
            </button>
          </div>
        </div>
      </div>
    </section>
<!-- 
    <section class="featured-section py-6">
      <div class="container">
        <h2 class="section-title">Imóvel em Destaque</h2>
        <div class="row justify-content-center">
          <div class="col-lg-10" v-if="highlightedProperty">
            <div class="property-card featured-card" @click="goToDetail(highlightedProperty.id)">
              <div class="row g-0">
                <div class="col-md-7">
                  <div class="property-image featured-img" :style="{ backgroundImage: `url(${highlightedProperty.photo})` }">
                    <div v-if="highlightedProperty.views >= 1000" class="views-badge">
                      <i class="fas fa-fire text-white me-1"></i>
                      Muito Vista
                    </div>
                    <div v-if="highlightedProperty.verification" class="verified-badge">
                      <i class="fas fa-check"></i> Verificada
                    </div>
                    <div class="price-tag">
                      {{ formatPrice(highlightedProperty.price) }} AOA
                      <span v-if="highlightedProperty.type === '2'" class="price-suffix">/mês</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-5 d-flex align-items-center bg-white">
                  <div class="property-info p-5 w-100">
                    <h3 class="property-title fw-bold mb-3">{{ highlightedProperty.name }}</h3>
                    <p class="property-location text-muted mb-3">
                      <i class="fas fa-map-marker-alt"></i> {{ highlightedProperty.address }}
                    </p>
                    <p class="text-muted mb-4 line-clamp-3">{{ highlightedProperty.description }}</p>
                    <div class="property-features features-grid mb-4">
                      <div><i class="fas fa-bed"></i> {{ highlightedProperty.bedrooms }} Quartos</div>
                      <div><i class="fas fa-bath"></i> {{ highlightedProperty.bathrooms }} WC</div>
                      <div><i class="fas fa-ruler-combined"></i> {{ highlightedProperty.area }}m²</div>
                      <div v-if="highlightedProperty.garages"><i class="fas fa-car"></i> {{ highlightedProperty.garages }} Garagens</div>
                      <div v-if="highlightedProperty.swimming_pool === '1'"><i class="fas fa-swimming-pool"></i> Piscina</div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                      <small class="text-muted">
                        <i class="fas fa-eye me-1"></i>{{ highlightedProperty.views }} visualizações
                      </small>
                      <button class="btn-visit" @click.stop="goToDetail(highlightedProperty.id)">
                        <i class="fas fa-eye me-1"></i> Explorar Agora
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <section class="highlights-section py-6 bg-light">
      <div class="container">
        <h2 class="section-title">Explorar Destaques</h2>
        <div class="row g-4">
          <div v-for="property in highlights" :key="property.id" class="col-lg-4 col-md-6">
            <div class="property-card highlight-card" @click="goToDetail(property.slug)">
              <div class="property-image highlight-img" :style="{ backgroundImage: `url(${property.photo})` }">
                <div v-if="property.views >= 100" class="views-badge">
                  <i class="fas fa-fire text-white me-1"></i>
                  Muito Vista
                </div>
                <div v-if="property.verification" class="verified-badge">
                  <i class="fas fa-check"></i> Verificada
                </div>
                <div class="price-tag">
                  {{ formatPrice(property.price) }} AOA
                  <!-- <span v-if="property.type === '2'" class="price-suffix">/mês</span> -->
                </div>
              </div>
              <div class="property-info p-4">
                <h5 class="property-title fw-bold mb-2">{{ property.name }}</h5>
                <p class="property-location text-muted small mb-3">
                  <i class="fas fa-map-marker-alt"></i> {{ property.address }}
                </p>
                <!-- <p class="text-muted small mb-3 line-clamp-2">{{ property.description }}</p> -->
                <div class="property-features features-small mb-3">
                  <span><i class="fas fa-bed"></i> {{ property.bedrooms }}</span>
                  <span><i class="fas fa-bath"></i> {{ property.bathrooms }}</span>
                  <!-- <span><i class="fas fa-ruler-combined"></i> {{ property.area }}m²</span> -->
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    <i class="fas fa-eye me-1"></i>{{ property.views }}
                  </small>
                  <button class="btn-visit btn-sm" @click.stop="goToDetail(property.slug)">
                    <i class="fas fa-eye me-1"></i> Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="services-section py-6">
      <div class="container">
        <h2 class="section-title">Nossos Serviços</h2>
        <div class="row g-5 text-center">
          <div class="col-md-4">
            <div class="service-icon mb-4"><i class="fas fa-search fa-3x text-danger"></i></div>
            <h5 class="fw-bold text-danger">Busca Inteligente</h5>
            <p class="text-muted">Filtros por preço, localização, quartos e mais.</p>
          </div>
          <div class="col-md-4">
            <div class="service-icon mb-4"><i class="fas fa-video fa-3x text-danger"></i></div>
            <h5 class="fw-bold text-danger">Visitas Virtuais</h5>
            <p class="text-muted">Tour 360° em tempo real, sem sair de casa.</p>
          </div>
          <div class="col-md-4">
            <div class="service-icon mb-4"><i class="fas fa-handshake fa-3x text-danger"></i></div>
            <h5 class="fw-bold text-danger">Suporte 24h</h5>
            <p class="text-muted">Equipe dedicada para guiar sua compra.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials py-6 bg-light">
      <div class="container">
        <h2 class="section-title">O Que Dizem Nossos Clientes</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="testimonial-card p-4 rounded shadow-sm bg-white">
              <p class="mb-3 fst-italic">"Encontrei minha casa em 15 dias! Processo rápido e seguro."</p>
              <div class="d-flex align-items-center">
                <div class="avatar me-3">M</div>
                <div>
                  <strong>Maria Silva</strong><br>
                  <small class="text-muted">Luanda, Talatona</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="testimonial-card p-4 rounded shadow-sm bg-white">
              <p class="mb-3 fst-italic">"Equipe atenciosa e imóveis exatamente como nas fotos."</p>
              <div class="d-flex align-items-center">
                <div class="avatar me-3">J</div>
                <div>
                  <strong>João Mendes</strong><br>
                  <small class="text-muted">Benguela</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="testimonial-card p-4 rounded shadow-sm bg-white">
              <p class="mb-3 fst-italic">"Melhor plataforma de Angola. Recomendo!"</p>
              <div class="d-flex align-items-center">
                <div class="avatar me-3">A</div>
                <div>
                  <strong>Ana Costa</strong><br>
                  <small class="text-muted">Huambo</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-final py-6 text-white text-center">
      <div class="container">
        <h2 class="mb-4">Pronto para vender ou remodelar?</h2>
        <p class="lead mb-4">Cadastre-se grátis e publique sua casa</p>
        <button class="btn btn-light btn-lg px-5" @click="goToProperties">Começar Agora</button>
      </div>
    </section>

    <FooterComponent />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import axios from 'axios'
import Cookies from 'js-cookie'

const router = useRouter()
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'

interface Property {
  id: number
  slug: string
  name: string
  description: string
  price: number
  address: string
  type: string
  bedrooms: number
  bathrooms: number
  area: string
  views: number
  photos: string
  photo: string
  verification: boolean
  garages?: string
  swimming_pool?: string
}

const isHeroLoaded = ref(false)
const properties = ref<Property[]>([])

const loadProperties = async () => {
  try {
    const token = Cookies.get('token')
    const response = await axios.get(`${API_URL}/product/emphasis`, {
     
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })

    const data = response.data

    properties.value = (data.products || []).map((p: any) => {
      const photos = parsePhotos(p.photos)
      return {
        ...p,
        photo: photos[0]?.url || '/placeholder.jpg',
        verification: p.verification === '1' || p.verification === 1 || p.verification === true
      }
    })
  } catch (error) {
    // properties.value = [
    //   { id: 1, name: 'Moradia T3 Moderna', address: 'Luanda, Talatona', price: 45000000, photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', bedrooms: 3, bathrooms: 2, area: '150', views: 1200, type: '1', verification: true, description: 'Jardim privativo, segurança 24h e acabamentos premium.', garages: '2' },
    //   { id: 2, name: 'Apartamento T2 Luxo', address: 'Luanda, Maianga', price: 28000000, photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80', bedrooms: 2, bathrooms: 2, area: '95', views: 950, type: '1', verification: true, description: 'Vista panorâmica, ginásio e concierge.', garages: '1', swimming_pool: '1' },
    //   { id: 3, name: 'Villa Exclusiva T5', address: 'Luanda, Miramar', price: 95000000, photo: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', bedrooms: 5, bathrooms: 4, area: '450', views: 2500, type: '1', verification: true, description: 'Piscina infinita, cinema e vista para o mar.', garages: '4', swimming_pool: '1' },
    //   { id: 4, name: 'Casa T4 Familiar', address: 'Benguela, Centro', price: 38000000, photo: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80', bedrooms: 4, bathrooms: 3, area: '220', views: 780, type: '1', verification: true, description: 'Quintal amplo, ideal para crianças.', garages: '2' },
    //   { id: 5, name: 'Terreno Urbanizado', address: 'Viana, Kilamba', price: 12000000, photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', bedrooms: 0, bathrooms: 0, area: '600', views: 650, type: '1', verification: true, description: 'Projeto aprovado, água e luz.' },
    //   { id: 6, name: 'Duplex T3+1', address: 'Cabinda, Centro', price: 52000000, photo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80', bedrooms: 4, bathrooms: 3, area: '280', views: 1100, type: '1', verification: false, description: 'Varanda gourmet e suite master.', garages: '2' }
    // ]
    console.error('Erro ao carregar propriedades em destaque:', error)
  }
}

const parsePhotos = (photosString: string): any[] => {
  if (!photosString) return []
  try {
    const cleaned = photosString.replace(/\\\//g, '/')
    const parsed = JSON.parse(cleaned)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-AO', { minimumFractionDigits: 0 }).format(price)
}

const highlightedProperty = computed(() => properties.value.find(p => p.views >= 2000) || properties.value[2] || null)
const highlights = computed(() => properties.value.slice(0, 6).filter(p => p.id !== (highlightedProperty.value?.id || 0)))

const goToDetail = (slug: string) => {
  router.push({ name: 'app.property.detail', params: { slug } })
}

const goToProperties = () => {
  router.push({ name: 'app.properties' })
}

onMounted(() => {
  setTimeout(() => isHeroLoaded.value = true, 150)
  loadProperties()
})
</script>

<style scoped>
.main {
  min-height: 100vh;
  background: var(--light-bg);
}

.hero {
  background: linear-gradient(135deg, var(--soft-red) 0%, var(--light-bg) 100%);
  padding: 170px 0 150px;
  min-height: 88vh;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80') center/cover;
  opacity: 0.08;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.hero.loaded .hero-content {
  opacity: 1;
  transform: translateY(0);
}

.hero h1 {
  font-size: 4.4rem;
  font-weight: 900;
  margin-bottom: 1.2rem;
  background: linear-gradient(90deg, var(--dark-charcoal), var(--primary-red));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.8px;
  line-height: 1.1;
}

.hero .lead {
  font-size: 1.35rem;
  color: var(--medium-gray);
  font-weight: 500;
  margin-bottom: 2.2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.visit-btn {
  background: white;
  color: var(--primary-red);
  padding: 19px 52px;
  border-radius: 60px;
  font-weight: 700;
  font-size: 1.18rem;
  box-shadow: 0 14px 40px rgba(211,47,47,0.22);
  transition: all 0.5s cubic-bezier(0.34, 0.69, 0.36, 0.98);
  border: 2.5px solid transparent;
  position: relative;
  overflow: hidden;
}

.visit-btn::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  /* background: linear-gradient(135deg, var(--primary-red), #e53935); */
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.34, 0.69, 0.36, 0.98);
  border-radius: 60px;
}

.visit-btn:hover::before {
  opacity: 1;
}

.visit-btn:hover {
  /* color: white; */
  transform: translateY(-7px) scale(1.03);
  box-shadow: 0 22px 50px rgba(211,47,47,0.32);
  /* border-color: white; */
}

.section-title {
  font-size: 3.1rem;
  font-weight: 800;
  color: var(--dark-charcoal);
  text-align: center;
  position: relative;
  margin-bottom: 75px;
  letter-spacing: -0.5px;
}

.section-title::after {
  content: '';
  width: 100px;
  height: 5px;
  background: var(--primary-red);
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
  box-shadow: 0 3px 12px rgba(211,47,47,0.25);
}

.property-card {
  background: var(--card-bg);
  border-radius: 26px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--soft-red);
  transition: all 0.4s ease;
  cursor: pointer;
}

.property-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px var(--shadow-medium);
}

.property-image {
  height: 310px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.5s ease;
}

.property-card:hover .property-image {
  transform: scale(1.03);
}

.featured-img {
  height: 540px;
}

.views-badge,
.verified-badge {
  position: absolute;
  top: 15px;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 20px;
  z-index: 2;
}

.views-badge {
  left: 15px;
  background: rgba(255, 152, 0, 0.95);
  color: white;
}

.verified-badge {
  right: 15px;
  background: var(--primary-red);
  color: white;
}

.price-tag {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: rgba(26, 26, 46, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1rem;
  backdrop-filter: blur(8px);
}

.price-suffix {
  font-size: 0.75rem;
  opacity: 0.9;
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  font-size: 1.02rem;
  color: var(--medium-gray);
  font-weight: 600;
}

.features-grid div,
.features-small span {
  background: var(--soft-red);
  padding: 12px 18px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.features-grid div:hover,
.features-small span:hover {
  background: #fce2e2;
  transform: translateY(-2px);
}

.features-small {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.features-small span {
  padding: 8px 16px;
  border-radius: 22px;
  font-size: 0.88rem;
  font-weight: 600;
}

.btn-visit {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.85rem;
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

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.service-icon i {
  transition: all 0.5s cubic-bezier(0.34, 0.69, 0.36, 0.98);
  color: var(--primary-red);
  filter: drop-shadow(0 0 8px rgba(211,47,47,0.15));
}

.service-icon:hover i {
  transform: scale(1.28) rotate(10deg);
  filter: drop-shadow(0 0 20px rgba(211,47,47,0.35));
}

.testimonial-card {
  transition: all 0.5s cubic-bezier(0.34, 0.69, 0.36, 0.98);
  border: 1px solid #f0f0f0;
  background: linear-gradient(135deg, white, #fdf8f8);
  border-radius: 20px;
}

.testimonial-card:hover {
  transform: translateY(-14px);
  box-shadow: 0 22px 45px var(--shadow-soft);
}

.avatar {
  width: 58px;
  height: 58px;
  background: var(--primary-red);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.45rem;
  box-shadow: 0 5px 18px rgba(211,47,47,0.32);
}

.cta-final {
  background: linear-gradient(135deg, var(--primary-red), #b71c1c);
  padding: 130px 0;
  position: relative;
  overflow: hidden;
}

.cta-final::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1), transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1), transparent 50%);
  opacity: 0.2;
}

.cta-final h2 {
  font-size: 3.4rem;
  font-weight: 900;
  margin-bottom: 1.2rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.cta-final .lead {
  font-size: 1.45rem;
  margin-bottom: 2.3rem;
  opacity: 0.96;
}

.cta-final .btn-light {
  background: white;
  color: var(--primary-red);
  padding: 20px 55px;
  border-radius: 60px;
  font-weight: 700;
  font-size: 1.25rem;
  box-shadow: 0 18px 45px rgba(0,0,0,0.22);
  transition: all 0.5s cubic-bezier(0.34, 0.69, 0.36, 0.98);
  border: 3px solid transparent;
}

.cta-final .btn-light:hover {
  background: #fdfdfd;
  transform: translateY(-6px);
  box-shadow: 0 25px 55px rgba(0,0,0,0.3);
  border-color: rgba(255,255,255,0.5);
}

.container {
  max-width: 1320px;
}

@media (max-width: 992px) {
  .hero h1 { font-size: 3.6rem; }
  .section-title { font-size: 2.7rem; }
  .featured-img { height: 420px; }
  .highlight-img { height: 270px; }
}

@media (max-width: 768px) {
  .hero { padding: 130px 0; min-height: 75vh; }
  .hero h1 { font-size: 2.9rem; }
  .hero .lead { font-size: 1.15rem; }
  .visit-btn { padding: 15px 35px; font-size: 1.05rem; }
  .featured-card .row { flex-direction: column; }
  .featured-img { height: 320px; }
  .highlight-img { height: 230px; }
  .section-title { font-size: 2.3rem; margin-bottom: 55px; }
  .cta-final { padding: 110px 0; }
  .cta-final h2 { font-size: 2.6rem; }
}
</style>