        
 
 
// fleet-registry.js - VELITELSKÝ MOST (Jediný soubor, který upravuješ)
const FLEET_CONFIG = {
    version: "0.0.0.0.0.5", // ← Zvýšil jsem o 1 (nový modul přidán)
    codename: "Prometheus-Class",
    
    // SEZNAM VŠECH MODULŮ (Tady spravuješ odkazy)
    modules: [
        //HLAVNÍ KOSTRA STAR TREK HUDEBNÍHO PŘEHRAVAČE
        './index.html',
        // --- CSS MODULY (POUZE AKTIVNÍ) ---
        './style.css',
        // ---HLAVNÍ CSS PRO MINI-PŘEHRAVAČ
        './multi-file-styles.css',
         // ---HLAVNÍ CSS ČASOVAČ DEAKTIVOVÁNÍ HRAJÍCÍ HUDBY
        './hlasovi-model-moldar.css',
         // ---HLAVNÍ CSS PRO UKAZATEL CO JE TO ZA PROHLÍŽEČ
        './Multimedialni-velikosti-vsech-obrazovek.css',
        // ---HLAVNÍ CSS PRO BOČNÍ POSUVNÍK OKNA PROHLÍŽEČE
        './serpapi-search--vyhledavac-by-vice-admiral-jirik.css',
        // ---HLAVNÍ CSS VÁNOČNÍ EDICE STAR TREK HUDEBNÍHO PŘEHRAVAČE
        './style-uss-prometheus.css',
        // ---HLAVNÍ CSS NOVÍ PANEL HLASITOST ZE SPRÁVCE ROZHRANÍ .JS
      
  //=========================================================================
         //STAR TREK HUDEBNÍ PŘEHRAVAČ KONFIGURACE KOMPATIBILNÍ Z USS-PROMETHEUS 
                             './style-uss-prometheus.css',
                          // --- NULTÉ POŘADÍ V POŘADÍ ---
                            './fleet-register.js',
                 // --- Musí se načíst PŘED všemi Firebase moduly ---
            'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
          'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js',  
                           './uss-prometheus-Firebase-Functions.js',   
                             './buttonVisibilityFirebase.js',
                             './buttonVisibilityManager.js',
                               './notificationFix.js',
                                 './myPlaylist.js',
                 //       './universalni-perfomens-monitor.js',
  //==============================================================================      
        
  //==============================================================================        
         //USS-PROMETHEUS 
        './serpapi-search.js',
        './serpapi-search--vyhledavac-by-vice-admiral-jirik.js',
        './system-prompt.js',
        './gemini-api.js',
        './canvas-editor.js',
        './google-cloud-tts.js',
        './script.js',
        './devtools-prometheus.js',
//=================================================================================        
    ]           
};

// ═══════════════════════════════════════════════════════════════════════════
// 🖖 EXPORT PRO SERVICE WORKER A MANIFEST
// ═══════════════════════════════════════════════════════════════════════════
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FLEET_CONFIG;
}

if (typeof window !== 'undefined') {
    window.FLEET_CONFIG = FLEET_CONFIG;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📡 FLEET STATUS LOGGER
// ═══════════════════════════════════════════════════════════════════════════
console.log(
    `%c🖖 USS PROMETHEUS - Fleet Registry v${FLEET_CONFIG.version}`,
    'color: #00FF00; font-size: 16px; font-weight: bold; background: #000; padding: 10px; border: 2px solid #00FF00;'
);
console.log(
    `%c   Kódové jméno: ${FLEET_CONFIG.codename}`,
    'color: #00CCFF; font-size: 12px;'
);
console.log(
    `%c   Registrované moduly: ${FLEET_CONFIG.modules.length}`,
    'color: #FFCC00; font-size: 12px;'
);
console.log(
    `%c   Status: Všechny systémy zelené! ✅`,
    'color: #00FF00; font-size: 12px; font-weight: bold;'        
);
 console.log(
    `%c   Projekt běží na: https://jirka22med.github.io/star-trek-hudebni-prehravac-vylepsen-4-mobilni/! ✅`,
    'color: #00FF00; font-size: 12px; font-weight: bold;'
);
 console.log(
    `%c   Projekt běží na:  https://jirka22med.github.io/uss-prometheus-gemini-app-2/! ✅`,
    'color: #00FF00; font-size: 12px; font-weight: bold;'
);
