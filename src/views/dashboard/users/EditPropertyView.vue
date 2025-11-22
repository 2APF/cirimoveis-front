<template>
  <main class="main publish-page" id="top">
    <NavbarComponent />

    <section class="publish-section">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">
              <i class="fas fa-edit me-3"></i>
              Editar Anúncio
            </h1>
            <p class="page-subtitle">Atualize as informações do seu imóvel</p>
          </div>
          <RouterLink :to="{ name: 'app.user.properties' }" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>
            Voltar
          </RouterLink>
        </div>

        <form @submit.prevent="submitProperty" class="publish-form" v-if="property">
          <div class="publish-form-container">
            <div class="row">
              <div class="col-lg-8">
                <div class="card">
                  <div class="card-header">
                    <h3><i class="fas fa-info-circle me-2"></i>Informações Básicas</h3>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>Nome do Imóvel *</label>
                          <input v-model="form.title" type="text" class="form-control"
                            :class="{ 'is-invalid': errors.title }" placeholder="Ex: Casa 3 quartos no centro" />
                          <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>Tipo *</label>
                          <select v-model="form.type" class="form-select" :class="{ 'is-invalid': errors.type }">
                            <option value="">Selecione...</option>
                            <option value="sale">Venda</option>
                            <option value="rent">Aluguel</option>
                          </select>
                          <div v-if="errors.type" class="invalid-feedback">{{ errors.type }}</div>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>Preço (AOA) *</label>
                          <input v-model.number="form.price" type="number" class="form-control"
                            :class="{ 'is-invalid': errors.price }" placeholder="150000" />
                          <div v-if="errors.price" class="invalid-feedback">{{ errors.price }}</div>
                          <small class="form-text text-muted">Não use vírgulas ou pontos</small>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>Categoria *</label>
                          <select v-model="form.category_id" class="form-select"
                            :class="{ 'is-invalid': errors.category_id }">
                            <option value="">Selecione...</option>
                            <option value="1">Casa</option>
                            <option value="2">Apartamento</option>
                            <option value="3">Terreno</option>
                            <option value="4">Comercial</option>
                          </select>
                          <div v-if="errors.category_id" class="invalid-feedback">{{ errors.category_id }}</div>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>Ano de Construção</label>
                          <input v-model.number="form.year_built" type="number" min="1900" max="2025"
                            class="form-control" />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>Condição</label>
                          <select v-model="form.condition" class="form-select">
                            <option value="">Selecione...</option>
                            <option value="new">Novo</option>
                            <option value="used">Usado</option>
                            <option value="reformed">Reformado</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="form-group">
                      <label>Endereço Completo *</label>
                      <input v-model="form.location" type="text" class="form-control"
                        :class="{ 'is-invalid': errors.location }"
                        placeholder="Rua Exemplo, 123 - Bairro, Cidade - AO" />
                      <div v-if="errors.location" class="invalid-feedback">{{ errors.location }}</div>
                    </div>

                    <div class="form-group">
                      <label>Descrição Completa *</label>
                      <textarea v-model="form.description" rows="5" class="form-control"
                        :class="{ 'is-invalid': errors.description }"
                        placeholder="Descreva detalhadamente a propriedade..."></textarea>
                      <div class="text-end mt-1">
                        <small class="text-muted">{{ form.description.length }}/1000</small>
                      </div>
                      <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
                    </div>
                  </div>
                </div>

                <div class="card mt-4">
                  <div class="card-header">
                    <h3><i class="fas fa-home me-2"></i>Características</h3>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-3">
                        <div class="form-group">
                          <label>Quartos</label>
                          <input v-model.number="form.bedrooms" type="number" min="1" max="20" class="form-control" />
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="form-group">
                          <label>Banheiros</label>
                          <input v-model.number="form.bathrooms" type="number" min="1" max="15" class="form-control" />
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="form-group">
                          <label>Área (m²)</label>
                          <input v-model.number="form.area" type="number" min="20" max="10000" class="form-control" />
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="form-group">
                          <label>Garagem</label>
                          <div class="form-check mt-2">
                            <input class="form-check-input" type="checkbox" id="garages" v-model="form.garages">
                            <label class="form-check-label" for="garages">Sim</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-3">
                        <div class="form-group">
                          <label>Piscina</label>
                          <div class="form-check mt-2">
                            <input class="form-check-input" type="checkbox" id="swimming_pool"
                              v-model="form.swimming_pool">
                            <label class="form-check-label" for="swimming_pool">Sim</label>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="form-group">
                          <label>Jardim</label>
                          <div class="form-check mt-2">
                            <input class="form-check-input" type="checkbox" id="garden" v-model="form.garden">
                            <label class="form-check-label" for="garden">Sim</label>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="form-group">
                          <label>Ar Condicionado</label>
                          <div class="form-check mt-2">
                            <input class="form-check-input" type="checkbox" id="air_conditioning"
                              v-model="form.air_conditioning">
                            <label class="form-check-label" for="air_conditioning">Sim</label>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="form-group">
                          <label>Destaque</label>
                          <div class="form-check mt-2">
                            <input class="form-check-input" type="checkbox" id="featured" v-model="form.featured">
                            <label class="form-check-label" for="featured">Sim</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>Disponibilidade</label>
                          <select v-model="form.availability" class="form-select">
                            <option value="" disabled>Selecione...</option>
                            <option value="0">Imediata</option>
                            <option value="1">15 dias</option>
                            <option value="2">30 dias</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card mt-4">
                  <div class="card-header">
                    <h3><i class="fas fa-images me-2"></i>Fotos (máx 10)</h3>
                  </div>
                  <div class="card-body">
                    <div v-if="imagePreview.length === 0" class="text-center py-5 text-muted">
                      <i class="fas fa-cloud-upload-alt fa-4x mb-3 opacity-50"></i>
                      <p>Arraste suas fotos aqui ou clique para selecionar</p>
                      <small>Formatos: JPG, PNG (máx 5MB cada)</small>
                    </div>

                    <div v-else class="images-preview row g-3">
                      <div v-for="(image, index) in imagePreview" :key="index" class="col-md-4 col-sm-6">
                        <div class="image-item position-relative">
                          <img :src="image.url" class="img-fluid rounded" />
                          <button type="button" class="btn-remove-image" @click="removeImage(index)">
                            <i class="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="image-upload-area mt-4" @dragover.prevent="onDragOver" @drop.prevent="onDrop"
                      @click="fileInput.click()" :class="{ 'drag-over': isDragOver }">
                      <input ref="fileInput" type="file" multiple accept="image/jpeg,image/png,image/jpg"
                        @change="handleFiles" class="d-none" />
                      <i class="fas fa-cloud-upload-alt fa-2x mb-2"></i>
                      <p>{{ imagePreview.length }}/10 fotos</p>
                      <small>Clique ou arraste mais fotos</small>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-4">
                <div class="sidebar-preview">
                  <div class="card preview-card">
                    <div class="card-header">
                      <h5>Pré-visualização</h5>
                    </div>
                    <div class="card-body text-center">
                      <div v-if="imagePreview[0]" class="preview-image mb-3">
                        <img :src="imagePreview[0].url" class="rounded shadow" />
                      </div>
                      <div v-else class="preview-placeholder">
                        <i class="fas fa-image fa-3x text-muted mb-2"></i>
                        <p class="text-muted">Primeira foto aparece aqui</p>
                      </div>

                      <div class="preview-content">
                        <div class="preview-price mb-2">
                          {{ formatPrice(form.price) }} AOA
                          <span v-if="form.type === 'rent'" class="price-label">/mês</span>
                        </div>
                        <h6 class="preview-title">{{ form.title || 'Nome do imóvel' }}</h6>
                        <p class="preview-location mb-3">
                          <i class="fas fa-map-marker-alt me-1"></i>
                          {{ form.location || 'Endereço' }}
                        </p>

                        <div class="preview-features mb-3">
                          <div class="feature-row">
                            <span><i class="fas fa-bed me-1"></i>{{ form.bedrooms || 0 }} quarto{{ form.bedrooms !== 1 ? 's' : '' }}</span>
                            <span><i class="fas fa-bath me-1"></i>{{ form.bathrooms || 0 }} banheiro{{ form.bathrooms !== 1 ? 's' : '' }}</span>
                          </div>
                          <div class="feature-row">
                            <span><i class="fas fa-expand me-1"></i>{{ formatArea(form.area) }}</span>
                            <span>{{ form.type === 'sale' ? 'Venda' : 'Aluguel' }}</span>
                          </div>
                        </div>

                        <div v-if="form.featured" class="preview-featured mb-2">
                          <i class="fas fa-crown text-warning me-1"></i>
                          <small>Anúncio em Destaque</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="card progress-card mt-4">
                    <div class="card-body">
                      <h6>Progresso da Edição</h6>
                      <div class="progress-wrapper">
                        <div class="progress-item" :class="{ 'completed': isBasicInfoComplete }">
                          <i class="fas fa-info-circle"></i>
                          <span>Informações Básicas</span>
                        </div>
                        <div class="progress-item" :class="{ 'completed': isFeaturesComplete }">
                          <i class="fas fa-home"></i>
                          <span>Características</span>
                        </div>
                        <div class="progress-item" :class="{ 'completed': imagePreview.length > 0 }">
                          <i class="fas fa-images"></i>
                          <span>{{ imagePreview.length }}/10 Fotos</span>
                        </div>
                      </div>
                      <div class="progress-bar mt-3">
                        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
                      </div>
                      <div class="progress-text">
                        {{ Math.round(progressPercentage) }}% completo
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions mt-5">
            <button type="button" class="btn btn-secondary me-3" @click="router.back()">
              <i class="fas fa-times me-2"></i>Cancelar
            </button>
            <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting">
              <i v-show="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
              {{ isSubmitting ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>

        <div v-else class="text-center py-5">
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="mt-3 text-muted">Carregando dados do anúncio...</p>
        </div>
      </div>
    </section>

    <FooterComponent />
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import axios from 'axios'
import Cookies from 'js-cookie'

const route = useRoute()
const router = useRouter()
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'
const propertySlug = route.params.slug as string

interface Photo {
  url: string
  size: number
  extension: string
}

interface PropertyForm {
  title: string
  description: string
  price: number
  location: string
  type: 'sale' | 'rent'
  bedrooms: number
  bathrooms: number
  area: number
  category_id: string
  year_built?: number
  condition?: string
  availability?: string
  garages: boolean
  swimming_pool: boolean
  garden: boolean
  air_conditioning: boolean
  featured: boolean
}

const property = ref<any>(null)
const form = reactive<PropertyForm>({
  title: '',
  description: '',
  price: 0,
  location: '',
  type: 'sale',
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  category_id: '',
  year_built: undefined,
  condition: '',
  availability: '',
  garages: false,
  swimming_pool: false,
  garden: false,
  air_conditioning: false,
  featured: false
})

const errors = reactive<Record<string, string>>({
  title: '',
  type: '',
  price: '',
  location: '',
  description: '',
  category_id: ''
})

const imagePreview = ref<Photo[]>([])
const imageFiles = ref<File[]>([])
const isSubmitting = ref(false)
const isDragOver = ref(false)
const fileInput: any = ref<HTMLInputElement>()

const validateForm = () => {
  Object.keys(errors).forEach(key => errors[key] = '')

  let isValid = true

  if (!form.title.trim()) {
    errors.title = 'Nome é obrigatório'
    isValid = false
  } else if (form.title.length < 10) {
    errors.title = 'Nome deve ter pelo menos 10 caracteres'
    isValid = false
  }

  if (!form.type) {
    errors.type = 'Selecione o tipo do imóvel'
    isValid = false
  }

  if (!form.price || form.price <= 0) {
    errors.price = 'Preço deve ser maior que 0'
    isValid = false
  }

  if (!form.location.trim()) {
    errors.location = 'Endereço é obrigatório'
    isValid = false
  }

  if (form.description.length < 50) {
    errors.description = 'Descrição deve ter pelo menos 50 caracteres'
    isValid = false
  }

  if (!form.category_id) {
    errors.category_id = 'Selecione a categoria'
    isValid = false
  }

  return isValid
}

const parsePhotos = (photosString: string): Photo[] => {
  try {
    const cleaned = photosString.replace(/\\\//g, '/')
    const parsed = JSON.parse(cleaned)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const loadProperty = async () => {
  try {
    const token = Cookies.get('token')
    if (!token) {
      router.push({ name: 'app.auth.login' })
      return
    }

    const response = await axios.get(`${API_URL}/user/product/show/${propertySlug}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    property.value = response.data.product

    const p = property.value
    Object.assign(form, {
      title: p.name || '',
      description: p.description || '',
      price: p.price || 0,
      location: p.address || '',
      type: p.type === '1' ? 'sale' : 'rent',
      bedrooms: p.bedrooms || 0,
      bathrooms: p.bathrooms || 0,
      area: p.area || 0,
      category_id: p.category_id?.toString() || '',
      year_built: p.year_built ? parseInt(p.year_built) : undefined,
      condition: p.condition || '',
      availability: p.availability?.toString() || '',
      garages: p.garages === '1' || p.garages === 1,
      swimming_pool: p.swimming_pool === '1' || p.swimming_pool === 1,
      garden: p.garden === '1' || p.garden === 1,
      air_conditioning: p.air_conditioning === '1' || p.air_conditioning === 1,
      featured: p.featured === '1' || p.featured === 1
    })

    if (p.photos) {
      imagePreview.value = parsePhotos(p.photos)
    }
  } catch (error: any) {
    showNotification('Erro ao carregar anúncio', 'error')
    router.push({ name: 'app.user.properties' })
  }
}

const submitProperty = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const token = Cookies.get('token')
    if (!token) {
      router.push({ name: 'app.auth.login' })
      return
    }

    const formData = new FormData()
    formData.append('name', form.title)
    formData.append('description', form.description)
    formData.append('price', form.price.toString())
    formData.append('address', form.location)
    formData.append('type', form.type === 'sale' ? '1' : '2')
    formData.append('bedrooms', form.bedrooms.toString())
    formData.append('bathrooms', form.bathrooms.toString())
    formData.append('area', form.area.toString())
    formData.append('category_id', form.category_id)

    if (form.year_built) formData.append('year_built', form.year_built.toString())
    if (form.condition) formData.append('condition', form.condition)
    if (form.availability) formData.append('availability', form.availability)
    formData.append('garages', form.garages ? '1' : '0')
    formData.append('swimming_pool', form.swimming_pool ? '1' : '0')
    formData.append('garden', form.garden ? '1' : '0')
    formData.append('air_conditioning', form.air_conditioning ? '1' : '0')
    formData.append('featured', form.featured ? '1' : '0')

    imageFiles.value.forEach((file, index) => {
      formData.append(`new_photos[${index}]`, file)
    })

    await axios.put(`${API_URL}/user/product/update/${propertySlug}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    showNotification('Anúncio atualizado com sucesso!', 'success')
    router.push({ name: 'app.user.properties' })
  } catch (error: any) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors)
    } else {
      showNotification(error.response?.data?.message || 'Erro ao atualizar anúncio', 'error')
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleFiles = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  files.forEach(file => addImageFile(file))
  target.value = ''
}

const onDragOver = () => {
  isDragOver.value = true
}

const onDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  files.forEach(file => addImageFile(file))
}

const addImageFile = (file: File) => {
  if (!file.type.startsWith('image/')) return
  if (file.size > 5 * 1024 * 1024) {
    showNotification('Foto muito grande (máx 5MB)', 'error')
    return
  }
  if (imagePreview.value.length >= 10) {
    showNotification('Máximo de 10 fotos', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = e => {
    if (e.target?.result) {
      imagePreview.value.push({
        url: e.target.result as string,
        size: file.size,
        extension: file.name.split('.').pop() || ''
      })
      imageFiles.value.push(file)
    }
  }
  reader.readAsDataURL(file)
}

const removeImage = (index: number) => {
  imagePreview.value.splice(index, 1)
  if (index < imageFiles.value.length) {
    imageFiles.value.splice(index, 1)
  }
}

const isBasicInfoComplete = computed(() =>
  form.title.trim() && form.type && form.price && form.location.trim() && form.category_id
)

const isFeaturesComplete = computed(() =>
  form.bedrooms >= 1 && form.bathrooms >= 1 && form.area > 0
)

const progressPercentage = computed(() => {
  let progress = 0
  if (isBasicInfoComplete.value) progress += 40
  if (isFeaturesComplete.value) progress += 30
  progress += (imagePreview.value.length / 10) * 30
  return Math.min(progress, 100)
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-AO', { minimumFractionDigits: 0 }).format(price)
}

const formatArea = (area: number) => {
  return area ? `${area}m²` : '0m²'
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
  loadProperty()
})
</script>

<style scoped>
.publish-page {
  padding-top: 100px;
  background: linear-gradient(135deg, var(--soft-red) 0%, #f8f9fa 100%);
  min-height: 100vh;
}

.publish-section {
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
}

.card {
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.card-header {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  color: white;
  padding: 20px 24px;
  border-radius: 16px 16px 0 0 !important;
}

.card-header h3,
.card-header h5 {
  margin: 0;
  font-weight: 700;
}

.card-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: 600;
  color: var(--dark-charcoal);
  margin-bottom: 8px;
  display: block;
}

.form-control,
.form-select {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--card-bg);
}

.form-control:focus,
.form-select:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 0 0.2rem rgba(211, 47, 47, 0.15);
}

.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 4px;
}

.form-check-input:checked {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
}

.image-upload-area {
  border: 3px dashed #e9ecef;
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--card-bg);
}

.image-upload-area:hover {
  border-color: var(--primary-red);
  background: rgba(211, 47, 47, 0.02);
}

.image-upload-area.drag-over {
  border-color: var(--primary-red);
  background: rgba(211, 47, 47, 0.08);
}

.images-preview {
  margin-bottom: 20px;
}

.image-item {
  height: 140px;
}

.image-item img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.btn-remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-preview {
  position: sticky;
  top: 120px;
}

.preview-card {
  height: fit-content;
}

.preview-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
}

.preview-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #e9ecef;
}

.preview-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary-red);
}

.price-label {
  font-size: 0.9rem;
  color: var(--medium-gray);
}

.preview-title {
  color: var(--dark-charcoal);
  font-weight: 700;
  margin: 0 0 8px 0;
  font-size: 1.1rem;
}

.preview-location {
  color: var(--medium-gray);
  font-size: 0.95rem;
  margin: 0;
}

.preview-features {
  text-align: left;
}

.feature-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--dark-charcoal);
  margin-bottom: 4px;
}

.preview-featured {
  background: rgba(255, 193, 7, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #f59e0b;
  font-weight: 600;
}

.progress-card {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

.progress-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: var(--medium-gray);
  font-size: 0.95rem;
}

.progress-item.completed {
  color: var(--primary-red);
}

.progress-item i {
  width: 24px;
  text-align: center;
  font-size: 1rem;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-red), #e53935);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: 600;
  color: var(--primary-red);
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 40px;
  border-top: 1px solid #e9ecef;
}

.btn-primary.btn-lg {
  padding: 16px 32px;
  font-size: 1.1rem;
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  border: none;
}

.btn-primary.btn-lg:hover:not(:disabled) {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-2px);
}

@media (max-width: 992px) {
  .page-header {
    flex-direction: column;
    text-align: center;
  }

  .sidebar-preview {
    position: static;
    margin-top: 40px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary.btn-lg {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .card-body {
    padding: 20px;
  }

  .image-item {
    height: 120px;
  }
}
</style>