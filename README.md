# चित्रसृष्टी (ChitraSrushti) 🎨

**मराठी टेक्स्ट आणि व्हॉईस ते AI इमेज जनरेटर**  
*Convert Marathi text and speech into AI-generated images*

---

## ✨ वैशिष्ट्ये (Features)

- 🎤 **मराठी व्हॉईस इनपुट** – ब्राउझरच्या Web Speech API द्वारे (`mr-IN` locale)
- ⌨️ **देवनागरी व्हर्च्युअल कीबोर्ड** – ऑन-स्क्रीन कीबोर्ड + रोमन phonetic transliteration
- 🖼️ **AI इमेज जनरेशन** – Pollinations AI द्वारे मोफत, कोणत्याही API Key शिवाय
- 🎨 **९ आर्ट स्टाइल्स** – वास्तववादी, वॉरली, राजा रविवर्मा, सिनेमॅटिक, ॲनिमे, इत्यादी
- 🏛️ **सांस्कृतिक ऑब्जेक्ट बाइंडिंग** – मोर, पणत्या, गणपती, किल्ला, इत्यादींसाठी अचूक चित्र
- 📱 **Responsive Design** – मोबाईल आणि डेस्कटॉप दोन्हींसाठी
- 🗂️ **गॅलरी व हिस्ट्री** – तयार केलेली सर्व चित्रे जतन होतात, डाऊनलोड करता येतात
- 🌐 **मराठी/English Bilingual UI**

---

## 🚀 सुरू करण्याचा मार्ग (Quick Start)

### आवश्यकता (Prerequisites)
- [Node.js](https://nodejs.org/) v18 किंवा त्यावरील आवृत्ती

### स्थापना (Installation)

```bash
# 1. रिपॉझिटरी क्लोन करा
git clone https://github.com/YOUR_USERNAME/marathi-text-speech-to-image.git

# 2. फोल्डरमध्ये जा
cd marathi-text-speech-to-image

# 3. सर्व्हर सुरू करा (कोणतेही npm install नाही!)
node server.js
```

### ब्राउझरमध्ये उघडा
```
http://localhost:3000
```

> **टीप:** माईक (व्हॉईस) वापरण्यासाठी **HTTPS** आवश्यक आहे. रिमोट ॲक्सेससाठी Cloudflare Tunnel वापरा.

---

## 🌍 क्लायंटसाठी Public URL (Share with client)

### Cloudflare Tunnel (मोफत, अकाउंट नाही)
1. [cloudflared.exe](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe) डाऊनलोड करा
2. ही कमांड चालवा:
   ```
   cloudflared.exe tunnel --url http://localhost:3000
   ```
3. मिळालेली `https://xxxx.trycloudflare.com` लिंक क्लायंटला पाठवा

---

## 📁 प्रोजेक्ट स्ट्रक्चर (Project Structure)

```
marathi-text-speech-to-image/
├── server.js               # Node.js backend server (zero npm deps)
├── package.json
├── start.bat               # Windows one-click launcher
├── start.ps1               # PowerShell launcher
├── sdxl_diffusers_clip.py  # (Optional) Local SDXL Python demo
├── public/
│   ├── index.html          # Main UI (Tailwind CSS + Lucide Icons via CDN)
│   ├── app.js              # Main application controller
│   ├── style.css           # Custom styles (Devanagari fonts, glassmorphism)
│   ├── i18n.js             # Marathi/English localization dictionary
│   ├── marathi-keyboard.js # Virtual keyboard & phonetic transliteration
│   └── marathi-prompts.js  # 20+ Marathi preset prompts (6 categories)
└── outputs/                # Generated images saved here (git-ignored)
```

---

## 🎯 वापर उदाहरणे (Example Prompts)

| मराठी | English Translation |
|-------|-------------------|
| पावसात नाचणारा मोर | Peacock dancing in the rain |
| एक लहान कुत्रा चेंडूशी खेळत आहे | A small dog playing with a ball |
| दिवाळीच्या पणत्या आणि रांगोळी | Diwali oil lamps and rangoli |
| सह्याद्रीचा भव्य किल्ला | Majestic Sahyadri hill fort |
| छत्रपती शिवाजी महाराज | Chhatrapati Shivaji Maharaj |

---

## 🛠️ तंत्रज्ञान (Tech Stack)

- **Backend:** Pure Node.js (no npm packages — zero dependencies!)
- **Frontend:** HTML5, Tailwind CSS (CDN), Lucide Icons (CDN)
- **AI Image API:** [Pollinations.AI](https://pollinations.ai) (free, no API key needed)
- **Translation:** Google Translate APIs (free endpoints)
- **Speech:** Web Speech API (`mr-IN` — built into Chrome/Edge)
- **Font:** Noto Sans Devanagari (Google Fonts)

---

## 📜 परवाना (License)

MIT License — Free to use, modify, and distribute.

---

*महाराष्ट्रातील संस्कृती, कला आणि आधुनिक तंत्रज्ञानाच्या प्रेमातून साकारलेले 🧡*
