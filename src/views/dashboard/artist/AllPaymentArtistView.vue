<template>
    <main class="main" id="top">
        <NavbarAccessedArtistComponent />
        <section id="payment-request" class="payment-request-section">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <h2 class="text-center mb-4 mt-6 animate-slide-up">Solicitar Pagamento</h2>
                        <p class="text-center mb-4 animate-fade-in">Selecione o período para solicitar um pagamento. O sistema calculará automaticamente o valor com base nos seus ganhos.</p>
                        <div class="request-card mb-4 animate-scale-in">
                            <h3 class="mb-3">Nova Solicitação de Pagamento</h3>
                            <div class="row g-3">
                                <div class="col-12 d-flex align-items-end">
                                    <button class="btn btn-hero w-100" @click="openPreviewModal" :disabled="isLoading">Solicitação</button>
                                </div>
                            </div>
                        </div>
                        <div class="payments-card animate-stagger">
                            <h3 class="mb-3">Histórico de Solicitações</h3>
                            <div class="table-responsive">
                                <table class="table table-dark table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">REF</th>
                                            <th scope="col">Valor (EUR)</th>
                                            
                                            <th scope="col">Data</th>
                                            <th scope="col">Período</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Observação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="payment in paginatedPayments" :key="payment.id" class="animate-row">
                                            <td>{{ payment.id }}</td>
                                            <td>{{ formatCurrency(payment.amount, 'EUR') }}</td>
                                            <td>{{ formatDate(payment.created_at) }}</td>
                                            <td>{{ payment.payment_mode === '1' ? 'Q1' : payment.payment_mode === '2' ? 'Q2' : (payment.payment_mode === '3' ? 'Q3' : 'Q4') }}</td>
                                            <td>
                                                <span :class="{
                                                    'badge': true,
                                                    'bg-warning': payment.status === '1',
                                                    'bg-success': payment.status === '0',
                                                    'bg-danger': payment.status === '2'
                                                }">
                                                    {{ payment.status === '1' ? 'Pendente' : payment.status === '0' ? 'Aceito' : 'Recusado' }}
                                                </span>
                                            </td>
                                            <td>{{ payment.note || 'Nenhuma' }}</td>
                                        </tr>
                                        <tr v-if="paginatedPayments.length === 0">
                                            <td colspan="5" class="text-center">Nenhuma solicitação encontrada.</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div v-if="hasMorePayments" class="text-center my-3">
                                    <button class="btn btn-hero" @click="loadMorePayments">Carregar Mais</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal para Visualizar Solicitação -->
        <div v-if="showPreviewModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="background: var(--secondary-black); border: 1px solid var(--primary-yellow);">
                    <div class="modal-header">
                        <h5 class="modal-title" style="color: var(--primary-yellow);">Visualizar Solicitação de Pagamento</h5>
                        <button type="button" class="btn-close btn-close-white" @click="showPreviewModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Tipo:</strong> {{ previewData.typePayment }}</p>
                        <p><strong>Período:</strong> {{ previewData.startDate + ' até ' + previewData.endDate }}</p>
                        <p><strong>Percentual da Casa:</strong> {{ formatPercentage(100 - previewData.percentage) }}</p>
                        <p><strong>Seu Percentual:</strong> {{ formatPercentage(previewData.percentage) }}</p>
                        <p><strong>Valor Bruto (EUR):</strong> {{ formatCurrency(previewData.grossAmount, 'EUR') }}</p>
                        <p><strong>Seu Valor (EUR):</strong> {{ formatCurrency(previewData.netAmount, 'EUR') }}</p>
                        <p><strong>Seu Valor (AOA):</strong> {{ formatCurrency(previewData.netAmount * exchangeRate, 'AOA') }}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="showPreviewModal = false" >Cancelar</button>
                        <button class="btn btn-success" @click="submitPaymentRequest" :disabled="isLoading">Confirmar Solicitação</button>
                    </div>
                </div>
            </div>
        </div>

        <FooterComponent />
    </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import NavbarAccessedArtistComponent from '@/components/NavbarAccessedUserComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import 'vue3-toastify/dist/index.css';

import { useRoute, useRouter } from 'vue-router';



gsap.registerPlugin(ScrollTrigger);

interface Payment {
    id: number;
    amount: number;
    date: string;
    payment_mode: '1' | '2' | '3' | '4';
    created_at: string;
    status: '0' | '1' | '2';
    note?: string;
}

interface PreviewData {
    percentage: number;
    grossAmount: number;
    netAmount: number;
    startDate?: string;
    endDate?: string;
    typePayment?: string;
}



const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
const requestPeriod = ref<'monthly' | 'bimonthly' | 'quarterly'>('monthly');
const requestPaymentMode = ref<'1' | '2' | '3' | '4'>('1'); // 1: Q1, 2: Q2, 3: Q3, 4: Q4
const payments = ref<Payment[]>([]);
const pageSize = ref(5);
const currentPage = ref(1);
const totalPages = ref(1);
const showPreviewModal = ref(false);

const isLoading = ref(false);
const previewData = ref<PreviewData>({ percentage: 0, grossAmount: 0, netAmount: 0 });
const exchangeRate = 1000; // 1 EUR = 1000 AOA (adjust as needed)

const paginatedPayments = computed(() => {
    const start = 0;
    const end = currentPage.value * pageSize.value;
    return payments.value.slice(start, end);
});



const router = useRouter();
const route = useRoute();


interface ProfileData {
    id?: string | number;
    phone?: string;
    name: string;
    email: string;
    style: string;
    address?: string;
    about?: string | any;
    description?: string;
    photo?: string;
    password?: string;
    percentage?: number | string;
    confirmPassword?: string;
    createdAt?: string;
    partnershipDate?: string;
}

var user: ProfileData;
if (typeof route.params.user === 'string') {
    user = { id: route.params.user, name: '', phone: '', email: '', style: '', percentage: 0, about: '', createdAt: '', partnershipDate: '', photo: '', address: '', password: '', confirmPassword: '' };
} else if (Array.isArray(route.params.user)) {
    user = { id: route.params.user[0], name: '', phone: '', email: '', style: '', percentage: 0, about: '', createdAt: '', partnershipDate: '', photo: '', address: '', password: '', confirmPassword: '' };
} else {
    user = route.params.user || { id: '', name: '', phone: '', email: '', style: '', percentage: 0, about: '', createdAt: '', partnershipDate: '', photo: '', address: '', password: '', confirmPassword: '' };
}



const hasMorePayments = computed(() => currentPage.value < totalPages.value);

const fetchPayments = async () => {
    try {
        const response = await axios.get(`${apiBase}/artist/payments`, {
            params: {
                user_id: user.id,
                page: currentPage.value,
                per_page: pageSize.value
            }
        });
        payments.value = response.data.data;
 
        totalPages.value = response.data.last_page || 1;
    } catch (error: any) {
        // console.error('Erro ao buscar pagamentos:', error);
        toast.error(error.response?.data?.error || 'Erro ao carregar pagamentos.', {
            autoClose: 3000,
            position: 'top-right',
            theme: 'colored',
            transition: 'slide'
        });
        payments.value = [];
    }
};

const fetchPreviewData = async () => {
    try {
        const response = await axios.get(`${apiBase}/artist/payment/preview`, {
            params: {
                user_id: user.id,
                period: requestPeriod.value
            }
        });
        previewData.value = response.data;
        showPreviewModal.value = true;
    } catch (error: any) {
        // console.error('Erro ao buscar visualização de pagamento:', error);
        toast.error(error.response?.data?.error || 'Erro ao carregar visualização.', {
            autoClose: 3000,
            position: 'top-right',
            theme: 'colored',
            transition: 'slide'
        });
    }
};

const submitPaymentRequest = async () => {
    isLoading.value = true;
    try {
        await axios.post(`${apiBase}/artist/payment/request`, {
            user_id: user.id,
            period: requestPeriod.value
        });
        toast.success('Solicitação de pagamento enviada com sucesso!', {
            autoClose: 2000,
            position: 'top-right',
            theme: 'colored',
            transition: 'slide'
        });
        showPreviewModal.value = false;
        requestPeriod.value = 'monthly';
        isLoading.value = false;
        await fetchPayments();  
    } catch (error: any) {
 // console.error('Erro ao enviar solicitação de pagamento:', error);
        toast.error(error.response?.data?.error || 'Erro ao enviar solicitação.', {
            autoClose: 3000,
            position: 'top-right',
            theme: 'colored',
            transition: 'slide'
        });
    }
};

const openPreviewModal = async () => {
    isLoading.value = true;
    await fetchPreviewData();

    isLoading.value = false;
};

const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: currency || 'EUR',
        minimumFractionDigits: 2
    }).format(value);
};

const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
        style: 'percent',
        minimumFractionDigits: 0
    }).format(value / 100);
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium' }).format(new Date(date));
};

const loadMorePayments = () => {
    if (hasMorePayments.value) {
        currentPage.value++;
        fetchPayments();
        gsap.from('.animate-row', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 });
    }
};

onMounted(async () => {
    await fetchPayments();
    gsap.from('.animate-slide-up', { opacity: 0, y: 50, duration: 1, ease: 'power3.out' });
    gsap.from('.animate-fade-in', { opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
    gsap.from('.animate-scale-in', { opacity: 0, scale: 0.95, duration: 1, delay: 0.4, ease: 'back.out(1.7)' });
    gsap.from('.animate-stagger', {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.payments-card', start: 'top 80%' }
    });
});
</script>

<style scoped>
.payment-request-section {
    padding: 80px 0;
    background: linear-gradient(135deg, #1a1a1a, #000);
    min-height: 100vh;
}

.payment-request-section h2 {
    color: #ffeb3b;
    font-size: 2.8rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.payment-request-section p {
    font-size: 1.2rem;
    color: #ccc;
}

.request-card,
.payments-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 235, 59, 0.2);
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(12px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.request-card:hover,
.payments-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(255, 235, 59, 0.2);
}

.form-label {
    color: #ffeb3b;
    font-weight: 500;
    font-size: 0.9rem;
    margin-bottom: 8px;
}

.form-control {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 235, 59, 0.2);
    color: #fff;
    border-radius: 10px;
    padding: 12px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

.form-control:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: #ffeb3b;
    box-shadow: 0 0 10px rgba(255, 235, 59, 0.3);
    outline: none;
}

.form-control::placeholder {
    color: rgba(255, 255, 255, 0.4);
}

.btn-hero {
    background: #ffeb3b;
    color: #000;
    font-weight: 600;
    padding: 12px 28px;
    border-radius: 14px;
    border: none;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.btn-hero:hover:not(:disabled) {
    background: #fbc02d;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(255, 235, 59, 0.4);
}

.btn-hero:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.table-dark {
    background: transparent;
    color: #ddd;
    min-width: 600px;
}

.table-dark th {
    color: #ffeb3b;
    font-weight: 600;
    font-size: 0.9rem;
    border-bottom: 2px solid rgba(255, 235, 59, 0.3);
    padding: 12px 8px;
}

.table-dark td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 0.85rem;
    padding: 12px 8px;
}

.table-dark tr:hover {
    background: rgba(255, 235, 59, 0.1);
}

.badge {
    font-size: 0.75rem;
    padding: 6px 12px;
    border-radius: 12px;
}

.modal-content {
    background: #1a1a1a;
    border: 1px solid #ffeb3b;
    border-radius: 12px;
}

.modal-header, .modal-footer {
    border-color: rgba(255, 235, 59, 0.2);
}

.modal-title {
    color: #ffeb3b;
}

.btn-close-white {
    filter: invert(1);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
    from { opacity: 0; scale: 0.95; }
    to { opacity: 1; scale: 1; }
}

@media (max-width: 768px) {
    .payment-request-section h2 {
        font-size: 2.2rem;
    }
    .payment-request-section p {
        font-size: 1.1rem;
    }
    .form-control {
        font-size: 0.9rem;
        padding: 10px;
    }
    .form-label {
        font-size: 0.85rem;
    }
    .btn-hero {
        padding: 10px 20px;
        font-size: 0.95rem;
    }
    .table-dark th,
    .table-dark td {
        font-size: 0.8rem;
        padding: 10px 6px;
    }
}

@media (max-width: 576px) {
    .btn-hero {
        padding: 8px 16px;
        font-size: 0.9rem;
    }
    .table-dark th,
    .table-dark td {
        font-size: 0.75rem;
        padding: 8px 4px;
    }
}
</style>