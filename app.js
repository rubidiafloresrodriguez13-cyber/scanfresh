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
    { id: 1,  plu: 4087, nombre: 'Tomate',        variedad: 'Saladette / Roma',        categoria: 'FRUTA FRESCA' },
    { id: 2,  plu: 4225, nombre: 'Aguacate',       variedad: 'Hass',                    categoria: 'FRUTA FRESCA' },
    { id: 3,  plu: 4011, nombre: 'Banano',         variedad: 'Cavendish',               categoria: 'FRUTA FRESCA' },
    { id: 4,  plu: 4131, nombre: 'Cebolla',        variedad: 'Amarilla',                categoria: 'VERDURA FRESCA' },
    { id: 5,  plu: 4065, nombre: 'Pimiento',       variedad: 'Verde / Bell',            categoria: 'VERDURA FRESCA' },
    { id: 6,  plu: 4062, nombre: 'Zanahoria',      variedad: 'Convencional, manojo',    categoria: 'VERDURA FRESCA' },
    { id: 7,  plu: 4032, nombre: 'Manzana',        variedad: 'Gala',                    categoria: 'FRUTA FRESCA' },
    { id: 8,  plu: 4022, nombre: 'Naranja',        variedad: 'Valencia',                categoria: 'FRUTA FRESCA' },
    { id: 9,  plu: 4640, nombre: 'Papa',           variedad: 'Blanca, bolsa 5 lb',      categoria: 'VERDURA FRESCA' },
    { id: 10, plu: 4688, nombre: 'Pepino',         variedad: 'Convencional',            categoria: 'VERDURA FRESCA' },
    { id: 11, plu: 4046, nombre: 'Papaya',         variedad: 'Maradol',                 categoria: 'FRUTA FRESCA' },
    { id: 12, plu: 4959, nombre: 'Brócoli',        variedad: 'Corona',                  categoria: 'VERDURA FRESCA' },
    { id: 13, plu: 3113, nombre: 'Limón',          variedad: 'Persa',                   categoria: 'FRUTA FRESCA' },
    { id: 14, plu: 4067, nombre: 'Chile jalapeño', variedad: 'Verde',                   categoria: 'VERDURA FRESCA' },
    { id: 15, plu: 4222, nombre: 'Sandía',         variedad: 'Sin semilla',             categoria: 'FRUTA FRESCA' },
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
