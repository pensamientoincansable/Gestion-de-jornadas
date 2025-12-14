// ============================================
// INICIALIZACIÓN
// ============================================

// Cargar datos iniciales
inicializarDatos();
let datos = cargarDatos();
let telepizzeros = datos.telepizzeros;
let registros = datos.registros;
let ausencias = datos.ausencias;
let correoGerencia = datos.correoGerencia || "fichajetelepizza@outlook.es";

// Variables para geolocalización
let ubicacionActual = null;
let watchId = null;

// ============================================
// ELEMENTOS DEL DOM - NUEVA ORGANIZACIÓN
// ============================================

const selector = document.querySelector('.selector');
const telepizzeroSection = document.querySelector('.telepizzero-section');
const gerenciaSection = document.querySelector('.gerencia-section');
const registroSection = document.querySelector('.registro-section');

// Botones principales
const btnTelepizzero = document.getElementById('btnTelepizzero');
const btnGerencia = document.getElementById('btnGerencia');
const btnFichar = document.getElementById('btnFichar');
const btnAcceder = document.getElementById('btnAcceder');
const volverTelepizzero = document.getElementById('volverTelepizzero');
const volverGerencia = document.getElementById('volverGerencia');
const volverRegistro = document.getElementById('volverRegistro');

// Campos de fichaje
const dniInput = document.getElementById('dniInput');
const passwordInput = document.getElementById('passwordInput');
const mensajeTelepizzero = document.getElementById('mensajeTelepizzero');
const mensajeGerencia = document.getElementById('mensajeGerencia');
const tablaRegistros = document.querySelector('#tablaRegistros tbody');

// Elementos de geolocalización
const permisoGeolocalizacion = document.getElementById('permisoGeolocalizacion');
const contenidoFichaje = document.getElementById('contenidoFichaje');
const btnActivarGeolocalizacion = document.getElementById('btnActivarGeolocalizacion');
const loaderGeolocalizacion = document.getElementById('loaderGeolocalizacion');
const infoGeolocalizacion = document.getElementById('infoGeolocalizacion');
const estadoGeolocalizacion = document.getElementById('estadoGeolocalizacion');
const coordenadasElement = document.getElementById('coordenadas');
const direccionAproximada = document.getElementById('direccionAproximada');
const mapaContainer = document.getElementById('mapaContainer');

// Elementos de gestión de usuarios (nueva organización)
const btnAgregarUsuario = document.getElementById('btnAgregarUsuario');
const nuevoDni = document.getElementById('nuevoDni');
const nuevoNombre = document.getElementById('nuevoNombre');
const nuevoPuesto = document.getElementById('nuevoPuesto');
const listaUsuarios = document.getElementById('listaUsuarios');

// Elementos de control de ausencias
const selectUsuarioAusencia = document.getElementById('selectUsuarioAusencia');
const fechaAusencia = document.getElementById('fechaAusencia');
const tipoAusencia = document.getElementById('tipoAusencia');
const motivoAusencia = document.getElementById('motivoAusencia');
const btnRegistrarAusencia = document.getElementById('btnRegistrarAusencia');
const listaAusencias = document.getElementById('listaAusencias');

// Elementos de configuración de correo
const correoElectronico = document.getElementById('correoElectronico');
const btnGuardarCorreo = document.getElementById('btnGuardarCorreo');
const infoCorreoGuardado = document.getElementById('infoCorreoGuardado');
const mensajeCorreo = document.getElementById('mensajeCorreo');
const btnEnviarDiarioManual = document.getElementById('btnEnviarDiarioManual');
const btnEnviarSemanalManual = document.getElementById('btnEnviarSemanalManual');
const btnEnviarMensualManual = document.getElementById('btnEnviarMensualManual');
const btnEnviarReporteDiario = document.getElementById('btnEnviarReporteDiario');
const btnEnviarReporteSemanal = document.getElementById('btnEnviarReporteSemanal');
const btnEnviarReporteMensual = document.getElementById('btnEnviarReporteMensual');
const btnEnviarReporteSemanaSeleccionada = document.getElementById('btnEnviarReporteSemanaSeleccionada');

// Elementos de filtros
const filtroPuesto = document.getElementById('filtroPuesto');
const filtroVista = document.getElementById('filtroVista');
const filtroSemana = document.getElementById('filtroSemana');
const filtroDia = document.getElementById('filtroDia');
const filtroDesde = document.getElementById('filtroDesde');
const filtroHasta = document.getElementById('filtroHasta');
const selectorSemana = document.getElementById('selectorSemana');
const selectorDia = document.getElementById('selectorDia');
const selectorRango = document.getElementById('selectorRango');
const btnFiltrar = document.getElementById('btnFiltrar');
const btnResetFiltros = document.getElementById('btnResetFiltros');
const totalHoras = document.getElementById('totalHoras');

// Elementos de gestión semanal
const selectSemana = document.getElementById('selectSemana');
const selectPuestoSemana = document.getElementById('selectPuestoSemana');
const resumenSemanal = document.getElementById('resumenSemanal');
const tablaSemanal = document.querySelector('#tablaSemanal tbody');
const btnExportarSemanal = document.getElementById('btnExportarSemanal');

// Nueva navegación vertical
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

// ============================================
// EVENT LISTENERS
// ============================================

// Botones principales
btnTelepizzero.addEventListener('click', () => {
    selector.classList.remove('active');
    telepizzeroSection.classList.add('active');
    mostrarPermisoGeolocalizacion();
});

btnGerencia.addEventListener('click', () => {
    selector.classList.remove('active');
    gerenciaSection.classList.add('active');
    passwordInput.focus();
});

// Botones de fichaje
btnFichar.addEventListener('click', fichar);
btnAcceder.addEventListener('click', accederGerencia);

// Botones de volver
volverTelepizzero.addEventListener('click', () => {
    detenerGeolocalizacion();
    telepizzeroSection.classList.remove('active');
    selector.classList.add('active');
    resetearFichaje();
});

volverGerencia.addEventListener('click', () => {
    gerenciaSection.classList.remove('active');
    selector.classList.add('active');
    resetearAccesoGerencia();
});

volverRegistro.addEventListener('click', () => {
    registroSection.classList.remove('active');
    selector.classList.add('active');
});

// Gestión de usuarios
btnAgregarUsuario.addEventListener('click', agregarUsuario);

// Control de ausencias
btnRegistrarAusencia.addEventListener('click', registrarAusencia);

// Configuración de correo
btnGuardarCorreo.addEventListener('click', guardarCorreo);
btnEnviarDiarioManual.addEventListener('click', () => enviarReportePDF('diario'));
btnEnviarSemanalManual.addEventListener('click', () => enviarReportePDF('semanal'));
btnEnviarMensualManual.addEventListener('click', () => enviarReportePDF('mensual'));
btnEnviarReporteDiario.addEventListener('click', () => enviarReportePDF('diario'));
btnEnviarReporteSemanal.addEventListener('click', () => enviarReportePDF('semanal'));
btnEnviarReporteMensual.addEventListener('click', () => enviarReportePDF('mensual'));
btnEnviarReporteSemanaSeleccionada.addEventListener('click', () => enviarReportePDF('semana-seleccionada'));

// Filtros
btnFiltrar.addEventListener('click', aplicarFiltros);
btnResetFiltros.addEventListener('click', resetearFiltros);
filtroVista.addEventListener('change', cambiarVistaFiltro);

// Gestión semanal
btnExportarSemanal.addEventListener('click', exportarDatosParaGitHub);
selectSemana.addEventListener('change', cargarDatosSemana);
selectPuestoSemana.addEventListener('change', cargarDatosSemana);

// Nueva navegación vertical
navItems.forEach(nav => {
    nav.addEventListener('click', () => {
        const tabId = nav.getAttribute('data-tab');
        
        // Actualizar navegación
        navItems.forEach(item => item.classList.remove('active'));
        nav.classList.add('active');
        
        // Actualizar contenido de pestañas
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabId}-tab`).classList.add('active');
        
        // Acciones específicas por pestaña
        if (tabId === 'registros') {
            cargarRegistrosSemanaActual();
        } else if (tabId === 'usuarios') {
            cargarUsuarios();
        } else if (tabId === 'ausencias') {
            cargarAusencias();
            cargarSelectUsuarios();
        } else if (tabId === 'correo') {
            cargarCorreoGuardado();
        } else if (tabId === 'semanas') {
            cargarSemanasDisponibles();
        }
    });
});

// Geolocalización
btnActivarGeolocalizacion.addEventListener('click', iniciarGeolocalizacion);

// Validación de DNI
dniInput.addEventListener('input', validarDNI);
nuevoDni.addEventListener('input', validarDNI);

// Enter para enviar
dniInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fichar();
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') accederGerencia();
});

// ============================================
// FUNCIONES DE INTERFAZ
// ============================================

function mostrarPermisoGeolocalizacion() {
    permisoGeolocalizacion.style.display = 'block';
    contenidoFichaje.style.display = 'none';
    infoGeolocalizacion.style.display = 'none';
    mensajeTelepizzero.textContent = '';
    dniInput.value = '';
}

function resetearFichaje() {
    dniInput.value = '';
    mensajeTelepizzero.textContent = '';
    mostrarPermisoGeolocalizacion();
}

function resetearAccesoGerencia() {
    passwordInput.value = '';
    mensajeGerencia.textContent = '';
}

function validarDNI(e) {
    const input = e.target;
    input.value = input.value.replace(/\D/g, '');
    if (input.value.length > 8) {
        input.value = input.value.slice(0, 8);
    }
}

function cambiarVistaFiltro() {
    const vista = filtroVista.value;
    
    // Ocultar todos los selectores
    selectorSemana.style.display = 'none';
    selectorDia.style.display = 'none';
    selectorRango.style.display = 'none';
    
    // Mostrar el selector correspondiente
    if (vista === 'semana') {
        selectorSemana.style.display = 'flex';
        // Establecer semana actual por defecto
        const hoy = new Date();
        const año = hoy.getFullYear();
        const semana = obtenerNumeroSemana(hoy);
        const semanaFormato = `${año}-W${semana.toString().padStart(2, '0')}`;
        filtroSemana.value = semanaFormato;
    } else if (vista === 'dia') {
        selectorDia.style.display = 'flex';
        // Establecer día actual por defecto
        const hoy = new Date().toISOString().split('T')[0];
        filtroDia.value = hoy;
    } else if (vista === 'rango') {
        selectorRango.style.display = 'flex';
        // Establecer rango de la semana actual por defecto
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1); // Lunes
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6); // Domingo
        
        filtroDesde.value = inicioSemana.toISOString().split('T')[0];
        filtroHasta.value = finSemana.toISOString().split('T')[0];
    }
}

// ============================================
// FUNCIONES DE GEOLOCALIZACIÓN (SIN CAMBIOS)
// ============================================

function iniciarGeolocalizacion() {
    loaderGeolocalizacion.style.display = 'block';
    btnActivarGeolocalizacion.disabled = true;
    estadoGeolocalizacion.textContent = "Obteniendo ubicación...";
    
    if (!navigator.geolocation) {
        estadoGeolocalizacion.textContent = "Geolocalización no soportada";
        loaderGeolocalizacion.style.display = 'none';
        btnActivarGeolocalizacion.disabled = false;
        return;
    }
    
    const opciones = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };
    
    navigator.geolocation.getCurrentPosition(
        (posicion) => {
            // Éxito
            loaderGeolocalizacion.style.display = 'none';
            ubicacionActual = {
                latitud: posicion.coords.latitude,
                longitud: posicion.coords.longitude,
                precision: posicion.coords.accuracy
            };
            
            mostrarInformacionUbicacion();
            
            // Iniciar seguimiento
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    ubicacionActual = {
                        latitud: pos.coords.latitude,
                        longitud: pos.coords.longitude,
                        precision: pos.coords.accuracy
                    };
                    mostrarInformacionUbicacion();
                },
                (error) => console.error("Error en seguimiento:", error),
                opciones
            );
            
            // Mostrar contenido de fichaje
            permisoGeolocalizacion.style.display = 'none';
            contenidoFichaje.style.display = 'flex';
            infoGeolocalizacion.style.display = 'block';
            dniInput.focus();
        },
        (error) => {
            // Error
            loaderGeolocalizacion.style.display = 'none';
            btnActivarGeolocalizacion.disabled = false;
            
            let mensaje = "Error: ";
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    mensaje = "Permiso denegado. Activa la geolocalización en tu navegador.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    mensaje = "Ubicación no disponible.";
                    break;
                case error.TIMEOUT:
                    mensaje = "Tiempo de espera agotado.";
                    break;
                default:
                    mensaje = "Error desconocido.";
                    break;
            }
            
            estadoGeolocalizacion.textContent = mensaje;
            infoGeolocalizacion.style.display = 'block';
        },
        opciones
    );
}

function detenerGeolocalizacion() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    ubicacionActual = null;
}

function mostrarInformacionUbicacion() {
    if (!ubicacionActual) return;
    
    coordenadasElement.textContent = `Lat: ${ubicacionActual.latitud.toFixed(6)}, Lng: ${ubicacionActual.longitud.toFixed(6)}`;
    estadoGeolocalizacion.textContent = "✅ Ubicación obtenida";
    direccionAproximada.textContent = `Precisión: ±${Math.round(ubicacionActual.precision)}m`;
    
    // Mostrar mapa
    const { latitud, longitud } = ubicacionActual;
    const urlMapa = `https://maps.google.com/maps?q=${latitud},${longitud}&z=17&output=embed`;
    mapaContainer.innerHTML = `<iframe src="${urlMapa}" allowfullscreen title="Ubicación"></iframe>`;
}

// ============================================
// FUNCIÓN DE FICHAJE (SIN CAMBIOS)
// ============================================

function fichar() {
    // Validar ubicación
    if (!ubicacionActual) {
        mensajeTelepizzero.textContent = "❌ Primero activa la geolocalización";
        mensajeTelepizzero.style.borderLeftColor = '#FF5252';
        return;
    }
    
    const dni = dniInput.value.trim();
    
    // Validar DNI
    if (!dni || dni.length !== 8 || !/^\d{8}$/.test(dni)) {
        mensajeTelepizzero.textContent = "❌ DNI inválido (8 dígitos)";
        mensajeTelepizzero.style.borderLeftColor = '#FF5252';
        dniInput.focus();
        return;
    }
    
    // Buscar telepizzero
    const telepizzero = telepizzeros.find(t => t.dni === dni);
    if (!telepizzero) {
        mensajeTelepizzero.textContent = "❌ DNI no registrado";
        mensajeTelepizzero.style.borderLeftColor = '#FF5252';
        dniInput.focus();
        return;
    }
    
    const ahora = new Date();
    const fechaHoy = ahora.toISOString().split('T')[0];
    const horaActual = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    // Buscar registro activo (sin salida)
    const registroActivo = registros.find(r => 
        r.dni === dni && 
        !r.salida
    );
    
    if (registroActivo) {
        // Registrar salida (puede ser en fecha diferente)
        const fechaSalida = ahora.toISOString().split('T')[0];
        registroActivo.salida = horaActual;
        registroActivo.fechaSalida = fechaSalida;
        registroActivo.ubicacionSalida = { ...ubicacionActual };
        
        // Calcular horas trabajadas (soporta turnos cruzados)
        const horasTrabajadas = calcularHorasTrabajadas(
            registroActivo.fecha,
            registroActivo.entrada,
            fechaSalida,
            horaActual
        );
        
        registroActivo.horasTrabajadas = horasTrabajadas;
        registroActivo.horasTrabajadasTexto = convertirMinutosATexto(horasTrabajadas?.totalMinutos || 0);
        
        mensajeTelepizzero.textContent = `✅ Salida registrada a las ${horaActual}. ¡Hasta luego ${telepizzero.nombre}!`;
        mensajeTelepizzero.style.borderLeftColor = '#4CAF50';
    } else {
        // Registrar entrada
        registros.push({
            nombre: telepizzero.nombre,
            dni: telepizzero.dni,
            puesto: telepizzero.puesto,
            fecha: fechaHoy,
            entrada: horaActual,
            salida: null,
            fechaSalida: null,
            horasTrabajadas: null,
            horasTrabajadasTexto: null,
            ubicacionEntrada: { ...ubicacionActual },
            ubicacionSalida: null,
            semana: obtenerNumeroSemana(ahora),
            año: ahora.getFullYear()
        });
        
        mensajeTelepizzero.textContent = `✅ Entrada registrada a las ${horaActual}. ¡Bienvenido ${telepizzero.nombre}!`;
        mensajeTelepizzero.style.borderLeftColor = '#4CAF50';
    }
    
    // Guardar datos
    guardarDatos({ telepizzeros, registros, ausencias, correoGerencia, semanas: datos.semanas });
    
    // Limpiar campo
    dniInput.value = '';
    dniInput.focus();
}

// ============================================
// FUNCIONES DE GERENCIA ACTUALIZADAS
// ============================================

function accederGerencia() {
    if (passwordInput.value === "369") {
        gerenciaSection.classList.remove('active');
        registroSection.classList.add('active');
        cargarRegistrosSemanaActual();
        cargarUsuarios();
        cargarAusencias();
        cargarSelectUsuarios();
        cargarCorreoGuardado();
        cargarSemanasDisponibles();
        
        // Configurar vista por defecto
        cambiarVistaFiltro();
    } else {
        mensajeGerencia.textContent = "❌ Contraseña incorrecta";
        mensajeGerencia.style.borderLeftColor = '#FF5252';
        passwordInput.focus();
    }
}

function cargarRegistrosSemanaActual() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const semana = obtenerNumeroSemana(hoy);
    
    // Establecer filtros para semana actual
    filtroVista.value = 'semana';
    filtroSemana.value = `${año}-W${semana.toString().padStart(2, '0')}`;
    filtroPuesto.value = '';
    
    // Aplicar filtros
    aplicarFiltros();
}

function cargarRegistros(filtroPuestoValue = '', filtroSemanaValue = '', filtroDiaValue = '', filtroDesdeValue = '', filtroHastaValue = '') {
    tablaRegistros.innerHTML = '';
    
    let registrosFiltrados = [...registros];
    
    // Aplicar filtro de puesto
    if (filtroPuestoValue) {
        registrosFiltrados = registrosFiltrados.filter(r => r.puesto === filtroPuestoValue);
    }
    
    // Aplicar filtro de semana
    if (filtroSemanaValue) {
        const [año, semanaStr] = filtroSemanaValue.split('-W');
        const numeroSemana = parseInt(semanaStr);
        
        registrosFiltrados = registrosFiltrados.filter(registro => {
            const fecha = new Date(registro.fecha);
            const semanaRegistro = obtenerNumeroSemana(fecha);
            const añoRegistro = fecha.getFullYear();
            return semanaRegistro === numeroSemana && añoRegistro === parseInt(año);
        });
    }
    
    // Aplicar filtro de día
    if (filtroDiaValue) {
        registrosFiltrados = registrosFiltrados.filter(r => r.fecha === filtroDiaValue);
    }
    
    // Aplicar filtro de rango
    if (filtroDesdeValue && filtroHastaValue) {
        registrosFiltrados = registrosFiltrados.filter(r => {
            const fechaRegistro = new Date(r.fecha);
            const desde = new Date(filtroDesdeValue);
            const hasta = new Date(filtroHastaValue);
            hasta.setHours(23, 59, 59, 999);
            return fechaRegistro >= desde && fechaRegistro <= hasta;
        });
    }
    
    if (registrosFiltrados.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 8;
        celda.textContent = "No hay registros para los filtros seleccionados";
        celda.style.textAlign = "center";
        celda.style.padding = "30px";
        celda.style.color = "#FFC72C";
        fila.appendChild(celda);
        tablaRegistros.appendChild(fila);
        
        totalHoras.textContent = "Total horas: 0h 0m";
        return;
    }
    
    // Ordenar por fecha (más reciente primero)
    registrosFiltrados.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.entrada}`);
        const fechaB = new Date(`${b.fecha}T${b.entrada}`);
        return fechaB - fechaA;
    });
    
    let totalMinutos = 0;
    
    registrosFiltrados.forEach(registro => {
        const fila = document.createElement('tr');
        
        const horasTrabajadas = registro.horasTrabajadas;
        if (horasTrabajadas) {
            totalMinutos += horasTrabajadas.totalMinutos || 0;
        }
        
        const celdas = [
            registro.nombre,
            registro.dni,
            `<span class="puesto-badge ${obtenerClasePuesto(registro.puesto)}">${obtenerNombrePuesto(registro.puesto)}</span>`,
            registro.fecha,
            registro.entrada || "-",
            registro.salida || "-",
            registro.horasTrabajadasTexto || "-",
            registro.ubicacionEntrada ? 
                `<a href="https://maps.google.com/?q=${registro.ubicacionEntrada.latitud},${registro.ubicacionEntrada.longitud}" target="_blank" style="color: #FFC72C; text-decoration: none;" title="Ver ubicación en mapa">📍</a>` : 
                "-"
        ];
        
        celdas.forEach(texto => {
            const celda = document.createElement('td');
            celda.innerHTML = texto;
            fila.appendChild(celda);
        });
        
        tablaRegistros.appendChild(fila);
    });
    
    totalHoras.textContent = `Total horas trabajadas: ${convertirMinutosATexto(totalMinutos)}`;
}

function aplicarFiltros() {
    const puesto = filtroPuesto.value;
    const vista = filtroVista.value;
    
    if (vista === 'semana') {
        const semana = filtroSemana.value;
        cargarRegistros(puesto, semana, '', '', '');
    } else if (vista === 'dia') {
        const dia = filtroDia.value;
        cargarRegistros(puesto, '', dia, '', '');
    } else if (vista === 'rango') {
        const desde = filtroDesde.value;
        const hasta = filtroHasta.value;
        cargarRegistros(puesto, '', '', desde, hasta);
    }
}

function resetearFiltros() {
    filtroPuesto.value = '';
    filtroVista.value = 'semana';
    cambiarVistaFiltro();
    cargarRegistrosSemanaActual();
}

// ============================================
// GESTIÓN DE USUARIOS - NUEVO DISEÑO HORIZONTAL
// ============================================

function agregarUsuario() {
    const dni = nuevoDni.value.trim();
    const nombre = nuevoNombre.value.trim().toUpperCase();
    const puesto = nuevoPuesto.value;
    
    if (!dni || dni.length !== 8 || !/^\d{8}$/.test(dni)) {
        alert("DNI debe tener 8 dígitos numéricos");
        nuevoDni.focus();
        return;
    }
    
    if (!nombre) {
        alert("Ingresa el nombre");
        nuevoNombre.focus();
        return;
    }
    
    if (!puesto) {
        alert("Selecciona un puesto");
        nuevoPuesto.focus();
        return;
    }
    
    if (telepizzeros.some(u => u.dni === dni)) {
        alert("Ya existe un telepizzero con ese DNI");
        nuevoDni.focus();
        return;
    }
    
    telepizzeros.push({ dni, nombre, puesto });
    guardarDatos({ telepizzeros, registros, ausencias, correoGerencia, semanas: datos.semanas });
    
    cargarUsuarios();
    cargarSelectUsuarios();
    
    nuevoDni.value = '';
    nuevoNombre.value = '';
    nuevoPuesto.value = 'auxiliar';
    nuevoDni.focus();
    
    alert(`✅ ${nombre} agregado correctamente como ${obtenerNombrePuesto(puesto)}`);
}

function cargarUsuarios() {
    listaUsuarios.innerHTML = '';
    
    if (telepizzeros.length === 0) {
        listaUsuarios.innerHTML = `
            <div class="usuario-vacio">
                <i class="fas fa-user-plus fa-2x"></i>
                <p>No hay usuarios registrados</p>
                <p class="texto-pequeno">Agrega el primer telepizzero</p>
            </div>
        `;
        return;
    }
    
    telepizzeros.forEach(usuario => {
        const registrosUsuario = registros.filter(r => r.dni === usuario.dni).length;
        const iniciales = usuario.nombre.split(' ').map(n => n[0]).join('').substring(0, 2);
        
        const card = document.createElement('div');
        card.className = 'usuario-card';
        
        card.innerHTML = `
            <div class="usuario-header">
                <div class="usuario-avatar">${iniciales}</div>
                <div class="usuario-info">
                    <h4>${usuario.nombre}</h4>
                    <div class="usuario-dni">${usuario.dni}</div>
                </div>
            </div>
            
            <div class="usuario-puesto ${obtenerClasePuesto(usuario.puesto)}">
                ${obtenerNombrePuesto(usuario.puesto)}
            </div>
            
            <div class="usuario-stats">
                <span><i class="fas fa-clipboard-list"></i> ${registrosUsuario} registros</span>
            </div>
            
            <div class="usuario-acciones">
                <button class="btn btn-danger btn-small btn-eliminar-usuario" data-dni="${usuario.dni}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        
        listaUsuarios.appendChild(card);
    });
    
    // Event listeners para eliminar
    document.querySelectorAll('.btn-eliminar-usuario').forEach(btn => {
        btn.addEventListener('click', function() {
            const dni = this.getAttribute('data-dni');
            eliminarUsuario(dni);
        });
    });
}

function eliminarUsuario(dni) {
    if (!confirm("¿Eliminar este telepizzero? Se eliminarán también sus registros.")) return;
    
    const nombre = telepizzeros.find(u => u.dni === dni)?.nombre;
    
    telepizzeros = telepizzeros.filter(u => u.dni !== dni);
    registros = registros.filter(r => r.dni !== dni);
    ausencias = ausencias.filter(a => a.dni !== dni);
    
    guardarDatos({ telepizzeros, registros, ausencias, correoGerencia, semanas: datos.semanas });
    
    cargarUsuarios();
    cargarSelectUsuarios();
    cargarRegistrosSemanaActual();
    cargarAusencias();
    
    alert(`✅ ${nombre} eliminado`);
}

function cargarSelectUsuarios() {
    selectUsuarioAusencia.innerHTML = '<option value="">Seleccionar telepizzero</option>';
    
    telepizzeros.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.dni;
        option.textContent = `${usuario.nombre} (${usuario.dni}) - ${obtenerNombrePuesto(usuario.puesto)}`;
        selectUsuarioAusencia.appendChild(option);
    });
}

// ============================================
// CONTROL DE AUSENCIAS
// ============================================

function registrarAusencia() {
    const dni = selectUsuarioAusencia.value;
    const fecha = fechaAusencia.value;
    const tipo = tipoAusencia.value;
    const motivo = motivoAusencia.value.trim();
    
    if (!dni || !fecha) {
        alert("Completa los campos obligatorios");
        return;
    }
    
    const usuario = telepizzeros.find(u => u.dni === dni);
    if (!usuario) {
        alert("Usuario no encontrado");
        return;
    }
    
    ausencias.push({
        dni,
        nombre: usuario.nombre,
        puesto: usuario.puesto,
        fecha,
        tipo,
        motivo: motivo || "No especificado",
        fechaRegistro: new Date().toLocaleString('es-ES')
    });
    
    guardarDatos({ telepizzeros, registros, ausencias, correoGerencia, semanas: datos.semanas });
    cargarAusencias();
    
    motivoAusencia.value = '';
    alert(`✅ Incidencia registrada para ${usuario.nombre}`);
}

function cargarAusencias() {
    listaAusencias.innerHTML = '';
    
    if (ausencias.length === 0) {
        listaAusencias.innerHTML = '<p style="text-align: center; color: #FFC72C;">No hay incidencias registradas</p>';
        return;
    }
    
    // Ordenar por fecha (más reciente primero)
    const ordenadas = [...ausencias].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    ordenadas.forEach(ausencia => {
        const item = document.createElement('div');
        item.className = `ausencia-item`;
        
        let tipoTexto = '';
        let icono = '';
        switch(ausencia.tipo) {
            case 'falta': 
                tipoTexto = 'Falta';
                icono = '❌';
                break;
            case 'ausencia_justificada': 
                tipoTexto = 'Ausencia Justificada';
                icono = '⚠️';
                break;
            case 'retraso': 
                tipoTexto = 'Retraso';
                icono = '⏰';
                break;
        }
        
        item.innerHTML = `
            <div class="ausencia-info">
                <h4>${ausencia.nombre}</h4>
                <div class="ausencia-detalles">
                    <span><i class="fas fa-calendar-day"></i> ${ausencia.fecha}</span>
                    <span>${icono} ${tipoTexto}</span>
                    <span><i class="fas fa-comment"></i> ${ausencia.motivo}</span>
                </div>
            </div>
            <button class="btn btn-danger btn-small btn-eliminar-ausencia" data-id="${ausencia.dni}-${ausencia.fecha}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        listaAusencias.appendChild(item);
    });
    
    // Event listeners para eliminar
    document.querySelectorAll('.btn-eliminar-ausencia').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const [dni, fecha] = id.split('-');
            eliminarAusencia(dni, fecha);
        });
    });
}

function eliminarAusencia(dni, fecha) {
    if (!confirm("¿Eliminar esta incidencia?")) return;
    
    ausencias = ausencias.filter(a => !(a.dni === dni && a.fecha === fecha));
    guardarDatos({ telepizzeros, registros, ausencias, correoGerencia, semanas: datos.semanas });
    cargarAusencias();
    alert("✅ Incidencia eliminada");
}

// ============================================
// CONFIGURACIÓN DE CORREO
// ============================================

function guardarCorreo() {
    const correo = correoElectronico.value.trim();
    
    if (!correo || !correo.includes('@') || !correo.includes('.')) {
        alert("Correo electrónico inválido");
        correoElectronico.focus();
        return;
    }
    
    correoGerencia = correo;
    guardarDatos({ telepizzeros, registros, ausencias, correoGerencia, semanas: datos.semanas });
    cargarCorreoGuardado();
    
    mensajeCorreo.textContent = `✅ Correo ${correo} guardado`;
    mensajeCorreo.style.borderLeftColor = '#4CAF50';
    setTimeout(() => mensajeCorreo.textContent = '', 3000);
}

function cargarCorreoGuardado() {
    if (correoGerencia) {
        infoCorreoGuardado.innerHTML = `
            <h3><i class="fas fa-check-circle" style="color: #4CAF50;"></i> Correo Configurado</h3>
            <p style="margin: 10px 0;"><strong>📧 ${correoGerencia}</strong></p>
            <p style="font-size: 0.9rem; color: #FFC72C;">
                <i class="fas fa-info-circle"></i> Los reportes PDF se enviarán a este correo
            </p>
            <button class="btn btn-danger btn-small" id="btnEliminarCorreo" style="margin-top: 10px;">
                <i class="fas fa-trash"></i> Eliminar Correo
            </button>
        `;
        
        document.getElementById('btnEliminarCorreo').addEventListener('click', eliminarCorreo);
    } else {
        infoCorreoGuardado.innerHTML = `
            <h3><i class="fas fa-envelope"></i> Sin correo configurado</h3>
            <p style="margin: 10px 0;">Configure un correo para recibir reportes PDF</p>
            <p style="font-size: 0.9rem; color: #FFC72C;">
                <i class="fas fa-info-circle"></i> Correo por defecto: fichajetelepizza@outlook.es
            </p>
        `;
    }
}

function eliminarCorreo() {
    if (!confirm("¿Restablecer al correo por defecto?")) return;
    
    correoGerencia = "fichajetelepizza@outlook.es";
    guardarDatos({ telepizzeros, registros, ausencias, correoGerencia, semanas: datos.semanas });
    cargarCorreoGuardado();
    correoElectronico.value = correoGerencia;
    mensajeCorreo.textContent = "✅ Correo restablecido al valor por defecto";
    mensajeCorreo.style.borderLeftColor = '#4CAF50';
    setTimeout(() => mensajeCorreo.textContent = '', 3000);
}

// ============================================
// FUNCIONES PARA ENVIAR REPORTES EN PDF
// ============================================

async function enviarReportePDF(tipo) {
    if (!correoGerencia) {
        alert("Primero configure un correo electrónico");
        return;
    }
    
    mensajeCorreo.textContent = `⏳ Generando reporte ${tipo} en PDF...`;
    mensajeCorreo.style.borderLeftColor = '#FFC72C';
    
    try {
        let datosReporte;
        let titulo = '';
        
        if (tipo === 'diario') {
            const hoy = new Date();
            const fechaHoy = hoy.toISOString().split('T')[0];
            const registrosHoy = registros.filter(r => r.fecha === fechaHoy);
            const ausenciasHoy = ausencias.filter(a => a.fecha === fechaHoy);
            
            datosReporte = {
                tipo: 'diario',
                fecha: fechaHoy,
                titulo: `Reporte Diario - ${fechaHoy}`,
                totalTelepizzeros: telepizzeros.length,
                registros: registrosHoy,
                ausencias: ausenciasHoy
            };
            titulo = `Reporte Diario ${fechaHoy}`;
            
        } else if (tipo === 'semanal') {
            const hoy = new Date();
            const numeroSemana = obtenerNumeroSemana(hoy);
            const año = hoy.getFullYear();
            datosReporte = generarResumenSemanal(numeroSemana, año);
            datosReporte.titulo = `Reporte Semanal - Semana ${numeroSemana} ${año}`;
            titulo = `Reporte Semanal ${numeroSemana}-${año}`;
            
        } else if (tipo === 'semana-seleccionada') {
            const semanaSeleccionada = selectSemana.value;
            if (!semanaSeleccionada) {
                alert("Selecciona una semana");
                return;
            }
            
            const [año, semanaStr] = semanaSeleccionada.split('-');
            const numeroSemana = parseInt(semanaStr);
            datosReporte = generarResumenSemanal(numeroSemana, parseInt(año));
            datosReporte.titulo = `Reporte Semanal - Semana ${numeroSemana} ${año}`;
            titulo = `Reporte Semanal ${numeroSemana}-${año}`;
            
        } else if (tipo === 'mensual') {
            const hoy = new Date();
            const mesActual = hoy.getMonth() + 1;
            const añoActual = hoy.getFullYear();
            const nombreMes = hoy.toLocaleDateString('es-ES', { month: 'long' });
            
            const registrosMes = registros.filter(r => {
                const fecha = new Date(r.fecha);
                return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === añoActual;
            });
            
            const ausenciasMes = ausencias.filter(a => {
                const fecha = new Date(a.fecha);
                return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === añoActual;
            });
            
            datosReporte = {
                tipo: 'mensual',
                mes: mesActual,
                año: añoActual,
                titulo: `Reporte Mensual - ${nombreMes} ${añoActual}`,
                totalTelepizzeros: telepizzeros.length,
                registros: registrosMes,
                ausencias: ausenciasMes
            };
            titulo = `Reporte Mensual ${mesActual}-${añoActual}`;
        }
        
        // Generar PDF
        const pdfBlob = await generarPDF(datosReporte);
        
        // Enviar por correo
        const resultado = await enviarPDFPorCorreo(titulo, pdfBlob, correoGerencia);
        
        if (resultado.success) {
            mensajeCorreo.textContent = `✅ Reporte ${tipo} en PDF enviado a ${correoGerencia}`;
            mensajeCorreo.style.borderLeftColor = '#4CAF50';
        } else {
            mensajeCorreo.textContent = `❌ Error al enviar: ${resultado.error}`;
            mensajeCorreo.style.borderLeftColor = '#FF5252';
        }
        
        setTimeout(() => mensajeCorreo.textContent = '', 5000);
        
    } catch (error) {
        mensajeCorreo.textContent = `❌ Error: ${error.message}`;
        mensajeCorreo.style.borderLeftColor = '#FF5252';
        setTimeout(() => mensajeCorreo.textContent = '', 5000);
    }
}

async function generarPDF(datos) {
    return new Promise((resolve) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configuración del documento
        doc.setFontSize(20);
        doc.setTextColor(212, 0, 28); // Color Telepizza
        doc.text("Telepizza - Gestión de Jornadas", 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(datos.titulo, 105, 35, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 105, 45, { align: 'center' });
        
        // Información general
        let yPos = 60;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Resumen General:", 14, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.text(`• Total empleados: ${datos.totalTelepizzeros || datos.totalEmpleados || 0}`, 20, yPos);
        yPos += 7;
        
        if (datos.totalRegistros !== undefined) {
            doc.text(`• Total registros: ${datos.totalRegistros}`, 20, yPos);
            yPos += 7;
        }
        
        if (datos.totalHorasTexto) {
            doc.text(`• Total horas trabajadas: ${datos.totalHorasTexto}`, 20, yPos);
            yPos += 7;
        }
        
        if (datos.totalAusencias !== undefined) {
            doc.text(`• Total ausencias: ${datos.totalAusencias}`, 20, yPos);
            yPos += 7;
        }
        
        yPos += 5;
        
        // Tabla de registros si existen
        if (datos.registros && datos.registros.length > 0) {
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text("Registros de Jornadas:", 14, yPos);
            yPos += 10;
            
            const headers = [['Nombre', 'DNI', 'Fecha', 'Entrada', 'Salida', 'Horas']];
            const rows = datos.registros.map(reg => [
                reg.nombre,
                reg.dni,
                reg.fecha,
                reg.entrada || '-',
                reg.salida || '-',
                reg.horasTrabajadasTexto || '-'
            ]);
            
            doc.autoTable({
                startY: yPos,
                head: headers,
                body: rows,
                theme: 'grid',
                headStyles: { fillColor: [212, 0, 28] },
                styles: { fontSize: 8 },
                margin: { left: 14, right: 14 }
            });
            
            yPos = doc.lastAutoTable.finalY + 10;
        }
        
        // Tabla de ausencias si existen
        if (datos.ausencias && datos.ausencias.length > 0) {
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text("Incidencias y Ausencias:", 14, yPos);
            yPos += 10;
            
            const headers = [['Nombre', 'Fecha', 'Tipo', 'Motivo']];
            const rows = datos.ausencias.map(aus => [
                aus.nombre,
                aus.fecha,
                aus.tipo === 'falta' ? 'Falta' : 
                aus.tipo === 'ausencia_justificada' ? 'Ausencia Justificada' : 'Retraso',
                aus.motivo || '-'
            ]);
            
            doc.autoTable({
                startY: yPos,
                head: headers,
                body: rows,
                theme: 'grid',
                headStyles: { fillColor: [255, 152, 0] },
                styles: { fontSize: 8 },
                margin: { left: 14, right: 14 }
            });
        }
        
        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: 'center' });
            doc.text("Sistema de Gestión de Jornadas Telepizza", 105, 290, { align: 'center' });
        }
        
        // Convertir a Blob
        const pdfBlob = doc.output('blob');
        resolve(pdfBlob);
    });
}

// ============================================
// GESTIÓN SEMANAL
// ============================================

function cargarSemanasDisponibles() {
    const semanas = obtenerSemanasDisponibles();
    selectSemana.innerHTML = '<option value="">Selecciona una semana</option>';
    
    semanas.forEach(semana => {
        const [año, numeroSemana] = semana.split('-');
        const option = document.createElement('option');
        option.value = semana;
        option.textContent = `Semana ${numeroSemana} del ${año}`;
        selectSemana.appendChild(option);
    });
    
    if (semanas.length > 0) {
        selectSemana.value = semanas[0];
        cargarDatosSemana();
    }
}

function cargarDatosSemana() {
    const semanaSeleccionada = selectSemana.value;
    if (!semanaSeleccionada) return;
    
    const [año, numeroSemana] = semanaSeleccionada.split('-').map(Number);
    const filtroPuesto = selectPuestoSemana.value;
    const resumen = generarResumenSemanal(numeroSemana, año);
    
    // Mostrar resumen
    resumenSemanal.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; min-width: 150px;">
                <h4 style="color: #FFC72C; margin-bottom: 8px;"><i class="fas fa-clock"></i> Total Horas</h4>
                <p style="font-size: 1.5rem; color: white;">${resumen.totalHorasTexto}</p>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; min-width: 150px;">
                <h4 style="color: #FFC72C; margin-bottom: 8px;"><i class="fas fa-users"></i> Empleados</h4>
                <p style="font-size: 1.5rem; color: white;">${resumen.totalEmpleados}</p>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; min-width: 150px;">
                <h4 style="color: #FFC72C; margin-bottom: 8px;"><i class="fas fa-clipboard-list"></i> Registros</h4>
                <p style="font-size: 1.5rem; color: white;">${resumen.totalRegistros}</p>
            </div>
        </div>
        
        ${Object.keys(resumen.porPuesto).length > 0 ? `
        <div style="margin-top: 25px;">
            <h4 style="color: #FFC72C; text-align: center; margin-bottom: 15px;">
                <i class="fas fa-chart-pie"></i> Distribución por Puesto
            </h4>
            <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
                ${Object.keys(resumen.porPuesto).map(puesto => `
                    <div style="background: rgba(255,255,255,0.15); padding: 12px 20px; border-radius: 10px; min-width: 180px;">
                        <div style="font-weight: 700; color: white; margin-bottom: 5px;">
                            ${obtenerNombrePuesto(puesto)}
                        </div>
                        <div style="color: #FFC72C; font-size: 0.9rem;">
                            <i class="fas fa-users"></i> ${resumen.porPuesto[puesto].totalEmpleados} empleados
                        </div>
                        <div style="color: #4CAF50; font-weight: 600; margin-top: 5px;">
                            ${resumen.porPuesto[puesto].totalHorasTexto}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
    
    // Mostrar tabla de empleados
    tablaSemanal.innerHTML = '';
    
    let empleadosFiltrados = Object.values(resumen.empleados);
    if (filtroPuesto) {
        empleadosFiltrados = empleadosFiltrados.filter(e => e.puesto === filtroPuesto);
    }
    
    if (empleadosFiltrados.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 5;
        celda.textContent = "No hay datos para esta semana";
        celda.style.textAlign = "center";
        celda.style.padding = "30px";
        celda.style.color = "#FFC72C";
        fila.appendChild(celda);
        tablaSemanal.appendChild(fila);
        return;
    }
    
    empleadosFiltrados.forEach(empleado => {
        const fila = document.createElement('tr');
        
        const celdas = [
            empleado.nombre,
            `<span class="puesto-badge ${obtenerClasePuesto(empleado.puesto)}">${obtenerNombrePuesto(empleado.puesto)}</span>`,
            empleado.totalHorasTexto,
            empleado.diasTrabajados,
            empleado.promedioDiario
        ];
        
        celdas.forEach(texto => {
            const celda = document.createElement('td');
            celda.innerHTML = texto;
            fila.appendChild(celda);
        });
        
        tablaSemanal.appendChild(fila);
    });
}

// ============================================
// INICIALIZAR APLICACIÓN
// ============================================

function init() {
    // Establecer valores por defecto
    const hoy = new Date();
    
    // Configurar fecha de ausencia
    fechaAusencia.value = hoy.toISOString().split('T')[0];
    
    // Configurar correo por defecto
    if (!correoGerencia) {
        correoGerencia = "fichajetelepizza@outlook.es";
        guardarDatos({ telepizzeros, registros, ausencias, correoGerencia, semanas: datos.semanas });
    }
    correoElectronico.value = correoGerencia;
    
    // Cargar correo guardado
    cargarCorreoGuardado();
    
    console.log("✅ Sistema inicializado correctamente");
    console.log("📧 Correo configurado:", correoGerencia);
    console.log("📄 jsPDF cargado:", typeof window.jspdf !== 'undefined');
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', init);