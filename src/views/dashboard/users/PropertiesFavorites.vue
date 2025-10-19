<template>
  <main class="main favorites-page" id="top">
    <NavbarComponent />

    <section class="favorites-section">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title text-danger">
              <i class="fas fa-heart me-3"></i>
              Lista de Adoradas
            </h1>
            <p class="page-subtitle">{{ favorites.length }} casa(s) que você adorou</p>
          </div>
        </div>

        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="mt-3">Carregando suas casas favoritas...</p>
        </div>

        <div v-else-if="favorites.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-heart-broken"></i>
          </div>
          <h3>Nenhuma casa adorada ainda</h3>
          <p class="empty-text">Salve suas casas favoritas para vê-las aqui!</p>
          <RouterLink :to="{ name: 'app.home' }" class="btn btn-danger text-center w-100">
            <i class="fas fa-home me-2"></i>Explorar Casas
          </RouterLink>
        </div>

        <div v-else class="favorites-grid">
          <div class="row g-4">
            <div v-for="property in favorites" :key="property.id" class="col-lg-4 col-md-6">
              <div class="favorite-card">
                <div class="card-image-container">
                  <img 
                    :src="property.images[0] || '/placeholder-home.jpg'" 
                    :alt="property.title"
                    class="card-image"
                    @error="handleImageError"
                  />
                  <button 
                    class="btn-favorite" 
                    :class="{ 'active': true }"
                    @click="toggleFavorite(property.id)"
                    :aria-label="`Remover ${property.title} dos favoritos`"
                  >
                    <i class="fas fa-heart"></i>
                  </button>
                  <div class="card-status" :class="getStatusClass(property.status)">
                    {{ getStatusLabel(property.status) }}
                  </div>
                </div>

                <div class="card-body">
                  <div class="card-price">
                    <span class="price-value">R$ {{ formatPrice(property.price) }}</span>
                    <span v-if="property.type === 'rent'" class="price-label">/mês</span>
                  </div>

                  <h3 class="card-title">{{ property.title }}</h3>
                  <p class="card-location">
                    <i class="fas fa-map-marker-alt me-1"></i>
                    {{ property.location }}
                  </p>

                  <div class="property-features">
                    <div class="feature-item">
                      <i class="fas fa-bed me-1"></i>
                      {{ property.bedrooms }} quarto{{ property.bedrooms > 1 ? 's' : '' }}
                    </div>
                    <div class="feature-item">
                      <i class="fas fa-bath me-1"></i>
                      {{ property.bathrooms }} banheiro{{ property.bathrooms > 1 ? 's' : '' }}
                    </div>
                    <div class="feature-item">
                      <i class="fas fa-expand-arrows-alt me-1"></i>
                      {{ property.area }}m²
                    </div>
                  </div>

                  <div class="card-actions">
                    <RouterLink :to="`/casa/${property.id}`" class="btn btn-outline-primary">
                      <i class="fas fa-eye me-1"></i>Ver Detalhes
                    </RouterLink>
                    <button class="btn btn-contact" @click="contactOwner(property)">
                      <i class="fas fa-whatsapp me-1"></i>WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginação -->
        <div v-if="favorites.length > 0" class="pagination-section mt-5">
          <nav aria-label="Paginação das favoritas">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                  <i class="fas fa-chevron-left"></i>
                </button>
              </li>
              <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                <button class="page-link" @click="changePage(page)">{{ page }}</button>
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

    <FooterComponent />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import axios from 'axios'
import Cookies from 'js-cookie'

const router = useRouter()
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'

interface FavoriteProperty {
  id: number
  title: string
  price: number
  type: 'sale' | 'rent'
  status: 'available' | 'reserved' | 'sold'
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  owner_phone: string
}

const favorites = ref<FavoriteProperty[]>([])
const isLoading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 9

const loadFavorites = async (page = 1) => {
  try {
    isLoading.value = true
    const token = Cookies.get('token')
    
    const response = await axios.get(`${API_URL}/favorites?page=${page}&limit=${perPage}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    favorites.value = response.data.data
    currentPage.value = response.data.current_page
    totalPages.value = response.data.last_page
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error)
    showNotification('Erro ao carregar favoritos', 'error')
  } finally {
    isLoading.value = false
  }
}

const toggleFavorite = async (propertyId: number) => {
  try {
    const token = Cookies.get('token')
    await axios.delete(`${API_URL}/favorites/${propertyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    favorites.value = favorites.value.filter(p => p.id !== propertyId)
    showNotification('Casa removida dos favoritos!', 'success')
  } catch (error) {
    showNotification('Erro ao remover favorito', 'error')
  }
}

const contactOwner = (property: FavoriteProperty) => {
  const phone = property.owner_phone.replace(/\D/g, '')
  window.open(`https://wa.me/55${phone}`, '_blank')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price).replace('R$', '')
}

const getStatusClass = (status: FavoriteProperty['status']) => {
  const classes = {
    available: 'status-available',
    reserved: 'status-reserved',
    sold: 'status-sold'
  }
  return classes[status] || 'status-available'
}

const getStatusLabel = (status: FavoriteProperty['status']) => {
  const labels = {
    available: 'Disponível',
    reserved: 'Reservada',
    sold: 'Vendida'
  }
  return labels[status] || 'Disponível'
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-home.jpg'
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadFavorites(page)
}

const showNotification = (message: string, type: 'success' | 'error') => {
  const alert = document.createElement('div')
  alert.className = `alert alert-${type} alert-notification`
  alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>${message}`
  document.body.appendChild(alert)
  setTimeout(() => alert.remove(), 3000)
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped>
.favorites-page {
  padding-top: 100px;
  background: linear-gradient(135deg, var(--soft-red) 0%, #f8f9fa 100%);
  min-height: 100vh;
}

.favorites-section { padding: 40px 0; }

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--dark-charcoal);
  margin: 0;
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--medium-gray);
  margin: 8px 0 0;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 6rem;
  color: var(--soft-red);
  margin-bottom: 20px;
}

.empty-state h3 {
  color: var(--dark-charcoal);
  font-size: 1.8rem;
  margin-bottom: 12px;
}

.empty-text {
  color: var(--medium-gray);
  font-size: 1.1rem;
  margin-bottom: 24px;
}

.favorites-grid { margin-bottom: 40px; }

.favorite-card {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
  height: 100%;
}

.favorite-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

.card-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.favorite-card:hover .card-image {
  transform: scale(1.05);
}

.btn-favorite {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  z-index: 2;
}

.btn-favorite.active {
  background: var(--primary-red);
  color: white;
}

.btn-favorite:hover { transform: scale(1.1); }

.card-status {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-available { background: rgba(40,167,69,0.9); }
.status-reserved { background: rgba(255,193,7,0.9); }
.status-sold { background: rgba(220,53,69,0.9); }

.card-body {
  padding: 20px;
}

.card-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 12px;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary-red);
}

.price-label {
  font-size: 0.9rem;
  color: var(--medium-gray);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 8px;
  line-height: 1.3;
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-location {
  color: var(--medium-gray);
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.property-features {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--dark-charcoal);
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-outline-primary {
  border: 2px solid var(--primary-red);
  color: var(--primary-red);
  background: transparent;
}

.btn-outline-primary:hover {
  background: var(--primary-red);
  color: white;
  transform: translateY(-1px);
}

.btn-contact {
  background: #25D366;
  color: white;
  border: none;
}

.btn-contact:hover {
  background: #128C7E;
  transform: translateY(-1px);
}

.pagination-section { margin-top: 40px; }

.pagination .page-link {
  border: none;
  color: var(--primary-red);
  padding: 12px 16px;
  margin: 0 4px;
  border-radius: 8px;
  font-weight: 600;
}

.pagination .page-item.active .page-link {
  background: var(--primary-red);
  color: white;
}

.pagination .page-link:hover:not(.disabled) {
  background: var(--soft-red);
  transform: translateY(-1px);
}

.alert-notification {
  position: fixed;
  top: 120px;
  right: 20px;
  z-index: 9999;
  max-width: 350px;
  animation: slideInRight 0.3s ease;
}

@media (max-width: 992px) {
  .page-title { font-size: 2rem; }
  .property-features { justify-content: center; }
  .card-actions { flex-direction: column; }
}

@media (max-width: 768px) {
  .page-subtitle { font-size: 1rem; }
  .card-body { padding: 16px; }
  .price-value { font-size: 1.3rem; }
  .card-title { font-size: 1rem; }
  .pagination .page-link { padding: 10px 12px; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>