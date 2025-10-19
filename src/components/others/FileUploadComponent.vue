<template>
    <div class="file-upload-container">
        <label for="fileInput" class="form-label">Importar CSV/Excel</label>
        <div class="d-flex align-items-center gap-2">
            <input type="file" class="form-control" id="fileInput"
                accept=".csv,.xlsx" @change="handleFileSelect" ref="fileInput" />
            <button v-if="selectedFile" class="btn btn-primary" @click="handleFileUpload" :disabled="isProcessing">
                <i v-if="isProcessing" class="fas fa-spinner fa-spin me-2"></i>
                {{ isProcessing ? `${progress}%` : 'Processar' }}
            </button>
        </div>
        <div v-if="isProcessing" class="progress mt-2">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface Artist {
    id: number | any;
    artist_name: string;
    release_title: string;
    track_title: string;
    country_region: string;
    report_month: string;
    sale_month: string;
    quantity: number;
    unit_price: number;
    gross_profit: number;
    net_profit: number;
    currency: string;
}

const isProcessing = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const progress = ref(0);
const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const emit = defineEmits(['refresh-reports']);

const requiredHeaders = [
    'Nome do Artista', 'Título do Lançamento', 'Título da Faixa', 'País/Região',
    'Mês do Relatório', 'Mês de Venda', 'Quantidade', 'Preço Unitário',
    'Lucro Bruto', 'Lucro Líquido', 'Moeda de Pagamento do Cliente'
];

const headerAliases: Record<string, string[]> = {
    'Nome do Artista': ['nome', 'artista', 'artist', 'artistname', 'artist name'],
    'Título do Lançamento': ['album', 'release', 'título do álbum', 'albumtitle', 'release title', 'album title'],
    'Título da Faixa': ['faixa', 'música', 'track', 'tracktitle', 'song', 'track name', 'titulo da faixa'],
    'País/Região': ['país', 'região', 'pais', 'country', 'region', 'country/region'],
    'Mês do Relatório': ['mêsrelatório', 'reportmonth', 'mes relatorio', 'report month'],
    'Mês de Venda': ['mêsvenda', 'salemonth', 'mes venda', 'sale month'],
    'Quantidade': ['qtd', 'quantity', 'quant', 'quantidade'],
    'Preço Unitário': ['preço', 'unitprice', 'preco', 'unit price', 'preco unitario', 'preço unitario'],
    'Lucro Bruto': ['lucro', 'grossprofit', 'gross profit'],
    'Lucro Líquido': ['lucroliquido', 'netprofit', 'net profit'],
    'Moeda de Pagamento do Cliente': ['moeda', 'currency', 'moeda de pagamento']
};

const normalizeHeader = (header: string) => header?.toLowerCase().replace(/\s+/g, '') || '';

const mapHeaders = (headers: string[]) => {
    const headerMap: Record<string, number> = {};
    const normalizedHeaders = headers.map(normalizeHeader);
    const missingHeaders: string[] = [];

    // console.log('Cabeçalhos do arquivo:', headers);

    requiredHeaders.forEach((required) => {
        const normalizedRequired = normalizeHeader(required);
        let index = normalizedHeaders.indexOf(normalizedRequired);
        if (index === -1) {
            const aliases = headerAliases[required].map(normalizeHeader);
            index = normalizedHeaders.findIndex(h => aliases.includes(h));
        }
        if (index !== -1) {
            headerMap[required] = index;
        } else {
            missingHeaders.push(required);
        }
    });

    if (missingHeaders.length > 0) {
       // console.warn('Cabeçalhos ausentes:', missingHeaders, 'Processando com valores padrão.');
        missingHeaders.forEach((header) => {
            headerMap[header] = -1;
        });
    }

    return headerMap;
};

const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement;
    selectedFile.value = input.files?.[0] || null;
   // console.log('Arquivo selecionado:', selectedFile.value?.name);
};

const handleFileUpload = async () => {
    if (!selectedFile.value) {
        toast.error('Nenhum arquivo selecionado.', { autoClose: 3000, position: 'top-right', theme: 'dark' });
        return;
    }

    isProcessing.value = true;
    progress.value = 0;
    const file = selectedFile.value;

    try {
        if (file.size > 50 * 1024 * 1024) {
            throw new Error('Arquivo muito grande. O limite é 50MB.');
        }

        progress.value = 10; // Start parsing
        let newArtists: Artist[] = [];

        if (file.name.endsWith('.csv')) {
            const text = await file.text();
            const result = Papa.parse(text, { skipEmptyLines: true });
            if (!result.data || result.data.length < 2) {
                throw new Error('Arquivo CSV vazio ou inválido.');
            }
            const rows = result.data as string[][];
            const headers = rows[0].map(String);
            const headerMap = mapHeaders(headers);

            newArtists = rows.slice(1).map((row, index) => {
                progress.value = 10 + (index / rows.length) * 40; // Update parsing progress
                return {
                    id: (index + 1),
                    artist_name: (headerMap['Nome do Artista'] !== -1 ? row[headerMap['Nome do Artista']]?.trim() : '') || 'Desconhecido',
                    release_title: (headerMap['Título do Lançamento'] !== -1 ? row[headerMap['Título do Lançamento']]?.trim() : '') || 'Sem Álbum',
                    track_title: (headerMap['Título da Faixa'] !== -1 ? row[headerMap['Título da Faixa']]?.trim() : '') || 'Sem Faixa',
                    country_region: (headerMap['País/Região'] !== -1 ? row[headerMap['País/Região']]?.trim() : '') || 'Desconhecido',
                    report_month: (headerMap['Mês do Relatório'] !== -1 ? row[headerMap['Mês do Relatório']]?.trim() : '') || '2025-01-01',
                    sale_month: (headerMap['Mês de Venda'] !== -1 ? row[headerMap['Mês de Venda']]?.trim() : '') || '2025-01-01',
                    quantity: parseInt(row[headerMap['Quantidade']] || '0'),
                    unit_price: parseFloat(row[headerMap['Preço Unitário']] || '0'),
                    gross_profit: parseFloat(row[headerMap['Lucro Bruto']] || '0'),
                    net_profit: parseFloat(row[headerMap['Lucro Líquido']] || '0'),
                    currency: (headerMap['Moeda de Pagamento do Cliente'] !== -1 ? row[headerMap['Moeda de Pagamento do Cliente']]?.trim() : '') || 'AOA'
                };
            }).filter(artist => artist.artist_name && artist.release_title && artist.track_title &&
                artist.country_region && artist.report_month && artist.sale_month && artist.currency);

        } else if (file.name.endsWith('.xlsx')) {
          
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' }) as any[][];

            if (rows.length < 2) {
                throw new Error('Arquivo Excel vazio ou inválido.');
            }

            const headers = rows[0].map(String);
            const headerMap = mapHeaders(headers);

            newArtists = rows.slice(1).map((row, index) => {
                progress.value = 10 + (index / rows.length) * 40; // Update parsing progress
                return {
                    id: parseInt(row[headerMap['id']] || (index + 1)),
                    artist_name: (headerMap['Nome do Artista'] !== -1 ? row[headerMap['Nome do Artista']]?.toString().trim() : '') || 'Desconhecido',
                    release_title: (headerMap['Título do Lançamento'] !== -1 ? row[headerMap['Título do Lançamento']]?.toString().trim() : '') || 'Sem Álbum',
                    track_title: (headerMap['Título da Faixa'] !== -1 ? row[headerMap['Título da Faixa']]?.toString().trim() : '') || 'Sem Faixa',
                    country_region: (headerMap['País/Região'] !== -1 ? row[headerMap['País/Região']]?.toString()?.trim() : '') || 'Desconhecido',
                    report_month: (headerMap['Mês do Relatório'] !== -1 ? row[headerMap['Mês do Relatório']] : '') || '2025-01-01',
                    sale_month: (headerMap['Mês de Venda'] !== -1 ? row[headerMap['Mês de Venda']] : '') || '2025-01-01',
                    quantity: parseInt(row[headerMap['Quantidade']] || '0'),
                    unit_price: parseFloat(row[headerMap['Preço Unitário']] || '0'),
                    gross_profit: parseFloat(row[headerMap['Lucro Bruto']] || '0'),
                    net_profit: parseFloat(row[headerMap['Lucro Líquido']] || '0'),
                    currency: (headerMap['Moeda de Pagamento do Cliente'] !== -1 ? row[headerMap['Moeda de Pagamento do Cliente']]?.toString().trim() : '') || 'AOA'
                };
            }).filter(artist => artist.artist_name && artist.release_title && artist.track_title &&
                artist.country_region && artist.report_month && artist.sale_month && artist.currency);
        } else {
            throw new Error('Formato de arquivo não suportado. Use .csv ou .xlsx.');
        }

        if (newArtists.length === 0) {
            throw new Error('Nenhum dado válido encontrado no arquivo.');
        }

        progress.value = 50;

        const batchSize = 500;
        const batches = [];
        for (let i = 0; i < newArtists.length; i += batchSize) {
            batches.push(newArtists.slice(i, i + batchSize));
        }

        let successfulRecords = 0;
        for (let i = 0; i < batches.length; i++) {
            try {
              //  console.log('Enviando lote', i + 1, 'com', batches[i].length, 'registros:', batches[i][0]);
                const response = await axios.post(`${apiBase}/administrator/report/insert`, batches[i], {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 45000
                });


                if (response.status !== 200 && response.status !== 201) {
                    throw new Error(`Erro ao salvar lote ${i + 1}: ${response.statusText}`);
                }
                successfulRecords += batches[i].length;
                progress.value = 50 + ((i + 1) / batches.length) * 50; // Update upload progress
            } catch (err: any) {
                // console.error('Erro no lote', i + 1, ':', err.response?.data || err.message);
                toast.error(`Erro ao salvar lote ${i + 1}: ${err.response?.data?.error || err.message || 'Falha na API'}.`, {
                    autoClose: 3000,
                    position: 'top-right',
                    theme: 'dark'
                });
            }
        }

        if (successfulRecords > 0) {

            // Dá refresh
            emit('refresh-reports', 'true');

            toast.success(`Dados salvos com sucesso! (${successfulRecords} registros)`, {
                autoClose: 3000,
                position: 'top-right',
                theme: 'dark'
            });
        } else {
            throw new Error('Nenhum registro salvo na API.');
        }

        if (fileInput.value) {
            fileInput.value.value = '';
            selectedFile.value = null;
        }
    } catch (error: any) {
       console.error('Erro na importação:', error.message);
        toast.error(error.message || 'Erro ao importar arquivo. Verifique o formato e as colunas.', {
            autoClose: 3000,
            position: 'top-right',
            theme: 'dark'
        });
    } finally {
        isProcessing.value = false;
        progress.value = 0;
    }
};
</script>

<style scoped>
.file-upload-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-label {
    color: var(--primary-yellow);
    font-weight: 500;
    font-size: 0.9rem;
    margin-bottom: 8px;
}

.form-control {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.2);
    color: white;
    border-radius: 8px;
    padding: 10px;
    font-size: 0.95rem;
}

.form-control:focus {
    background: rgba(255, 255, 255, 0.15);
    border-color: var(--primary-yellow);
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
}

.form-control::placeholder {
    color: rgba(255, 255, 255, 0.4);
}

.btn-primary {
    background-color: var(--primary-yellow);
    border-color: var(--primary-yellow);
    color: #000;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 8px;
}

.btn-primary:hover:not(:disabled) {
    background-color: #e6c200;
    border-color: #e6c200;
}

.btn-primary:disabled {
    background-color: #ccc;
    border-color: #ccc;
    cursor: not-allowed;
}

.progress {
    height: 8px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.progress-bar {
    height: 100%;
    background-color: var(--primary-yellow);
    transition: width 0.3s ease;
}

@media (max-width: 768px) {
    .form-control {
        font-size: 0.85rem;
        padding: 8px;
    }
    .btn-primary {
        padding: 8px 16px;
        font-size: 0.9rem;
    }
}
</style>