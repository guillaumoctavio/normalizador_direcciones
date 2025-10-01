// Importamos las librerías necesarias
const fs = require('fs');
const csv = require('csv-parser');
const correcciones = require('./reglas.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * Convierte un string a formato "Title Case" (la primera letra de cada palabra en mayúscula).
 * @param {string} str El string a convertir.
 * @returns {string} El string en formato Title Case.
 */
function toTitleCase(str) {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}
/**
 * Normaliza una dirección de CABA a un formato estándar.
 * @param {string} direccion La dirección completa a normalizar.
 * @returns {string} La dirección normalizada.
 */
function normalizarDireccion(direccion) {
    if (typeof direccion !== 'string' || !direccion) {
        return "";
    }

    let direccionLimpia = direccion.toLowerCase();
    direccionLimpia = direccionLimpia.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    direccionLimpia = direccionLimpia.replace(/[.,]/g, '');
    direccionLimpia = direccionLimpia.replace(/\s+/g, ' ').trim();

    // 1. LIMPIEZA DE "RUIDO" (port, dto, etc.)
    const regexRuido = /\s+\b(port|dto|depto|dpto|dt|uf|uc|ed|timbre|tbre|tr|hab|of|pb|piso|un|cpo|cuerpo|lado|loft|bk|col|mod|torre|s\/n|amarilla|amarillo|azul|verde|rojo|naranja|violeta|gris)\s*(\w+|\d+)?\b/g;
    direccionLimpia = direccionLimpia.replace(regexRuido, '');

    // 2. CONSOLIDACIÓN FINAL DE REGLAS
    // Un único array ordenado que maneja todo.

    // **EL CAMBIO CLAVE**: Un solo bucle que se detiene después del primer reemplazo exitoso.
    for (const regla of correcciones) {
        const patron = regla[0];
        const reemplazo = regla[1];
        // Usamos una nueva variable para no interferir con la original en el bucle
        const direccionModificada = direccionLimpia.replace(patron, reemplazo);

        // Si la regla produjo un cambio, actualizamos y SALIMOS del bucle.
        if (direccionModificada !== direccionLimpia) {
            direccionLimpia = direccionModificada;
            break;
        }
    }

    // 3. SEPARACIÓN DEL NÚMERO Y FORMATO FINAL
    const match = direccionLimpia.match(/(\d+)$/);
    let nombreCalle = direccionLimpia;
    let numero = '';
    if (match) {
        numero = match[1];
        nombreCalle = direccionLimpia.substring(0, match.index).trim();
    }

    nombreCalle = nombreCalle.replace(/\s+/g, ' ').trim();
    nombreCalle = toTitleCase(nombreCalle);

    return numero ? `${nombreCalle} ${numero}` : nombreCalle;
}

/**
 * Función principal que lee, procesa y escribe el archivo CSV.
 */
async function procesarArchivo() {
    // --- CONFIGURACIÓN ---
    const archivoEntrada = 'direcciones_comuna14.csv';
    const archivoSalida = 'direcciones_normalizadas.csv';

    const registros = [];
    console.log(`Iniciando la lectura de '${archivoEntrada}'...`);

    fs.createReadStream(archivoEntrada)
        .pipe(csv())
        .on('data', (fila) => {
            // CAMBIO: Tomamos la dirección base
            let direccionBase = fila.direccion_limpia;
            const codigoPostal = fila.codigo_postal;

            // CAMBIO: Limpiamos la información de torres ANTES de normalizar
            const regexTorre = /\s+\b(t|torre|to)\s*(\d+|i{1,3}|iv|v)\b/g;
            if (direccionBase) {
                direccionBase = direccionBase.toLowerCase().replace(regexTorre, '').trim();
            }

            // Llama a la función de normalización SÓLO con la dirección base
            const direccionNormalizada = normalizarDireccion(direccionBase);

            // CAMBIO: Construimos la cadena final aquí
            let direccionFinalCompleta = direccionNormalizada;
            if (codigoPostal && String(codigoPostal).trim()) {
                direccionFinalCompleta += `, ${String(codigoPostal).trim()}`;
            }
            direccionFinalCompleta += ', CABA';


            // Prepara la nueva fila para el archivo de salida
            const nuevoRegistro = {
                direccion_original: fila.direccion_limpia, // Guardamos la original para referencia
                codigo_postal: fila.codigo_postal,
                direccion_normalizada: direccionFinalCompleta
            };
            registros.push(nuevoRegistro);
        })
        .on('end', () => {
            console.log("Lectura completada. Escribiendo resultados...");
            if (registros.length === 0) {
                console.log("No se encontraron registros para procesar.");
                return;
            }

            const cabeceras = Object.keys(registros[0]).map(key => ({ id: key, title: key }));

            const csvWriter = createCsvWriter({
                path: archivoSalida,
                header: cabeceras
            });

            csvWriter.writeRecords(registros)
                .then(() => console.log(`✅ ¡Proceso completado! Revisa el archivo '${archivoSalida}'.`));
        })
        .on('error', (error) => {
            console.error("❌ Error al leer el archivo:", error.message);
        });
}
// Llama a la función principal para iniciar el proceso
procesarArchivo();