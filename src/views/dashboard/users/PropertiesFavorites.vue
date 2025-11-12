<template>
  <main class="main favorites-page" id="top">
    <NavbarComponent />

    <section class="favorites-section">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">
              <i class="fas fa-heart text-danger me-3"></i>
              Meus Favoritos
            </h1>
            <p class="page-subtitle">
              {{ favorites.length }} {{ favorites.length === 1 ? 'anúncio' : 'anúncios' }} que você adorou
            </p>
          </div>
          <RouterLink :to="{ name: 'app.home' }" class="btn btn-outline-danger">
            <i class="fas fa-search me-2"></i>
            Explorar Mais
          </RouterLink>
        </div>

        <div v-if="isLoading" class="loading-container text-center py-5">
          <div class="spinner-border spinner-border-lg text-danger" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="mt-3 text-muted">Carregando seus favoritos...</p>
        </div>

        <div v-else-if="favorites.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-heart-broken text-danger"></i>
          </div>
          <h3>Nenhum favorito ainda</h3>
          <p class="empty-text">
            Quando você curtir um imóvel, ele aparecerá aqui para acesso rápido.
          </p>
          <RouterLink :to="{ name: 'app.home' }" class="btn btn-danger btn-lg">
            <i class="fas fa-search me-2"></i>
            Encontrar Imóveis
          </RouterLink>
        </div>

        <div v-else class="favorites-grid">
          <div class="row g-4">
            <div v-for="property in favorites" :key="property.id" class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
              <div class="property-card card h-100 position-relative">
                <div class="card-image-container position-relative overflow-hidden">
                  <img :src="property.photo" :alt="property.title" class="card-image"
                    @error="handleImageError" />
                  <div class="card-favorite-badge">
                    <i class="fas fa-heart text-white"></i>
                  </div>
                  <div class="card-quick-actions">
                    <button class="btn-quick-action btn-danger" @click="confirmUnfavorite(property)"
                      :disabled="isUnfavoriting.includes(property.id)"
                      title="Remover dos favoritos">
                      <i v-if="isUnfavoriting.includes(property.id)" class="fas fa-spinner fa-spin"></i>
                      <i v-else class="fas fa-heart-broken"></i>
                    </button>
                  </div>
                </div>

                <div class="card-body d-flex flex-column">
                  <div class="card-price mb-2">
                    <span class="price-value">{{ 'AOA' + formatPrice(property.price) }}</span>
                    <span v-if="property.type === 'rent'" class="price-label">/mês</span>
                  </div>

                  <h3 class="card-title">{{ property.title }}</h3>

                  <div class="property-meta mb-3">
                    <div class="meta-item">
                      <i class="fas fa-map-marker-alt me-1"></i>
                      {{ property.location }}
                    </div>
                    <div class="meta-item">
                      <i class="fas fa-calendar me-1"></i>
                      {{ formatDate(property.favorited_at) }}
                    </div>
                  </div>

                  <div class="property-features mb-3">
                    <div class="feature-item">
                      <i class="fas fa-bed me-1"></i>{{ property.bedrooms }} quarto{{ property.bedrooms !== 1 ? 's' : '' }}
                    </div>
                    <div class="feature-item">
                      <i class="fas fa-bath me-1"></i>{{ property.bathrooms }} banheiro{{ property.bathrooms !== 1 ? 's' : '' }}
                    </div>
                    <div class="feature-item">
                      <i class="fas fa-expand me-1"></i>{{ property.area }}m²
                    </div>
                  </div>

                  <div class="mt-auto">
                    <div class="property-stats mb-3">
                      <span class="stat-item">
                        <i class="fas fa-eye me-1"></i>{{ property.views || 0 }}
                      </span>
                      <span class="stat-item">
                        <i class="fas fa-heart me-1 text-danger"></i>{{ property.favorites || 0 }}
                      </span>
                    </div>

                    <RouterLink :to="`/casa/${property.id}`" class="btn btn-outline-danger w-100">
                      <i class="fas fa-external-link-alt me-1"></i>Ver Detalhes
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="showUnfavoriteModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-heart-broken text-danger me-2"></i>
              Remover dos favoritos?
            </h5>
            <button type="button" class="btn-close" @click="showUnfavoriteModal = false"></button>
          </div>
          <div class="modal-body">
            Deseja remover <strong>"{{ propertyToUnfavorite?.title }}"</strong> da sua lista de favoritos?
            <br><small class="text-muted">Você poderá favoritar novamente depois.</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showUnfavoriteModal = false">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="unfavoriteProperty" :disabled="isUnfavoriting.length > 0">
              <i v-if="isUnfavoriting.length > 0" class="fas fa-spinner fa-spin me-2"></i>
              {{ isUnfavoriting.length > 0 ? 'Removendo...' : 'Remover' }}
            </button>
          </div>
        </div>
      </div>
    </div>

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

interface Property {
  id: number
  title: string
  price: number
  type: 'sale' | 'rent'
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  photo: string
  views?: number
  favorites?: number
  favorited_at: string
}

const favorites = ref<Property[]>([])
const isLoading = ref(true)
const isUnfavoriting = ref<number[]>([])
const propertyToUnfavorite = ref<Property | null>(null)
const showUnfavoriteModal = ref(false)

const confirmUnfavorite = (property: Property) => {
  propertyToUnfavorite.value = property
  showUnfavoriteModal.value = true
}

const unfavoriteProperty = async () => {
  if (!propertyToUnfavorite.value) return

  try {
    isUnfavoriting.value.push(propertyToUnfavorite.value.id)
    const token = Cookies.get('token')

    if (!token) {
      router.push({ name: 'app.auth.login' })
      return
    }

    await axios.delete(`${API_URL}/products/favorites/${propertyToUnfavorite.value.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    favorites.value = favorites.value.filter(p => p.id !== propertyToUnfavorite.value?.id)
    showUnfavoriteModal.value = false
    propertyToUnfavorite.value = null
    showNotification('Removido dos favoritos!', 'success')
  } catch (error: any) {
    showNotification('Erro ao remover favorito', 'error')
  } finally {
    isUnfavoriting.value = isUnfavoriting.value.filter(id => id !== propertyToUnfavorite.value?.id)
  }
}




const loadFavorites = async () => {

  try {
    isLoading.value = true
    const token = Cookies.get('token')

    const userId = Cookies.get('user') 

    if (!token) {
      router.push({ name: 'app.auth.login' })
      return
    }

    const response = await axios.get(`${API_URL}/user/product/favorites/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    favorites.value = (response.data.favorites || []).map((p: any) => ({
      ...p,
      photo: p.photos?.[0]?.url || '/placeholder-home.jpg',
      favorited_at: p.favorited_at || p.created_at
    }))

  } catch (error: any) {
    if (error.response?.status === 401) {
      showNotification('Sessão expirada', 'error')
      router.push({ name: 'app.auth.login' })
    } else {
      showNotification('Erro ao carregar favoritos', 'error')
    }
  } finally {
    isLoading.value = false
  }
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-home.jpg'
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-AO', { minimumFractionDigits: 0 }).format(price)
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString))
}

const showNotification = (message: string, type: 'success' | 'error') => {
  const alert = document.createElement('div')
  alert.className = `alert alert-${type} alert-notification position-fixed`
  alert.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
    ${message}
  `
  document.body.appendChild(alert)
  setTimeout(() => alert.remove(), 4000)
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped>
.favorites-page {
  padding-top: 100px;
  background: linear-gradient(135deg, #ffebee 0%, #f8f9fa 100%);
  min-height: 100vh;
}

.favorites-section {
  padding: 40px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--dark-charcoal);
  margin: 0;
  background: linear-gradient(135deg, #e53935, #c62828);
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
  padding: 80px 20px;
}

.empty-icon {
  font-size: 7rem;
  color: #e53935;
  margin-bottom: 24px;
  opacity: 0.7;
}

.empty-state h3 {
  color: var(--dark-charcoal);
  font-size: 2rem;
  margin-bottom: 16px;
}

.empty-text {
  color: var(--medium-gray);
  font-size: 1.15rem;
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.property-card {
  height: 480px;
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 57, 53, 0.1);
  transition: all 0.3s ease;
}

.property-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(229, 57, 53, 0.15);
  border-color: rgba(229, 57, 53, 0.3);
}

.card-image-container {
  height: 220px;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  position: relative;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.property-card:hover .card-image {
  transform: scale(1.05);
}

.card-favorite-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 8px 12px;
  background: rgba(229, 57, 53, 0.95);
  border-radius: 50px;
  font-size: 1.1rem;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(229, 57, 53, 0.3);
}

.card-quick-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 4px;
  z-index: 3;
}

.btn-quick-action {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: var(--dark-charcoal);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-quick-action:hover:not(:disabled) {
  background: #dc3545;
  color: white;
  transform: scale(1.1);
}

.btn-quick-action.btn-danger:hover {
  background: #c82333 !important;
}

.card-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
}

.card-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 10px;
}

.price-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: #e53935;
}

.price-label {
  font-size: 0.85rem;
  color: var(--medium-gray);
}

.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 10px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.property-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.88rem;
}

.meta-item {
  display: flex;
  align-items: center;
  color: var(--medium-gray);
}

.property-features {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.feature-item {
  display: flex;
  align-items: center;
  font-size: 0.82rem;
  color: var(--dark-charcoal);
  font-weight: 500;
}

.property-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--medium-gray);
  font-weight: 500;
}

.btn-outline-danger {
  border: 2px solid #e53935;
  color: #e53935;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-danger:hover {
  background: #e53935;
  color: white;
  transform: translateY(-1px);
}

.modal-content {
  border-radius: 16px;
  border: none;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 20px 24px;
}

.modal-title {
  color: var(--dark-charcoal);
  font-weight: 700;
}

.modal-body {
  padding: 24px;
  color: var(--dark-charcoal);
}

.alert-notification {
  top: 120px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  border-radius: 12px;
  border: none;
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 992px) {
  .page-header {
    flex-direction: column;
    text-align: center;
  }

  .property-card {
    height: 440px;
  }

  .card-image-container {
    height: 200px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .card-quick-actions {
    right: 8px;
    top: 8px;
  }

  .btn-quick-action {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }

  .property-card {
    height: auto;
    min-height: 420px;
  }

  .card-image-container {
    height: 180px;
  }

  .property-features {
    flex-direction: column;
    gap: 6px;
    text-align: center;
  }

  .property-stats {
    justify-content: center;
  }
}
</style>