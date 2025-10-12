// Skaičiuotuvo kintamieji
let dabartinisBandymas = '';
let ankstenisIvestis = '';
let operatorius = '';
let ReikiaIstrinti = false;
let visaIsraiška = ''; // Visa išraiška rodymui

function atnaujintiEkrana() {
    const ekranas = document.getElementById('display');
    let tekstas;
    
    if (visaIsraiška !== '') {
        tekstas = visaIsraiška;
    } else {
        tekstas = dabartinisBandymas || '0';
    }
    
    ekranas.value = tekstas;
    
    // Automatiškai keisti šrifto dydį pagal teksto ilgį
    prisitaikytiSrifta(ekranas, tekstas);
}

function prisitaikytiSrifta(ekranas, tekstas) {
    // Pašalinti visas esamas šrifto klases
    ekranas.classList.remove('text-small', 'text-smaller', 'text-tiny', 'text-micro', 'error-text');
    
    // Jei tai klaidos pranešimas
    if (tekstas.includes('AR TU SVEIKAS?')) {
        ekranas.classList.add('error-text');
        return;
    }
    
    // Automatinis šrifto dydžio prisitaikymas pagal simbolių kiekį
    const ilgis = tekstas.length;
    
    if (ilgis > 25) {
        ekranas.classList.add('text-micro');     // Labai mažas šriftas
    } else if (ilgis > 20) {
        ekranas.classList.add('text-tiny');      // Mažas šriftas
    } else if (ilgis > 15) {
        ekranas.classList.add('text-smaller');   // Vidutinis šriftas
    } else if (ilgis > 10) {
        ekranas.classList.add('text-small');     // Šiek tiek mažesnis šriftas
    }
    // Jei ilgis <= 10, lieka normalus šriftas (jokių klasių)
}

function isvalytiEkrana() {
    dabartinisBandymas = '';
    ankstenisIvestis = '';
    operatorius = '';
    visaIsraiška = '';
    atnaujintiEkrana();
}

function istrintiPaskutini() {
    if (visaIsraiška.length > 0) {
        visaIsraiška = visaIsraiška.slice(0, -1);
        // Atnaujinti dabartinisBandymas pagal paskutinį skaičių
        const dalys = visaIsraiška.split(/[\+\-\*\/\^]/);
        dabartinisBandymas = dalys[dalys.length - 1] || '';
    } else if (dabartinisBandymas.length > 0) {
        dabartinisBandymas = dabartinisBandymas.slice(0, -1);
    }
    atnaujintiEkrana();
}

function pridetiSkaiciu(skaicius) {
    if (ReikiaIstrinti) {
        dabartinisBandymas = '';
        visaIsraiška = '';
        ReikiaIstrinti = false;
    }
    dabartinisBandymas += skaicius;
    
    // Atnaujinti visą išraišką
    if (operatorius && ankstenisIvestis !== '') {
        visaIsraiška = ankstenisIvestis + ' ' + operatorius + ' ' + dabartinisBandymas;
    } else {
        visaIsraiška = dabartinisBandymas;
    }
    
    atnaujintiEkrana();
}

function pridetiVeiksma(veiksmas) {
    if (dabartinisBandymas === '') return;
    
    if (ankstenisIvestis !== '' && operatorius !== '') {
        apskaiciuotiRezultata();
    }
    
    operatorius = veiksmas;
    ankstenisIvestis = dabartinisBandymas;
    visaIsraiška = dabartinisBandymas + ' ' + veiksmas + ' ';
    dabartinisBandymas = '';
    atnaujintiEkrana();
}

function pridetiKableli() {
    if (ReikiaIstrinti) {
        dabartinisBandymas = '0';
        visaIsraiška = '0';
        ReikiaIstrinti = false;
    }
    
    if (!dabartinisBandymas.includes('.')) {
        if (dabartinisBandymas === '') {
            dabartinisBandymas = '0.';
        } else {
            dabartinisBandymas += '.';
        }
        
        // Atnaujinti visą išraišką
        if (operatorius && ankstenisIvestis !== '') {
            visaIsraiška = ankstenisIvestis + ' ' + operatorius + ' ' + dabartinisBandymas;
        } else {
            visaIsraiška = dabartinisBandymas;
        }
        
        atnaujintiEkrana();
    }
}

function apskaiciuotiRezultata() {
    if (ankstenisIvestis === '' || dabartinisBandymas === '' || operatorius === '') {
        return;
    }
    
    let ankstesnis = parseFloat(ankstenisIvestis);
    let dabartinis = parseFloat(dabartinisBandymas);
    let rezultatas;
    
    switch(operatorius) {
        case '+':
            rezultatas = ankstesnis + dabartinis;
            break;
        case '-':
            rezultatas = ankstesnis - dabartinis;
            break;
        case '*':
            rezultatas = ankstesnis * dabartinis;
            break;
        case '/':
            if (dabartinis === 0) {
                dabartinisBandymas = 'AR TU SVEIKAS?';
                visaIsraiška = 'AR TU SVEIKAS?';
                ankstenisIvestis = '';
                operatorius = '';
                atnaujintiEkrana();
                return;
            }
            rezultatas = ankstesnis / dabartinis;
            break;
        case '**':
            rezultatas = Math.pow(ankstesnis, dabartinis);
            break;
        default:
            return;
    }
    
    // Rodyti visą išraišką su rezultatu
    visaIsraiška = ankstenisIvestis + ' ' + operatorius + ' ' + dabartinisBandymas + ' = ' + rezultatas;
    dabartinisBandymas = rezultatas.toString();
    ankstenisIvestis = '';
    operatorius = '';
    ReikiaIstrinti = true;
    atnaujintiEkrana();
}

function pridetiMatFunkcija(funkcija) {
    if (dabartinisBandymas === '') return;
    
    let skaicius = parseFloat(dabartinisBandymas);
    let rezultatas;
    
    switch(funkcija) {
        case 'sin':
            rezultatas = Math.sin(skaicius * Math.PI / 180);
            visaIsraiška = 'sin(' + dabartinisBandymas + ') = ' + rezultatas;
            break;
        case 'cos':
            rezultatas = Math.cos(skaicius * Math.PI / 180);
            visaIsraiška = 'cos(' + dabartinisBandymas + ') = ' + rezultatas;
            break;
        case 'tan':
            rezultatas = Math.tan(skaicius * Math.PI / 180);
            visaIsraiška = 'tan(' + dabartinisBandymas + ') = ' + rezultatas;
            break;
        case 'square':
            rezultatas = skaicius * skaicius;
            visaIsraiška = dabartinisBandymas + '² = ' + rezultatas;
            break;
        default:
            return;
    }
    
    dabartinisBandymas = rezultatas.toString();
    ReikiaIstrinti = true;
    atnaujintiEkrana();
}

function pridetiSakniesNaujinta() {
    if (dabartinisBandymas === '') return;
    
    let skaicius = parseFloat(dabartinisBandymas);
    
    if (skaicius < 0) {
        dabartinisBandymas = 'AR TU SVEIKAS?';
        visaIsraiška = '√(' + skaicius + ') = AR TU SVEIKAS?';
        atnaujintiEkrana();
        return;
    }
    
    let rezultatas = Math.sqrt(skaicius);
    visaIsraiška = '√(' + dabartinisBandymas + ') = ' + rezultatas;
    dabartinisBandymas = rezultatas.toString();
    ReikiaIstrinti = true;
    atnaujintiEkrana();
}

function pazimiKeisti() {
    if (dabartinisBandymas !== '' && dabartinisBandymas !== '0') {
        if (dabartinisBandymas.startsWith('-')) {
            dabartinisBandymas = dabartinisBandymas.substring(1);
        } else {
            dabartinisBandymas = '-' + dabartinisBandymas;
        }
        
        // Atnaujinti visą išraišką
        if (operatorius && ankstenisIvestis !== '') {
            visaIsraiška = ankstenisIvestis + ' ' + operatorius + ' ' + dabartinisBandymas;
        } else {
            visaIsraiška = dabartinisBandymas;
        }
        
        atnaujintiEkrana();
    }
}

// Klavišų palaikymas
document.addEventListener('keydown', function(event) {
    const klavisas = event.key;
    
    if (klavisas >= '0' && klavisas <= '9') {
        pridetiSkaiciu(klavisas);
    } else if (klavisas === '+' || klavisas === '-' || klavisas === '*' || klavisas === '/') {
        pridetiVeiksma(klavisas);
    } else if (klavisas === '.') {
        pridetiKableli();
    } else if (klavisas === 'Enter' || klavisas === '=') {
        apskaiciuotiRezultata();
    } else if (klavisas === 'Escape' || klavisas.toLowerCase() === 'c') {
        isvalytiEkrana();
    } else if (klavisas === 'Backspace') {
        istrintiPaskutini();
    }
});

// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.initializeDrops();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initializeDrops() {
        // Matrix simboliai: skaičiai, raidės, matematikos simboliai
        this.characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-*/=()[]{}πℯ∞√∑∏∫∂∇αβγδεζηθλμξρστφχψω';
        this.fontSize = 14;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = [];
        this.dropSpeed = 0.3; // Pridėtas lėtas kritimo greitis
        
        // Inicializuoti lašus
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * this.canvas.height / this.fontSize;
        }
    }
    
    draw() {
        // Pusiau skaidrus juodas fonas šleifui
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // Šiek tiek ryškesnis fono valymas
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Žalias tekstas
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = `${this.fontSize}px 'Fira Code', monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            // Atsitiktinis simbolis
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            
            // Apskaičiuoti poziciją
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            // Gradient efektas - šviesesnės viršuje
            const alpha = Math.max(0.1, 1 - (y / this.canvas.height));
            this.ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            
            // Nupiešti simbolį
            this.ctx.fillText(text, x, y);
            
            // Jei lašas pasiekė apačią arba atsitiktinai, atstatyti viršuje
            if (y > this.canvas.height || Math.random() > 0.995) { // Sumažintas atsitiktinumo dažnis
                this.drops[i] = 0;
            }
            
            // Judėti žemyn lėčiau
            this.drops[i] += this.dropSpeed;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Paleisti Matrix efektą kai puslapis užkrautas
document.addEventListener('DOMContentLoaded', () => {
    new MatrixRain();
});
