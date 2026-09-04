/* =========================================================
   ScanFresh — app.js
   Cámara nativa + base de datos local + simulación de escaneo
   ========================================================= */

(() => {
  'use strict';

  /* ---------------------------------------------------------
     1. BASE DE DATOS LOCAL DE INVENTARIO (simulada)
     Cada producto trae su código PLU real de referencia.
  --------------------------------------------------------- */
  const inventario = [
  // --- FRUTAS Y VERDURAS ---
  { id: 1, plu: 3495, nombre: 'AGUACATE BENEKE UND' },
  { id: 2, plu: 4227, nombre: 'AGUACATE CRIOLLO UND' },
  { id: 3, plu: 4225, nombre: 'AGUACATE HASS LB' },
  { id: 4, plu: 7013, nombre: 'APIO IMPORTADO LB' },
  { id: 5, plu: 4055, nombre: 'AYOTE BUTTERNUT LB' },
  { id: 6, plu: 4168, nombre: 'AYOTE TIERNO UND' },
  { id: 7, plu: 3383, nombre: 'AYOTE SAZON UND' },
  { id: 8, plu: 7566, nombre: 'MANDARINA CRIOLLA UND' },
  { id: 9, plu: 3383, nombre: 'MANDARINAS CLEMENTINA LB' },
  { id: 10, plu: 7566, nombre: 'LECHUGA ROMANA UND' },
  { id: 11, plu: 4106, nombre: 'LECHUGA ARREPOLLADA LB' },
  { id: 12, plu: 7347, nombre: 'LIMON PERSICO UND' },
  { id: 13, plu: 3009, nombre: 'PATERNA UND' },
  { id: 14, plu: 4133, nombre: 'PERA ASIATICA LB' },
  { id: 15, plu: 3072, nombre: 'CILANTRO MANOJO' },
  { id: 16, plu: 7522, nombre: 'ESPARRAGOS' },
  { id: 17, plu: 4015, nombre: 'ESPINACA CHINA MANOJO' },
  { id: 18, plu: 4016, nombre: 'ESPINACA MANOJO' },
  { id: 19, plu: 7501, nombre: 'FRESA BANDEJA' },
  { id: 20, plu: 7070, nombre: 'GRANADILLA BANDEJA' },
  { id: 21, plu: 4017, nombre: 'HOJA PARA TAMAL' },
  { id: 22, plu: 3312, nombre: 'LIMON BOLSA 10 UND' },
  { id: 23, plu: 4038, nombre: 'LOROCO 4 OZ' },
  { id: 24, plu: 4050, nombre: 'MAIN DULCE BANDEJA' },
  { id: 25, plu: 4405, nombre: 'MANZANA VERDE PAQUETE' },
  { id: 26, plu: 7549, nombre: 'MANZANA GALA PAQUETE' },
  { id: 27, plu: 4315, nombre: 'MANZANA ROJA PAQUETE' },
  { id: 28, plu: 7639, nombre: 'PAPA AMERICANA RED' },
  { id: 29, plu: 4392, nombre: 'PAPA SUPER RED 3 LB' },
  { id: 30, plu: 35910, nombre: 'PIÑA DORADA UND' },
  { id: 31, plu: 4072, nombre: 'RABANO MANOJO' },
  { id: 32, plu: 4462, nombre: 'SURTIMONTES' },
  { id: 33, plu: 4596, nombre: 'TOMATE GRAPE 12 OZ' },
  { id: 34, plu: 7430, nombre: 'TOMATE MANZANO RED' },
  { id: 35, plu: 7354, nombre: 'PAPAYA KAYA PAYA UND' },
  { id: 36, plu: 741006210424, nombre: 'BLUE BERRY' },
  { id: 37, plu: 7410110360013, nombre: 'MINI PIPIAN BANDEJA' },
  { id: 38, plu: 741390350010, nombre: 'PIPIAN BANDEJA' },
  { id: 39, plu: 333832029, nombre: 'JICAMA LB' },
  { id: 40, plu: 741006210509, nombre: 'MANGO IMPORTADO' },
  { id: 41, plu: 741006210445, nombre: 'TANGELO' },
  { id: 42, plu: 741006210422, nombre: 'SACO DE AZUCAR' },
  { id: 43, plu: 741006210509, nombre: 'CAJA DE CARTON' },
  { id: 44, plu: 4480, nombre: 'GARRAFON DE CRISTA' },
  { id: 45, plu: 7419, nombre: 'SERVICIO A DOMICILIO' },

  // --- PANADERÍA Y REPOSTERÍA ---
  { id: 46, plu: 74134001041, nombre: 'ALFAJORES FAMILY 8' },
  { id: 47, plu: 25702100000, nombre: 'BADU CHILENITA 350GR' },
  { id: 48, plu: 25702800000, nombre: 'BADU MIL HOJAS REPOS' },
  { id: 49, plu: 25780200000, nombre: 'BAGUETT AJO' },
  { id: 50, plu: 25790500000, nombre: 'BAGUETT BLANCO GRAN' },
  { id: 51, plu: 25780100000, nombre: 'BAGUETT FINAS HIERB' },
  { id: 52, plu: 25692000000, nombre: 'BAGUETT RUSTICO UND' },
  { id: 53, plu: 588, nombre: 'BUDIN PORCION PS' },
  { id: 54, plu: 25014100000, nombre: 'CAJA 6 DONAS VARIEDA' },
  { id: 55, plu: 74127005021, nombre: 'CAKE TRI SABOR 10 UN' },
  { id: 56, plu: 74127005020, nombre: 'CAKE TRI SABOR 8 UND' },
  { id: 57, plu: 74127005027, nombre: 'CAKE TRISABOR UND' },
  { id: 58, plu: 740613167095, nombre: 'CAKITO VAINIL 6 EA' },
  { id: 59, plu: 718, nombre: 'CARACOL DANES CCREMA' },
  { id: 60, plu: 615, nombre: 'CARCAN GALLETA' },
  { id: 61, plu: 122, nombre: 'CORONA VAINILLA UND' },
  { id: 62, plu: 128, nombre: 'D STRUDELL CREMA' },
  { id: 63, plu: 469, nombre: 'DELAWERE UND' },
  { id: 64, plu: 612, nombre: 'DOMINO CHOCOLATE' },
  { id: 65, plu: 25389500000, nombre: 'DOMO CAKITO DECOR 6' },
  { id: 66, plu: 25387700000, nombre: 'DOMO DE ALFAJOR 8 UN' },
  { id: 67, plu: 25041900000, nombre: 'DOMO DE MUFFING 10 U' },
  { id: 68, plu: 25901200000, nombre: 'DOMO PANQUE TROPICAL' },
  { id: 69, plu: 732, nombre: 'DONA DECORADA UND' },
  { id: 70, plu: 630, nombre: 'FLAN QUESO PO' },
  { id: 71, plu: 319, nombre: 'GALLETA DE COCO UND' },
  { id: 72, plu: 151, nombre: 'GALLETA CON AVENA' },
  { id: 73, plu: 363, nombre: 'GALLETA DE CHOCHIPS' },
  { id: 74, plu: 190, nombre: 'GUSANITO DULCE' },
  { id: 75, plu: 520, nombre: 'HERRADURA PINA UND' },
  { id: 76, plu: 280, nombre: 'MARGARITA UND' },
  { id: 77, plu: 637, nombre: 'MUFFIN CHOCOLATE UND' },
  { id: 78, plu: 209, nombre: 'MUFFIN DECORADO UND' },
  { id: 79, plu: 638, nombre: 'MUFFIN VAINILLLLA UND' },
  { id: 80, plu: 285, nombre: 'PAN CROISSANNT UND' },
  { id: 81, plu: 339, nombre: 'PAN INTEGRALITO 1' },
  { id: 82, plu: 325, nombre: 'PAN TORTAS MEXICANA' },
  { id: 83, plu: 25022800000, nombre: 'PAN BAGUETTE UND' },
  { id: 84, plu: 716, nombre: 'PAN BLA INT MED BAGU' },
  { id: 85, plu: 715, nombre: 'PAN BLAN INTEG BAGUE' },
  { id: 86, plu: 74134070047, nombre: 'PAN BOLLO BLANCO' },
  { id: 87, plu: 598, nombre: 'PAN CONCHA DE VAIN' },
  { id: 88, plu: 161, nombre: 'PAN MARQUESOTE UND' },
  { id: 89, plu: 627, nombre: 'PAN PEPERECHA UND' },
  { id: 90, plu: 323, nombre: 'PAN PIRUJO CON AJONJ' },
  { id: 91, plu: 25690400000, nombre: 'PAN PIRUJO PAQUETE' },
  { id: 92, plu: 25390800000, nombre: 'PAN QUESO Y COMINO U' },
  { id: 93, plu: 25220000000, nombre: 'PAN ROSCA' },
  { id: 94, plu: 569, nombre: 'PAN TELERA UND' },
  { id: 95, plu: 25039600000, nombre: 'PANQUE ALMENDRA SEMI' },
  { id: 96, plu: 25386300000, nombre: 'PANQUE PASAS' },
  { id: 97, plu: 25386400000, nombre: 'PANQUE VAINILLA UND' },
  { id: 98, plu: 74134070020, nombre: 'PANUELO GRANDE UND' },
  { id: 99, plu: 25040200000, nombre: 'PAS 14 PL RELL FRES' },
  { id: 100, plu: 25388600000, nombre: 'PAST CHOCOGALLET 10P' },
  { id: 101, plu: 25389100000, nombre: 'PAST MEDI PLA DUL LE' },
  { id: 102, plu: 25388500000, nombre: 'PASTEL CARAMEL 8 UN' },
  { id: 103, plu: 26699700000, nombre: 'ROLL DE POLLO 6' },
  { id: 104, plu: 317, nombre: 'SANTANECA UND' },
  { id: 105, plu: 625, nombre: 'SEMITA ALTA UND' },
  { id: 106, plu: 729, nombre: 'STRUDELL BERRIES' },
  { id: 107, plu: 124, nombre: 'STRUDELL MANZA' },
  { id: 108, plu: 126, nombre: 'STRUDELL CREMA' },
  { id: 109, plu: 25880100000, nombre: 'STRUDELL PINA UN' },
  { id: 110, plu: 25385700000, nombre: 'STRUDELL FRESA' },
  { id: 111, plu: 25900900000, nombre: 'TARTALETA DE FR' },
  { id: 112, plu: 25900800000, nombre: 'TARTALETA DE ME' },
  { id: 113, plu: 25182000000, nombre: 'TARTALETA FRESA' },
  { id: 114, plu: 25390300000, nombre: 'TORTA DE QUESO' },
  { id: 115, plu: 593, nombre: 'TORTA SECA U' },
  { id: 116, plu: 717, nombre: 'TRENZA DANES CC' },
  { id: 117, plu: 336, nombre: 'TRENZA UND PES' },
  { id: 118, plu: 740613166500, nombre: 'TRES LECHES FAM' },
  { id: 119, plu: 25692100000, nombre: 'TWO PACK BAQUE' },
  { id: 120, plu: 266, nombre: 'UND SALPOR ALM' },
  { id: 121, plu: 265, nombre: 'UND SALPOR ARR' },
  { id: 122, plu: 25023700000, nombre: 'VIEJITA UND' },
  { id: 123, plu: 25710800000, nombre: 'VIEJITAS 5 UND' },
  { id: 124, plu: 25711000000, nombre: 'VOLOVAN DE POLL' },
  { id: 125, plu: 301, nombre: 'VOLOVAN DE POLL' },
  { id: 126, plu: 740613166704, nombre: 'PASTEL CHOCOLA' },
  { id: 127, plu: 25388700000, nombre: 'PASTEL CHOFRES' },
  { id: 128, plu: 740109080514, nombre: 'PASTEL FRU ROJ17' },
  { id: 129, plu: 740108080544, nombre: 'PASTEL FRUTOS R' },
  { id: 130, plu: 740109080049, nombre: 'PASTEL NAPOLI 14' },
  { id: 131, plu: 740109080047, nombre: 'PASTEL QUES F 16' },
  { id: 132, plu: 740613166602, nombre: 'PASTEL SELVA NE' },
  { id: 133, plu: 309, nombre: 'PEGADITOS UND' },
  { id: 134, plu: 453, nombre: 'PICUDA' },
  { id: 135, plu: 618, nombre: 'PIRUJO' },
  { id: 136, plu: 25710500000, nombre: 'PIRUJON 4 UND' },
  { id: 137, plu: 310, nombre: 'PIRUJON HIPER UN' },
  { id: 138, plu: 328, nombre: 'PORCION PASTEL' },
  { id: 139, plu: 25390000000, nombre: 'POSTRE 3 LECHES' },
  { id: 140, plu: 25390200000, nombre: 'POSTRE 3 LECHES' },
  { id: 141, plu: 25034300000, nombre: 'POSTRE 3 LECHES' },
  { id: 142, plu: 25033700000, nombre: 'POSTRE 3 LECHES' },
  { id: 143, plu: 25036200000, nombre: 'POSTRE TRES LEC' },
  { id: 144, plu: 25389400000, nombre: 'REPOST CARAME' },
  { id: 145, plu: 25901300000, nombre: 'REPOSTERIA CHO' },
  { id: 146, plu: 25047900000, nombre: 'REPOSTERIA VAIN' },
  { id: 147, plu: 25018300000, nombre: 'MINI BAGUETT AJ' },
  { id: 148, plu: 25389000000, nombre: 'MINI BAGUETT BL' },
  { id: 149, plu: 35885200000, nombre: 'PAN PIRUJON GT' }
  ];

  /* ---------------------------------------------------------
     2. REFERENCIAS AL DOM
  --------------------------------------------------------- */
  const video             = document.getElementById('video');
  const previewImage       = document.getElementById('previewImage');
  const canvas             = document.getElementById('canvas');
  const cameraPlaceholder  = document.getElementById('cameraPlaceholder');

  const cameraToggleBtn    = document.getElementById('cameraToggleBtn');
  const switchCameraBtn    = document.getElementById('switchCameraBtn');
  const scanBtn             = document.getElementById('scanBtn');
  const uploadInput         = document.getElementById('uploadInput');
  const scanLine            = document.getElementById('scanLine');

  const statusDot           = document.getElementById('statusDot');
  const statusText          = document.getElementById('statusText');

  const resultEmpty         = document.getElementById('resultEmpty');
  const resultContent       = document.getElementById('resultContent');
  const categoryTag         = document.getElementById('categoryTag');
  const confidenceValue     = document.getElementById('confidenceValue');
  const productName         = document.getElementById('productName');
  const productVariety      = document.getElementById('productVariety');
  const pluCode              = document.getElementById('pluCode');

  /* ---------------------------------------------------------
     3. ESTADO
  --------------------------------------------------------- */
  let mediaStream    = null;
  let currentFacing  = 'environment'; // trasera por defecto
  let usingUpload    = false;
  let isScanning     = false;

  /* ---------------------------------------------------------
     4. CÁMARA — activar / detener / cambiar
  --------------------------------------------------------- */
  async function startCamera(facingMode = currentFacing) {
    stopCamera(); // asegura no dejar streams abiertos

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus(false, 'Cámara no disponible en este navegador');
      return;
    }

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode } },
        audio: false
      });

      usingUpload = false;
      previewImage.classList.add('camera-frame__video--hidden');
      previewImage.removeAttribute('src');

      video.srcObject = mediaStream;
      video.classList.remove('camera-frame__video--hidden');
      cameraPlaceholder.style.display = 'none';

      currentFacing = facingMode;
      setStatus(true, 'Cámara activa');
      cameraToggleBtn.textContent = 'Apagar cámara';
      cameraToggleBtn.classList.add('is-active');

    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setStatus(false, 'Permiso de cámara denegado');
    }
  }

  function stopCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    video.srcObject = null;
  }

  function toggleCamera() {
    if (mediaStream) {
      stopCamera();
      video.classList.add('camera-frame__video--hidden');
      if (!usingUpload) cameraPlaceholder.style.display = 'flex';
      setStatus(false, 'Cámara inactiva');
      cameraToggleBtn.textContent = 'Activar cámara';
      cameraToggleBtn.classList.remove('is-active');
    } else {
      startCamera(currentFacing);
    }
  }

  function switchFacing() {
    const next = currentFacing === 'environment' ? 'user' : 'environment';
    if (mediaStream) {
      startCamera(next);
    } else {
      currentFacing = next;
    }
  }

  function setStatus(active, text) {
    statusDot.classList.toggle('status-dot--active', active);
    statusText.textContent = text;
  }

  /* ---------------------------------------------------------
     5. SUBIR IMAGEN DE PRUEBA (alternativa a la cámara)
  --------------------------------------------------------- */
  function handleUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    stopCamera();
    usingUpload = true;

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.classList.remove('camera-frame__video--hidden');
      video.classList.add('camera-frame__video--hidden');
      cameraPlaceholder.style.display = 'none';
      setStatus(true, 'Imagen de prueba cargada');
      cameraToggleBtn.textContent = 'Activar cámara';
      cameraToggleBtn.classList.remove('is-active');
    };
    reader.readAsDataURL(file);
  }

  /* ---------------------------------------------------------
     6. SIMULACIÓN DE ESCANEO
     Toma una "captura" del frame actual (o de la imagen subida)
     y selecciona un producto aleatorio del inventario local,
     como si fuera el resultado de un modelo de identificación.
  --------------------------------------------------------- */
  function runScan() {
    if (isScanning) return;

    if (!mediaStream && !usingUpload) {
      setStatus(false, 'Activa la cámara o sube una imagen primero');
      return;
    }

    isScanning = true;
    scanBtn.classList.add('is-scanning');
    scanLine.hidden = false;
    setStatus(true, 'Analizando producto...');

    // Si hay video en vivo, capturamos el frame al canvas (uso real de captura)
    if (mediaStream) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth || 480;
      canvas.height = video.videoHeight || 640;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // canvas.toDataURL('image/png') queda disponible aquí para
      // enviarse a un modelo real de identificación en el futuro.
    }

    // Simula el tiempo de procesamiento del "modelo" de identificación
    window.setTimeout(() => {
      const producto = inventario[Math.floor(Math.random() * inventario.length)];
      const confianza = Math.floor(Math.random() * (99 - 90 + 1)) + 90; // 90–99%

      mostrarResultado(producto, confianza);

      isScanning = false;
      scanBtn.classList.remove('is-scanning');
      scanLine.hidden = true;
      setStatus(true, mediaStream ? 'Cámara activa' : 'Imagen de prueba cargada');
    }, 1100);
  }

  /* ---------------------------------------------------------
     7. ACTUALIZAR TARJETA DE RESULTADOS
  --------------------------------------------------------- */
  function mostrarResultado(producto, confianza) {
    categoryTag.textContent = producto.categoria;
    confidenceValue.textContent = confianza;
    productName.textContent = producto.nombre;
    productVariety.textContent = `Variedad: ${producto.variedad}`;
    pluCode.textContent = producto.plu;

    resultEmpty.hidden = true;
    resultContent.hidden = false;

    // Reinicia la animación de entrada en cada nuevo resultado
    resultContent.style.animation = 'none';
    // Forzar reflow para poder relanzar la animación
    void resultContent.offsetWidth;
    resultContent.style.animation = '';
  }

  /* ---------------------------------------------------------
     8. EVENTOS
  --------------------------------------------------------- */
  cameraToggleBtn.addEventListener('click', toggleCamera);
  switchCameraBtn.addEventListener('click', switchFacing);
  scanBtn.addEventListener('click', runScan);
  uploadInput.addEventListener('change', handleUpload);

  // Libera la cámara si el usuario cambia de pestaña/cierra la app
  window.addEventListener('beforeunload', stopCamera);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopCamera();
  });

})();
