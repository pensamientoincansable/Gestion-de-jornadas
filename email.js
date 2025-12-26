// ============================================
// CONFIGURACIÓN EMAILJS PARA ENVÍO DE PDF
// ============================================

// Inicializar EmailJS con tu clave pública
// IMPORTANTE: Reemplaza "TU_USER_ID" con tu User ID de EmailJS
emailjs.init("lfpbuaU91P6LcoHSi");

// Función para enviar reporte PDF por correo
async function enviarPDFPorCorreo(titulo, pdfBlob, correoDestino, correoRemitente) {
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
            from_email: correoRemitente || "fichajetelepizza@outlook.es",
            subject: `${titulo} - Telepizza`,
            message: `Se adjunta el reporte "${titulo}" generado el ${new Date().toLocaleDateString('es-ES')}`,
            report_title: titulo,
            fecha_generacion: new Date().toLocaleDateString('es-ES'),
            hora_generacion: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            // Para adjuntos en EmailJS, necesitamos usar un template configurado para adjuntos
            attachment: base64data,
            attachment_name: `${titulo.replace(/[^a-z0-9]/gi, '_')}.pdf`
        };
        
        console.log('Enviando PDF por correo a:', correoDestino);
        console.log('Remitente:', correoRemitente);
        
        // Enviar correo usando el servicio y template correctos
        // NOTA: Necesitas configurar en EmailJS:
        // 1. Un servicio de correo (Gmail, Outlook, etc.)
        // 2. Un template que acepte adjuntos
        const response = await emailjs.send(
            'service_8z5zbsr', // service ID - Reemplaza con tu Service ID
            'template_g60lzrr', // template ID - Reemplaza con tu Template ID
            templateParams
        );
        
        console.log('Correo enviado exitosamente:', response);
        return { success: true, response };
        
    } catch (error) {
        console.error('Error al enviar correo con PDF:', error);
        
        // Si falla el envío con adjunto, intentamos enviar sin adjunto pero con enlace para descargar
        try {
            console.log('Intentando método alternativo...');
            
            // Crear URL para el PDF
            const pdfUrl = URL.createObjectURL(pdfBlob);
            
            const templateParamsAlt = {
                to_email: correoDestino,
                from_email: correoRemitente || "fichajetelepizza@outlook.es",
                subject: `${titulo} - Telepizza`,
                message: `Reporte "${titulo}" generado el ${new Date().toLocaleDateString('es-ES')}. 
                
Para descargar el reporte en PDF, por favor accede al sistema de gestión de Telepizza.

Si tienes problemas para acceder al archivo, por favor contacta con el administrador del sistema.

---
Sistema de Gestión de Jornadas Telepizza
Este es un correo automático, por favor no responder.`,
                report_title: titulo,
                fecha_generacion: new Date().toLocaleDateString('es-ES')
            };
            
            const responseAlt = await emailjs.send(
                'service_8z5zbsr', // service ID
                'template_g60lzrr', // template ID
                templateParamsAlt
            );
            
            console.log('Correo alternativo enviado:', responseAlt);
            return { 
                success: true, 
                response: responseAlt,
                message: 'Correo enviado (sin adjunto por limitaciones técnicas)' 
            };
            
        } catch (altError) {
            console.error('Error en método alternativo:', altError);
            return { 
                success: false, 
                error: 'No se pudo enviar el correo. Error: ' + (altError.text || altError.message || 'Error desconocido')
            };
        }
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
async function enviarReportePorCorreo(tipo, datos, correoDestino, correoRemitente) {
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
        
        // Calcular totales
        const ahora = new Date();
        const totalEmpleados = datos.totalTelepizzeros || datos.totalEmpleados || 0;
        const totalRegistros = datos.registros ? datos.registros.length : 0;
        const totalAusencias = datos.ausencias ? datos.ausencias.length : 0;
        
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
            from_email: correoRemitente || "fichajetelepizza@outlook.es",
            subject: asunto,
            message: `Reporte ${tipo.toUpperCase()} de Telepizza

Período: ${reportPeriod}
Fecha de generación: ${ahora.toLocaleDateString('es-ES')} ${ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}

RESUMEN:
• Total empleados: ${totalEmpleados}
• Total registros: ${totalRegistros}
• Total horas trabajadas: ${totalHoras}
• Total ausencias/incidencias: ${totalAusencias}

---
Sistema de Gestión de Jornadas Telepizza
Este es un correo automático, por favor no responder.`,
            report_type: tipo.toUpperCase(),
            report_period: reportPeriod,
            fecha_generacion: ahora.toLocaleDateString('es-ES'),
            hora_generacion: ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            total_empleados: totalEmpleados,
            total_registros: totalRegistros,
            total_horas: totalHoras,
            total_ausencias: totalAusencias
        };
        
        console.log('Enviando correo HTML con parámetros:', templateParams);
        
        // Enviar correo
        const response = await emailjs.send(
            'service_8z5zbsr',
            'template_g60lzrr',
            templateParams
        );
        
        console.log('Correo HTML enviado:', response);
        return { success: true, response };
        
    } catch (error) {
        console.error('Error al enviar correo HTML:', error);
       
