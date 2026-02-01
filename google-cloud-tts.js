// ═══════════════════════════════════════════════════════════
// 🎙️ GOOGLE CLOUD TEXT-TO-SPEECH - USS PROMETHEUS
// WaveNet Technology - Production Ready
// ═══════════════════════════════════════════════════════════

// API Configuration
export const GOOGLE_TTS_API_KEY = 'AIzaSyAz_BFf_O8x4j9nFWzinB4deWSdpBLqdUA';
export const GOOGLE_TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`;

// Voice Configuration - Aktualizováno pro USS PROMETHEUS v5.9
export const VOICES = {
    female: 'cs-CZ-Wavenet-A ',      // Ženský hlas (Wavenet) cs-CZ-Wavenet-A 
    male: 'cs-CZ-Wavenet-B',        // Ženský hlas (Wavenet) cs-CZ-Wavenet-B
    
};

let currentVoice = VOICES.male; // Výchozí: mužský hlas

/**
 * 🎙️ GENEROVÁNÍ ŘEČI (Google Cloud TTS)
 */
export async function generateSpeechGoogleCloud(text, voice = currentVoice) {
    try {
        const response = await fetch(GOOGLE_TTS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: { 
                    text: text 
                },
                voice: { 
                    languageCode: 'cs-CZ', 
                    name: voice 
                },
                audioConfig: { 
                    audioEncoding: 'MP3',
                    speakingRate: 1.0,      // Rychlost čtení (0.25-4.0)
                    pitch: 0.0,             // Výška hlasu (-20.0 až 20.0)
                    volumeGainDb: 0.0       // Hlasitost (0 = normální)
                }
            }),
        });

        if (!response.ok) {
            throw new Error(`Google TTS API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.audioContent) {
            throw new Error('No audio content in response');
        }

      console.log('🎙️ Google Cloud TTS: Audio generated ✅');
        console.log(`   Voice: ${voice} ✅`);
        console.log(`   Size: ${(data.audioContent.length / 1024).toFixed(2)} KB ✅`);
        
        return data.audioContent; // Base64 MP3
        
    } catch (error) {
        console.error('❌ Google Cloud TTS Error:', error);
        return null;
    }
}

/**
 * 🎚️ ZMĚNA HLASU
 */
export function setVoice(voiceType) {
    if (VOICES[voiceType]) {
        currentVoice = VOICES[voiceType];
        console.log(`🎙️ Voice changed to: ${currentVoice} ✅`);
        return true;
    }
    console.error(`❌ Unknown voice type: ${voiceType}`);
    return false;
}

/**
 * 📋 ZÍSKÁNÍ DOSTUPNÝCH HLASŮ
 */
export function getAvailableVoices() {
    return VOICES;
}

/**
 * 🎯 ZÍSKÁNÍ AKTUÁLNÍHO HLASU
 */
export function getCurrentVoice() {
    return currentVoice;
}

 
