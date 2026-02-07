// ═══════════════════════════════════════════════════════════════
// 🔍 SERPAPI VYHLEDÁVAČ - TACTICAL SEARCH MODULE v2.0
// Autoři: Admirál Claude.AI & Více admirál Jiřík
// Licence: USS PROMETHEUS Tactical Operations
// NOVÉ: Proxy Masking Protocol - použití proxy z hlavního modulu
// ═══════════════════════════════════════════════════════════════

/**
 * 🛡️ PROXY MASKOVACÍ MATRICE (Kopie z hlavního modulu)
 * Použití stejných proxy jako v serpapi-search.js
 */
const TACTICAL_PROXY_GRID = [
    // ✅ ID:2 - CODETABS (OSVĚDČENÝ)
    {
        id: 2,
        name: "CODETABS_RESCUE",
        endpoint: (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        strategy: "DIRECT_GET",
        description: "OSVĚDČENÝ VÍTĚZ: Záložní uzel s nízkou latencí pro GitHub Pages."
    },
    
    // ✅ ID:3 - CORSPROXY.IO
    {
        id: 3,
        name: "CORSPROXY_IO_SHIELD",
        endpoint: (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        strategy: "DIRECT_GET",
        description: "Robustní uzel pro těžké datové přenosy."
    },
    
    // ✅ ID:4 - THINGPROXY
    {
        id: 4,
        name: "THINGPROXY_ALPHA",
        endpoint: (url) => `https://thingproxy.freeboard.io/fetch/${url}`,
        strategy: "DIRECT_GET",
        description: "Alternativní uzel pro API bypass."
    },
    
    // ✅ ID:7 - LOCALHOST
    {
        id: 7,
        name: "LOCAL_TUNNEL_7778",
        endpoint: (url) => `http://localhost:7778/proxy?url=${encodeURIComponent(url)}`,
        strategy: "DIRECT_GET",
        description: "LOKÁLNÍ PŘÍSTAV: Interní Python tunel na tvém Windows serveru."
    },
    
    // ✅ ID:8 - CLOUDFLARE BYPASS
    {
        id: 8,
        name: "CLOUDFLARE_BYPASS_1",
        endpoint: (url) => `https://proxy-server.libyzidi.workers.dev/?url=${encodeURIComponent(url)}`,
        strategy: "DIRECT_GET",
        description: "Vlastní Cloudflare brána."
    },
    
    // ✅ ID:1 - ALLORIGINS JSON WRAPPER
    {
        id: 1,
        name: "ALLORIGINS_BYPASS",
        endpoint: (url) => `https://api.allorigins.win/get?disableCache=true&url=${encodeURIComponent(url)}`,
        strategy: "JSON_WRAPPER",
        description: "Hybridní uzel pro obcházení GitHub Pages 403 blokace."
    },
    
    // ✅ ID:11 - ALLORIGINS RAW
    {
        id: 11,
        name: "OPEN_PROXY_SPACE",
        endpoint: (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        strategy: "DIRECT_RAW",
        description: "Raw přístup skrze AllOrigins."
    }
];

/**
 * 🧠 STATISTIKY UZLŮ
 */
const NODE_STATS = {
    total_requests: 0,
    successful_requests: 0,
    failed_requests: 0,
    node_history: []
};

/**
 * 🛡️ INTEGRITY ANALYZER - Kontrola dat z proxy
 */
function analyzeDataIntegrity(rawData, node) {
    console.log(`%c🛡️ [SEARCH DIAGNOSTIKA] Analyzuji data z uzlu: ${node.name}`, 'color: #f59e0b;');

    if (!rawData) {
        throw new Error(`Uzel ${node.name} nevrátil žádný signál.`);
    }

    let data = rawData;

    // Speciální ošetření pro JSON wrappery (AllOrigins)
    if (node.strategy === "JSON_WRAPPER" && rawData.contents) {
        try {
            data = JSON.parse(rawData.contents);
            console.log(`%c📦 [SEARCH DEKRYPCE] JSON wrapper z ${node.name} úspěšně rozbalen.`, 'color: #10b981;');
        } catch (e) {
            throw new Error(`Dekódování obsahu z uzlu ${node.name} selhalo: ${e.message}.`);
        }
    }

    // Kontrola API chyb
    if (data.error) {
        throw new Error(`SerpAPI nahlásilo chybu: ${data.error}`);
    }

    // Kontrola, zda jsou výsledky
    const hasResults = (
        (data.organic_results && data.organic_results.length > 0) ||
        data.knowledge_graph ||
        data.answer_box ||
        (data.related_questions && data.related_questions.length > 0)
    );

    if (!hasResults) {
        console.warn(`%c⚠️ [SEARCH DIAGNOSTIKA] Uzel ${node.name} vrátil prázdné výsledky!`, 'color: #f59e0b;');
        throw new Error(`Žádné výsledky nenalezeny přes uzel ${node.name}`);
    }

    console.log(`%c✅ [SEARCH DIAGNOSTIKA] Integrita dat z ${node.name} je 100%.`, 'color: #10b981;');
    return data;
}

/**
 * 🎯 MASKOVACÍ VYHLEDÁVACÍ FUNKCE - Použití proxy sítě
 * @param {string} query - Vyhledávací dotaz
 * @param {string} apiKey - SerpAPI klíč
 * @returns {Promise<Object>} - Výsledky vyhledávání
 */
export async function searchWithSerpAPI(query, apiKey) {
    if (!apiKey) {
        throw new Error('⚠️ SerpAPI klíč není nastaven! Zkalibruj systém.');
    }

    console.log(`%c🔍 [SEARCH] Zahájení maskovaného vyhledávání: "${query}"`, 'color: #6366f1; font-weight: bold;');
    
    const targetUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&num=10&api_key=${apiKey}&hl=cs&gl=cz`;
    
    console.log(`%c📡 [SEARCH DEBUG] Target URL: ${targetUrl}`, 'color: #94a3b8;');
    
    NODE_STATS.total_requests++;

    const activeNodes = TACTICAL_PROXY_GRID.filter(node => node !== undefined);
    
    // Iterace přes všechny proxy uzly
    for (let i = 0; i < activeNodes.length; i++) {
        const node = activeNodes[i];
        const proxyUrl = node.endpoint(targetUrl);
        
        console.log(`%c🛰️ [UZEL ${node.id}: ${node.name}] Pokouším se o průlom...`, 'color: #6366f1;');
        
        try {
            const startTime = performance.now();
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            const latency = `${(performance.now() - startTime).toFixed(0)}ms`;
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const rawData = await response.json();
            const fullSerpApiData = analyzeDataIntegrity(rawData, node);

            NODE_STATS.successful_requests++;
            NODE_STATS.node_history.push({ 
                node: node.name, 
                nodeId: node.id, 
                success: true, 
                latency 
            });

            console.log(`%c✅ [PRŮLOM!] Uzel ${node.name} (ID:${node.id}) dosáhl cíle! Odezva: ${latency}`, 'color: #10b981; font-weight: bold;');

            return {
                metadata: {
                    query: query,
                    proxy_node: node.name,
                    proxy_node_id: node.id,
                    latency: latency,
                    timestamp: Date.now()
                },
                organic_results: fullSerpApiData.organic_results || [],
                knowledge_graph: fullSerpApiData.knowledge_graph || null,
                answer_box: fullSerpApiData.answer_box || null,
                related_questions: fullSerpApiData.related_questions || [],
                inline_videos: fullSerpApiData.inline_videos || [],
                top_stories: fullSerpApiData.top_stories || [],
                local_results: fullSerpApiData.local_results || []
            };

        } catch (err) {
            const errorMsg = err.message || 'Neznámá chyba';
            console.error(`%c⚠️ [UZEL ${node.name} ID:${node.id}] Selhání: ${errorMsg}`, 'color: #ef4444;');
            NODE_STATS.node_history.push({ 
                node: node.name, 
                nodeId: node.id, 
                success: false, 
                error: errorMsg 
            });
            
            // Pokud jsme na konci seznamu
            if (i === activeNodes.length - 1) {
                NODE_STATS.failed_requests++;
                
                console.error(`%c❌ [TOTÁLNÍ BLOKÁDA] Všech ${activeNodes.length} proxy uzlů selhalo!`, 'color: #b91c1c; font-weight: bold;');
                console.error(`%c📋 [HISTORIE POKUSŮ]:`, 'color: #f59e0b;');
                NODE_STATS.node_history.forEach((h, idx) => {
                    const status = h.success ? '✅ ÚSPĚCH' : '❌ SELHÁNÍ';
                    console.error(`%c   ${idx+1}. ${h.node} (ID:${h.nodeId}) - ${status}${h.error ? ': ' + h.error : ''}`, 
                        h.success ? 'color: #10b981;' : 'color: #ef4444;');
                });
                
                throw new Error(`TOTÁLNÍ BLOKÁDA: Všech ${activeNodes.length} proxy uzlů selhalo. Poslední chyba: ${errorMsg}`);
            }
        }
    }
}

/**
 * 🎨 RENDEROVÁNÍ VÝSLEDKŮ DO UI
 * @param {Object} results - Data z SerpAPI
 * @param {HTMLElement} container - Kontejner pro výsledky
 */
export function renderSearchResults(results, container) {
    container.innerHTML = '';

    if (!results.organic_results || results.organic_results.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>❌ Žádné výsledky nenalezeny.</p>
                <p style="font-size: 10px; color: var(--slate-text); margin-top: 0.5rem;">
                    Použitý proxy uzel: ${results.metadata?.proxy_node || 'Neznámý'}
                </p>
            </div>
        `;
        return;
    }

    // Metadata header
    const metaHeader = `
        <div class="search-meta-header">
            <div class="meta-item">
                <span class="meta-label">DOTAZ:</span>
                <span class="meta-value">${results.metadata?.query || 'N/A'}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">PROXY:</span>
                <span class="meta-value">${results.metadata?.proxy_node || 'N/A'} (ID:${results.metadata?.proxy_node_id || '?'})</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">ODEZVA:</span>
                <span class="meta-value">${results.metadata?.latency || 'N/A'}</span>
            </div>
        </div>
    `;

    const resultsHTML = results.organic_results.map((result, index) => `
        <div class="search-result-card" data-index="${index}">
            <div class="result-header">
                <span class="result-position">#${index + 1}</span>
                <h3 class="result-title">
                    <a href="${result.link}" target="_blank" rel="noopener">
                        ${result.title}
                    </a>
                </h3>
            </div>
            <p class="result-snippet">${result.snippet || 'Popis nedostupný.'}</p>
            <div class="result-meta">
                <span class="result-source">${new URL(result.link).hostname}</span>
                ${result.date ? `<span class="result-date">📅 ${result.date}</span>` : ''}
            </div>
        </div>
    `).join('');

    container.innerHTML = metaHeader + resultsHTML;
}

/**
 * 🚀 INICIALIZACE VYHLEDÁVAČE
 */
export function initSearchPanel() {
    const searchPanel = document.getElementById('serpapi-search-panel');
    const searchForm = document.getElementById('serpapi-search-form');
    const searchInput = document.getElementById('search-query-input');
    const resultsContainer = document.getElementById('search-results-container');
    const searchStatus = document.getElementById('search-status');
    const closeBtn = document.getElementById('close-search-btn');
    const openBtn = document.getElementById('open-search-btn');

    // 🔹 OTEVŘENÍ PANELU
    openBtn?.addEventListener('click', () => {
        searchPanel?.classList.remove('hidden');
        searchInput?.focus();
        console.log('🔍 Tactical Search Panel otevřen.');
    });

    // 🔹 ZAVŘENÍ PANELU
    closeBtn?.addEventListener('click', () => {
        searchPanel?.classList.add('hidden');
        console.log('✅ Tactical Search Panel zavřen.');
    });

    // 🔹 ODESLÁNÍ FORMULÁŘE
    searchForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const query = searchInput.value.trim();
        if (!query) {
            alert('⚠️ Zadej vyhledávací dotaz!');
            return;
        }

        // Univerzální načítání API klíče
        const apiKey = localStorage.getItem('PROMETHEUS_SERPAPI_KEY') || localStorage.getItem('serpapi_key');
        
        if (!apiKey) {
            alert('⚠️ SerpAPI klíč není nastaven! Otevři kalibrační panel.');
            console.error('🔴 Klíč nebyl nalezen!');
            return;
        }

        console.log('✅ API klíč nalezen:', apiKey.substring(0, 10) + '...');

        // Zobrazit loading
        searchStatus?.classList.remove('hidden');
        resultsContainer.innerHTML = '';

        try {
            const results = await searchWithSerpAPI(query, apiKey);
            renderSearchResults(results, resultsContainer);
            console.log('✅ Vyhledávání úspěšné:', results);
        } catch (error) {
            resultsContainer.innerHTML = `
                <div class="error-message">
                    <p>❌ Chyba při vyhledávání: ${error.message}</p>
                    <p style="font-size: 10px; margin-top: 0.5rem;">Zkontroluj API klíč a síťové připojení.</p>
                </div>
            `;
            console.error('❌ Chyba při vyhledávání:', error);
        } finally {
            searchStatus?.classList.add('hidden');
        }
    });

    console.log('✅ Tactical Search Module v2.0 inicializován (s Proxy Masking Protocol).');
}

/**
 * 🎯 OTEVŘENÍ VYHLEDÁVACÍHO PANELU (PROGRAMOVĚ)
 */
export function openSearchPanel() {
    const panel = document.getElementById('serpapi-search-panel');
    const searchInput = document.getElementById('search-query-input');
    
    panel?.classList.remove('hidden');
    searchInput?.focus();
    
    console.log('🔍 Tactical Search Panel otevřen programově.');
}

// ═══════════════════════════════════════════════════════════════
// 🚀 MODULE LOADED
// ═══════════════════════════════════════════════════════════════
console.log('%c✅ [MODULE] serpapi-search--vyhledavac-by-vice-admiral-jirik.js v2.0 LOADED', 'color: #10b981; font-weight: bold;');
console.log('%c🛡️ PROXY MASKING PROTOCOL: 7 aktivních uzlů připraveno', 'color: #6366f1;');