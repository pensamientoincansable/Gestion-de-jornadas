// ============================================
// INICIALIZACIÓN
// ============================================

// Cargar datos iniciales
inicializarDatos();
let datos = cargarDatos();
let telepizzeros = datos.telepizzeros;
let registros = datos.registros;
let ausencias = datos.ausencias;
let correoGerencia = datos.correoGerencia;

// Variables para geolocalización
let ubicacionActual = null;
let watchId = null;

// ============================================
// ELEMENTOS DEL DOM
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

// Elementos de gestión de usuarios
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
const filtroFecha = document.getElementById('filtroFecha');
const btnFiltrar = document.getElementById('btnFiltrar');
const btnResetFiltros = document.getElementById('btnResetFiltros');
const totalHoras = document.getElementById('totalHoras');

// Elementos de gestión semanal
const selectSemana = document.getElementById('selectSemana');
const selectPuestoSemana = document.getElementById('selectPuestoSemana');
const resumenSemanal = document.getElementById('resumenSemanal');
const tablaSemanal = document.querySelector('#tablaSemanal tbody');
const btnExportarSemanal = document.getElementById('btnExportarSemanal');

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
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
btnEnviarDiarioManual.addEventListener('click', () => enviarReporte('diario'));
btnEnviarSemanalManual.addEventListener('click', () => enviarReporte('semanal'));
btnEnviarMensualManual.addEventListener('click', () => enviarReporte('mensual'));
btnEnviarReporteDiario.addEventListener('click', () => enviarReporte('diario'));
btnEnviarReporteSemanal.addEventListener('click', () => enviarReporte('semanal'));
btnEnviarReporteMensual.addEventListener('click', () => enviarReporte('mensual'));
btnEnviarReporteSemanaSeleccionada.addEventListener('click', () => enviarReporteSemanaSeleccionada());

// Filtros
btnFiltrar.addEventListener('click', aplicarFiltros);
btnResetFiltros.addEventListener('click', resetearFiltros);

// Gestión semanal
btnExportarSemanal.addEventListener('click', exportarDatosParaGitHub);
selectSemana.addEventListener('change', cargarDatosSemana);
selectPuestoSemana.addEventListener('change', cargarDatosSemana);

// Tabs
tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Actualizar botones de pestaña
        tabBtns.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Actualizar contenido de pestañas
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabId}-tab`).classList.add('active');
        
        // Si es la pestaña de semanas, cargar semanas
        if (tabId === 'semanas') {
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

// ============================================
// FUNCIONES DE GEOLOCALIZACIÓN
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
// FUNCIÓN DE FICHAJE CORREGIDA (SIN SELECCIÓN DE PUESTO)
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
            puesto: telepizzero.puesto, // Tomar puesto del registro del empleado
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
// FUNCIONES DE GERENCIA
// ============================================

function accederGerencia() {
    if (passwordInput.value === "369") {
        gerenciaSection.classList.remove('active');
        registroSection.classList.add('active');
        cargarRegistros();
        cargarUsuarios();
        cargarAusencias();
        cargarSelectUsuarios();
        cargarCorreoGuardado();
        cargarSemanasDisponibles();
    } else {
        mensajeGerencia.textContent = "❌ Contraseña incorrecta";
        mensajeGerencia.style.borderLeftColor = '#FF5252';
        passwordInput.focus();
    }
}

function cargarRegistros(filtroPuestoValue = '', filtroFechaValue = '') {
    tablaRegistros.innerHTML = '';
    
    let registrosFiltrados = [...registros];
    
    // Aplicar filtros
    if (filtroPuestoValue) {
        registrosFiltrados = registrosFiltrados.filter(r => r.puesto === filtroPuestoValue);
    }
    
    if (filtroFechaValue) {
        registrosFiltrados = registrosFiltrados.filter(r => r.fecha === filtroFechaValue);
    }
    
    if (registrosFiltrados.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 8;
        celda.textContent = "No hay registros";
        celda.style.textAlign = "center";
        celda.style.padding = "40px";
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
                `<a href="https://maps.google.com/?q=${registro.ubicacionEntrada.latitud},${registro.ubicacionEntrada.longitud}" target="_blank" style="color: #FFC72C;">📍</a>` : 
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
    const fecha = filtroFecha.value;
    cargarRegistros(puesto, fecha);
}

function resetearFiltros() {
    filtroPuesto.value = '';
    filtroFecha.value = '';
    cargarRegistros();
}

// ============================================
// GESTIÓN DE USUARIOS
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
        listaUsuarios.innerHTML = '<p style="text-align: center;">No hay usuarios</p>';
        return;
    }
    
    telepizzeros.forEach(usuario => {
        const item = document.createElement('div');
        item.className = 'usuario-item';
        
        const registrosUsuario = registros.filter(r => r.dni === usuario.dni).length;
        
        item.innerHTML = `
            <div>
                <strong>${usuario.nombre}</strong>
                <div>DNI: ${usuario.dni}</div>
                <div><span class="puesto-badge ${obtenerClasePuesto(usuario.puesto)}">${obtenerNombrePuesto(usuario.puesto)}</span></div>
                <div style="font-size: 0.9rem; color: #FFC72C;">Registros: ${registrosUsuario}</div>
            </div>
            <button class="btn btn-danger btn-small" data-dni="${usuario.dni}">Eliminar</button>
        `;
        
        listaUsuarios.appendChild(item);
    });
    
    // Event listeners para eliminar
    document.querySelectorAll('[data-dni]').forEach(btn => {
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
    cargarRegistros();
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
        listaAusencias.innerHTML = '<p style="text-align: center;">No hay incidencias</p>';
        return;
    }
    
    // Ordenar por fecha
    const ordenadas = [...ausencias].sort((a, b) => a.fecha < b.fecha ? 1 : -1);
    
    ordenadas.forEach(ausencia => {
        const item = document.createElement('div');
        item.className = `ausencia-item ${ausencia.tipo === 'falta' ? 'ausencia-marcada' : ''}`;
        
        let tipoTexto = '';
        switch(ausencia.tipo) {
            case 'falta': tipoTexto = '❌ Falta'; break;
            case 'ausencia_justificada': tipoTexto = '⚠️ Ausencia Justificada'; break;
            case 'retraso': tipoTexto = '⏰ Retraso'; break;
        }
        
        item.innerHTML = `
            <div>
                <strong>${ausencia.nombre}</strong> 
                <span class="puesto-badge ${obtenerClasePuesto(ausencia.puesto)}">${obtenerNombrePuesto(ausencia.puesto)}</span>
                <div>📅 ${ausencia.fecha} - ${tipoTexto}</div>
                <div>📝 ${ausencia.motivo}</div>
                <div><small>🕐 ${ausencia.fechaRegistro}</small></div>
            </div>
            <button class="btn btn-danger btn-small" data-id="${ausencia.dni}-${ausencia.fecha}">🗑️</button>
        `;
        
        listaAusencias.appendChild(item);
    });
    
    // Event listeners para eliminar
    document.querySelectorAll('[data-id]').forEach(btn => {
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
    
    correoElectronico.value = '';
    mensajeCorreo.textContent = `✅ Correo ${correo} guardado`;
    setTimeout(() => mensajeCorreo.textContent = '', 3000);
}

function cargarCorreoGuardado() {
    if (correoGerencia) {
        infoCorreoGuardado.innerHTML = `
            <h3>✅ Correo Vinculado</h3>
            <p><strong>📧 ${correoGerencia}</strong></p>
            <p><small>Template ID: template_g60lzrr</small></p>
            <button class="btn btn-danger btn-small" id="btnEliminarCorreo">Eliminar</button>
        `;
        
        document.getElementById('btnEliminarCorreo').addEventListener('click', eliminarCorreo);
    } else {
        infoCorreoGuardado.innerHTML = `
            <h3>📧 Sin correo vinculado</h3>
            <p>Vincule un correo para recibir reportes</p>
            <p><small>Template ID: template_g60lzrr</small></p>
        `;
    }
}

function eliminarCorreo() {
    if (!confirm("¿Eliminar el correo vinculado?")) return;
    
    correoGerencia = null;
    guardarDatos({ telepizzeros, registros, ausencias, correoGerencia, semanas: datos.semanas });
    cargarCorreoGuardado();
    mensajeCorreo.textContent = "✅ Correo eliminado";
    setTimeout(() => mensajeCorreo.textContent = '', 3000);
}

async function enviarReporte(tipo) {
    if (!correoGerencia) {
        alert("Primero vincule un correo electrónico");
        return;
    }
    
    mensajeCorreo.textContent = `⏳ Enviando reporte ${tipo} a ${correoGerencia}...`;
    
    try {
        let datosReporte;
        
        if (tipo === 'diario') {
            const hoy = new Date();
            const fechaHoy = hoy.toISOString().split('T')[0];
            const registrosHoy = registros.filter(r => r.fecha === fechaHoy);
            const ausenciasHoy = ausencias.filter(a => a.fecha === fechaHoy);
            
            datosReporte = {
                tipo: 'diario',
                fecha: fechaHoy,
                totalTelepizzeros: telepizzeros.length,
                registros: registrosHoy,
                ausencias: ausenciasHoy
            };
        } else if (tipo === 'semanal') {
            const hoy = new Date();
            const numeroSemana = obtenerNumeroSemana(hoy);
            const año = hoy.getFullYear();
            datosReporte = generarResumenSemanal(numeroSemana, año);
        } else {
            const hoy = new Date();
            const mesActual = hoy.getMonth() + 1;
            const añoActual = hoy.getFullYear();
            
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
                totalTelepizzeros: telepizzeros.length,
                registros: registrosMes,
                ausencias: ausenciasMes
            };
        }
        
        const resultado = await enviarReportePorCorreo(tipo, datosReporte, correoGerencia);
        
        if (resultado.success) {
            mensajeCorreo.textContent = `✅ Reporte ${tipo} enviado a ${correoGerencia}`;
        } else {
            mensajeCorreo.textContent = `❌ Error al enviar: ${resultado.error}`;
        }
        
        setTimeout(() => mensajeCorreo.textContent = '', 5000);
        
    } catch (error) {
        mensajeCorreo.textContent = `❌ Error: ${error.message}`;
        setTimeout(() => mensajeCorreo.textContent = '', 5000);
    }
}

async function enviarReporteSemanaSeleccionada() {
    if (!correoGerencia) {
        alert("Primero vincule un correo electrónico");
        return;
    }
    
    const semanaSeleccionada = selectSemana.value;
    if (!semanaSeleccionada) {
        alert("Selecciona una semana");
        return;
    }
    
    const [año, numeroSemana] = semanaSeleccionada.split('-').map(Number);
    const datosSemana = generarResumenSemanal(numeroSemana, año);
    
    mensajeCorreo.textContent = `⏳ Enviando reporte de la semana ${numeroSemana}...`;
    
    try {
        const resultado = await enviarReportePorCorreo('semanal', datosSemana, correoGerencia);
        
        if (resultado.success) {
            mensajeCorreo.textContent = `✅ Reporte semanal enviado a ${correoGerencia}`;
        } else {
            mensajeCorreo.textContent = `❌ Error al enviar: ${resultado.error}`;
        }
        
        setTimeout(() => mensajeCorreo.textContent = '', 5000);
        
    } catch (error) {
        mensajeCorreo.textContent = `❌ Error: ${error.message}`;
        setTimeout(() => mensajeCorreo.textContent = '', 5000);
    }
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
        <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px;">
            <div>
                <h4>📊 Total Horas</h4>
                <p style="font-size: 1.5rem; color: #FFC72C;">${resumen.totalHorasTexto}</p>
            </div>
            <div>
                <h4>👥 Empleados</h4>
                <p style="font-size: 1.5rem; color: #FFC72C;">${resumen.totalEmpleados}</p>
            </div>
            <div>
                <h4>📋 Registros</h4>
                <p style="font-size: 1.5rem; color: #FFC72C;">${resumen.totalRegistros}</p>
            </div>
        </div>
        
        ${Object.keys(resumen.porPuesto).length > 0 ? `
        <div style="margin-top: 20px;">
            <h4>🏷️ Por Puesto</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                ${Object.keys(resumen.porPuesto).map(puesto => `
                    <div style="background: rgba(255,255,255,0.1); padding: 10px 15px; border-radius: 10px;">
                        <strong>${obtenerNombrePuesto(puesto)}</strong>
                        <div>${resumen.porPuesto[puesto].totalEmpleados} empleados</div>
                        <div>${resumen.porPuesto[puesto].totalHorasTexto}</div>
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
        celda.style.padding = "40px";
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
    // Establecer fecha actual
    const hoy = new Date();
    fechaAusencia.value = hoy.toISOString().split('T')[0];
    filtroFecha.value = hoy.toISOString().split('T')[0];
    
    // Configurar EmailJS
    console.log("✅ Sistema inicializado correctamente");
    console.log("📧 EmailJS configurado con template: template_g60lzrr");
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', init);
