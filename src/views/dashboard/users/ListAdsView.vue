<template>
    <main class="main my-properties-page" id="top">
        <NavbarComponent />

        <section class="properties-section">
            <div class="container">
                <div class="page-header">
                    <div class="header-content">
                        <h1 class="page-title">
                            <i class="fas fa-building me-3"></i>
                            Meus Anúncios
                        </h1>
                        <p class="page-subtitle">
                            {{ properties.length }} {{ properties.length === 1 ? 'anúncio' : 'anúncios' }} publicados
                        </p>
                    </div>
                    <RouterLink :to="{ name: 'app.user.property.create' }" class="btn btn-danger btn-lg">
                        <i class="fas fa-plus me-2"></i>
                        Novo Anúncio
                    </RouterLink>
                </div>

                <div v-if="isLoading" class="loading-container text-center py-5">
                    <div class="spinner-border spinner-border-lg text-danger" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <p class="mt-3 text-muted">Carregando seus anúncios...</p>
                </div>

                <div v-else-if="properties.length === 0" class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-building-slash"></i>
                    </div>
                    <h3>Nenhum anúncio publicado</h3>
                    <p class="empty-text">
                        Publique sua primeira casa e comece a atrair interessados!
                    </p>
                    <RouterLink :to="{ name: 'app.user.property.create' }" class="btn btn-danger btn-lg">
                        <i class="fas fa-plus me-2"></i>
                        Publicar Primeiro Anúncio
                    </RouterLink>
                </div>

                <div v-else class="properties-grid">
                
                    


                    <div class="row g-4">
                        <div v-for="property in filteredProperties" :key="property.id"
                            class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <div class="property-card card h-100">
                                <div class="card-image-container position-relative overflow-hidden">
                                    <img :src="property.photo" :alt="property.name" class="card-image"
                                        @error="handleImageError" />
                                    <div class="card-status-badge" :class="getStatusClass(property.status)">
                                        {{ getStatusLabel(property.status) }}
                                    </div>
                                    <div class="card-quick-actions">
                                        <!-- <button class="btn-quick-action" @click="toggleActive(property)"
                                            :disabled="isUpdating.includes(property.id)"
                                            :title="property.status === 'active' ? 'Desativar' : 'Ativar'">
                                            <i v-if="isUpdating.includes(property.id)"
                                                class="fas fa-spinner fa-spin"></i>
                                            <i v-else class="fas"
                                                :class="property.status === 'active' ? 'fa-eye-slash' : 'fa-eye'"></i>
                                        </button> -->
                                        <RouterLink :to="{ name: 'app.user.property.edit', params: { id: property.id } }" class="btn-quick-action"
                                            title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </RouterLink>
                                        <button class="btn-quick-action btn-danger" @click="confirmDelete(property)"
                                            title="Excluir">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="card-body d-flex flex-column">
                                    <div class="card-price mb-2">
                                        <span class="price-value">{{ 'AOA' + formatPrice(property.price) }}</span>
                                        <!-- <span v-if="property.type === 'rent'" class="price-label">/mês</span> -->
                                    </div>

                                    <h3 class="card-title">{{ property.name }}</h3>

                                    <div class="property-meta mb-3">
                                        <!-- <div class="meta-item">
                                            <i class="fas fa-map-marker-alt me-1"></i>
                                            {{ property.address }}
                                        </div> -->
                                        <div class="meta-item">
                                            <i class="fas fa-calendar me-1"></i>
                                            {{ formatDate(property.created_at) }}
                                        </div>
                                    </div>

                                    <div class="property-features mb-3">
                                        <div class="feature-item">
                                            <i class="fas fa-bed me-1"></i>{{ property.bedrooms }} qr
                                        </div>
                                        <div class="feature-item">
                                            <i class="fas fa-bath me-1"></i>{{ property.bathrooms }} ban
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
                                                <i class="fas fa-heart me-1"></i>{{ property.favorites || 0 }}
                                            </span>
                                        </div>

                                       <RouterLink :to="{ name: 'app.property.detail', params: { id: property.id } }" :scroll-behavior="{ behavior: 'smooth' }" class="btn btn-outline-primary w-100">
                      Ver Detalhes
                    </RouterLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="totalPages > 1" class="pagination-section mt-5">
                        <nav aria-label="Paginação">
                            <ul class="pagination justify-content-center">
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                    <button class="page-link" @click="changePage(currentPage - 1)"
                                        :disabled="currentPage === 1">
                                        <i class="fas fa-chevron-left"></i>
                                    </button>
                                </li>
                                <li v-for="page in visiblePages" :key="page" class="page-item"
                                    :class="{ active: currentPage === page }">
                                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                                </li>
                                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                    <button class="page-link" @click="changePage(currentPage + 1)"
                                        :disabled="currentPage === totalPages">
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
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
                            Confirmar exclusão
                        </h5>
                        <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
                    </div>
                    <div class="modal-body">
                        Tem certeza que deseja excluir <strong>"{{ propertyToDelete?.name }}"</strong>?
                        <br><small class="text-muted">Esta ação não pode ser desfeita.</small>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-danger" @click="deleteProperty" :disabled="isDeleting">
                            <i v-if="isDeleting" class="fas fa-spinner fa-spin me-2"></i>
                            {{ isDeleting ? 'Excluindo...' : 'Excluir Anúncio' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <FooterComponent />
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import axios from 'axios'
import Cookies from 'js-cookie'

const router = useRouter()
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'

interface Property {
    id: number
    name: string
    price: number
    type: 'sale' | 'rent'
    status: '0' | '1' | '2'
    location: string
    bedrooms: number
    bathrooms: number
    area: number
    photos: string[]
    photo: string
    created_at: string
    updated_at: string
    views?: number
    favorites?: number
}

interface Filters {
    status: string
    type: string
}

const properties = ref<Property[]>([])
const isLoading = ref(true)
const isUpdating = ref<number[]>([])
const isDeleting = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 12

const filters = reactive<Filters>({
    status: '',
    type: ''
})

const selectedStatus = ref('')
const selectedType = ref('')



const confirmDelete = (property: Property) => {
    propertyToDelete.value = property
    showDeleteModal.value = true

}

const propertyToDelete = ref<Property | any>(null)
const showDeleteModal = ref(false)



const filteredProperties = computed(() => {
    return properties.value.filter(property => {
        const matchesStatus = !filters.status || property.status === filters.status
        const matchesType = !filters.type || property.type === filters.type
        return matchesStatus && matchesType
    })
})

const visiblePages = computed(() => {
    const pages: number[] = []
    const delta = 2
    let left = currentPage.value - delta
    let right = currentPage.value + delta + 1

    const total = totalPages.value

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        while (left > 1) {
            pages.push(left)
            left--
        }
        pages.reverse()

        pages.push(currentPage.value)

        while (pages.length + delta < total) {
            pages.push(++right)
        }
        pages.push(total)
    }
    return pages
})

const loadProperties = async (page = 1) => {
    try {
        isLoading.value = true
        const token = Cookies.get('token')
        const userId = Cookies.get('user')

        if (!token) {
            router.push({ name: 'app.auth.login' })
            return
        }

        const params = new URLSearchParams({
            page: page.toString(),
            limit: perPage.toString(),
            user: userId || '',
            status: filters.status || '',
            type: filters.type || ''
        })

        // const response = await axios.get(`${API_URL}/products/my?${params}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // })
        const response = await axios.get(`${API_URL}/user/product/list`, {
            params,
            headers: { Authorization: `Bearer ${token}` }
        })


        properties.value = response.data.products || []
        currentPage.value = response.data.current_page || 1
        totalPages.value = response.data.last_page || 1

    } catch (error: any) {
        // console.error('Erro ao carregar propriedades:', error)
        if (error.response?.status === 401) {
            showNotification('Sessão expirada', 'error')
            router.push({ name: 'app.auth.login' })
        } else {
            showNotification('Erro ao carregar anúncios', 'error')
        }
    } finally {
        isLoading.value = false
    }
}




const toggleActive = async (property: Property) => {
    try {
        isUpdating.value.push(property.id)
        const token = Cookies.get('token')

        await axios.patch(`${API_URL}/properties/${property.id}/toggle`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })

        property.status = property.status === '1' ? '0' : property.status === '0' ? '1' : '2';
        showNotification(
            property.status === '1' ? 'Anúncio ativado!' : 'Anúncio desativado!',
            'success'
        )
    } catch (error: any) {
        showNotification('Erro ao atualizar status', 'error')
    } finally {
        isUpdating.value = isUpdating.value.filter(id => id !== property.id)
    }
}


const deleteProperty = async () => {
    if (!propertyToDelete.value) return

    try {
        isDeleting.value = true
        const token = Cookies.get('token')

        // await axios.delete(`${API_URL}/properties/${propertyToDelete.value.id}`, {
        //     headers: { Authorization: `Bearer ${token}` }
        // })

        const response = await axios.delete(`${API_URL}/user/product/delete/${propertyToDelete.value.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })


        loadProperties();
        showDeleteModal.value = false
        propertyToDelete.value = null

        showNotification('Anúncio excluído com sucesso!', 'success')


    } catch (error: any) {
        showNotification('Erro ao excluir anúncio', 'error')
    } finally {
        isDeleting.value = false
    }
}

const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value || page === currentPage.value) return

    window.scrollTo({ top: 0, behavior: 'smooth' })
    loadProperties(page)
}

// const getFirstImage = (images: string[]) => {
//     return images?.[0] || '/placeholder-home.jpg'
// }

const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = '/placeholder-home.jpg'
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'AOA'
    }).format(price).replace('AOA', '')
}

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(new Date(dateString))
}

const getStatusClass = (status: Property['status']) => {
    const statusMap: Record<string, string> = {
        '1': 'status-active',
        '0': 'status-inactive',
        '2': 'status-pending'
    };
    return statusMap[status] || 'status-pending';
}

const getStatusLabel = (status: Property['status']) => {
    const statusMap: Record<string, string> = {
        '1': 'Ativo',
        '0': 'Inativo',
        '2': 'Pendente'
    };
    return statusMap[status] || 'Pendente';
}

const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const alert = document.createElement('div')
    alert.className = `alert alert-${type} alert-notification position-fixed`
    alert.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'exclamation-circle'} me-2"></i>
    ${message}
  `
    document.body.appendChild(alert)

    setTimeout(() => {
        alert.remove()
    }, 4000)
}

onMounted(() => {
    loadProperties()
})
</script>

<style scoped>
.my-properties-page {
    padding-top: 100px;
    background: linear-gradient(135deg, var(--soft-red) 0%, #f8f9fa 100%);
    min-height: 100vh;
}

.properties-section {
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

.btn-lg {
    padding: 14px 28px;
    font-size: 1.1rem;
    border-radius: 12px;
}

.empty-state {
    text-align: center;
    padding: 80px 20px;
}

.empty-icon {
    font-size: 7rem;
    color: var(--soft-red);
    margin-bottom: 24px;
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

.filters-card {
    background: var(--card-bg);
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.filter-group {
    position: relative;
    display: inline-block;
    min-width: 140px;
}

.filter-label {
    position: absolute;
    top: -10px;
    left: 12px;
    background: var(--card-bg);
    padding: 0 8px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--primary-red);
}

.form-select {
    padding: 10px 14px 10px 12px;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    background: var(--card-bg);
    font-weight: 500;
    font-size: 0.95rem;
}

.form-select:focus {
    border-color: var(--primary-red);
    box-shadow: 0 0 0 0.2rem rgba(211, 47, 47, 0.15);
}

.filter-results {
    font-weight: 600;
    color: var(--dark-charcoal);
    font-size: 1rem;
}

.property-card {
    height: 480px;
    background: var(--card-bg);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.property-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
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

.card-status-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    color: white;
    z-index: 2;
}

.status-active {
    background: rgba(40, 167, 69, 0.95);
}

.status-inactive {
    background: rgba(108, 117, 125, 0.95);
}

.status-pending {
    background: rgba(255, 193, 7, 0.95);
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
    background: rgba(255, 255, 255, 0.9);
    color: var(--dark-charcoal);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
}

.btn-quick-action:hover:not(:disabled) {
    background: white;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-danger:hover {
    background: #dc3545 !important;
    color: white !important;
}

.card-body {
    padding: 18px;
    display: flex;
    flex-direction: column;
}

.card-price {
    display: flex;
    align-items: baseline;
    margin-bottom: 10px;
}

.price-value {
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--primary-red);
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

.btn-outline-primary {
    border: 2px solid var(--primary-red);
    color: var(--primary-red);
    padding: 10px 16px;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-outline-primary:hover {
    background: var(--primary-red);
    color: white;
    transform: translateY(-1px);
}

.pagination-section {
    margin-top: 40px;
}

.pagination .page-link {
    border: none;
    color: var(--primary-red);
    padding: 12px 16px;
    margin: 0 2px;
    border-radius: 10px;
    font-weight: 600;
    min-width: 44px;
}

.pagination .page-item.active .page-link {
    background: var(--primary-red);
    color: white;
}

.pagination .page-link:hover:not(.disabled) {
    background: var(--soft-red);
    transform: translateY(-1px);
}

.modal {
    z-index: 1060;
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
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@media (max-width: 1400px) {
    .property-card {
        height: 460px;
    }
}

@media (max-width: 992px) {
    .page-header {
        flex-direction: column;
        text-align: center;
    }

    .page-title {
        font-size: 2.2rem;
    }

    .property-card {
        height: 440px;
    }

    .card-image-container {
        height: 200px;
    }

    .property-features {
        justify-content: center;
    }

    .property-meta {
        flex-direction: column;
        gap: 8px;
    }
}

@media (max-width: 768px) {
    .page-subtitle {
        font-size: 1.1rem;
    }

    .card-quick-actions {
        right: 8px;
        top: 8px;
        flex-direction: column;
        gap: 2px;
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

@media (max-width: 576px) {
    .filters-card .row>* {
        margin-bottom: 16px;
    }

    .filter-group {
        width: 100%;
    }
}
</style>