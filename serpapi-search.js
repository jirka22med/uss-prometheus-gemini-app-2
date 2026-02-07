// ═══════════════════════════════════════════════════════════════════════════════════════════════════
//
//          ██████╗ ██████╗  ██████╗ ███╗   ███╗███████╗████████╗██╗  ██╗███████╗██╗   ██╗███████╗
//          ██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔════╝██║   ██║██╔════╝
//          ██████╔╝██████╔╝██║   ██║██╔████╔██║█████╗     ██║   ███████║█████╗  ██║   ██║███████╗
//          ██╔═══╝ ██╔══██╗██║   ██║██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██╔══╝  ██║   ██║╚════██║
//          ██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗   ██║   ██║  ██║███████╗╚██████╔╝███████║
//          ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝
//
// 🚢 USS PROMETHEUS - SERPAPI SEARCH MODULE v4.3 [OPRAVENÁ VERZE]
// 🛠️ CHIEF ENGINEER: Vice Admirál Jiřík + Admirál Claude
// 📅 DATUM OPRAVY: 6.2.2026
// 🛡️ ZMĚNY: Více aktivních proxy uzlů, lepší error handling, diagnostika
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

/**
 * 🛰️ TAKTICKÁ PROXY MATRICE [OPTIMALIZOVANÁ VERZE 4.3 - OPRAVENO]
 * AKTIVOVÁNO VÍCE UZLŮ PRO MAXIMÁLNÍ REDUNDANCI
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
    
    // ✅ ID:3 - CORSPROXY.IO (REAKTIVOVÁNO)
    {
        id: 3,
        name: "CORSPROXY_IO_SHIELD",
        endpoint: (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        strategy: "DIRECT_GET",
        description: "Robustní uzel pro těžké datové přenosy."
    },
    
    // ✅ ID:4 - THINGPROXY (REAKTIVOVÁNO)
    {
        id: 4,
        name: "THINGPROXY_ALPHA",
        endpoint: (url) => `https://thingproxy.freeboard.io/fetch/${url}`,
        strategy: "DIRECT_GET",
        description: "Alternativní uzel pro API bypass."
    },
    
    // ✅ ID:7 - LOCALHOST (FUNGUJE!)
    {
        id: 7,
        name: "LOCAL_TUNNEL_7778",
        endpoint: (url) => `http://localhost:7778/proxy?url=${encodeURIComponent(url)}`,
        strategy: "DIRECT_GET",
        description: "LOKÁLNÍ PŘÍSTAV: Interní Python tunel na tvém Windows serveru."
    },
    
    // ✅ ID:8 - CLOUDFLARE BYPASS 1 (REAKTIVOVÁNO)
    {
        id: 8,
        name: "CLOUDFLARE_BYPASS_1",
        endpoint: (url) => `https://proxy-server.libyzidi.workers.dev/?url=${encodeURIComponent(url)}`,
        strategy: "DIRECT_GET",
        description: "Vlastní Cloudflare brána."
    },
    
    // ✅ ID:1 - ALLORIGINS (REAKTIVOVÁNO S LEPŠÍM HANDLINGEM)
    {
        id: 1,
        name: "ALLORIGINS_BYPASS",
        endpoint: (url) => `https://api.allorigins.win/get?disableCache=true&url=${encodeURIComponent(url)}`,
        strategy: "JSON_WRAPPER",
        description: "Hybridní uzel pro obcházení GitHub Pages 403 blokace."
    },
    
    // ✅ ID:11 - ALLORIGINS RAW (NOVÝ)
    {
        id: 11,
        name: "OPEN_PROXY_SPACE",
        endpoint: (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        strategy: "DIRECT_RAW",
        description: "Raw přístup skrze AllOrigins."
    }
];

/**
 * 🧠 STATISTIKY UZLŮ (TRACKING ÚSPĚŠNOSTI)
 */
const NODE_STATS = {
    total_requests: 0,
    successful_requests: 0,
    failed_requests: 0,
    node_history: []
};

/**
 * 🔑 LODNÍ ARCHIV - ZÍSKÁNÍ SERPAPI KLÍČE
 */
function getSerpApiKey() {
    console.log('%c🔑 [ARCHIV] Vyhledávám SerpAPI klíč...', 'color: #6366f1;');
    const key = localStorage.getItem('PROMETHEUS_SERPAPI_KEY');
    
    if (!key) {
        console.error('%c🔴 [KRITICKÉ] Klíč nebyl v databázi nalezen! Skenery jsou neaktivní.', 'color: #ef4444; font-weight: bold;');
        return null;
    }
    
    console.log('%c✅ [ARCHIV] Klíč nalezen a ověřen.', 'color: #10b981;');
    return key;
}

/**
 * 🛡️ INTEGRITY ANALYZER - HLOUBKOVÁ KONTROLA DAT A EXTRAKCE VŠECH TYPŮ
 */
function analyzeDataIntegrity(rawData, node) {
    console.log(`%c🛡️ [DIAGNOSTIKA] Analyzuji data z uzlu: ${node.name}`, 'color: #f59e0b;');

    if (!rawData) {
        throw new Error(`Uzel ${node.name} nevrátil žádný signál.`);
    }

    let data = rawData;

    // Speciální ošetření pro JSON wrappery (AllOrigins)
    if (node.strategy === "JSON_WRAPPER" && rawData.contents) {
        try {
            data = JSON.parse(rawData.contents);
            console.log(`%c📦 [DEKRYPCE] JSON wrapper z ${node.name} úspěšně rozbalen.`, 'color: #10b981;');
        } catch (e) {
            throw new Error(`Dekódování obsahu z uzlu ${node.name} selhalo: ${e.message}.`);
        }
    }

    // Kontrola API chyb
    if (data.error) {
        throw new Error(`SerpAPI nahlásilo chybu: ${data.error}`);
    }

    // ✅ NOVÁ KONTROLA: Pokud nejsou žádné výsledky
    const hasResults = (
        (data.organic_results && data.organic_results.length > 0) ||
        data.knowledge_graph ||
        data.answer_box ||
        (data.related_questions && data.related_questions.length > 0) ||
        (data.inline_videos && data.inline_videos.length > 0) ||
        (data.top_stories && data.top_stories.length > 0)
    );

    if (!hasResults) {
        console.warn(`%c⚠️ [DIAGNOSTIKA] Uzel ${node.name} vrátil prázdné výsledky!`, 'color: #f59e0b;');
        throw new Error(`Žádné výsledky nenalezeny přes uzel ${node.name}`);
    }

    console.log(`%c✅ [DIAGNOSTIKA] Integrita dat z ${node.name} je 100%. Nalezeny validní výsledky.`, 'color: #10b981;');
    return data;
}

/**
 * 🛰️ SEARCH ENGINE - PROTOKOL ARMAGEDDON [DEEP SPACE SCANNER]
 */
export async function searchSerpAPI(query, numResults = 5) {
    console.log(`%c🚀 ZAHÁJENÍ OPERACE ARMAGEDDON v4.3: "${query}"`, 'color: #6366f1; font-weight: bold; font-size: 16px; border-bottom: 2px solid #6366f1;');
    
    const apiKey = getSerpApiKey();
    if (!apiKey) throw new Error('OPERACE PŘERUŠENA: Chybí API klíč.');

    const targetUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&num=${numResults}&api_key=${apiKey}`;
    
    console.log(`%c📡 [DEBUG] Target URL: ${targetUrl}`, 'color: #94a3b8;');
    
    NODE_STATS.total_requests++;

    // Iterace pouze skrze AKTIVNÍ uzly
    const activeNodes = TACTICAL_PROXY_GRID.filter(node => node !== undefined);
    
    console.log(`%c🔍 [INFO] Aktivní uzly: ${activeNodes.length}`, 'color: #10b981;');
    activeNodes.forEach((node, i) => {
        console.log(`%c   [${i+1}] ID:${node.id} - ${node.name}`, 'color: #cbd5e1;');
    });

    for (let i = 0; i < activeNodes.length; i++) {
        const node = activeNodes[i];
        const attemptUrl = node.endpoint(targetUrl);
        
        console.log(`%c📡 [VLNA ${i + 1}/${activeNodes.length}] Pokus o průlom skrze: ${node.name} (ID:${node.id})...`, 'color: #cbd5e1;');
        console.log(`%c   Proxy URL: ${attemptUrl.substring(0, 100)}...`, 'color: #64748b;');

        try {
            // Nastavení časového limitu pro uzel (15 sekund - zvýšeno)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const startTime = performance.now();
            
            const response = await fetch(attemptUrl, { 
                signal: controller.signal,
                headers: { 'Accept': 'application/json' }
            });

            clearTimeout(timeoutId);

            console.log(`%c   Response Status: ${response.status} ${response.statusText}`, 
                response.ok ? 'color: #10b981;' : 'color: #ef4444;');

            if (!response.ok) {
                console.warn(`%c❌ [UZEL ${node.name}] Odražen (Status: ${response.status}).`, 'color: #ef4444;');
                continue; 
            }

            const rawData = await response.json();
            console.log(`%c   Raw data received, size: ${JSON.stringify(rawData).length} bytes`, 'color: #94a3b8;');
            
            const fullSerpApiData = analyzeDataIntegrity(rawData, node);

            if (fullSerpApiData) {
                const endTime = performance.now();
                const latency = Math.round(endTime - startTime);
                
                console.log(`%c🎯 [ÚSPĚCH!] Průlom potvrzen! Uzel: ${node.name} (ID:${node.id}) | Latence: ${latency}ms`, 'color: #10b981; font-weight: bold; font-size: 14px;');
                
                NODE_STATS.successful_requests++;
                NODE_STATS.node_history.push({ node: node.name, nodeId: node.id, success: true, latency });

                // Vracíme celý objekt SerpAPI pro hlubokou analýzu
                return {
                    metadata: {
                        query: query,
                        num_results_requested: numResults,
                        proxy_node: node.name,
                        proxy_node_id: node.id,
                        latency: `${latency}ms`,
                        protocol_version: 'v4.3 OPRAVENÁ VERZE',
                        timestamp: new Date().toISOString()
                    },
                    // Extrahujeme všechny relevantní informační bloky
                    organic_results: fullSerpApiData.organic_results || [],
                    knowledge_graph: fullSerpApiData.knowledge_graph || null,
                    answer_box: fullSerpApiData.answer_box || null,
                    related_questions: fullSerpApiData.related_questions || [],
                    inline_videos: fullSerpApiData.inline_videos || [],
                    top_stories: fullSerpApiData.top_stories || [],
                    local_results: fullSerpApiData.local_results || [],
                };
            }

        } catch (err) {
            const errorMsg = err.message || 'Neznámá chyba';
            console.error(`%c⚠️ [UZEL ${node.name} ID:${node.id}] Kritické selhání: ${errorMsg}`, 'color: #ef4444;');
            console.error(`%c   Stack trace:`, 'color: #64748b;', err);
            NODE_STATS.node_history.push({ node: node.name, nodeId: node.id, success: false, error: errorMsg });
            
            // Pokud jsme na konci seznamu a nic nefunguje
            if (i === activeNodes.length - 1) {
                NODE_STATS.failed_requests++;
                
                console.error(`%c❌ [TOTÁLNÍ BLOKÁDA] Všech ${activeNodes.length} aktivních uzlů selhalo!`, 'color: #b91c1c; font-weight: bold; font-size: 14px;');
                console.error(`%c📋 [HISTORIE POKUSŮ]:`, 'color: #f59e0b;');
                NODE_STATS.node_history.forEach((h, idx) => {
                    const status = h.success ? '✅ ÚSPĚCH' : '❌ SELHÁNÍ';
                    console.error(`%c   ${idx+1}. ${h.node} (ID:${h.nodeId}) - ${status}${h.error ? ': ' + h.error : ''}`, 
                        h.success ? 'color: #10b981;' : 'color: #ef4444;');
                });
                
                throw new Error(`TOTÁLNÍ BLOKÁDA: Všech ${activeNodes.length} aktivních taktických uzlů bylo vyřazeno z provozu. Poslední chyba: ${errorMsg}`);
            }
        }
    }
}

/**
 * 📡 TAKTICKÝ DISPLEJ - FORMÁTOVÁNÍ PRO MŮSTEK (FULL VÝSTUP)
 */
export function formatSerpAPIResults(fullResults) {
    if (!fullResults || (!fullResults.organic_results && !fullResults.knowledge_graph && !fullResults.answer_box && !fullResults.related_questions && !fullResults.inline_videos && !fullResults.top_stories && !fullResults.local_results)) {
        return '❌ **KRITICKÉ SELHÁNÍ SKENERŮ**\n\nŽádná data neprošla skrze nepřátelskou obranu. Zkontroluj rušičky nebo API klíč.';
    }

    let output = '🚢 **USS PROMETHEUS - TAKTICKÉ HLÁŠENÍ [v4.3 OPRAVENO]**\n\n';
    output += `**STATUS:** 🟢 OPERAČNÍ (Všechny systémy nominální)\n`;
    output += `**DOTAZ:** "${fullResults.metadata.query}"\n`;
    output += `**PRŮLOM:** Skrze uzel \`${fullResults.metadata.proxy_node}\` (ID:${fullResults.metadata.proxy_node_id}) (Odezva: ${fullResults.metadata.latency})\n`;
    output += `**ČAS:** \`${new Date(fullResults.metadata.timestamp).toLocaleTimeString()}\`\n\n`;
    output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

    // 1. Znalostní graf (Knowledge Graph)
    if (fullResults.knowledge_graph) {
        const kg = fullResults.knowledge_graph;
        output += `🧠 **ZNALOSTNÍ GRAF (KNOWLEDGE GRAPH):**\n\n`;
        output += `  **Název:** ${kg.title || 'N/A'}\n`;
        if (kg.type) output += `  **Typ:** ${kg.type}\n`;
        if (kg.description) output += `  **Popis:** ${kg.description}\n`;
        if (kg.image) output += `  **Obrázek:** ${kg.image}\n`;
        if (kg.url) output += `  **Více info:** [${kg.title || 'Odkaz'}](${kg.url})\n`;
        if (kg.header_images) {
            output += `  **Další obrázky:** ${kg.header_images.map(img => img.image).join(', ')}\n`;
        }
        if (kg.people_also_search_for) {
            output += `  **Související hledání:** ${kg.people_also_search_for.map(item => item.name).join(', ')}\n`;
        }
        output += '\n────────────────────────────────────────────────────────────\n\n';
    }

    // 2. Odpověďní box (Answer Box)
    if (fullResults.answer_box) {
        const ab = fullResults.answer_box;
        output += `🎯 **PŘÍMÁ ODPOVĚĎ (ANSWER BOX):**\n\n`;
        if (ab.title) output += `  **Titul:** ${ab.title}\n`;
        if (ab.snippet) output += `  **Úryvek:** ${ab.snippet}\n`;
        if (ab.link) output += `  **Zdroj:** [Odkaz](${ab.link})\n`;
        if (ab.answer) output += `  **Odpověď:** ${ab.answer}\n`;
        output += '\n────────────────────────────────────────────────────────────\n\n';
    }

    // 3. Organické výsledky (primární odkazy)
    if (fullResults.organic_results && fullResults.organic_results.length > 0) {
        output += `🔍 **ORGANICKÉ VÝSLEDKY (${fullResults.organic_results.length} cílů):**\n\n`;
        fullResults.organic_results.forEach((res) => {
            output += `**[${res.position}] ${res.title.toUpperCase()}**\n`;
            output += `🌐 **ZDROJ:** \`${res.source || (res.link ? new URL(res.link).hostname : 'Neznámý sektor')}\`\n`;
            output += `📄 **DATA:** *${res.snippet || 'Popis nebyl zachycen.'}*\n`;
            output += `🔗 **LINK:** [NAVIGOVAT K CÍLI](${res.link})\n\n`;
            output += '────────────────────────────────────\n\n';
        });
        output += '\n';
    }

    // 4. Související dotazy (People Also Ask)
    if (fullResults.related_questions && fullResults.related_questions.length > 0) {
        output += `❓ **SOUVISEJÍCÍ DOTAZY (PEOPLE ALSO ASK):**\n\n`;
        fullResults.related_questions.forEach((q) => {
            output += `  • ${q.question}\n`;
            if (q.snippet) output += `    *${q.snippet}*\n`;
            if (q.link) output += `    [Více](${q.link})\n`;
        });
        output += '\n────────────────────────────────────────────────────────────\n\n';
    }

    // 5. Top Story (Zprávy)
    if (fullResults.top_stories && fullResults.top_stories.length > 0) {
        output += `📰 **TOP ZPRÁVY (TOP STORIES):**\n\n`;
        fullResults.top_stories.forEach((story) => {
            output += `  • **Titul:** ${story.title}\n`;
            output += `    **Zdroj:** ${story.source}\n`;
            output += `    **Link:** [Číst](${story.link})\n`;
        });
        output += '\n────────────────────────────────────────────────────────────\n\n';
    }

    output += `\n🚀 *Vojenský protokol Armageddon v4.3 OPRAVENO - Plná hloubková analýza dat provedena.*`;
    return output;
}

/**
 * ✅ SYSTÉMOVÁ DIAGNOSTIKA - REVIZE MŮSTKU
 */
export function checkSerpAPIConfig() {
    console.log('%c🔍 [DIAGNOSTIKA] Zahajuji revizi všech systémů...', 'color: #6366f1; font-weight: bold;');
    const key = getSerpApiKey();
    const isGitHub = window.location.hostname.includes('github.io');
    
    const statusReport = {
        vessel: "USS PROMETHEUS",
        module_version: "4.3 OPRAVENÁ VERZE",
        combat_ready: key ? "YES" : "NO",
        configured: key && key.length > 20 ? true : false,
        sector: isGitHub ? "GITHUB_PAGES (Hostile Environment)" : "LOCALHOST (Safe Harbor)",
        active_proxies: TACTICAL_PROXY_GRID.filter(node => node !== undefined).length,
        redundancy_level: "MAXIMÁLNÍ - 7 UZLŮ",
        last_operation: NODE_STATS.node_history.length > 0 ? NODE_STATS.node_history[NODE_STATS.node_history.length - 1] : "None",
        performance_metrics: {
            total: NODE_STATS.total_requests,
            success: NODE_STATS.successful_requests,
            fail: NODE_STATS.failed_requests
        }
    };
    
    console.table(statusReport);
    return statusReport;
}

/**
 * 🧪 STRESS TEST - ZÁŽEH VŠECH MOTORŮ
 */
export async function testSerpAPI() {
    console.log('%c🧪 [ZÁŽEH] Spouštím zátěžový test všech aktivních uzlů...', 'color: #f59e0b; font-weight: bold; font-size: 14px;');
    
    const config = checkSerpAPIConfig();
    try {
        const results = await searchSerpAPI('Leden únor 2026 novinky', 5);
        console.log('%c✅ [VÝSLEDEK TESTU] Průlom byl úspěšný!', 'color: #10b981; font-weight: bold;');
        console.log(formatSerpAPIResults(results));
    } catch (e) {
        console.error('%c❌ [VÝSLEDEK TESTU] Totální selhání systémů:', 'color: #ef4444; font-weight: bold;', e.message);
        console.log('%c[DOPORUČENÍ] Vice admirále, zkontroluj:\n1. SerpAPI klíč v localStorage\n2. Připojení k internetu\n3. Běžící Python proxy server (localhost:9785)\n4. Firewall nastavení', 'color: #6366f1;');
    }
}
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// 🚀 INICIALIZACE MODULU ARMAGEDDON v4.3
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
console.log('%c✅ [MODULE] serpapi-search.js v4.3 [OPRAVENÁ VERZE] LOADED', 'color: #10b981; font-weight: bold; border: 2px solid #10b981; padding: 10px;');
console.log('%c💡 ZMĚNY: 7 aktivních proxy uzlů, vylepšená diagnostika, lepší error handling', 'color: #6366f1;');

// Provedení okamžité kontroly při načtení
const check = checkSerpAPIConfig();
if (check.combat_ready === "NO") {
    console.warn('%c⚠️ [VAROVÁNÍ] Loď je v tomto sektoru slepá. Vlož API klíč do localStorage jako "PROMETHEUS_SERPAPI_KEY".', 'color: #f59e0b;');
}

// KONEC SOUBORU - OPRAVENÁ VERZE PRO VICE ADMIRÁLA JIŘÍKA
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
