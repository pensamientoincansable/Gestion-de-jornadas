// ============================================
// CONFIGURACIÓN EMAILJS PARA ENVÍO DE PDF
// ============================================

// Inicializar EmailJS con tu clave pública
emailjs.init("lfpbuaU91P6LcoHSi");

// Función para enviar reporte PDF por correo
async function enviarPDFPorCorreo(titulo, pdfBlob, correoDestino) {
    try {
        // Verificar que EmailJS esté cargado
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS no está cargado');
            return { success: false, error: 'EmailJS no está cargado' };
        }
        
        // Convertir Blob a base64 para adjuntar
        const base64data = await blobToBase64(pdfBlob);
        
        // Preparar parámetros para el template
        const templateParams = {
            to_email: correoDestino,
            subject: `${titulo} - Telepizza`,
            from_name: 'Telepizza Gestión',
            report_title: titulo,
            fecha_generacion: new Date().toLocaleDateString('es-ES'),
            hora_generacion: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            // EmailJS necesita datos base64 para adjuntos
            attachment: base64data,
            attachment_name: `${titulo.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`
        };
        
        console.log('Enviando PDF por correo a:', correoDestino);
        
        // Enviar correo usando el servicio y template correctos
        const response = await emailjs.send(
            'default_service', // service ID
            'template_g60lzrr', // template ID - Asegúrate de que este template soporte adjuntos
            templateParams
        );
        
        console.log('Correo enviado exitosamente:', response);
        return { success: true, response };
        
    } catch (error) {
        console.error('Error al enviar correo con PDF:', error);
        return { 
            success: false, 
            error: error.text || error.message || 'Error desconocido al enviar el PDF' 
        };
    }
}

// Función auxiliar para convertir Blob a base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result.split(',')[1];
            resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Función para enviar reporte HTML (mantenida para compatibilidad)
async function enviarReportePorCorreo(tipo, datos, correoDestino) {
    try {
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS no está cargado');
            return { success: false, error: 'EmailJS no está cargado' };
        }
        
        let asunto = '';
        let reportPeriod = '';
        
        // Preparar contenido según el tipo de reporte
        switch(tipo) {
            case 'diario':
                asunto = `Reporte Diario Telepizza - ${datos.fecha}`;
                reportPeriod = datos.fecha;
                break;
                
            case 'semanal':
                asunto = `Reporte Semanal Telepizza - Semana ${datos.numeroSemana} ${datos.año}`;
                reportPeriod = `Semana ${datos.numeroSemana} del ${datos.año}`;
                break;
                
            case 'mensual':
                asunto = `Reporte Mensual Telepizza - ${datos.mes}/${datos.año}`;
                reportPeriod = `${datos.mes}/${datos.año}`;
                break;
                
            default:
                asunto = `Reporte Telepizza - ${new Date().toLocaleDateString('es-ES')}`;
                reportPeriod = new Date().toLocaleDateString('es-ES');
        }
        
        // Preparar arrays de registros e incidencias
        let registrosArray = [];
        let incidenciaArray = [];
        
        if (datos.registros && datos.registros.length > 0) {
            registrosArray = datos.registros.map(registro => ({
                nombre: registro.nombre || '',
                dni: registro.dni || 'No disponible',
                fecha: registro.fecha || datos.fecha || new Date().toLocaleDateString('es-ES'),
                entrada: registro.entrada || '',
                salida: registro.salida || '',
                horas_trabajadas: registro.horasTrabajadasTexto || '-',
                estado: registro.salida ? '✅ Completa' : '🟡 Activa'
            }));
        }
        
        if (datos.ausencias && datos.ausencias.length > 0) {
            incidenciaArray = datos.ausencias.map(ausencia => ({
                nombre: ausencia.nombre || '',
                fecha: ausencia.fecha || datos.fecha || new Date().toLocaleDateString('es-ES'),
                tipo: ausencia.tipo || '',
                motivo: ausencia.motivo || ''
            }));
        }
        
        // Calcular totales
        const ahora = new Date();
        const totalEmpleados = datos.totalTelepizzeros || datos.totalEmpleados || 0;
        const totalRegistros = registrosArray.length;
        const totalAusencias = incidenciaArray.length;
        
        // Calcular horas totales
        let totalHorasMinutos = 0;
        if (datos.registros) {
            datos.registros.forEach(registro => {
                if (registro.horasTrabajadas && registro.horasTrabajadas.totalMinutos) {
                    totalHorasMinutos += registro.horasTrabajadas.totalMinutos;
                }
            });
        }
        const totalHoras = convertirMinutosATexto(totalHorasMinutos);
        
        // Parámetros para el template
        const templateParams = {
            to_email: correoDestino,
            from_name: 'Telepizza Gestión',
            subject: asunto,
            report_type: tipo.toUpperCase(),
            report_period: reportPeriod,
            fecha_generacion: ahora.toLocaleDateString('es-ES'),
            hora_generacion: ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            total_empleados: totalEmpleados,
            total_registros: totalRegistros,
            total_horas: totalHoras,
            total_ausencias: totalAusencias,
            registros_array: registrosArray,
            incidencia_array: incidenciaArray
        };
        
        console.log('Enviando correo HTML con parámetros:', templateParams);
        
        // Enviar correo
        const response = await emailjs.send(
            'default_service',
            'template_g60lzrr',
            templateParams
        );
        
        console.log('Correo HTML enviado:', response);
        return { success: true, response };
        
    } catch (error) {
        console.error('Error al enviar correo HTML:', error);
        return { success: false, error: error.text || error.message || 'Error desconocido' };
    }
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

// Exportar funciones para uso en app.js
window.enviarPDFPorCorreo = enviarPDFPorCorreo;
window.enviarReportePorCorreo = enviarReportePorCorreo;