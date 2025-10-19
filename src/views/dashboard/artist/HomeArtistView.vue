<template>
    <main class="main" id="top">
        <NavbarAccessedArtistComponent />
        <section id="artist-analytics" class="artist-analytics-section">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <h2 class="text-center mb-4 mt-6 animate-slide-up">Olá, {{ artist.name }}!</h2>
                        <p class="text-center mb-4 animate-fade-in">Explore suas métricas de músicas, visualizações, ganhos e muito mais.</p>
                        <div class="artist-card mb-4 animate-scale-in">
                            <div class="text-center mb-4">
                                <img :src="artist.photo || '/dist/logo-black.png'" alt="Foto do Artista" class="artist-photo" />
                            </div>
                            <div class="artist-details">
                                <p><strong>Nome:</strong> {{ artist.name }}</p>
                                <p><strong>REF:</strong> {{ artist.id }}</p>
                                <p><strong>Telefone:</strong> {{ artist.phone }}</p>
                                <p><strong>Email:</strong> {{ artist.email || 'Não informado' }}</p>
                                <p><strong>Estilo Musical:</strong> {{ artist.style }}</p>
                                <!-- <p><strong>Data de Parceria:</strong> {{ formatDate(artist.partnershipDate) }}</p> -->
                                <p><strong>Percentual:</strong> {{ artist.percentage }}%</p>
                                <p><strong>Descrição:</strong> {{ artist.about || 'Não informada' }}</p>
                            </div>
                        </div>
                        <div class="stats-card mb-4 animate-stagger">
                            <div class="row g-3 text-center">
                                
                                <div class="col-md-4">
                                    <span class="stat-label">Total de Músicas</span>
                                    <span class="stat-value">{{ songHistory.length }}</span>
                                </div>

                                <div class="col-md-4">
                                    <span class="stat-label">Total Visualizações</span>
                                    <span class="stat-value animate-counter" ref="viewsCounter">{{ stats.totalViews.toLocaleString() }}</span>
                                </div>

                                <div class="col-md-4">
                                    <span class="stat-label">Total Recebido (EUR)</span>
                                    <span class="stat-value animate-counter" ref="grossProfitCounter">{{ formatCurrency(stats.totalGrossProfit, 'EUR') }}</span>
                                </div>
                                <!-- <div class="col-md-3">
                                    <span class="stat-label">Tota (EUR)</span>
                                    <span class="stat-value animate-counter" ref="netProfitCounter">{{ formatCurrency(stats.totalNetProfit, 'EUR') }}</span>
                                </div> -->
                            </div>
                        </div>
                        <div class="charts-card mb-4 animate-stagger">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <h3 class="chart-title">Histórico de Pagamentos</h3>
                                    <canvas id="paymentsChart"></canvas>
                                </div>
                                <div class="col-md-6">
                                    <h3 class="chart-title">Visualizações por Música</h3>
                                    <canvas id="viewsChart"></canvas>
                                </div>
                                <div class="col-md-6">
                                    <h3 class="chart-title">Distribuição por Região</h3>
                                    <canvas id="platformChart"></canvas>
                                </div>
                                <div class="col-md-6">
                                    <h3 class="chart-title">Visualizações Mensais</h3>
                                    <canvas id="monthlyViewsChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="songs-card animate-stagger">
                            <h3 class="mb-3">Suas Músicas</h3>
                            <div class="table-responsive">
                                <table class="table table-dark table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Título</th>
                                            <th scope="col">Visualizações</th>
                                            <th scope="col">País/Região</th>
                                            <th scope="col">Data de Publicação</th>
                                            <th scope="col">Ganhos (EUR)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(song, index) in paginatedSongs" :key="song.id" class="animate-row">
                                            <td>{{ index + 1 }}</td>
                                            <td>{{ song.title }}</td>
                                            <td>{{ song.views.toLocaleString() }}</td>
                                            <td>{{ song.platforms }}</td>
                                            <td>{{ formatDate(song.publicationDate) }}</td>
                                            <td>{{ formatCurrency(song.earnings, 'EUR') }}</td>
                                        </tr>
                                        <tr v-if="paginatedSongs.length === 0">
                                            <td colspan="5" class="text-center">Nenhuma música encontrada.</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div v-if="hasMoreSongs" class="text-center my-3">
                                    <button class="btn btn-hero" @click="loadMoreSongs">Carregar Mais</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <FooterComponent />
    </main>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { toast } from 'vue3-toastify';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Chart from 'chart.js/auto';
import { useRoute } from 'vue-router';
import axios from 'axios';
import NavbarAccessedArtistComponent from '@/components/NavbarAccessedUserComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import 'vue3-toastify/dist/index.css';

gsap.registerPlugin(ScrollTrigger);

interface Artist {
    id: number | string;
    name: string;
    phone: string;
    email?: string;
    style: string;
    partnershipDate: string;
    percentage: number;
    about?: string;
    photo?: string;
    createdAt: string;
    artist_id: string;
}

interface Song {
    id: number;
    title: string;
    views: number;
    platforms: string[];
    publicationDate: string;
    earnings: number;
    plataforms: string;
}

interface Payment {
    id: number;
    date: string;
    amount: number;
    status: '0' | '1' | '2';
}

interface Stats {
    totalViews: number;
    totalGrossProfit: number;
    totalNetProfit: number;
}

const route = useRoute();
const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// const artist = ref<Artist>({
//     id: '',
//     name: '',
//     phone: '',
//     email: '',
//     style: '',
//     partnershipDate: '',
//     percentage: 0,
//     about: '',
//     createdAt: '',
//     photo: ''
// });
const songHistory = ref<Song[]>([]);
const songMonthly = ref<Song[]>([]);
const songDistribuition = ref<Song[]>([]);
const songTitles = ref<Song[]>([]);



const paymentHistory = ref<Payment[]>([]);
const stats = ref<Stats>({ totalViews: 0, totalGrossProfit: 0, totalNetProfit: 0 });
const pageSize = ref(10);
const currentPageSongs = ref(1);
const totalPages = ref(1);
const viewsCounter = ref<HTMLElement | null>(null);
const grossProfitCounter = ref<HTMLElement | null>(null);
const netProfitCounter = ref<HTMLElement | null>(null);
let paymentChart: Chart | null = null;
let viewsChart: Chart | null = null;
let earningsChart: Chart | null = null;
let platformChart: Chart | null = null;
let monthlyViewsChart: Chart | null = null;




let artist: Artist;
if (typeof route.params.user === 'string') {
  artist = { id: route.params.user, name: '', phone: '', email: '', style: '',  percentage: 0, about: '', createdAt: '', partnershipDate: '', photo: '', artist_id: '' };
} else if (Array.isArray(route.params.user)) {
  artist = { id: route.params.user[0], name: '', phone: '', email: '', style: '',  percentage: 0, about: '', createdAt: '', partnershipDate: '', photo: '', artist_id: '' };
} else {
  artist = route.params.user || { id: '', name: '', phone: '', email: '', style: '',  percentage: 0, about: '', createdAt: '', partnershipDate: '', photo: '', artist_id: '' };
}


const paginatedSongs = computed(() => {

    const start = 0;
    const end = currentPageSongs.value * pageSize.value;
    return songHistory.value.slice(start, end);

});

const hasMoreSongs = computed(() => currentPageSongs.value < totalPages.value);

const fetchDashboardData = async () => {
    try {
        const response = await axios.get(`${apiBase}/artist/dashboard`, {
            params: { 
                user_id: artist.id,
                page: currentPageSongs.value,
            }
        });


        artist = response.data.artist;

        songMonthly.value = response.data.songs.monthlyViews;
        songDistribuition.value = response.data.songs.distribution;
        songTitles.value = response.data.songs.songsByTitle;

        paymentHistory.value = response.data.payments;
        stats.value = response.data.stats;
        totalPages.value = response.data.songs.last_page;

        if (currentPageSongs.value == 1) {

            songHistory.value = response.data.songs.data;
            currentPageSongs.value = 1;
        } else {
            songHistory.value = [...songHistory.value, ...response.data.songs.data];
            currentPageSongs.value++;
        }

    } catch (error: any) {
        // console.error('Erro ao buscar dados do dashboard:', error);
        toast.error(error.response?.data?.error || 'Erro ao carregar dados do dashboard.', {
            autoClose: 3000,
            position: 'top-right',
            theme: 'colored',
            transition: 'slide'
        });
        artist = { id: '', name: 'Artista', phone: '', email: '', style: '', partnershipDate: '', percentage: 0, about: '', createdAt: '', photo: '', artist_id: '' };
        songHistory.value = [];
        paymentHistory.value = [];
        stats.value = { totalViews: 0, totalGrossProfit: 0, totalNetProfit: 0 };
    }
};

const initCharts = () => {
    if (paymentChart) paymentChart.destroy();
    if (viewsChart) viewsChart.destroy();
    if (earningsChart) earningsChart.destroy();
    if (platformChart) platformChart.destroy();
    if (monthlyViewsChart) monthlyViewsChart.destroy();

    const paymentLabels = paymentHistory.value.map(payment => {
        // Formata para YYYY-MM-DD
        const d = new Date(payment.date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const paymentData = paymentHistory.value.map(payment => payment.amount);
    const paymentColors = paymentHistory.value.map(payment => 
        payment.status === '1' ? '#ffb300' : 
        payment.status === '0' ? '#ffeb3b' : '#ff6b6b');

    paymentChart = new Chart(document.getElementById('paymentsChart') as HTMLCanvasElement, {
        type: 'line',
        data: {
            labels: paymentLabels,
            datasets: [{
                label: 'Pagamentos (EUR)',
                data: paymentData,
                borderColor: '#ffeb3b',
                backgroundColor: 'rgba(255, 235, 59, 0.3)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: paymentColors,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Valor (EUR)', color: '#e0e0e0' }, ticks: { color: '#e0e0e0' } },
                x: { title: { display: true, text: 'Mês', color: '#e0e0e0' }, ticks: { color: '#e0e0e0', maxRotation: 45 } }
            },
            plugins: { legend: { labels: { color: '#e0e0e0' } }, tooltip: { backgroundColor: '#2a2a2a', titleColor: '#ffeb3b', bodyColor: '#e0e0e0' } },
            animation: { duration: 1500, easing: 'easeOutQuart' }
        }
    });

    const viewsLabels = songTitles.value.map(song => song.title);
    const viewsData = songTitles.value.map(song => song.views);

    viewsChart = new Chart(document.getElementById('viewsChart') as HTMLCanvasElement, {
        type: 'bar',
        data: {
            labels: viewsLabels,
            datasets: [{
                label: 'Visualizações (TOP 10)',
                data: viewsData,
                backgroundColor: ['#ffeb3b', '#fbc02d', '#ffca28', '#ffb300', '#ffa000'],
                borderColor: '#1e1e1e',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Visualizações', color: '#e0e0e0' }, ticks: { color: '#e0e0e0' } },
                x: { title: { display: true, text: 'Música', color: '#e0e0e0' }, ticks: { color: '#e0e0e0', maxRotation: 45 } }
            },
            plugins: { legend: { labels: { color: '#e0e0e0' } }, tooltip: { backgroundColor: '#2a2a2a', titleColor: '#ffeb3b', bodyColor: '#e0e0e0' } },
            animation: { duration: 1500, easing: 'easeOutQuart' }
        }
    });

    // const platformCounts = songHistory.value.reduce((acc, song) => {
    //     song.platforms.forEach(platform => { acc[platform] = (acc[platform] || 0) + 1; });
    //     return acc;
    // }, {} as Record<string, number>);









    // Conta as views por plataforma/região (não apenas quantidade de músicas)
    const platformCounts = songDistribuition.value.reduce((acc, song) => {
        // song.platforms pode ser array ou string, depende do backend
        const platforms = Array.isArray(song.plataforms) ? song.plataforms : [song.plataforms];
        platforms.forEach(platform => {
            acc[platform] = (acc[platform] || 0) + (Number(song.views) || 0);
        });
        return acc;
    }, {} as Record<string, number>);

    platformChart = new Chart(document.getElementById('platformChart') as HTMLCanvasElement, {
        type: 'pie',
        data: {
            labels: Object.keys(platformCounts),
            datasets: [{
                label: 'Visualizações por Plataforma',
                data: Object.values(platformCounts),
                backgroundColor: [
                    '#ffeb3b', // amarelo
                    '#fbc02d', // amarelo escuro
                    '#ffffff', // branco
                    '#ffb300', // amarelo forte
                    '#ff9800', // laranja
                    '#2196f3', // azul
                    '#e53935', // vermelho
                    '#795548'  // castanho
                ],
                borderColor: '#1e1e1e',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#e0e0e0' } },
                tooltip: { backgroundColor: '#2a2a2a', titleColor: '#ffeb3b', bodyColor: '#e0e0e0' }
            },
            animation: { duration: 1500, easing: 'easeOutQuart' }
        }
    });


   // Agrupa visualizações mensais (garantindo número e normalizando YYYY-MM)
const monthlyViews = songMonthly.value.reduce((acc, song) => {
    // Pega só ano-mês da data (ex: "2025-04" a partir de "2025-04-01")
    const month = song.publicationDate.slice(0, 7);
    // Garante que views seja número
    const views = Number(song.views) || 0;
    acc[month] = (acc[month] || 0) + views;
    return acc;
}, {} as Record<string, number>);

// Ordena os meses (ascendente: mais antigo -> mais recente)
const sortedMonthlyViews = Object.keys(monthlyViews)
    .sort((a, b) => a.localeCompare(b)) // como é YYYY-MM funciona bem
    .reduce((acc, key) => {
        acc[key] = monthlyViews[key];
        return acc;
    }, {} as Record<string, number>);

    monthlyViewsChart = new Chart(document.getElementById('monthlyViewsChart') as HTMLCanvasElement, {
        type: 'line',
        data: {
            labels: Object.keys(sortedMonthlyViews) ,
            datasets: [{
                label: 'Visualizações dos últimos 6 meses',
                data: Object.values(sortedMonthlyViews),
                borderColor: '#ffca28',
                backgroundColor: 'rgba(255, 202, 40, 0.3)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ffca28',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Visualizações', color: '#e0e0e0' }, ticks: { color: '#e0e0e0' } },
                x: { title: { display: true, text: 'Mês', color: '#e0e0e0' }, ticks: { color: '#e0e0e0', maxRotation: 45 } }
            },
            plugins: { legend: { labels: { color: '#e0e0e0' } }, tooltip: { backgroundColor: '#2a2a2a', titleColor: '#ffeb3b', bodyColor: '#e0e0e0' } },
            animation: { duration: 1500, easing: 'easeOutQuart' }
        }
    });


}


const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: currency || 'EUR',
        minimumFractionDigits: 2
    }).format(value);
};

const formatDate = (date: string) => {
    return date
    // return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium' }).format(new Date(date));
};



const loadMoreSongs = () => {
    if (hasMoreSongs.value) {
        currentPageSongs.value++;
        fetchDashboardData();
        gsap.from('.animate-row', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 });
    }
};

const animateStats = () => {
    if (viewsCounter.value) {
        const target = stats.value.totalViews;
        gsap.to(viewsCounter.value, {
            duration: 2,
            innerHTML: target,
            roundProps: 'innerHTML',
            onUpdate: () => {
                if (viewsCounter.value) {
                    viewsCounter.value.innerHTML = Math.round(Number(viewsCounter.value.innerHTML)).toLocaleString();
                }
            },
            ease: 'power2.out'
        });
    }
    if (grossProfitCounter.value) {
        const target = stats.value.totalGrossProfit;
        gsap.to(grossProfitCounter.value, {
            duration: 2,
            innerHTML: target,
            roundProps: 'innerHTML',
            onUpdate: () => {
                if (grossProfitCounter.value) {
                    grossProfitCounter.value.innerHTML = formatCurrency(Math.round(Number(grossProfitCounter.value.innerHTML)), 'EUR');
                }
            },
            ease: 'power2.out'
        });
    }
    if (netProfitCounter.value) {
        const target = stats.value.totalNetProfit;
        gsap.to(netProfitCounter.value, {
            duration: 2,
            innerHTML: target,
            roundProps: 'innerHTML',
            onUpdate: () => {
                if (netProfitCounter.value) {
                    netProfitCounter.value.innerHTML = formatCurrency(Math.round(Number(netProfitCounter.value.innerHTML)), 'EUR');
                }
            },
            ease: 'power2.out'
        });
    }
};

onMounted(async () => {
    await fetchDashboardData();
    initCharts();
    animateStats();
    gsap.from('.animate-slide-up', { opacity: 0, y: 50, duration: 1, ease: 'power3.out' });
    gsap.from('.animate-fade-in', { opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
    gsap.from('.animate-scale-in', { opacity: 0, scale: 0.95, duration: 1, delay: 0.4, ease: 'back.out(1.7)' });
    gsap.from('.animate-stagger', {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.stats-card', start: 'top 80%' }
    });
    gsap.from('.charts-card canvas', {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        stagger: 0.3,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: { trigger: '.charts-card', start: 'top 80%' }
    });
});

onUnmounted(() => {
    if (paymentChart) paymentChart.destroy();
    if (viewsChart) viewsChart.destroy();
    if (earningsChart) earningsChart.destroy();
    if (platformChart) platformChart.destroy();
    if (monthlyViewsChart) monthlyViewsChart.destroy();
});
</script>

<style scoped>
.main {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #1a1a1a, #000);
    min-height: 100vh;
    color: #fff;
}

.artist-analytics-section {
    padding: 80px 0;
    background: linear-gradient(135deg, #1a1a1a, #000);
}

.artist-analytics-section h2 {
    color: #ffeb3b;
    font-size: 2.8rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.artist-analytics-section p {
    font-size: 1.2rem;
    color: #ccc;
}

.artist-card,
.stats-card,
.charts-card,
.songs-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 235, 59, 0.2);
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(12px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.artist-card:hover,
.stats-card:hover,
.charts-card:hover,
.songs-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(255, 235, 59, 0.2);
}

.artist-photo {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid #ffeb3b;
    margin-bottom: 24px;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.artist-photo:hover {
    transform: scale(1.08);
    box-shadow: 0 0 20px rgba(255, 235, 59, 0.4);
}

.artist-details p {
    color: #e0e0e0;
    font-size: 1.1rem;
    margin-bottom: 12px;
    padding: 10px 0;
    border-left: 3px solid #ffeb3b;
    padding-left: 12px;
    transition: background 0.3s ease;
}

.artist-details p:hover {
    background: rgba(255, 235, 59, 0.1);
}

.stat-label {
    display: block;
    color: #ffeb3b;
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 8px;
}

.stat-value {
    color: #fff;
    font-size: 1.6rem;
    font-weight: 700;
}

.chart-title {
    color: #ffeb3b;
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
    text-transform: uppercase;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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

.btn-hero:hover {
    background: #fbc02d;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(255, 235, 59, 0.4);
}

.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.table-dark {
    background: transparent;
    color: #ddd;
    min-width: 700px;
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

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
    from { opacity: 0; scale: 0.95; }
    to { opacity: 1; scale: 1; }
}

@media (max-width: 768px) {
    .artist-analytics-section h2 {
        font-size: 2.2rem;
    }
    .artist-analytics-section p {
        font-size: 1.1rem;
    }
    .artist-photo {
        width: 160px;
        height: 160px;
    }
    .artist-details p {
        font-size: 1rem;
    }
    .stat-value {
        font-size: 1.4rem;
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
    .artist-photo {
        width: 140px;
        height: 140px;
    }
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