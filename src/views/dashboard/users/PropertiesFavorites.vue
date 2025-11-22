<template>
  <main class="main my-properties-page" id="top">
    <NavbarComponent />

    <section class="properties-section">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">
              <i class="fas fa-heart me-3"></i>
              Meus Favoritos
            </h1>
            <p class="page-subtitle">
              {{ favorites.length }} {{ favorites.length === 1 ? 'favorito' : 'favoritos' }}
            </p>
          </div>
        </div>

        <div v-if="isLoading" class="loading-container text-center py-5">
          <div class="spinner-border spinner-border-lg text-danger" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="mt-3 text-muted">Carregando seus favoritos...</p>
        </div>

        <div v-else-if="favorites.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-heart-broken"></i>
          </div>
          <h3>Nenhum favorito</h3>
          <p class="empty-text">
            Adicione propriedades aos favoritos para vê-las aqui!
          </p>
          <RouterLink :to="{ name: 'app.properties' }" class="btn btn-danger btn-lg">
            Explorar Propriedades
          </RouterLink>
        </div>

        <div v-else>
          <div class="row g-4">
            <div v-for="item in favorites" :key="item.product_id" class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
              <div class="property-card card h-100">
                <div class="card-image-container position-relative overflow-hidden">
                  <img :src="item.photo" :alt="item.title" class="card-image" @error="handleImageError" />
                  <div class="card-quick-actions">
                    <button class="btn-quick-action btn-danger" @click="confirmRemove(item)" :disabled="removingIds.includes(item.product_id)" title="Remover">
                      <i :class="removingIds.includes(item.product_id) ? 'fas fa-spinner fa-spin' : 'fas fa-heart-broken'"></i>
                    </button>
                  </div>
                </div>

                <div class="card-body d-flex flex-column">
                  <div class="card-price mb-2">

                    <span class="price-value">{{ 'AOA' + formatPrice(item.price) }}</span>
                  </div>

                  <h3 class="card-title">{{ item.name }}</h3>

                  <div class="property-meta mb-3">
                    <div class="meta-item">
                      <i class="fas fa-map-marker-alt me-1"></i>
                      {{ item.address }}
                    </div>
                  </div>

                  <div class="property-features mb-3">
                    <div class="feature-item">
                      <i class="fas fa-bed me-1"></i>{{ item.bedrooms }} qr
                    </div>
                    <div class="feature-item">
                      <i class="fas fa-bath me-1"></i>{{ item.bathrooms }} ban
                    </div>
                    <div v-if="item.garages" class="feature-item">
                      <i class="fas fa-car me-1"></i>{{ item.garages }} gar
                    </div>
                  </div>

                  <div class="mt-auto">
                    <RouterLink :to="{ name: 'app.property.detail', params: { slug: item.slug } }" :scroll-behavior="{ behavior: 'smooth' }" class="btn btn-outline-primary w-100">
                      Ver Detalhes
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="showDeleteModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-exclamation-triangle text-warning me-2"></i>
              Remover dos favoritos?
            </h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            Tem certeza que deseja remover <strong>"{{ itemToRemove?.title }}"</strong> dos favoritos?
            <br><small class="text-muted">Você poderá favoritar novamente depois.</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="removeFromFavorites" :disabled="isDeleting">
              <i v-if="isDeleting" class="fas fa-spinner fa-spin me-2"></i>
              {{ isDeleting ? 'Removendo...' : 'Remover' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <FooterComponent />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import axios from 'axios'
import Cookies from 'js-cookie'

const router = useRouter()
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'

interface Favorite {
  id: number
  slug: string
  product_id: number
  name: string
  price: number
  type: string
  address: string
  bedrooms: number
  bathrooms: number
  garages?: number
  photos: string
  photo?: string
  title?: string
}

const favorites = ref<Favorite[]>([])
const isLoading = ref(true)
const removingIds = ref<number[]>([])
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const itemToRemove = ref<Favorite | null>(null)

const loadFavorites = async () => {
  try {
    isLoading.value = true
    const token = Cookies.get('token')
    const userId = Cookies.get('user')
    // if (!token || !userId) {
    //   router.push({ name: 'app.auth.login' })
    //   return
    // }
    const response = await axios.get(`${API_URL}/user/product/favorites`, {
      params: { user_id: userId },
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = response.data.favorites || []
    favorites.value = data.map((item: any) => {
      const photos = parsePhotos(item.photos || '[]')
      return {
        id: item.id || 0,
        slug: item.slug || '',
        product_id: item.product_id || item.id || 0,
        name: item.name || 'Sem título',
        price: Number(item.price) || 0,
        type: item.type || 'sale',
        address: item.address || 'Sem endereço',
        bedrooms: Number(item.bedrooms) || 0,
        bathrooms: Number(item.bathrooms) || 0,
        garages: item.garages ? Number(item.garages) : undefined,
        photos: item.photos || '[]',
        photo: photos[0] || '/placeholder-home.jpg',
        title: item.name || 'Sem título'
      }
    })
  } catch (error: any) {
    if (error.response?.status === 401) {
    //  router.push({ name: 'app.auth.login' })
    }
  } finally {
    isLoading.value = false
  }
}

const confirmRemove = (item: Favorite) => {
  itemToRemove.value = item
  showDeleteModal.value = true
}

const removeFromFavorites = async () => {
  if (!itemToRemove.value) return
  const productId = itemToRemove.value.product_id
  if (removingIds.value.includes(productId)) return

  isDeleting.value = true
  removingIds.value.push(productId)

  try {
    const token = Cookies.get('token')
    await axios.delete(`${API_URL}/user/product/favorite/${productId}/${Cookies.get('user')}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    favorites.value = favorites.value.filter(f => f.product_id !== productId)
    showDeleteModal.value = false
  } catch (error) {
    console.error(error)
  } finally {
    isDeleting.value = false
    removingIds.value = removingIds.value.filter(id => id !== productId)
    itemToRemove.value = null
  }
}

const parsePhotos = (str: string): string[] => {
  if (!str) return []
  try {
    const cleaned = str.replace(/\\\//g, '/')
    const parsed = JSON.parse(cleaned)
    return Array.isArray(parsed) ? parsed.map((p: any) => p.url).filter(Boolean) : []
  } catch {
    return []
  }
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/placeholder-home.jpg'
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'AOA'
  }).format(price).replace('AOA', '')
}

onMounted(loadFavorites)
</script>

<style scoped>
.my-properties-page { padding-top: 100px; background: linear-gradient(135deg, var(--soft-red) 0%, #f8f9fa 100%); min-height: 100vh; }
.properties-section { padding: 40px 0; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 40px; flex-wrap: wrap; }
.page-title { font-size: 2.5rem; font-weight: 800; color: var(--dark-charcoal); margin: 0; background: linear-gradient(135deg, var(--primary-red), #e53935); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.page-subtitle { font-size: 1.2rem; color: var(--medium-gray); margin: 8px 0 0; font-weight: 500; }
.loading-container, .empty-state { text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 7rem; color: var(--soft-red); margin-bottom: 24px; }
.empty-state h3 { color: var(--dark-charcoal); font-size: 2rem; margin-bottom: 16px; }
.empty-text { color: var(--medium-gray); font-size: 1.15rem; margin-bottom: 32px; max-width: 500px; margin-left: auto; margin-right: auto; }
.btn-lg { padding: 14px 28px; font-size: 1.1rem; border-radius: 12px; }
.property-card { height: 480px; background: var(--card-bg); border-radius: 16px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05); transition: all 0.3s ease; }
.property-card:hover { transform: translateY(-6px); box-shadow: 0 15px 35px rgba(0,0,0,0.15); }
.card-image-container { height: 220px; background: linear-gradient(45deg, #f8f9fa, #e9ecef); position: relative; overflow: hidden; }
.card-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.property-card:hover .card-image { transform: scale(1.05); }
.card-quick-actions { position: absolute; top: 12px; right: 12px; display: flex; gap: 4px; z-index: 3; }
.btn-quick-action { width: 36px; height: 36px; border-radius: 8px; border: none; background: rgba(255,255,255,0.9); color: var(--dark-charcoal); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; transition: all 0.2s ease; backdrop-filter: blur(10px); }
.btn-quick-action:hover:not(:disabled) { background: white; transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.btn-danger:hover {To: #dc3545 !important; color: white !important; }
.card-body { padding: 18px; display: flex; flex-direction: column; }
.card-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 10px; }
.price-value { font-size: 1.35rem; font-weight: 800; color: var(--primary-red); }
.price-label { font-size: 0.85rem; color: var(--medium-gray); }
.card-title { font-size: 1.05rem; font-weight: 700; color: var(--dark-charcoal); margin-bottom: 10px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.property-meta { display: flex; gap: 12px; margin-bottom: 12px; font-size: 0.88rem; }
.meta-item { display: flex; align-items: center; color: var(--medium-gray); }
.property-features { display: flex; gap: 10px; margin-bottom: 14px; }
.feature-item { display: flex; align-items: center; font-size: 0.82rem; color: var(--dark-charcoal); font-weight: 500; }
.btn-outline-primary { border: 2px solid var(--primary-red); color: var(--primary-red); padding: 10px 16px; border-radius: 10px; font-weight: 600; transition: all 0.3s ease; }
.btn-outline-primary:hover { background: var(--primary-red); color: white; transform: translateY(-1px); }
.modal { z-index: 1060; }
.modal-content { border-radius: 16px; border: none; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
.modal-header { border-bottom: 1px solid #e9ecef; padding: 20px 24px; }
.modal-title { color: var(--dark-charcoal); font-weight: 700; }
.modal-body { padding: 24px; color: var(--dark-charcoal); }
.modal-footer { padding: 16px 24px; }
@media (max-width: 1400px) { .property-card { height: 460px; } }
@media (max-width: 992px) { .page-header { flex-direction: column; text-align: center; } .page-title { font-size: 2.2rem; } .property-card { height: 440px; } .card-image-container { height: 200px; } .property-features { justify-content: center; } .property-meta { flex-direction: column; gap: 8px; } }
@media (max-width: 768px) { .page-subtitle { font-size: 1.1rem; } .card-quick-actions { right: 8px; top: 8px; flex-direction: column; gap: 2px; } .btn-quick-action { width: 32px; height: 32px; font-size: 0.8rem; } .property-card { height: auto; min-height: 420px; } .card-image-container { height: 180px; } .property-features { flex-direction: column; gap: 6px; text-align: center; } }
@media (max-width: 576px) { .property-features { flex-direction: column; } }
</style>