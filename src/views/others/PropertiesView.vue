<template>
  <main class="main" id="top">
    <NavbarComponent active="properties" />

    <section id="home" class="hero d-flex align-items-center" :class="{ loaded: isHeroLoaded }">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center hero-content">
            <h1>Encontre a Casa dos Seus Sonhos</h1>
            <p class="hero-subtitle">Imóveis verificados em todo Angola, com filtros avançados e visualização detalhada
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="filters">
        <h3 class="filters-title">Filtre o Seu Imóvel Ideal</h3>
        <div class="row g-3 align-items-end">
          <div class="col-lg-3 col-md-6 col-sm-12">
            <input type="text" class="form-control" placeholder="Título do imóvel" v-model="filters.title"
              @input="debouncedApplyFilters" />
          </div>

          <!-- <div class="col-lg-3 col-md-6 col-sm-12">
            <div class="radio-group">
              <label class="radio-label"><input type="radio" v-model="filters.type" value="" checked> Todos</label>
              <label class="radio-label"><input type="radio" v-model="filters.type" value="1"> Venda</label>
              <label class="radio-label"><input type="radio" v-model="filters.type" value="2"> Aluguel</label>
            </div>
          </div> -->

          <div class="col-lg-3 col-md-3 col-sm-6">
            <select class="form-select" v-model="filters.price_range" @change="applyFilters">
              <option value="">Preço</option>
              <option value="0-5000000">Até 5M AOA</option>
              <option value="5000000-10000000">5M - 10M AOA</option>
              <option value="10000000-25000000">10M - 25M AOA</option>
              <option value="25000000-50000000">25M - 50M AOA</option>
              <option value="50000000-100000000">50M - 100M AOA</option>
              <option value="100000000-200000000">100M - 200M AOA</option>
              <option value="200000000+">Mais de 200M AOA</option>
            </select>
          </div>

          <div class="col-lg-3 col-md-3 col-sm-6">
            <select class="form-select" v-model="filters.condition" @change="applyFilters">
              <option value="">Estado</option>
              <option value="1">Novo</option>
              <option value="2">Usado</option>
              <option value="3">Reformado</option>
            </select>
          </div>

          <div class="col-lg-2 col-md-3 col-sm-6">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="verification" v-model="filters.verification"
                @change="applyFilters">
              <label class="form-check-label" for="verification">Verificadas</label>
            </div>
          </div>

          <div class="col-lg-1 col-md-3 col-sm-12">
            <button class="btn filter-btn w-100" @click="applyFilters" :disabled="isFiltering">
              <i :class="isFiltering ? 'fas fa-spinner fa-spin' : 'fas fa-search'"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <section id="propriedades" class="properties-section py-5">
      <div class="container">
        
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="mt-3 text-muted">Buscando imóveis...</p>
        </div>

        <div v-else-if="properties.length === 0" class="empty-state text-center py-5">
          <i class="fas fa-home fa-4x text-muted mb-3"></i>
          <h3>Nenhum imóvel encontrado</h3>
          <p class="text-muted">Tente ajustar os filtros ou explore outras opções.</p>
        </div>

        <div v-else class="row g-3">
          <div v-for="property in properties" :key="property.id" class="col-12 col-md-4 col-lg-4">
            <div class="property-card" @click="goToDetail(property.slug)">
              <div class="property-image" :style="{ backgroundImage: `url(${property.photo})` }">
                <div v-if="property.views >= 1000" class="views-badge">
                  <i class="fas fa-fire text-white me-1"></i>
                  Muito Vista
                </div>
                <div v-if="property.verification" class="verified-badge">
                  <i class="fas fa-check"></i> Verificada
                </div>
                <div class="price-tag">
                  {{ formatPrice(property.price) }} AOA
                  <span v-if="property.type === '2'" class="price-suffix">/mês</span>
                </div>
              </div>

              <div class="property-info">
                <h5 class="property-title">{{ property.name }}</h5>
                <p class="property-location">
                  <i class="fas fa-map-marker-alt me-1"></i>
                  {{ property.address }}
                </p>

                <div class="property-features">
                  <span><i class="fas fa-bed me-1"></i>{{ property.bedrooms }} Quartos</span>
                  <span><i class="fas fa-bath me-1"></i>{{ property.bathrooms }} WC</span>
                  <span><i class="fas fa-user me-1"></i>{{ property.availability === '0' ? 'Imediato' : property.availability === '1' ? '15 dias' : '30 dias' }}</span>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-3">
                  <small class="text-muted">
                    <i class="fas fa-eye me-1"></i>{{ property.views }} visualizações
                  </small>
                  <button class="btn-visit" @click.stop="goToDetail(property.slug)">
                    <i class="fas fa-eye me-1"></i>Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="totalPages > 1" class="pagination-wrapper mt-5">
          <nav aria-label="Paginação de imóveis">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                  <i class="fas fa-chevron-left"></i>
                </button>
              </li>
              <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                <button class="page-link" @click="changePage(page)">
                  {{ page }}
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>

    <button class="floating-filter-btn" :class="{ visible: showFloatingButton }" @click="scrollToFilters"
      title="Filtrar Imóveis">
      <i class="fas fa-filter"></i>
    </button>

    <FooterComponent />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
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
  status: string
  views: number
  category_id: number
  user_id: number
  year_built: number
  condition: string
  availability: string
  garages: string
  garden: string
  swimming_pool: string
  air_conditioning: string
  featured: string
  created_at: string
  photos: string
  photo: string
  verification: boolean
}

const isHeroLoaded = ref(false)
const isLoading = ref(true)
const isFiltering = ref(false)
const showFloatingButton = ref(false)
const showScrollToTop = ref(false)

const properties = ref<Property[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 9

const filters = ref({
  title: '',
  type: '',
  price_range: '',
  condition: '',
  verification: false
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const debouncedApplyFilters = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    applyFilters()
  }, 600)
}

const loadProperties = async () => {
  try {
    isLoading.value = true
    const token = Cookies.get('token')
    const params: any = {
      page: currentPage.value,
      per_page: perPage
    }

    if (filters.value.title) params.name = filters.value.title
    if (filters.value.type) params.type = filters.value.type
    if (filters.value.condition) params.condition = filters.value.condition
    if (filters.value.verification) params.verification = 1

    if (filters.value.price_range) {
      const [min, max] = filters.value.price_range.split('-')
      if (min) params.price_min = min
      if (max && max !== '+') params.price_max = max
      else if (max === '+') params.price_min = min
    }



    const response = await axios.get(`${API_URL}/product/list`, {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })

    const data = response.data

    properties.value = (data.products || []).map((p: any) => {
      const photos = parsePhotos(p.photos)
      return {
        ...p,
        photo: photos[0]?.url || '/placeholder.jpg',
        // verified: p.verified === '1' || p.verified === 1
      }
    })

    currentPage.value = data.current_page || 1
    totalPages.value = data.last_page || 1
  } catch (error) {
    console.error('Erro ao carregar imóveis:', error)
  } finally {
    isLoading.value = false
  }
}

const applyFilters = () => {
  isFiltering.value = true
  currentPage.value = 1
  loadProperties().finally(() => {
    isFiltering.value = false
  })
}

const changePage = (page: number | string) => {
  const pageNum = Number(page)
  if (!Number.isInteger(pageNum)) return
  if (pageNum < 1 || pageNum > totalPages.value || pageNum === currentPage.value) return
  currentPage.value = pageNum
  loadProperties()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const visiblePages = computed(() => {
  const delta = 2
  const range = []
  for (let i = Math.max(2, currentPage.value - delta); i <= Math.min(totalPages.value - 1, currentPage.value + delta); i++) {
    range.push(i)
  }
  if (currentPage.value - delta > 2) range.unshift('...')
  if (currentPage.value + delta < totalPages.value - 1) range.push('...')
  range.unshift(1)
  if (totalPages.value > 1) range.push(totalPages.value)
  return range
})

const parsePhotos = (photosString: string): any[] => {
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

const goToDetail = (slug: any) => {
  router.push({ name: 'app.property.detail', params: { slug } })
}

const scrollToFilters = () => {
  document.querySelector('.filters')?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  setTimeout(() => {
    isHeroLoaded.value = true
  }, 100)

  loadProperties()

  const handleScroll = () => {
    showFloatingButton.value = window.scrollY > 500
    showScrollToTop.value = window.scrollY > 300
  }
  window.addEventListener('scroll', handleScroll)

  return () => {
    window.removeEventListener('scroll', handleScroll)
    if (debounceTimer) clearTimeout(debounceTimer)
  }
})

watch(currentPage, () => {
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
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80') center/cover;
  opacity: 0.08;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.hero.loaded .hero-content {
  opacity: 1;
  transform: translateY(0);
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--dark-charcoal);
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: var(--medium-gray);
  font-weight: 500;
}


.filters {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 8px 30px var(--shadow-light);
  margin: -60px auto 40px;
  position: relative;
  z-index: 10;
  max-width: 1200px;
  border: 1px solid rgba(211, 47, 47, 0.15);
}

.properties-section {  
  max-width: 1280px; 
  margin: -60px auto 40px;
  padding: 28px; 
}

.filters-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 20px;
  text-align: center;
}

.radio-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.radio-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: var(--dark-charcoal);
  cursor: pointer;
  font-size: 0.95rem;
}

.radio-label input {
  margin-right: 6px;
}

.form-control,
.form-select {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 10px 14px;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 0 0.2rem rgba(211, 47, 47, 0.15);
}

.form-check-input:checked {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
}

.filter-btn {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  border: none;
  border-radius: 12px;
  padding: 12px;
  color: white;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-2px);
}

.property-card {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--soft-red);
  transition: all 0.4s ease;
  cursor: pointer;
  margin-bottom: 30px;
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
  transition: transform 0.5s ease;
}

.property-card:hover .property-image {
  transform: scale(1.03);
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

.pagination .page-link {
  border: none;
  color: var(--dark-charcoal);
  padding: 8px 14px;
  margin: 0 4px;
  border-radius: 8px;
  font-weight: 600;
}

.pagination .page-item.active .page-link {
  background: var(--primary-red);
  color: white;
}

.floating-filter-btn {
  position: fixed;
  bottom: 70px;
  right: 20px;
  z-index: 1000;
  background: var(--primary-red);
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(211, 47, 47, 0.3);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.floating-filter-btn.visible {
  opacity: 1;
  transform: translateY(0);
}

.floating-filter-btn:hover {
  transform: scale(1.1) translateY(0);
}

#scrollToTopBtn {
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 992px) {
  .hero h1 {
    font-size: 2.8rem;
  }

  .filters {
    margin: 20px 15px;
    padding: 20px;
  }

  .radio-group {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 80px 0;
  }

  .hero h1 {
    font-size: 2.4rem;
  }

  .filters .row>div {
    margin-bottom: 12px;
  }

  .property-image {
    height: 220px;
  }
}
</style>