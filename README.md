# Normalizador de Direcciones CABA

Este proyecto es un sistema automatizado para normalizar direcciones de la Ciudad Autónoma de Buenos Aires (CABA) a un formato estándar y consistente.

## Descripción

El normalizador procesa direcciones de la Comuna 14 de CABA, aplicando reglas de limpieza y estandarización para convertir direcciones con formato inconsistente en un formato uniforme que incluye:

- Nombres de calles estandarizados (formato Title Case)
- Corrección de abreviaturas comunes
- Eliminación de información irrelevante (departamentos, pisos, etc.)
- Formato final: `Nombre de Calle Número, Código Postal, CABA`

## Estructura del Proyecto

```
├── normalizar.js          # Archivo principal con la lógica de normalización
├── reglas.js              # Reglas de corrección y transformación
├── package.json           # Dependencias del proyecto
├── direcciones_comuna14.csv    # Archivo de entrada con direcciones a procesar
└── direcciones_normalizadas.csv # Archivo de salida con direcciones normalizadas
```

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd normalizador_direcciones
```

2. Instala las dependencias:
```bash
npm install
```

## Uso

Ejecuta el normalizador con:
```bash
node normalizar.js
```

El proceso:
1. Lee el archivo `direcciones_comuna14.csv`
2. Aplica las reglas de normalización a cada dirección
3. Genera el archivo `direcciones_normalizadas.csv` con los resultados

## Formato de Datos

### Entrada (`direcciones_comuna14.csv`)
```csv
direccion_limpia,codigo_postal
CABILDO 1123,1426
CABRERA JOSE ANTONIO 3693,1186
SCALABRINI ORTIZ 2043,1414
```

### Salida (`direcciones_normalizadas.csv`)
```csv
direccion_original,codigo_postal,direccion_normalizada
CABILDO 1123,1426,"Avenida Cabildo 1123, 1426, CABA"
CABRERA JOSE ANTONIO 3693,1186,"Jose Antonio Cabrera 3693, 1186, CABA"
SCALABRINI ORTIZ 2043,1414,"Avenida Raul Scalabrini Ortiz 2043, 1414, CABA"
```

## Funcionalidades

### Normalización de Direcciones
- **Limpieza de caracteres**: Eliminación de acentos, puntuación y espacios extra
- **Eliminación de "ruido"**: Remoción de información de departamentos, pisos, torres, etc.
- **Formato Title Case**: Conversión a formato de título consistente
- **Separación número/calle**: Identificación y reordenamiento de números de puerta

### Reglas de Corrección
El archivo `reglas.js` contiene más de 100 reglas que incluyen:

- **Avenidas principales**: Corrección de abreviaturas (Av, av) a formato completo
- **Nombres completos**: Expansión de iniciales y abreviaturas de nombres
- **Casos especiales**: Reordenamiento de nombres invertidos
- **Correcciones tipográficas**: Arreglo de errores comunes de escritura

### Ejemplos de Transformaciones

| Entrada | Salida |
|---------|---------|
| `CABILDO 1123` | `Avenida Cabildo 1123` |
| `CABRERA JOSE ANTONIO 3693` | `Jose Antonio Cabrera 3693` |
| `av del libertador 1234` | `Avenida Del Libertador 1234` |
| `scalabrini ortiz 567` | `Avenida Raul Scalabrini Ortiz 567` |
| `COSTA RICA 4435 DPTO 2B` | `Costa Rica 4435` |

## Componentes Principales

### `normalizar.js`
- **`normalizarDireccion()`**: Función principal de normalización
- **`toTitleCase()`**: Conversión a formato de título
- **`procesarArchivo()`**: Procesamiento del archivo CSV completo

### `reglas.js`
Array de reglas ordenadas por prioridad que incluyen:
- Casos específicos de reordenamiento
- Correcciones de avenidas
- Normalización de nombres de calles y pasajes
- Expansión de abreviaturas

## Dependencias

- **csv-parser**: Lectura de archivos CSV
- **csv-writer**: Escritura de archivos CSV

## Casos de Uso

Este normalizador es útil para:
- Sistemas de gestión de direcciones
- Bases de datos inmobiliarias
- Servicios de delivery y logística
- Análisis geoespacial
- Integración con APIs de mapas

## Rendimiento

- Procesa aproximadamente 19,664 direcciones de la Comuna 14
- Tiempo de procesamiento: < 1 minuto para el dataset completo
- Genera un archivo de salida con formato uniforme

## Mejoras Futuras

- Soporte para otras comunas de CABA
- Validación de códigos postales
- Integración con servicios de geolocalización
- API REST para normalización en tiempo real
- Soporte para direcciones de otras provincias argentinas

## Contribuciones

Las contribuciones son bienvenidas. Para contribuir:
1. Haz fork del proyecto
2. Crea una rama para tu feature
3. Agrega nuevas reglas en `reglas.js` si es necesario
4. Envía un pull request

## Licencia

Este proyecto está bajo la licencia ISC.

## Contacto

Para consultas o sugerencias sobre el normalizador de direcciones, por favor abre un issue en el repositorio.