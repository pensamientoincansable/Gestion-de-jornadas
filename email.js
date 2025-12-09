// ============================================
// CONFIGURACIÓN EMAILJS
// ============================================

// Inicializar EmailJS con tu clave pública
emailjs.init("lfpbuaU91P6LcoHSi");

// Función para enviar reporte por correo
async function enviarReportePorCorreo(tipo, datos, correoDestino) {
    try {
        // Verificar que EmailJS esté cargado
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS no está cargado');
            return { success: false, error: 'EmailJS no está cargado' };
        }
        
        let asunto = '';
        let contenido = '';
        
        // Preparar contenido según el tipo de reporte
        switch(tipo) {
            case 'diario':
                asunto = `📊 Reporte Diario Telepizza - ${datos.fecha}`;
                contenido = generarContenidoDiario(datos);
                break;
                
            case 'semanal':
                asunto = `📅 Reporte Semanal Telepizza - Semana ${datos.numeroSemana} ${datos.año}`;
                contenido = generarContenidoSemanal(datos);
                break;
                
            case 'mensual':
                asunto = `📈 Reporte Mensual Telepizza - ${datos.mes}/${datos.año}`;
                contenido = generarContenidoMensual(datos);
                break;
                
            default:
                asunto = `📋 Reporte Telepizza - ${new Date().toLocaleDateString('es-ES')}`;
                contenido = generarContenidoGeneral(datos);
        }
        
        // Parámetros para el template
        const templateParams = {
            to_email: correoDestino,
            subject: asunto,
            message: contenido,
            fecha: new Date().toLocaleDateString('es-ES'),
            hora: new Date().toLocaleTimeString('es-ES'),
            tipo_reporte: tipo.toUpperCase()
        };
        
        // Enviar correo
        const response = await emailjs.send(
            'default_service', // service ID
            'template_g60lzrr', // template ID
            templateParams
        );
        
        console.log('Correo enviado:', response);
        return { success: true, response };
        
    } catch (error) {
        console.error('Error al enviar correo:', error);
        return { success: false, error: error.message || 'Error desconocido' };
    }
}

// Generar contenido para reporte diario
function generarContenidoDiario(datos) {
    let contenido = `<h2>📊 Reporte Diario Telepizza</h2>`;
    contenido += `<p><strong>Fecha:</strong> ${datos.fecha}</p>`;
    contenido += `<p><strong>Total Empleados:</strong> ${datos.totalTelepizzeros}</p>`;
    contenido += `<p><strong>Registros del día:</strong> ${datos.registros.length}</p>`;
    contenido += `<p><strong>Ausencias del día:</strong> ${datos.ausencias.length}</p>`;
    
    if (datos.registros.length > 0) {
        contenido += `<h3>📋 Registros del Día:</h3>`;
        contenido += `<table border="1" cellpadding="5" style="border-collapse: collapse;">`;
        contenido += `<tr><th>Nombre</th><th>Puesto</th><th>Entrada</th><th>Salida</th><th>Horas</th></tr>`;
        
        datos.registros.forEach(registro => {
            contenido += `<tr>`;
            contenido += `<td>${registro.nombre}</td>`;
            contenido += `<td>${obtenerNombrePuesto(registro.puesto)}</td>`;
            contenido += `<td>${registro.entrada}</td>`;
            contenido += `<td>${registro.salida || 'En turno'}</td>`;
            contenido += `<td>${registro.horasTrabajadas ? convertirMinutosATexto(registro.horasTrabajadas.totalMinutos) : '-'}</td>`;
            contenido += `</tr>`;
        });
        
        contenido += `</table>`;
    }
    
    if (datos.ausencias.length > 0) {
        contenido += `<h3>⚠️ Ausencias del Día:</h3>`;
        datos.ausencias.forEach(ausencia => {
            contenido += `<p><strong>${ausencia.nombre}</strong> - ${ausencia.tipo}: ${ausencia.motivo}</p>`;
        });
    }
    
    return contenido;
}

// Generar contenido para reporte semanal
function generarContenidoSemanal(datos) {
    let contenido = `<h2>📅 Reporte Semanal Telepizza</h2>`;
    contenido += `<p><strong>Semana:</strong> ${datos.numeroSemana} del ${datos.año}</p>`;
    contenido += `<p><strong>Total Empleados:</strong> ${datos.totalEmpleados}</p>`;
    contenido += `<p><strong>Total Registros:</strong> ${datos.totalRegistros}</p>`;
    contenido += `<p><strong>Total Horas Trabajadas:</strong> ${datos.totalHorasTexto}</p>`;
    
    if (Object.keys(datos.porPuesto).length > 0) {
        contenido += `<h3>📊 Horas por Puesto:</h3>`;
        contenido += `<table border="1" cellpadding="5" style="border-collapse: collapse;">`;
        contenido += `<tr><th>Puesto</th><th>Empleados</th><th>Total Horas</th></tr>`;
        
        Object.keys(datos.porPuesto).forEach(puesto => {
            contenido += `<tr>`;
            contenido += `<td>${obtenerNombrePuesto(puesto)}</td>`;
            contenido += `<td>${datos.porPuesto[puesto].totalEmpleados}</td>`;
            contenido += `<td>${datos.porPuesto[puesto].totalHorasTexto}</td>`;
            contenido += `</tr>`;
        });
        
        contenido += `</table>`;
    }
    
    if (Object.keys(datos.empleados).length > 0) {
        contenido += `<h3>👥 Resumen por Empleado:</h3>`;
        contenido += `<table border="1" cellpadding="5" style="border-collapse: collapse;">`;
        contenido += `<tr><th>Nombre</th><th>Puesto</th><th>Días</th><th>Total Horas</th><th>Promedio/Día</th></tr>`;
        
        Object.values(datos.empleados).forEach(empleado => {
            contenido += `<tr>`;
            contenido += `<td>${empleado.nombre}</td>`;
            contenido += `<td>${obtenerNombrePuesto(empleado.puesto)}</td>`;
            contenido += `<td>${empleado.diasTrabajados}</td>`;
            contenido += `<td>${empleado.totalHorasTexto}</td>`;
            contenido += `<td>${empleado.promedioDiario}</td>`;
            contenido += `</tr>`;
        });
        
        contenido += `</table>`;
    }
    
    return contenido;
}

// Generar contenido para reporte mensual
function generarContenidoMensual(datos) {
    let contenido = `<h2>📈 Reporte Mensual Telepizza</h2>`;
    contenido += `<p><strong>Mes:</strong> ${datos.mes}/${datos.año}</p>`;
    contenido += `<p><strong>Total Empleados:</strong> ${datos.totalTelepizzeros}</p>`;
    contenido += `<p><strong>Total Registros:</strong> ${datos.registros.length}</p>`;
    contenido += `<p><strong>Total Ausencias:</strong> ${datos.ausencias.length}</p>`;
    
    // Agrupar por semana
    const semanas = {};
    datos.registros.forEach(registro => {
        const fecha = new Date(registro.fecha);
        const semana = obtenerNumeroSemana(fecha);
        const key = `Semana ${semana}`;
        
        if (!semanas[key]) {
            semanas[key] = {
                registros: 0,
                empleados: new Set(),
                horas: 0
            };
        }
        
        semanas[key].registros++;
        semanas[key].empleados.add(registro.dni);
        if (registro.horasTrabajadas) {
            semanas[key].horas += registro.horasTrabajadas.totalMinutos || 0;
        }
    });
    
    if (Object.keys(semanas).length > 0) {
        contenido += `<h3>📅 Resumen por Semana:</h3>`;
        contenido += `<table border="1" cellpadding="5" style="border-collapse: collapse;">`;
        contenido += `<tr><th>Semana</th><th>Empleados</th><th>Registros</th><th>Total Horas</th></tr>`;
        
        Object.keys(semanas).forEach(semana => {
            contenido += `<tr>`;
            contenido += `<td>${semana}</td>`;
            contenido += `<td>${semanas[semana].empleados.size}</td>`;
            contenido += `<td>${semanas[semana].registros}</td>`;
            contenido += `<td>${convertirMinutosATexto(semanas[semana].horas)}</td>`;
            contenido += `</tr>`;
        });
        
        contenido += `</table>`;
    }
    
    return contenido;
}

// Función auxiliar para convertir minutos a texto (importada de data.js)
function convertirMinutosATexto(minutos) {
    if (!minutos) return "0h 0m";
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
}

// Función auxiliar para obtener nombre del puesto (importada de data.js)
function obtenerNombrePuesto(codigo) {
    const puestos = {
        'auxiliar': 'Auxiliar de Tienda',
        'repartidor': 'Repartidor',
        'encargado': 'Encargado',
        'limpieza': 'Limpieza'
    };
    return puestos[codigo] || codigo;
}
