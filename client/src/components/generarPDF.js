import jsPDF from 'jspdf';

// --- DATOS DE EJEMPLO ---
const datosEmpresa = {
    nombre: "Lopez Repuestos SRL",
    direccion: "Ex Ruta 7, km781, Juana Koslay, San Luis",
    telefono: "(2664) 861658",
    email: "cristian.rlopez@hotmail.com"
};



/**
 * Genera el documento PDF de la factura, dibujando la tabla manualmente.
 */
export const generarPDF = (factura) => {

    const repuestosMapeados = factura.se_facturan_en_read.map(item => {

        const cantidad = item.cantidad;
        const precio = item.precio;
        const subtotal = item.subtotal; 

        const repuestoDetalle = item.codigo_repuesto; 

        return {

            descripcion: repuestoDetalle.descripcion,
            cantidad: cantidad,
            precio: precio,
            subtotal: subtotal
        };
    });
    
    const doc = new jsPDF();
    let y = 20; // Posición inicial vertical (coordenada Y)
    const margenX = 10;
    const anchoPagina = 210; // Ancho A4 en mm

    // --- 2. Información de la Empresa (Encabezado) ---
    doc.setFontSize(18);
    doc.text(datosEmpresa.nombre, anchoPagina / 2, y, { align: "center" });
    y += 7;
    doc.setFontSize(10);
    doc.text(`E-mail: ${datosEmpresa.email} | Tel: ${datosEmpresa.telefono}`, anchoPagina / 2, y, { align: "center" });
    y += 5;
    doc.text(datosEmpresa.direccion, anchoPagina / 2, y, { align: "center" });
    y += 10;
    
    doc.setDrawColor(0);
    doc.line(margenX, y, anchoPagina - margenX, y); // Línea divisoria
    y += 5;

    // --- 3. Título de la Factura y Fecha ---
    doc.setFontSize(14);
    doc.text("FACTURA DE VENTA", margenX, y);
    doc.setFontSize(10);
    doc.text(`Fecha: ${factura.fecha}`, anchoPagina - margenX, y, { align: "right" });
    y += 5;
    doc.text(`N° Factura: ${factura.nro_factura}`, anchoPagina - margenX, y, { align: "right" });
    y += 5;
    doc.text(`Metodo Pago: ${factura.metodo_pago}`, anchoPagina - margenX, y, { align: "right" });
    y += 10;



    // --- 4. Información de Cliente y Empleado ---
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Información del Cliente:", margenX, y);
    doc.text("Información del Empleado:", anchoPagina / 2 + 5, y); // Columna derecha
    y += 5;
    doc.setFont(undefined, 'normal');
    
    // Columna Cliente
    doc.text(`ID: ${factura.cliente_participa_read.codigo}`, margenX, y);
    doc.text(`Nombre: ${factura.cliente_participa_read.nombre}`, margenX, y + 5);
    doc.text(`Dirección: ${factura.cliente_participa_read.direccion}`, margenX, y + 10);
    doc.text(`CUIT: ${factura.cliente_participa_read.cuit}`, margenX, y + 15);
    
    // Columna Empleado
    doc.text(`Atendido por: ${factura.empleado_hace_read.nombre}`, anchoPagina / 2 + 5, y);

    y += 20; // Mover hacia abajo después de la información

    // --- 5. Tabla de Repuestos (Dibujada Manualmente) ---
    const anchoColumna = (anchoPagina - 2 * margenX) / 10; // 10 unidades para calcular anchos
    const posicionesX = {
        desc: margenX,
        cant: margenX + 5 * anchoColumna, // 50%
        pUnit: margenX + 7 * anchoColumna, // 70%
        total: anchoPagina - margenX - 2 * anchoColumna // Posición del total (alineado a la derecha)
    };
    const anchoTotalCol = anchoPagina - margenX;

    // Encabezado de la Tabla
    doc.setDrawColor(0);
    doc.setFillColor(200, 200, 200); // Color gris claro de fondo
    doc.rect(margenX, y - 2, anchoPagina - 2 * margenX, 7, 'F'); // Dibujar el rectángulo de fondo
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Descripción", posicionesX.desc, y + 3);
    doc.text("Cant.", posicionesX.cant, y + 3);
    doc.text("P. Unitario", posicionesX.pUnit, y + 3);
    doc.text("SubTotal", anchoTotalCol, y + 3, { align: "right" });
    y += 7;

    // Filas de la Tabla
    doc.setFont(undefined, 'normal');
    repuestosMapeados.forEach(item => {

        doc.line(margenX, y, anchoPagina - margenX, y); 
        y += 5;
        
        // Contenido (Ahora las propiedades SÍ existen en 'item')
        doc.text(item.descripcion, posicionesX.desc, y);
        doc.text(String(item.cantidad), posicionesX.cant + 4, y, { align: "right" }); // Convertido a string
        doc.text(`$${item.precio}`, posicionesX.pUnit + 8, y, { align: "right" }); // Formato de moneda
        doc.text(`$${item.subtotal}`, anchoTotalCol, y, { align: "right" }); // Formato de moneda

        y += 2;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    // Línea final de la tabla
    doc.line(margenX, y + 1, anchoPagina - margenX, y + 1);
    y += 10;

    // --- 6. Totales (A la derecha) ---
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const xTotales = anchoPagina - margenX;
 
    // Línea separadora
    doc.setDrawColor(0);
    doc.line(xTotales - 40, y, xTotales, y); 
    y += 5;
    
    // Total a Pagar
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL: $${factura.total}`, xTotales, y, { align: "right" });
    y += 15;

    // --- 7. Pie de Página ---
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    doc.text("Gracias por su preferencia.", anchoPagina / 2, 280, { align: "center" });

    // Guardar el PDF
    doc.save('factura_manual.pdf');
};