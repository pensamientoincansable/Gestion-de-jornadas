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
let correosDestinatarios = datos.correosDestinatarios || [];

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

// Elementos para correos destinatarios
const nuevoCorreoDestinatario = document.getElementById('nuevoCorreoDestinatario');
const btnAgregarDestinatario = document.getElementById('btnAgregarDestinatario');
const listaDestinatarios = document.getElementById('listaDestinatarios');

// Elementos para envío manual
const tipoReporteEnvio = document.getElementById('tipoReporteEnvio');
const selectorRangoEnvio = document.getElementById('selectorRangoEnvio');
const fechaDesdeEnvio = document.getElementById('fechaDesdeEnvio');
const fechaHastaEnvio = document.getElementById('fechaHastaEnvio');
const btnEnviarReporteManual = document.getElementById('btnEnviarReporteManual');

// Elementos para exportar
const filtroPuestoExportar = document.getElementById('filtroPuestoExportar');
const tipoReporteExportar = document.getElementById('tipoReporteExportar');
const selectorRangoExportar = document.getElementById('selectorRangoExportar');
const fechaDesdeExportar = document.getElementById('fechaDesdeExportar');
const fechaHastaExportar = document.getElementById('fechaHastaExportar');
const btnExportarPDF = document.getElementById('btnExportarPDF');

// Navegación vertical
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

// NUEVOS ELEMENTOS PARA CONSULTA INDIVIDUAL
const dniConsulta = document.getElementById('dniConsulta');
const fechaDesdeConsulta = document.getElementById('fechaDesdeConsulta');
const fechaHastaConsulta = document.getElementById('fechaHastaConsulta');
const btnConsultarRegistros = document.getElementById('btnConsultarRegistros');
const tablaConsultaRegistros = document.querySelector('#tablaConsultaRegistros tbody');
const totalConsulta = document.getElementById('totalConsulta');
const mensajeConsulta = document.getElementById('mensajeConsulta');
const resultadosConsulta = document.getElementById('resultadosConsulta');

// Pestañas en sección de fichaje
const tabsTelepizzero = document.querySelectorAll('.tab-telepizzero');
const tabContentsTelepizzero = document.querySelectorAll('.tab-content-telepizzero');

// ============================================
// EVENT LISTENERS
// ============================================

// Botones principales
btnTelepizzero.addEventListener('click', () => {
    selector.classList.remove('active');
    telepizzeroSection.classList.add('active');
    dniInput.focus();
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

// Event listeners para nuevos elementos
btnAgregarDestinatario.addEventListener('click', agregarCorreoDestinatario);
tipoReporteEnvio.addEventListener('change', cambiarTipoReporteEnvio);
btnEnviarReporteManual.addEventListener('click', enviarReporteManual);
tipoReporteExportar.addEventListener('change', cambiarTipoReporteExportar);
btnExportarPDF.addEventListener('click', exportarPDF);

// Filtros
btnFiltrar.addEventListener('click', aplicarFiltros);
btnResetFiltros.addEventListener('click', resetearFiltros);
filtroVista.addEventListener('change', cambiarVistaFiltro);

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
            cargarCorreosDestinatarios();
            // Configurar fecha actual por defecto
            const hoy = new Date();
            fechaDesdeEnvio.value = formatearFechaYYYYMMDD(hoy);
            fechaHastaEnvio.value = formatearFechaYYYYMMDD(hoy);
        } else if (tabId === 'exportar') {
            // Configurar fechas por defecto para exportar
            const hoy = new Date();
            const inicioSemana = new Date(hoy);
            inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1);
            const finSemana = new Date(inicioSemana);
            finSemana.setDate(inicioSemana.getDate() + 6);
            
            fechaDesdeExportar.value = formatearFechaYYYYMMDD(inicioSemana);
            fechaHastaExportar.value = formatearFechaYYYYMMDD(finSemana);
        } else if (tabId === 'personalizacion') {
            inicializarControlesPersonalizacion();
        }
    });
});

// Validación de DNI/NIE
dniInput.addEventListener('input', validarDNI);
nuevoDni.addEventListener('input', validarDNI);
dniConsulta.addEventListener('input', validarDNI);

// Enter para enviar
dniInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fichar();
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') accederGerencia();
});

// Pestañas en la sección de fichaje
tabsTelepizzero.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Actualizar pestañas
        tabsTelepizzero.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Actualizar contenido
        tabContentsTelepizzero.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabId}-tab`).classList.add('active');
        
        // Configurar fechas por defecto para consulta
        if (tabId === 'consultar') {
            const hoy = new Date();
            const hace7Dias = new Date(hoy);
            hace7Dias.setDate(hoy.getDate() - 7);
            
            fechaDesdeConsulta.value = formatearFechaYYYYMMDD(hace7Dias);
            fechaHastaConsulta.value = formatearFechaYYYYMMDD(hoy);
        }
    });
});

// Consulta de registros individuales
btnConsultarRegistros.addEventListener('click', consultarRegistrosIndividuales);

// ============================================
// FUNCIONES DE INTERFAZ
// ============================================

function resetearFichaje() {
    dniInput.value = '';
    mensajeTelepizzero.textContent = '';
}

function resetearAccesoGerencia() {
    passwordInput.value = '';
    mensajeGerencia.textContent = '';
}

function validarDNI(e) {
    const input = e.target;
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (input.value.length > 12) {
        input.value = input.value.slice(0, 12);
    }
}

// ============================================
// FUNCIONALIDAD DE TECLADO NUMÉRICO
// ============================================

function inicializarTecladoNumerico() {
    const teclasNumeros = document.querySelectorAll('.tecla-numero[data-numero]');
    const teclaBorrar = document.getElementById('teclaBorrar');
    const teclaLimpiar = document.getElementById('teclaLimpiar');
    
    teclasNumeros.forEach(tecla => {
        tecla.addEventListener('click', function() {
            const numero = this.getAttribute('data-numero');
            agregarNumeroDNI(numero);
            
            this.style.background = 'linear-gradient(145deg, var(--primary-color), var(--dark-red))';
            this.style.color = 'white';
            
            setTimeout(() => {
                this.style.background = '';
                this.style.color = '';
            }, 200);
        });
    });
    
    if (teclaBorrar) {
        teclaBorrar.addEventListener('click', function() {
            borrarUltimoNumero();
            
            this.style.background = 'linear-gradient(145deg, #D32F2F, var(--dark-red))';
            setTimeout(() => {
                this.style.background = '';
            }, 200);
        });
    }
    
    if (teclaLimpiar) {
        teclaLimpiar.addEventListener('click', function() {
            limpiarDNI();
            
            this.style.background = 'linear-gradient(145deg, #D32F2F, var(--dark-red))';
            setTimeout(() => {
                this.style.background = '';
            }, 200);
        });
    }
}

function agregarNumeroDNI(numero) {
    if (!dniInput) return;
    
    dniInput.value += numero;
    dniInput.dispatchEvent(new Event('input'));
}

function borrarUltimoNumero() {
    if (!dniInput) return;
    
    dniInput.value = dniInput.value.slice(0, -1);
    dniInput.dispatchEvent(new Event('input'));
}

function limpiarDNI() {
    if (!dniInput) return;
    
    dniInput.value = '';
    dniInput.dispatchEvent(new Event('input'));
    dniInput.focus();
}

function cambiarVistaFiltro() {
    const vista = filtroVista.value;
    
    selectorSemana.style.display = 'none';
    selectorDia.style.display = 'none';
    selectorRango.style.display = 'none';
    
    if (vista === 'semana') {
        selectorSemana.style.display = 'flex';
        const hoy = new Date();
        const año = hoy.getFullYear();
        const semana = obtenerNumeroSemana(hoy);
        const semanaFormato = `${año}-W${semana.toString().padStart(2, '0')}`;
        filtroSemana.value = semanaFormato;
    } else if (vista === 'dia') {
        selectorDia.style.display = 'flex';
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        filtroDia.value = `${año}-${mes}-${dia}`;
    } else if (vista === 'rango') {
        selectorRango.style.display = 'flex';
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1);
        
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);
        
        const inicioFormato = formatearFechaYYYYMMDD(inicioSemana);
        const finFormato = formatearFechaYYYYMMDD(finSemana);
        
        filtroDesde.value = inicioFormato;
        filtroHasta.value = finFormato;
    }
}

// ============================================
// FUNCIÓN DE FICHAJE
// ============================================

function fichar() {
    const dni = dniInput.value.trim().toUpperCase();
    
    if (!dni || dni.length < 5 || !/^[A-Z0-9]{5,12}$/.test(dni)) {
        mensajeTelepizzero.textContent = "❌ DNI/NIE inválido (mínimo 5 caracteres alfanuméricos)";
        mensajeTelepizzero.style.borderLeftColor = '#FF5252';
        dniInput.focus();
        return;
    }
    
    const telepizzero = telepizzeros.find(t => t.dni === dni);
    if (!telepizzero) {
        mensajeTelepizzero.textContent = "❌ DNI/NIE no registrado";
        mensajeTelepizzero.style.borderLeftColor = '#FF5252';
        dniInput.focus();
        return;
    }
    
    const ahora = new Date();
    const fechaHoy = formatearFechaYYYYMMDD(ahora);
    const horaActual = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    const registroActivo = registros.find(r => 
        r.dni === dni && 
        !r.salida
    );
    
    if (registroActivo) {
        const fechaSalida = formatearFechaYYYYMMDD(ahora);
        registroActivo.salida = horaActual;
        registroActivo.fechaSalida = fechaSalida;
        
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
            semana: obtenerNumeroSemana(ahora),
            año: ahora.getFullYear()
        });
        
        mensajeTelepizzero.textContent = `✅ Entrada registrada a las ${horaActual}. ¡Bienvenido ${telepizzero.nombre}!`;
        mensajeTelepizzero.style.borderLeftColor = '#4CAF50';
    }
    
    guardarDatos({ 
        telepizzeros, 
        registros, 
        ausencias, 
        correoGerencia, 
        correosDestinatarios, 
        semanas: datos.semanas 
    });
    
    dniInput.value = '';
    dniInput.focus();
}

// ============================================
// CONSULTA DE REGISTROS INDIVIDUALES
// ============================================

function consultarRegistrosIndividuales() {
    const dni = dniConsulta.value.trim().toUpperCase();
    
    if (!dni || dni.length < 5 || !/^[A-Z0-9]{5,12}$/.test(dni)) {
        mensajeConsulta.textContent = "❌ DNI/NIE inválido (mínimo 5 caracteres alfanuméricos)";
        mensajeConsulta.style.borderLeftColor = '#FF5252';
        dniConsulta.focus();
        return;
    }
    
    const desde = fechaDesdeConsulta.value;
    const hasta = fechaHastaConsulta.value;
    
    if (!desde || !hasta) {
        mensajeConsulta.textContent = "❌ Selecciona ambas fechas";
        mensajeConsulta.style.borderLeftColor = '#FF5252';
        return;
    }
    
    const desdeDate = new Date(desde);
    const hastaDate = new Date(hasta);
    hastaDate.setHours(23, 59, 59, 999);
    
    if (hastaDate < desdeDate) {
        mensajeConsulta.textContent = "❌ La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'";
        mensajeConsulta.style.borderLeftColor = '#FF5252';
        return;
    }
    
    const registrosFiltrados = registros.filter(registro => {
        const fechaRegistro = new Date(registro.fecha);
        return registro.dni === dni && fechaRegistro >= desdeDate && fechaRegistro <= hastaDate;
    });
    
    registrosFiltrados.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.entrada}`);
        const fechaB = new Date(`${b.fecha}T${b.entrada}`);
        return fechaB - fechaA;
    });
    
    tablaConsultaRegistros.innerHTML = '';
    
    if (registrosFiltrados.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 5;
        celda.textContent = "No hay registros para el DNI y rango de fechas seleccionados";
        celda.style.textAlign = "center";
        celda.style.padding = "30px";
        celda.style.color = "var(--secondary-color)";
        fila.appendChild(celda);
        tablaConsultaRegistros.appendChild(fila);
        
        totalConsulta.textContent = "Total horas: 0h 0m";
        mensajeConsulta.textContent = "ℹ️ No se encontraron registros";
        mensajeConsulta.style.borderLeftColor = '#FFC72C';
    } else {
        let totalMinutos = 0;
        
        registrosFiltrados.forEach(registro => {
            const fila = document.createElement('tr');
            
            const horasTrabajadas = registro.horasTrabajadas;
            if (horasTrabajadas) {
                totalMinutos += horasTrabajadas.totalMinutos || 0;
            }
            
            const fechaFormateada = formatearFechaDDMMYYYY(new Date(registro.fecha));
            
            const celdas = [
                fechaFormateada,
                registro.entrada || "-",
                registro.salida || "-",
                registro.horasTrabajadasTexto || "-",
                obtenerNombrePuesto(registro.puesto)
            ];
            
            celdas.forEach(texto => {
                const celda = document.createElement('td');
                celda.textContent = texto;
                fila.appendChild(celda);
            });
            
            tablaConsultaRegistros.appendChild(fila);
        });
        
        totalConsulta.textContent = `Total horas trabajadas: ${convertirMinutosATexto(totalMinutos)}`;
        mensajeConsulta.textContent = `✅ Encontrados ${registrosFiltrados.length} registros`;
        mensajeConsulta.style.borderLeftColor = '#4CAF50';
    }
    
    resultadosConsulta.style.display = 'block';
}

// ============================================
// FUNCIONES DE GERENCIA
// ============================================

function accederGerencia() {
    if (passwordInput.value === "0122") {
        gerenciaSection.classList.remove('active');
        registroSection.classList.add('active');
        cargarRegistrosSemanaActual();
        cargarUsuarios();
        cargarAusencias();
        cargarSelectUsuarios();
        cargarCorreoGuardado();
        cargarCorreosDestinatarios();
        
        cambiarVistaFiltro();
        
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1);
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);
        
        fechaDesdeExportar.value = formatearFechaYYYYMMDD(inicioSemana);
        fechaHastaExportar.value = formatearFechaYYYYMMDD(finSemana);
        
        fechaDesdeEnvio.value = formatearFechaYYYYMMDD(hoy);
        fechaHastaEnvio.value = formatearFechaYYYYMMDD(hoy);
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
    
    filtroVista.value = 'semana';
    filtroSemana.value = `${año}-W${semana.toString().padStart(2, '0')}`;
    filtroPuesto.value = '';
    
    aplicarFiltros();
}

function cargarRegistros(filtroPuestoValue = '', filtroSemanaValue = '', filtroDiaValue = '', filtroDesdeValue = '', filtroHastaValue = '') {
    tablaRegistros.innerHTML = '';
    
    let registrosFiltrados = [...registros];
    
    if (filtroPuestoValue) {
        registrosFiltrados = registrosFiltrados.filter(r => r.puesto === filtroPuestoValue);
    }
    
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
    
    if (filtroDiaValue) {
        registrosFiltrados = registrosFiltrados.filter(r => r.fecha === filtroDiaValue);
    }
    
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
        celda.style.color = "var(--secondary-color)";
        fila.appendChild(celda);
        tablaRegistros.appendChild(fila);
        
        totalHoras.textContent = "Total horas: 0h 0m";
        return;
    }
    
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
        
        const fechaFormateada = formatearFechaDDMMYYYY(new Date(registro.fecha));
        
        const celdas = [
            registro.nombre,
            registro.dni,
            `<span class="puesto-badge ${obtenerClasePuesto(registro.puesto)}">${obtenerNombrePuesto(registro.puesto)}</span>`,
            fechaFormateada,
            registro.entrada || "-",
            registro.salida || "-",
            registro.horasTrabajadasTexto || "-",
            `<i class="fas fa-info-circle" title="Registro almacenado localmente" style="color: var(--secondary-color);"></i>`
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
// GESTIÓN DE USUARIOS
// ============================================

function agregarUsuario() {
    const dni = nuevoDni.value.trim().toUpperCase();
    const nombre = nuevoNombre.value.trim().toUpperCase();
    const puesto = nuevoPuesto.value;
    
    if (!dni || dni.length < 5 || !/^[A-Z0-9]{5,12}$/.test(dni)) {
        alert("DNI/NIE debe tener entre 5 y 12 caracteres alfanuméricos");
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
        alert("Ya existe un telepizzero con ese DNI/NIE");
        nuevoDni.focus();
        return;
    }
    
    telepizzeros.push({ dni, nombre, puesto });
    guardarDatos({ 
        telepizzeros, 
        registros, 
        ausencias, 
        correoGerencia, 
        correosDestinatarios, 
        semanas: datos.semanas 
    });
    
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
                <button class="btn btn-warning btn-icono-small btn-cambiar-puesto" data-dni="${usuario.dni}" title="Cambiar puesto">
                    <i class="fas fa-exchange-alt"></i> Cambiar Puesto
                </button>
                <button class="btn btn-danger btn-icono-small btn-eliminar-usuario" data-dni="${usuario.dni}" title="Eliminar usuario">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        
        listaUsuarios.appendChild(card);
    });
    
    document.querySelectorAll('.btn-eliminar-usuario').forEach(btn => {
        btn.addEventListener('click', function() {
            const dni = this.getAttribute('data-dni');
            eliminarUsuario(dni);
        });
    });
    
    document.querySelectorAll('.btn-cambiar-puesto').forEach(btn => {
        btn.addEventListener('click', function() {
            const dni = this.getAttribute('data-dni');
            cambiarPuestoUsuario(dni);
        });
    });
}

function cambiarPuestoUsuario(dni) {
    const usuario = telepizzeros.find(u => u.dni === dni);
    if (!usuario) return;
    
    const nuevoPuesto = prompt(
        `Cambiar puesto de ${usuario.nombre} (${usuario.dni}):\n\n` +
        `1. auxiliar - Auxiliar de Tienda\n` +
        `2. repartidor - Repartidor\n` +
        `3. encargado - Encargado\n` +
        `4. limpieza - Limpieza\n\n` +
        `Introduce el código del nuevo puesto:`,
        usuario.puesto
    );
    
    if (!nuevoPuesto) return;
    
    const puestosValidos = ['auxiliar', 'repartidor', 'encargado', 'limpieza'];
    if (!puestosValidos.includes(nuevoPuesto)) {
        alert("Puesto no válido. Opciones: auxiliar, repartidor, encargado, limpieza");
        return;
    }
    
    usuario.puesto = nuevoPuesto;
    
    registros.forEach(registro => {
        if (registro.dni === dni) {
            registro.puesto = nuevoPuesto;
        }
    });
    
    ausencias.forEach(ausencia => {
        if (ausencia.dni === dni) {
            ausencia.puesto = nuevoPuesto;
        }
    });
    
    guardarDatos({ 
        telepizzeros, 
        registros, 
        ausencias, 
        correoGerencia, 
        correosDestinatarios, 
        semanas: datos.semanas 
    });
    
    cargarUsuarios();
    cargarSelectUsuarios();
    cargarRegistrosSemanaActual();
    cargarAusencias();
    
    alert(`✅ Puesto de ${usuario.nombre} actualizado a ${obtenerNombrePuesto(nuevoPuesto)}`);
}

function eliminarUsuario(dni) {
    if (!confirm("¿Eliminar este telepizzero? Se eliminarán también sus registros.")) return;
    
    const nombre = telepizzeros.find(u => u.dni === dni)?.nombre;
    
    telepizzeros = telepizzeros.filter(u => u.dni !== dni);
    registros = registros.filter(r => r.dni !== dni);
    ausencias = ausencias.filter(a => a.dni !== dni);
    
    guardarDatos({ 
        telepizzeros, 
        registros, 
        ausencias, 
        correoGerencia, 
        correosDestinatarios, 
        semanas: datos.semanas 
    });
    
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
    
    const fechaFormateada = formatearFechaDDMMYYYY(new Date(fecha));
    
    ausencias.push({
        dni,
        nombre: usuario.nombre,
        puesto: usuario.puesto,
        fecha: fechaFormateada,
        tipo,
        motivo: motivo || "No especificado",
        fechaRegistro: new Date().toLocaleString('es-ES')
    });
    
    guardarDatos({ 
        telepizzeros, 
        registros, 
        ausencias, 
        correoGerencia, 
        correosDestinatarios, 
        semanas: datos.semanas 
    });
    cargarAusencias();
    
    motivoAusencia.value = '';
    alert(`✅ Incidencia registrada para ${usuario.nombre}`);
}

function cargarAusencias() {
    listaAusencias.innerHTML = '';
    
    if (ausencias.length === 0) {
        listaAusencias.innerHTML = '<p style="text-align: center; color: var(--secondary-color);">No hay incidencias registradas</p>';
        return;
    }
    
    const ordenadas = [...ausencias].sort((a, b) => {
        const fechaA = parseFechaDDMMYYYY(a.fecha);
        const fechaB = parseFechaDDMMYYYY(b.fecha);
        return fechaB - fechaA;
    });
    
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
            <button class="btn btn-danger btn-icono-small btn-eliminar-ausencia" data-id="${ausencia.dni}-${ausencia.fecha}" title="Eliminar incidencia">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        listaAusencias.appendChild(item);
    });
    
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
    guardarDatos({ 
        telepizzeros, 
        registros, 
        ausencias, 
        correoGerencia, 
        correosDestinatarios, 
        semanas: datos.semanas 
    });
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
    guardarDatos({ 
        telepizzeros, 
        registros, 
        ausencias, 
        correoGerencia, 
        correosDestinatarios, 
        semanas: datos.semanas 
    });
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
            <p style="font-size: 0.9rem; color: var(--secondary-color);">
                <i class="fas fa-info-circle"></i> Los reportes PDF se enviarán desde este correo
            </p>
            <button class="btn btn-danger btn-small" id="btnEliminarCorreo" style="margin-top: 10px;">
                <i class="fas fa-trash"></i> Eliminar Correo
            </button>
        `;
        
        document.getElementById('btnEliminarCorreo').addEventListener('click', eliminarCorreo);
    } else {
        infoCorreoGuardado.innerHTML = `
            <h3><i class="fas fa-envelope"></i> Sin correo configurado</h3>
            <p style="margin: 10px 0;">Configure un correo para enviar reportes PDF</p>
            <p style="font-size: 0.9rem; color: var(--secondary-color);">
                <i class="fas fa-info-circle"></i> Correo por defecto: fichajetelepizza@outlook.es
            </p>
        `;
    }
}

function eliminarCorreo() {
    if (!confirm("¿Restablecer al correo por defecto?")) return;
    
    correoGerencia = "fichajetelepizza@outlook.es";
    guardarDatos({ 
        telepizzeros, 
        registros, 
        ausencias, 
        correoGerencia, 
        correosDestinatarios, 
        semanas: datos.semanas 
    });
    cargarCorreoGuardado();
    correoElectronico.value = correoGerencia;
    mensajeCorreo.textContent = "✅ Correo restablecido al valor por defecto";
    mensajeCorreo.style.borderLeftColor = '#4CAF50';
    setTimeout(() => mensajeCorreo.textContent = '', 3000);
}

// ============================================
// GESTIÓN DE CORREOS DESTINATARIOS
// ============================================

function agregarCorreoDestinatario() {
    const correo = nuevoCorreoDestinatario.value.trim();
    
    if (!correo || !correo.includes('@') || !correo.includes('.')) {
        alert("Correo electrónico inválido");
        nuevoCorreoDestinatario.focus();
        return;
    }
    
    if (correosDestinatarios.includes(correo)) {
        alert("Este correo ya está en la lista de destinatarios");
        return;
    }
    
    correosDestinatarios.push(correo);
    guardarDatos({ 
        telepizzeros, 
        registros, 
        ausencias, 
        correoGerencia, 
        correosDestinatarios, 
        semanas: datos.semanas 
    });
    
    cargarCorreosDestinatarios();
    nuevoCorreoDestinatario.value = '';
    nuevoCorreoDestinatario.focus();
    
    mensajeCorreo.textContent = `✅ Correo ${correo} agregado a destinatarios`;
    mensajeCorreo.style.borderLeftColor = '#4CAF50';
    setTimeout(() => mensajeCorreo.textContent = '', 3000);
}

function cargarCorreosDestinatarios() {
    listaDestinatarios.innerHTML = '';
    
    if (correosDestinatarios.length === 0) {
        listaDestinatarios.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--secondary-color);">
                <i class="fas fa-envelope fa-2x" style="margin-bottom: 10px;"></i>
                <p>No hay correos destinatarios configurados</p>
                <p style="font-size: 0.9rem;">Agrega correos para enviar reportes</p>
            </div>
        `;
        return;
    }
    
    const lista = document.createElement('div');
    lista.style.display = 'flex';
    lista.style.flexDirection = 'column';
    lista.style.gap = '10px';
    
    correosDestinatarios.forEach((correo, index) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '10px';
        item.style.background = 'rgba(255,255,255,0.08)';
        item.style.borderRadius = '8px';
        
        item.innerHTML = `
            <div>
                <i class="fas fa-envelope" style="color: var(--secondary-color); margin-right: 10px;"></i>
                <span>${correo}</span>
            </div>
            <button class="btn btn-danger btn-icono-small btn-eliminar-destinatario" data-index="${index}" title="Eliminar destinatario">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        lista.appendChild(item);
    });
    
    listaDestinatarios.appendChild(lista);
    
    document.querySelectorAll('.btn-eliminar-destinatario').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            eliminarCorreoDestinatario(index);
        });
    });
}

function eliminarCorreoDestinatario(index) {
    if (!confirm("¿Eliminar este correo de la lista de destinatarios?")) return;
    
    correosDestinatarios.splice(index, 1);
    guardarDatos({ 
        telepizzeros, 
        registros, 
        ausencias, 
        correoGerencia, 
        correosDestinatarios, 
        semanas: datos.semanas 
    });
    
    cargarCorreosDestinatarios();
}

// ============================================
// ENVÍO MANUAL DE REPORTES
// ============================================

function cambiarTipoReporteEnvio() {
    const tipo = tipoReporteEnvio.value;
    if (tipo === 'rango') {
        selectorRangoEnvio.style.display = 'flex';
        const hoy = new Date();
        const hace7Dias = new Date(hoy);
        hace7Dias.setDate(hoy.getDate() - 7);
        
        fechaDesdeEnvio.value = formatearFechaYYYYMMDD(hace7Dias);
        fechaHastaEnvio.value = formatearFechaYYYYMMDD(hoy);
    } else {
        selectorRangoEnvio.style.display = 'none';
    }
}

async function enviarReporteManual() {
    if (correosDestinatarios.length === 0) {
        alert("No hay correos destinatarios configurados. Agrega al menos uno.");
        return;
    }
    
    if (!correoGerencia || correoGerencia === "fichajetelepizza@outlook.es") {
        alert("Primero configure un correo electrónico de envío en la parte superior.");
        return;
    }
    
    const tipo = tipoReporteEnvio.value;
    let datosReporte;
    let titulo = '';
    
    try {
        mensajeCorreo.textContent = `⏳ Generando reporte...`;
        mensajeCorreo.style.borderLeftColor = '#FFC72C';
        
        if (tipo === 'diario') {
            const hoy = new Date();
            const fechaHoy = formatearFechaYYYYMMDD(hoy);
            const registrosHoy = registros.filter(r => r.fecha === fechaHoy);
            const ausenciasHoy = ausencias.filter(a => a.fecha === formatearFechaDDMMYYYY(hoy));
            
            datosReporte = {
                tipo: 'diario',
                fecha: formatearFechaDDMMYYYY(hoy),
                titulo: `Reporte Diario - ${formatearFechaDDMMYYYY(hoy)}`,
                totalTelepizzeros: telepizzeros.length,
                registros: registrosHoy,
                ausencias: ausenciasHoy
            };
            titulo = `Reporte Diario ${formatearFechaDDMMYYYY(hoy)}`;
            
        } else if (tipo === 'rango') {
            const desde = fechaDesdeEnvio.value;
            const hasta = fechaHastaEnvio.value;
            
            if (!desde || !hasta) {
                alert("Selecciona ambas fechas");
                return;
            }
            
            const desdeDate = new Date(desde);
            const hastaDate = new Date(hasta);
            
            if (hastaDate < desdeDate) {
                alert("La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'");
                return;
            }
            
            const registrosRango = registros.filter(r => {
                const fechaRegistro = new Date(r.fecha);
                const fechaDesde = new Date(desde);
                const fechaHasta = new Date(hasta);
                fechaHasta.setHours(23, 59, 59, 999);
                return fechaRegistro >= fechaDesde && fechaRegistro <= fechaHasta;
            });
            
            const ausenciasRango = ausencias.filter(a => {
                const fechaAusencia = parseFechaDDMMYYYY(a.fecha);
                const fechaDesde = new Date(desde);
                const fechaHasta = new Date(hasta);
                fechaHasta.setHours(23, 59, 59, 999);
                return fechaAusencia >= fechaDesde && fechaAusencia <= fechaHasta;
            });
            
            datosReporte = {
                tipo: 'rango',
                desde: formatearFechaDDMMYYYY(new Date(desde)),
                hasta: formatearFechaDDMMYYYY(new Date(hasta)),
                titulo: `Reporte Personalizado - ${formatearFechaDDMMYYYY(new Date(desde))} a ${formatearFechaDDMMYYYY(new Date(hasta))}`,
                totalTelepizzeros: telepizzeros.length,
                registros: registrosRango,
                ausencias: ausenciasRango
            };
            titulo = `Reporte ${formatearFechaDDMMYYYY(new Date(desde))} a ${formatearFechaDDMMYYYY(new Date(hasta))}`;
        }
        
        const pdfBlob = await generarPDF(datosReporte);
        
        let enviados = 0;
        let errores = 0;
        
        mensajeCorreo.textContent = `⏳ Enviando reportes a ${correosDestinatarios.length} destinatario(s)...`;
        
        for (const correoDestino of correosDestinatarios) {
            try {
                const resultado = await enviarPDFPorCorreo(titulo, pdfBlob, correoDestino, correoGerencia);
                
                if (resultado.success) {
                    enviados++;
                } else {
                    errores++;
                    console.error(`Error enviando a ${correoDestino}:`, resultado.error);
                }
            } catch (error) {
                errores++;
                console.error(`Error enviando a ${correoDestino}:`, error);
            }
        }
        
        if (errores === 0) {
            mensajeCorreo.textContent = `✅ Reporte enviado exitosamente a ${enviados} destinatario(s)`;
            mensajeCorreo.style.borderLeftColor = '#4CAF50';
        } else {
            mensajeCorreo.textContent = `⚠️ Reporte enviado a ${enviados} destinatario(s), ${errores} error(es)`;
            mensajeCorreo.style.borderLeftColor = '#FF9800';
        }
        
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${titulo}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setTimeout(() => mensajeCorreo.textContent = '', 5000);
        
    } catch (error) {
        mensajeCorreo.textContent = `❌ Error: ${error.message}`;
        mensajeCorreo.style.borderLeftColor = '#FF5252';
        setTimeout(() => mensajeCorreo.textContent = '', 5000);
    }
}

// ============================================
// EXPORTAR PDF
// ============================================

function cambiarTipoReporteExportar() {
    const tipo = tipoReporteExportar.value;
    if (tipo === 'rango') {
        selectorRangoExportar.style.display = 'flex';
    } else {
        selectorRangoExportar.style.display = 'none';
    }
}

async function exportarPDF() {
    const filtroPuesto = filtroPuestoExportar.value;
    const tipo = tipoReporteExportar.value;
    
    let datosReporte;
    let titulo = '';
    
    try {
        if (tipo === 'diario') {
            const hoy = new Date();
            const fechaHoy = formatearFechaYYYYMMDD(hoy);
            let registrosHoy = registros.filter(r => r.fecha === fechaHoy);
            
            if (filtroPuesto) {
                registrosHoy = registrosHoy.filter(r => r.puesto === filtroPuesto);
            }
            
            const ausenciasHoy = ausencias.filter(a => a.fecha === formatearFechaDDMMYYYY(hoy));
            
            datosReporte = {
                tipo: 'diario',
                fecha: formatearFechaDDMMYYYY(hoy),
                titulo: `Reporte Diario - ${formatearFechaDDMMYYYY(hoy)}${filtroPuesto ? ' - ' + obtenerNombrePuesto(filtroPuesto) : ''}`,
                totalTelepizzeros: telepizzeros.filter(u => !filtroPuesto || u.puesto === filtroPuesto).length,
                registros: registrosHoy,
                ausencias: ausenciasHoy,
                filtroPuesto: filtroPuesto
            };
            titulo = `Reporte Diario ${formatearFechaDDMMYYYY(hoy)}`;
            
        } else if (tipo === 'semanal') {
            const hoy = new Date();
            const numeroSemana = obtenerNumeroSemana(hoy);
            const año = hoy.getFullYear();
            
            datosReporte = generarResumenSemanal(numeroSemana, año);
            datosReporte.titulo = `Reporte Semanal - Semana ${numeroSemana} ${año}${filtroPuesto ? ' - ' + obtenerNombrePuesto(filtroPuesto) : ''}`;
            datosReporte.filtroPuesto = filtroPuesto;
            
            if (filtroPuesto) {
                datosReporte.registros = datosReporte.registros.filter(r => r.puesto === filtroPuesto);
                datosReporte.totalRegistros = datosReporte.registros.length;
            }
            
            titulo = `Reporte Semanal ${numeroSemana}-${año}`;
            
        } else if (tipo === 'mensual') {
            const hoy = new Date();
            const mesActual = hoy.getMonth() + 1;
            const añoActual = hoy.getFullYear();
            const nombreMes = hoy.toLocaleDateString('es-ES', { month: 'long' });
            
            let registrosMes = registros.filter(r => {
                const fecha = new Date(r.fecha);
                return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === añoActual;
            });
            
            if (filtroPuesto) {
                registrosMes = registrosMes.filter(r => r.puesto === filtroPuesto);
            }
            
            const ausenciasMes = ausencias.filter(a => {
                const fecha = parseFechaDDMMYYYY(a.fecha);
                return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === añoActual;
            });
            
            datosReporte = {
                tipo: 'mensual',
                mes: mesActual,
                año: añoActual,
                titulo: `Reporte Mensual - ${nombreMes} ${añoActual}${filtroPuesto ? ' - ' + obtenerNombrePuesto(filtroPuesto) : ''}`,
                totalTelepizzeros: telepizzeros.filter(u => !filtroPuesto || u.puesto === filtroPuesto).length,
                registros: registrosMes,
                ausencias: ausenciasMes,
                filtroPuesto: filtroPuesto
            };
            titulo = `Reporte Mensual ${mesActual}-${añoActual}`;
            
        } else if (tipo === 'rango') {
            const desde = fechaDesdeExportar.value;
            const hasta = fechaHastaExportar.value;
            
            if (!desde || !hasta) {
                alert("Selecciona ambas fechas");
                return;
            }
            
            const desdeDate = new Date(desde);
            const hastaDate = new Date(hasta);
            
            if (hastaDate < desdeDate) {
                alert("La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'");
                return;
            }
            
            let registrosRango = registros.filter(r => {
                const fechaRegistro = new Date(r.fecha);
                const fechaDesde = new Date(desde);
                const fechaHasta = new Date(hasta);
                fechaHasta.setHours(23, 59, 59, 999);
                return fechaRegistro >= fechaDesde && fechaRegistro <= fechaHasta;
            });
            
            if (filtroPuesto) {
                registrosRango = registrosRango.filter(r => r.puesto === filtroPuesto);
            }
            
            const ausenciasRango = ausencias.filter(a => {
                const fechaAusencia = parseFechaDDMMYYYY(a.fecha);
                const fechaDesde = new Date(desde);
                const fechaHasta = new Date(hasta);
                fechaHasta.setHours(23, 59, 59, 999);
                return fechaAusencia >= fechaDesde && fechaAusencia <= fechaHasta;
            });
            
            datosReporte = {
                tipo: 'rango',
                desde: formatearFechaDDMMYYYY(new Date(desde)),
                hasta: formatearFechaDDMMYYYY(new Date(hasta)),
                titulo: `Reporte Personalizado - ${formatearFechaDDMMYYYY(new Date(desde))} a ${formatearFechaDDMMYYYY(new Date(hasta))}${filtroPuesto ? ' - ' + obtenerNombrePuesto(filtroPuesto) : ''}`,
                totalTelepizzeros: telepizzeros.filter(u => !filtroPuesto || u.puesto === filtroPuesto).length,
                registros: registrosRango,
                ausencias: ausenciasRango,
                filtroPuesto: filtroPuesto
            };
            titulo = `Reporte ${formatearFechaDDMMYYYY(new Date(desde))} a ${formatearFechaDDMMYYYY(new Date(hasta))}`;
        }
        
        const pdfBlob = await generarPDFExportacion(datosReporte);
        
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${titulo}${filtroPuesto ? ' - ' + obtenerNombrePuesto(filtroPuesto) : ''}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
    } catch (error) {
        alert(`Error al generar PDF: ${error.message}`);
    }
}

async function generarPDFExportacion(datos) {
    return new Promise((resolve) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.setTextColor(212, 0, 28);
        doc.text("Telepizza - Gestión de Jornadas", 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(datos.titulo, 105, 35, { align: 'center' });
        
        if (datos.filtroPuesto) {
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Filtro: ${obtenerNombrePuesto(datos.filtroPuesto)}`, 105, 45, { align: 'center' });
        }
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 105, 55, { align: 'center' });
        
        let yPos = 70;
        
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
        
        if (datos.registros && datos.registros.length > 0) {
            let totalMinutos = 0;
            datos.registros.forEach(registro => {
                if (registro.horasTrabajadas && registro.horasTrabajadas.totalMinutos) {
                    totalMinutos += registro.horasTrabajadas.totalMinutos;
                }
            });
            doc.text(`• Total horas trabajadas: ${convertirMinutosATexto(totalMinutos)}`, 20, yPos);
            yPos += 7;
        }
        
        if (datos.totalAusencias !== undefined) {
            doc.text(`• Total ausencias: ${datos.totalAusencias}`, 20, yPos);
            yPos += 7;
        }
        
        yPos += 5;
        
        if (datos.registros && datos.registros.length > 0) {
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text("Registros de Jornadas:", 14, yPos);
            yPos += 10;
            
            const headers = [['Nombre', 'DNI', 'Puesto', 'Fecha', 'Entrada', 'Salida', 'Horas']];
            const rows = datos.registros.map(reg => [
                reg.nombre,
                reg.dni,
                obtenerNombrePuesto(reg.puesto),
                formatearFechaDDMMYYYY(new Date(reg.fecha)),
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
        
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: 'center' });
            doc.text("Sistema de Gestión de Jornadas Telepizza - Informe de Registros", 105, 290, { align: 'center' });
        }
        
        const pdfBlob = doc.output('blob');
        resolve(pdfBlob);
    });
}

async function generarPDF(datos) {
    return generarPDFExportacion(datos);
}

// ============================================
// PERSONALIZACIÓN COMPLETA
// ============================================

// Configuración por defecto
const configPersonalizacion = {
    colorFondo: '#D4001C',
    colorSecundario: '#FFC72C',
    colorTexto: '#FFFFFF',
    colorContenedor: '#000000',
    colorBotonesAcceso: '#FFFFFF',
    colorTextoBotonesAcceso: '#D4001C',
    colorBotonFichar: '#4CAF50',
    colorBotonVolver: '#D4001C',
    colorTextoBotonVolver: '#FFFFFF',
    colorBotonSecundario: '#FFC72C',
    logoSize: 150,
    logoOpacity: 15,
    logoPositionX: 50,
    logoPositionY: 50,
    headerHeight: 120,
    headerOpacity: 100,
    containerPadding: 20,
    containerWidth: 100,
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 400,
    fontSize: 16
};

// Cargar personalización
function cargarPersonalizacion() {
    const guardado = localStorage.getItem('telepizza_personalizacion');
    if (guardado) {
        return JSON.parse(guardado);
    }
    return configPersonalizacion;
}

// Guardar personalización
function guardarPersonalizacion(config) {
    localStorage.setItem('telepizza_personalizacion', JSON.stringify(config));
}

// Aplicar personalización
function aplicarPersonalizacion(config) {
    // Aplicar a variables CSS
    document.documentElement.style.setProperty('--primary-color', config.colorFondo);
    document.documentElement.style.setProperty('--secondary-color', config.colorSecundario);
    document.documentElement.style.setProperty('--color-texto', config.colorTexto);
    document.documentElement.style.setProperty('--container-bg', config.colorContenedor + '33'); // Agregar transparencia
    document.documentElement.style.setProperty('--font-family', config.fontFamily);
    document.documentElement.style.setProperty('--font-weight', config.fontWeight);
    document.documentElement.style.setProperty('--font-size', config.fontSize + 'px');
    document.documentElement.style.setProperty('--logo-size', config.logoSize + 'px');
    document.documentElement.style.setProperty('--logo-opacity', config.logoOpacity / 100);
    document.documentElement.style.setProperty('--logo-position-x', config.logoPositionX + '%');
    document.documentElement.style.setProperty('--logo-position-y', config.logoPositionY + '%');
    document.documentElement.style.setProperty('--header-height', config.headerHeight + 'px');
    document.documentElement.style.setProperty('--header-opacity', config.headerOpacity / 100);
    document.documentElement.style.setProperty('--container-padding', config.containerPadding + 'px');
    document.documentElement.style.setProperty('--container-width', config.containerWidth + '%');
    
    // Aplicar a elementos específicos
    const btnFichar = document.getElementById('btnFichar');
    if (btnFichar) {
        btnFichar.style.backgroundColor = config.colorBotonFichar;
    }
    
    const botonesAcceso = document.querySelectorAll('.btn-acceso');
    botonesAcceso.forEach(btn => {
        btn.style.backgroundColor = config.colorBotonesAcceso;
        btn.style.color = config.colorTextoBotonesAcceso;
        btn.style.borderColor = config.colorTextoBotonesAcceso;
    });
    
    const botonesVolver = document.querySelectorAll('.volver-btn');
    botonesVolver.forEach(btn => {
        btn.style.backgroundColor = config.colorBotonVolver;
        btn.style.color = config.colorTextoBotonVolver;
        btn.style.borderColor = config.colorTextoBotonVolver;
    });
    
    const botonesSecundarios = document.querySelectorAll('.btn-secondary');
    botonesSecundarios.forEach(btn => {
        btn.style.background = `linear-gradient(145deg, ${config.colorBotonSecundario}, #FFB300)`;
    });
    
    // Aplicar fuente a todo el body
    document.body.style.fontFamily = config.fontFamily;
    document.body.style.fontWeight = config.fontWeight;
    document.body.style.fontSize = config.fontSize + 'px';
    
    // Aplicar al contenedor principal
    const container = document.querySelector('.container');
    if (container) {
        container.style.padding = config.containerPadding + 'px';
        container.style.width = config.containerWidth + '%';
        container.style.backgroundColor = config.colorContenedor + '33';
    }
    
    // Guardar configuración
    guardarPersonalizacion(config);
}

// Inicializar controles de personalización
function inicializarControlesPersonalizacion() {
    const config = cargarPersonalizacion();
    
    // Cargar valores en los controles
    document.getElementById('colorFondo').value = config.colorFondo;
    document.getElementById('colorFondoTexto').value = config.colorFondo;
    document.getElementById('colorSecundario').value = config.colorSecundario;
    document.getElementById('colorSecundarioTexto').value = config.colorSecundario;
    document.getElementById('colorTexto').value = config.colorTexto;
    document.getElementById('colorTextoTexto').value = config.colorTexto;
    document.getElementById('colorContenedor').value = config.colorContenedor;
    document.getElementById('colorContenedorTexto').value = config.colorContenedor;
    document.getElementById('colorBotonesAcceso').value = config.colorBotonesAcceso;
    document.getElementById('colorBotonesAccesoTexto').value = config.colorBotonesAcceso;
    document.getElementById('colorTextoBotonesAcceso').value = config.colorTextoBotonesAcceso;
    document.getElementById('colorTextoBotonesAccesoTexto').value = config.colorTextoBotonesAcceso;
    document.getElementById('colorBotonFichar').value = config.colorBotonFichar;
    document.getElementById('colorBotonFicharTexto').value = config.colorBotonFichar;
    document.getElementById('colorBotonVolver').value = config.colorBotonVolver;
    document.getElementById('colorBotonVolverTexto').value = config.colorBotonVolver;
    document.getElementById('colorTextoBotonVolver').value = config.colorTextoBotonVolver;
    document.getElementById('colorTextoBotonVolverTexto').value = config.colorTextoBotonVolver;
    document.getElementById('colorBotonSecundario').value = config.colorBotonSecundario;
    document.getElementById('colorBotonSecundarioTexto').value = config.colorBotonSecundario;
    
    document.getElementById('logoSize').value = config.logoSize;
    document.getElementById('logoSizeValue').textContent = `${config.logoSize}px`;
    document.getElementById('logoOpacity').value = config.logoOpacity;
    document.getElementById('logoOpacityValue').textContent = `${config.logoOpacity}%`;
    document.getElementById('logoPositionX').value = config.logoPositionX;
    document.getElementById('logoPositionXValue').textContent = `${config.logoPositionX}%`;
    document.getElementById('logoPositionY').value = config.logoPositionY;
    document.getElementById('logoPositionYValue').textContent = `${config.logoPositionY}%`;
    
    document.getElementById('headerHeight').value = config.headerHeight;
    document.getElementById('headerHeightValue').textContent = `${config.headerHeight}px`;
    document.getElementById('headerOpacity').value = config.headerOpacity;
    document.getElementById('headerOpacityValue').textContent = `${config.headerOpacity}%`;
    
    document.getElementById('containerPadding').value = config.containerPadding;
    document.getElementById('containerPaddingValue').textContent = `${config.containerPadding}px`;
    document.getElementById('containerWidth').value = config.containerWidth;
    document.getElementById('containerWidthValue').textContent = `${config.containerWidth}%`;
    
    document.getElementById('fontFamily').value = config.fontFamily;
    document.getElementById('fontWeight').value = config.fontWeight;
    document.getElementById('fontSize').value = config.fontSize;
    document.getElementById('fontSizeValue').textContent = `${config.fontSize}px`;
    
    // Event listeners para controles de color
    document.querySelectorAll('input[type="color"]').forEach(input => {
        input.addEventListener('input', function() {
            const textoId = this.id + 'Texto';
            document.getElementById(textoId).value = this.value;
            actualizarVistaPreviaPersonalizacion();
        });
    });
    
    document.querySelectorAll('input[type="text"][id$="Texto"]').forEach(input => {
        input.addEventListener('input', function() {
            const colorId = this.id.replace('Texto', '');
            const colorInput = document.getElementById(colorId);
            if (this.value.match(/^#[0-9A-F]{6}$/i)) {
                colorInput.value = this.value;
                actualizarVistaPreviaPersonalizacion();
            }
        });
    });
    
    // Event listeners para controles de rango
    document.querySelectorAll('input[type="range"]').forEach(input => {
        input.addEventListener('input', function() {
            const valueSpan = document.getElementById(this.id + 'Value');
            if (valueSpan) {
                const suffix = this.id.includes('Size') || this.id.includes('Height') || 
                              this.id.includes('Padding') ? 'px' : 
                              this.id.includes('Opacity') || this.id.includes('Position') ? '%' : '';
                valueSpan.textContent = `${this.value}${suffix}`;
            }
            actualizarVistaPreviaPersonalizacion();
        });
    });
    
    // Event listeners para selects
    document.getElementById('fontFamily').addEventListener('change', actualizarVistaPreviaPersonalizacion);
    document.getElementById('fontWeight').addEventListener('change', actualizarVistaPreviaPersonalizacion);
    
    // Botones de acción
    document.getElementById('btnAplicarPersonalizacion').addEventListener('click', function() {
        const nuevaConfig = obtenerConfiguracionActual();
        aplicarPersonalizacion(nuevaConfig);
        mostrarMensajePersonalizacion('✅ Cambios aplicados correctamente', 'success');
    });
    
    document.getElementById('btnResetPersonalizacion').addEventListener('click', function() {
        if (confirm('¿Restablecer todos los valores a los predeterminados?')) {
            aplicarPersonalizacion(configPersonalizacion);
            inicializarControlesPersonalizacion();
            mostrarMensajePersonalizacion('✅ Valores restablecidos', 'success');
        }
    });
    
    document.getElementById('btnGuardarPersonalizacion').addEventListener('click', function() {
        const nuevaConfig = obtenerConfiguracionActual();
        guardarPersonalizacion(nuevaConfig);
        mostrarMensajePersonalizacion('✅ Configuración guardada permanentemente', 'success');
    });
    
    // Actualizar vista previa inicial
    actualizarVistaPreviaPersonalizacion();
}

// Obtener configuración actual
function obtenerConfiguracionActual() {
    return {
        colorFondo: document.getElementById('colorFondo').value,
        colorSecundario: document.getElementById('colorSecundario').value,
        colorTexto: document.getElementById('colorTexto').value,
        colorContenedor: document.getElementById('colorContenedor').value,
        colorBotonesAcceso: document.getElementById('colorBotonesAcceso').value,
        colorTextoBotonesAcceso: document.getElementById('colorTextoBotonesAcceso').value,
        colorBotonFichar: document.getElementById('colorBotonFichar').value,
        colorBotonVolver: document.getElementById('colorBotonVolver').value,
        colorTextoBotonVolver: document.getElementById('colorTextoBotonVolver').value,
        colorBotonSecundario: document.getElementById('colorBotonSecundario').value,
        logoSize: parseInt(document.getElementById('logoSize').value),
        logoOpacity: parseInt(document.getElementById('logoOpacity').value),
        logoPositionX: parseInt(document.getElementById('logoPositionX').value),
        logoPositionY: parseInt(document.getElementById('logoPositionY').value),
        headerHeight: parseInt(document.getElementById('headerHeight').value),
        headerOpacity: parseInt(document.getElementById('headerOpacity').value),
        containerPadding: parseInt(document.getElementById('containerPadding').value),
        containerWidth: parseInt(document.getElementById('containerWidth').value),
        fontFamily: document.getElementById('fontFamily').value,
        fontWeight: parseInt(document.getElementById('fontWeight').value),
        fontSize: parseInt(document.getElementById('fontSize').value)
    };
}

// Actualizar vista previa
function actualizarVistaPreviaPersonalizacion() {
    const config = obtenerConfiguracionActual();
    
    // Actualizar vista previa del logo
    const previewLogo = document.getElementById('previewLogo');
    if (previewLogo) {
        previewLogo.style.width = `${config.logoSize * 0.5}px`;
        previewLogo.style.height = `${config.logoSize * 0.5}px`;
        previewLogo.style.opacity = `${config.logoOpacity / 100}`;
    }
    
    // Actualizar vista previa del encabezado
    const previewHeader = document.getElementById('previewHeader');
    if (previewHeader) {
        previewHeader.style.height = `${config.headerHeight * 0.3}px`;
        previewHeader.style.opacity = `${config.headerOpacity / 100}`;
    }
    
    // Actualizar vista previa de botones
    const previewBtnAcceso = document.getElementById('previewBtnAcceso');
    if (previewBtnAcceso) {
        previewBtnAcceso.style.backgroundColor = config.colorBotonesAcceso;
    }
    
    const previewBtnFichar = document.getElementById('previewBtnFichar');
    if (previewBtnFichar) {
        previewBtnFichar.style.backgroundColor = config.colorBotonFichar;
    }
    
    const previewBtnVolver = document.getElementById('previewBtnVolver');
    if (previewBtnVolver) {
        previewBtnVolver.style.backgroundColor = config.colorBotonVolver;
    }
    
    // Actualizar área de vista previa
    const previewArea = document.getElementById('previewArea');
    if (previewArea) {
        previewArea.style.backgroundColor = config.colorFondo;
    }
}

// Mostrar mensaje de personalización
function mostrarMensajePersonalizacion(mensaje, tipo = 'success') {
    const mensajeDiv = document.getElementById('mensajePersonalizacion');
    if (mensajeDiv) {
        mensajeDiv.textContent = mensaje;
        mensajeDiv.style.borderLeftColor = tipo === 'success' ? '#4CAF50' : '#FF5252';
        setTimeout(() => {
            mensajeDiv.textContent = '';
        }, 3000);
    }
}

// ============================================
// FUNCIONES AUXILIARES PARA FECHAS
// ============================================

function formatearFechaDDMMYYYY(fecha) {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
}

function formatearFechaYYYYMMDD(fecha) {
    const date = new Date(fecha);
    const año = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

function parseFechaDDMMYYYY(fechaString) {
    const [dia, mes, año] = fechaString.split('/').map(Number);
    return new Date(año, mes - 1, dia);
}

// ============================================
// INICIALIZAR APLICACIÓN
// ============================================

function init() {
    // Establecer valores por defecto
    const hoy = new Date();
    
    // Configurar fecha de ausencia
    fechaAusencia.value = formatearFechaYYYYMMDD(hoy);
    
    // Configurar fechas para consulta
    const hace7Dias = new Date(hoy);
    hace7Dias.setDate(hoy.getDate() - 7);
    fechaDesdeConsulta.value = formatearFechaYYYYMMDD(hace7Dias);
    fechaHastaConsulta.value = formatearFechaYYYYMMDD(hoy);
    
    // Configurar correo por defecto
    if (!correoGerencia) {
        correoGerencia = "fichajetelepizza@outlook.es";
        guardarDatos({ 
            telepizzeros, 
            registros, 
            ausencias, 
            correoGerencia, 
            correosDestinatarios, 
            semanas: datos.semanas 
        });
    }
    correoElectronico.value = correoGerencia;
    
    // Cargar correo guardado
    cargarCorreoGuardado();
    
    // Cargar y aplicar personalización
    const config = cargarPersonalizacion();
    aplicarPersonalizacion(config);
    
    // Inicializar teclado numérico
    inicializarTecladoNumerico();
    
    console.log("✅ Sistema inicializado correctamente");
    console.log("📧 Correo configurado:", correoGerencia);
    console.log("🎨 Personalización cargada:", config);
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', init);