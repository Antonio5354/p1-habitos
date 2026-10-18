const offlineStatus = document.getElementById('offlineStatus');
async function updateOfflineStatus(registration) {
  try {
    const cache = await caches.open('pfi-p1-shell-v1');
    const ready = !!(await cache.match('./index.html')) && !!registration.active;
    offlineStatus.textContent = ready
      ? 'Disponible sin conexión en esta instalación. Los registros se guardan en el iPhone.'
      : 'Preparando el uso sin conexión. Mantén esta pantalla abierta con internet.';
  } catch {
    offlineStatus.textContent = 'No se pudo comprobar el modo sin conexión. Puedes seguir registrando si la pantalla está abierta.';
  }
}
if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('./sw.js').then(async registration => {
    await navigator.serviceWorker.ready;
    updateOfflineStatus(registration);
    navigator.serviceWorker.addEventListener('controllerchange', () => updateOfflineStatus(registration));
    window.addEventListener('online', () => updateOfflineStatus(registration));
    window.addEventListener('offline', () => updateOfflineStatus(registration));
  }).catch(() => {
    offlineStatus.textContent = 'No se pudo preparar el uso sin conexión. Abre la app con internet para reintentarlo.';
  });
} else {
  offlineStatus.textContent = 'La instalación y el arranque sin conexión necesitan abrir esta herramienta desde un enlace HTTPS.';
}
document.getElementById('protectStorage').onclick = async () => {
  const status = document.getElementById('storageStatus');
  try {
    if (!navigator.storage?.persist) {
      status.textContent = 'Safari decide la conservación del almacenamiento. Guarda también copias JSON en Archivos.';
      return;
    }
    const granted = await navigator.storage.persist();
    status.textContent = granted
      ? 'El navegador concedió almacenamiento persistente. Borrar datos o eliminar la app aún puede eliminar registros: conserva copias JSON.'
      : 'El navegador no concedió persistencia adicional. Los registros siguen guardándose localmente; conserva copias JSON.';
  } catch {
    status.textContent = 'No se pudo solicitar persistencia adicional. Conserva copias JSON en Archivos.';
  }
};
