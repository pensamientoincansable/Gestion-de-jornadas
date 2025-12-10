// ============================================
// CONFIGURACIÓN EMAILJS CORREGIDA
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
        let contenidoHTML = '';
        let contenidoTexto = '';
        
        // Preparar contenido según el tipo de reporte
        switch(tipo) {
            case 'diario':
                asunto = `Reporte Diario Telepizza - ${datos.fecha}`;
                contenidoHTML = generarContenidoDiarioHTML(datos);
                contenidoTexto = generarContenidoDiarioTexto(datos);
                break;
                
            case 'semanal':
                asunto = `Reporte Semanal Telepizza - Semana ${datos.numeroSemana} ${datos.año}`;
                contenidoHTML = generarContenidoSemanalHTML(datos);
                contenidoTexto = generarContenidoSemanalTexto(datos);
                break;
                
            case 'mensual':
                asunto = `Reporte Mensual Telepizza - ${datos.mes}/${datos.año}`;
                contenidoHTML = generarContenidoMensualHTML(datos);
                contenidoTexto = generarContenidoMensualTexto(datos);
                break;
                
            default:
                asunto = `Reporte Telepizza - ${new Date().toLocaleDateString('es-ES')}`;
                contenidoHTML = generarContenidoGeneralHTML(datos);
                contenidoTexto = generarContenidoGeneralTexto(datos);
        }
        
        // Parámetros para el template - usar nombres de variables simples
        const templateParams = {
            to_email: correoDestino,
            from_name: 'Telepizza Gestión',
            subject: asunto,
            message_html: contenidoHTML,
            message_text: contenidoTexto,
            report_date: new Date().toLocaleDateString('es-ES'),
            report_time: new Date().toLocaleTimeString('es-ES'),
            report_type: tipo.toUpperCase()
        };
        
        console.log('Enviando correo con parámetros:', templateParams);
        
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
        return { success: false, error: error.text || error.message || 'Error desconocido' };
    }
}

// Generar contenido HTML para reporte diario
function generarContenidoDiarioHTML(datos) {
    let contenido = `<h2>📊 Reporte Diario Telepizza</h2>`;
    contenido += `<p><strong>Fecha:</strong> ${datos.fecha || 'N/A'}</p>`;
    contenido += `<p><strong>Total Empleados Registrados:</strong> ${datos.totalTelepizzeros || 0}</p>`;
    contenido += `<p><strong>Registros del día:</strong> ${(datos.registros && datos.registros.length) || 0}</p>`;
    contenido += `<p><strong>Ausencias del día:</strong> ${(datos.ausencias && datos.ausencias.length) || 0}</p>`;
    
    if (datos.registros && datos.registros.length > 0) {
        contenido += `<h3>📋 Registros del Día:</h3>`;
        contenido += `<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">`;
        contenido += `<tr><th>Nombre</th><th>Puesto</th><th>Entrada</th><th>Salida</th><th>Horas</th></tr>`;
        
        datos.registros.forEach(registro => {
            contenido += `<tr>`;
            contenido += `<td>${registro.nombre || ''}</td>`;
            contenido += `<td>${obtenerNombrePuesto(registro.puesto) || ''}</td>`;
            contenido += `<td>${registro.entrada || ''}</td>`;
            contenido += `<td>${registro.salida || 'En turno'}</td>`;
            contenido += `<td>${registro.horasTrabajadasTexto || '-'}</td>`;
            contenido += `</tr>`;
        });
        
        contenido += `</table>`;
    } else {
        contenido += `<p><em>No hay registros para este día.</em></p>`;
    }
    
    if (datos.ausencias && datos.ausencias.length > 0) {
        contenido += `<h3>⚠️ Ausencias del Día:</h3>`;
        datos.ausencias.forEach(ausencia => {
            let tipoTexto = '';
            switch(ausencia.tipo) {
                case 'falta': tipoTexto = 'Falta'; break;
                case 'ausencia_justificada': tipoTexto = 'Ausencia Justificada'; break;
                case 'retraso': tipoTexto = 'Retraso'; break;
            }
            contenido += `<p><strong>${ausencia.nombre || ''}</strong> (${obtenerNombrePuesto(ausencia.puesto) || ''}) - ${tipoTexto}: ${ausencia.motivo || ''}</p>`;
        });
    }
    
    contenido += `<hr><p><small>Enviado automáticamente por el sistema de gestión de Telepizza</small></p>`;
    return contenido;
}

// Generar contenido texto para reporte diario
function generarContenidoDiarioTexto(datos) {
    let contenido = `REPORTE DIARIO TELEPIZZA\n`;
    contenido += `========================\n\n`;
    contenido += `Fecha: ${datos.fecha || 'N/A'}\n`;
    contenido += `Total Empleados: ${datos.totalTelepizzeros || 0}\n`;
    contenido += `Registros del día: ${(datos.registros && datos.registros.length) || 0}\n`;
    contenido += `Ausencias del día: ${(datos.ausencias && datos.ausencias.length) || 0}\n\n`;
    
    if (datos.registros && datos.registros.length > 0) {
        contenido += `REGISTROS DEL DÍA:\n`;
        contenido += `=================\n`;
        
        datos.registros.forEach(registro => {
            contenido += `${registro.nombre} (${obtenerNombrePuesto(registro.puesto)}) - Entrada: ${registro.entrada}, Salida: ${registro.salida || 'En turno'}, Horas: ${registro.horasTrabajadasTexto || '-'}\n`;
        });
        contenido += `\n`;
    }
    
    if (datos.ausencias && datos.ausencias.length > 0) {
        contenido += `AUSENCIAS DEL DÍA:\n`;
        contenido += `=================\n`;
        
        datos.ausencias.forEach(ausencia => {
            let tipoTexto = '';
            switch(ausencia.tipo) {
                case 'falta': tipoTexto = 'Falta'; break;
                case 'ausencia_justificada': tipoTexto = 'Ausencia Justificada'; break;
                case 'retraso': tipoTexto = 'Retraso'; break;
            }
            contenido += `${ausencia.nombre} (${obtenerNombrePuesto(ausencia.puesto)}) - ${tipoTexto}: ${ausencia.motivo}\n`;
        });
    }
    
    contenido += `\n---\nEnviado automáticamente por el sistema de gestión de Telepizza`;
    return contenido;
}

// Generar contenido HTML para reporte semanal
function generarContenidoSemanalHTML(datos) {
    let contenido = `<h2>📅 Reporte Semanal Telepizza</h2>`;
    contenido += `<p><strong>Semana:</strong> ${datos.numeroSemana || 'N/A'} del ${datos.año || 'N/A'}</p>`;
    contenido += `<p><strong>Total Empleados:</strong> ${datos.totalEmpleados || 0}</p>`;
    contenido += `<p><strong>Total Registros:</strong> ${datos.totalRegistros || 0}</p>`;
    contenido += `<p><strong>Total Horas Trabajadas:</strong> ${datos.totalHorasTexto || '0h 0m'}</p>`;
    
    if (Object.keys(datos.porPuesto || {}).length > 0) {
        contenido += `<h3>📊 Horas por Puesto:</h3>`;
        contenido += `<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">`;
        contenido += `<tr><th>Puesto</th><th>Empleados</th><th>Total Horas</th></tr>`;
        
        Object.keys(datos.porPuesto).forEach(puesto => {
            contenido += `<tr>`;
            contenido += `<td>${obtenerNombrePuesto(puesto)}</td>`;
            contenido += `<td>${datos.porPuesto[puesto].totalEmpleados || 0}</td>`;
            contenido += `<td>${datos.porPuesto[puesto].totalHorasTexto || '0h 0m'}</td>`;
            contenido += `</tr>`;
        });
        
        contenido += `</table>`;
    }
    
    if (Object.keys(datos.empleados || {}).length > 0) {
        contenido += `<h3>👥 Resumen por Empleado:</h3>`;
        contenido += `<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">`;
        contenido += `<tr><th>Nombre</th><th>Puesto</th><th>Días</th><th>Total Horas</th><th>Promedio/Día</th></tr>`;
        
        Object.values(datos.empleados).forEach(empleado => {
            contenido += `<tr>`;
            contenido += `<td>${empleado.nombre || ''}</td>`;
            contenido += `<td>${obtenerNombrePuesto(empleado.puesto) || ''}</td>`;
            contenido += `<td>${empleado.diasTrabajados || 0}</td>`;
            contenido += `<td>${empleado.totalHorasTexto || '0h 0m'}</td>`;
            contenido += `<td>${empleado.promedioDiario || '0h 0m'}</td>`;
            contenido += `</tr>`;
        });
        
        contenido += `</table>`;
    }
    
    contenido += `<hr><p><small>Enviado automáticamente por el sistema de gestión de Telepizza</small></p>`;
    return contenido;
}

// Generar contenido texto para reporte semanal
function generarContenidoSemanalTexto(datos) {
    let contenido = `REPORTE SEMANAL TELEPIZZA\n`;
    contenido += `========================\n\n`;
    contenido += `Semana: ${datos.numeroSemana || 'N/A'} del ${datos.año || 'N/A'}\n`;
    contenido += `Total Empleados: ${datos.totalEmpleados || 0}\n`;
    contenido += `Total Registros: ${datos.totalRegistros || 0}\n`;
    contenido += `Total Horas Trabajadas: ${datos.totalHorasTexto || '0h 0m'}\n\n`;
    
    if (Object.keys(datos.porPuesto || {}).length > 0) {
        contenido += `HORAS POR PUESTO:\n`;
        contenido += `================\n`;
        
        Object.keys(datos.porPuesto).forEach(puesto => {
            contenido += `${obtenerNombrePuesto(puesto)}: ${datos.porPuesto[puesto].totalEmpleados || 0} empleados, ${datos.porPuesto[puesto].totalHorasTexto || '0h 0m'}\n`;
        });
        contenido += `\n`;
    }
    
    if (Object.keys(datos.empleados || {}).length > 0) {
        contenido += `RESUMEN POR EMPLEADO:\n`;
        contenido += `====================\n`;
        
        Object.values(datos.empleados).forEach(empleado => {
            contenido += `${empleado.nombre} (${obtenerNombrePuesto(empleado.puesto)}): ${empleado.diasTrabajados || 0} días, ${empleado.totalHorasTexto || '0h 0m'}, Promedio: ${empleado.promedioDiario || '0h 0m'}/día\n`;
        });
    }
    
    contenido += `\n---\nEnviado automáticamente por el sistema de gestión de Telepizza`;
    return contenido;
}

// Generar contenido HTML para reporte mensual (simplificado)
function generarContenidoMensualHTML(datos) {
    let contenido = `<h2>📈 Reporte Mensual Telepizza</h2>`;
    contenido += `<p><strong>Mes:</strong> ${datos.mes || 'N/A'}/${datos.año || 'N/A'}</p>`;
    contenido += `<p><strong>Total Empleados:</strong> ${datos.totalTelepizzeros || 0}</p>`;
    contenido += `<p><strong>Total Registros:</strong> ${(datos.registros && datos.registros.length) || 0}</p>`;
    contenido += `<p><strong>Total Ausencias:</strong> ${(datos.ausencias && datos.ausencias.length) || 0}</p>`;
    
    // Calcular total horas del mes
    let totalHorasMes = 0;
    if (datos.registros) {
        datos.registros.forEach(registro => {
            if (registro.horasTrabajadas && registro.horasTrabajadas.totalMinutos) {
                totalHorasMes += registro.horasTrabajadas.totalMinutos;
            }
        });
    }
    
    contenido += `<p><strong>Total Horas Trabajadas:</strong> ${convertirMinutosATexto(totalHorasMes)}</p>`;
    contenido += `<hr><p><small>Enviado automáticamente por el sistema de gestión de Telepizza</small></p>`;
    return contenido;
}

// Generar contenido texto para reporte mensual
function generarContenidoMensualTexto(datos) {
    let contenido = `REPORTE MENSUAL TELEPIZZA\n`;
    contenido += `========================\n\n`;
    contenido += `Mes: ${datos.mes || 'N/A'}/${datos.año || 'N/A'}\n`;
    contenido += `Total Empleados: ${datos.totalTelepizzeros || 0}\n`;
    contenido += `Total Registros: ${(datos.registros && datos.registros.length) || 0}\n`;
    contenido += `Total Ausencias: ${(datos.ausencias && datos.ausencias.length) || 0}\n`;
    
    // Calcular total horas del mes
    let totalHorasMes = 0;
    if (datos.registros) {
        datos.registros.forEach(registro => {
            if (registro.horasTrabajadas && registro.horasTrabajadas.totalMinutos) {
                totalHorasMes += registro.horasTrabajadas.totalMinutos;
            }
        });
    }
    
    contenido += `Total Horas Trabajadas: ${convertirMinutosATexto(totalHorasMes)}\n`;
    contenido += `\n---\nEnviado automáticamente por el sistema de gestión de Telepizza`;
    return contenido;
}

// Funciones auxiliares para generar contenido general
function generarContenidoGeneralHTML(datos) {
    return `<h2>📋 Reporte Telepizza</h2>
            <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
            <p>Este es un reporte general del sistema de gestión.</p>
            <hr><p><small>Enviado automáticamente por el sistema de gestión de Telepizza</small></p>`;
}

function generarContenidoGeneralTexto(datos) {
    return `REPORTE TELEPIZZA\n================\n\nFecha: ${new Date().toLocaleDateString('es-ES')}\n\nEste es un reporte general del sistema de gestión.\n\n---\nEnviado automáticamente por el sistema de gestión de Telepizza`;
}

// Funciones auxiliares para convertir minutos a texto
function convertirMinutosATexto(minutos) {
    if (!minutos || minutos === 0) return "0h 0m";
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
}

// Función auxiliar para obtener nombre del puesto
function obtenerNombrePuesto(codigo) {
    const puestos = {
        'auxiliar': 'Auxiliar de Tienda',
        'repartidor': 'Repartidor',
        'encargado': 'Encargado',
        'limpieza': 'Limpieza'
    };
    return puestos[codigo] || codigo || 'No especificado';
}
