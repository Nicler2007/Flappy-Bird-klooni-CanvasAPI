# 🐦 Flappy Bird -klooni (HTML Canvas API)

Flappy Bird -tyylinen selainpeli, joka on toteutettu **HTML Canvas APIlla ja JavaScriptillä**.  
Pelin tavoitteena on ohjata lintua väistämään putkipareja ja kerätä mahdollisimman paljon pisteitä.  

## 🎮 Ominaisuudet
- Klassinen Flappy Bird -pelimekaniikka  
- Satunnaisesti generoidut putket  
- Pisteytys + high score tallennus `localStorageen`  
- Tilakone: **MENU → READY → PLAYING → GAME OVER**  
- Responsiivinen (toimii myös mobiilissa)  
- Ääniefektit (flap, point, hit, die)  
- Kevyt ja modulaarinen koodirakenne  

## 🛠️ Teknologiat
- **HTML5 Canvas API** – piirtämiseen ja animaatioon  
- **JavaScript (ES Modules)** – pelilogiikka ja syötteet  
- **CSS3** – yksinkertainen käyttöliittymä ja tyylit  
- **localStorage** – ennätyksen tallennus  

## 📂 Projektin rakenne
```
/project-root
│── index.html
│── style.css
│── /assets        # kuvat, äänet, sprite sheet
│── /js
│   ├── main.js    # käynnistys, pelisilmukka
│   ├── game.js    # maailman tila
│   ├── bird.js    # linnun fysiikka ja animaatio
│   ├── pipes.js   # putkien generointi ja kierrätys
│   ├── background.js
│   ├── ui.js      # HUD ja valikot
│   ├── audio.js   # äänet
│   └── storage.js # localStorage helperit
```

## 🚀 Käynnistys
1. Kloonaa repositorio  
   ```bash
   git clone https://github.com/<käyttäjänimi>/flappy-bird-clone.git
   cd flappy-bird-clone
   ```
2. Avaa `index.html` selaimessa  
   *tai* käynnistä dev-palvelin (esim. Vite):  
   ```bash
   npm install -g vite
   vite
   ```

## 🎯 Kontrollit
- **Space / Hiiren klikkaus / Kosketus** → Lintu hyppää  
- **M** → Mute päälle/pois  

## 📅 Kehitysaikataulu (arvio)
- Päivä 1: Alustus ja pelisilmukka  
- Päivä 2: Lintu ja syötteet  
- Päivä 3: Putket ja törmäykset  
- Päivä 4: Pisteytys ja tilakone  
- Päivä 5: Grafiikat ja äänet  
- Päivä 6: Tallennus ja asetukset  
- Päivä 7: Testaus ja julkaisu  

## 🌟 Tulevaisuuden ideat
- Päivä/yö-teema  
- Erikoisputkia ja haasteita  
- Online-scoreboard  
- PWA-tuki (offline ja asennettavuus)  

---

✍️ Tekijä: *[Nico Hede]*  
📜 Lisenssi: MIT
