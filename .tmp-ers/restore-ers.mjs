import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const source = 'C:/Users/juana/Documents/DUOC UC/Fullstack II/DSY1104 Evaluación Parcial 1 - Anexo 2 Planilla de Requerimientos.xlsx';
const outputDir = 'C:/React/clinica-nutrivida/outputs/ers-restaurado-20261028';
const outputPath = `${outputDir}/ERS_NutriVida_actualizado.xlsx`;
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(source));
const sheet = workbook.worksheets.getItem('Requerimiento Inicial');

const reqs = [
  ['R.1','Crear cuenta de paciente','Funcional','Funcional de usuario','Paciente','El sistema permite registrar una cuenta con los datos requeridos y validaciones del formulario.','Se crea una cuenta con datos válidos, se conserva para iniciar sesión y se informa el resultado al usuario.','Completado'],
  ['R.2','Iniciar sesión','Funcional','Funcional de usuario','Paciente, Administrador','El sistema valida las credenciales y permite el acceso según el tipo de cuenta.','Credenciales válidas abren el perfil o panel correspondiente; credenciales inválidas muestran un mensaje y no autentican.','Completado'],
  ['R.3','Control de acceso administrativo','Funcional','Funcional de sistema','Administrador, Paciente','Las funciones administrativas están disponibles solo para una cuenta con rol de administrador.','Una cuenta paciente que intenta abrir administración no accede a sus funciones.','Completado'],
  ['R.4','Consultar y editar perfil','Funcional','Funcional de usuario','Paciente','El paciente puede revisar sus datos y modificar los campos habilitados de su perfil.','Los cambios válidos se guardan y aparecen al volver a consultar el perfil.','Completado'],
  ['R.5','Consultar catálogo de servicios','Funcional','Funcional de usuario','Visitante, Paciente','El sistema muestra los servicios disponibles con nombre, descripción, precio, duración, modalidad e imagen cuando existan.','El catálogo presenta los servicios guardados y sus datos asociados.','Completado'],
  ['R.6','Buscar y filtrar servicios','Funcional','Funcional de usuario','Visitante, Paciente','El usuario puede buscar servicios y acotar resultados por categoría.','La lista se actualiza con resultados que cumplen simultáneamente los filtros seleccionados; sin coincidencias se informa el estado vacío.','Completado'],
  ['R.7','Consultar detalle de servicio','Funcional','Funcional de usuario','Visitante, Paciente','El usuario puede abrir el detalle de un servicio y revisar su información antes de reservar.','La página muestra los datos del servicio solicitado y ofrece acceso al flujo de reserva.','Completado'],
  ['R.8','Solicitar reserva de hora','Funcional','Funcional de usuario','Paciente','El paciente puede seleccionar servicio, fecha y hora e ingresar sus datos para solicitar una reserva.','Una solicitud válida se guarda y queda asociada al servicio, fecha, hora y datos ingresados.','Completado'],
  ['R.9','Validar datos de reserva','Funcional','Funcional de sistema','Paciente','El formulario valida campos obligatorios, formato y longitud de RUT/celular, y evita fechas pasadas.','Los datos inválidos muestran errores; la reserva no se guarda hasta corregirlos.','Completado'],
  ['R.10','Mostrar confirmación de reserva','Funcional','Funcional de usuario','Paciente','El sistema presenta una confirmación con el resumen de la reserva registrada.','Después de guardar, se muestra el servicio y los datos principales de la hora solicitada.','Completado'],
  ['R.11','Consultar citas del paciente','Funcional','Funcional de usuario','Paciente','El paciente puede consultar sus reservas registradas y su estado.','La vista lista las citas asociadas a la cuenta y refleja el estado almacenado.','Completado'],
  ['R.12','Gestionar citas desde administración','Funcional','Funcional de usuario','Administrador','El administrador puede revisar las reservas para apoyar la gestión de la agenda.','El panel muestra las reservas registradas y permite las acciones administrativas implementadas.','Parcial: persistencia local del navegador; no hay agenda compartida entre dispositivos.'],
  ['R.13','Crear servicios','Funcional','Funcional de usuario','Administrador','El administrador puede agregar servicios con sus datos e imagen.','Un servicio válido se guarda y aparece en el catálogo sin recargar manualmente los datos.','Completado'],
  ['R.14','Editar servicios','Funcional','Funcional de usuario','Administrador','El administrador puede modificar la información de un servicio existente.','Al guardar, se actualiza el registro correspondiente sin crear un duplicado y se conserva la imagen cuando no se reemplaza.','Completado'],
  ['R.15','Eliminar servicios','Funcional','Funcional de usuario','Administrador','El administrador puede retirar un servicio del catálogo tras confirmar la acción.','Al confirmar la eliminación, el servicio deja de aparecer en el catálogo.','Completado'],
  ['R.16','Enviar mensaje de contacto','Funcional','Funcional de usuario','Visitante, Paciente','El usuario puede enviar una consulta mediante el formulario de contacto.','El sistema valida los campos requeridos, guarda el mensaje y muestra una respuesta de envío.','Completado'],
  ['R.17','Consultar conversación de contacto','Funcional','Funcional de usuario','Paciente, Administrador','El paciente y el administrador pueden revisar el historial de mensajes y respuestas asociado a la conversación.','Los mensajes enviados y las respuestas aparecen en el mismo hilo para ambos roles.','Completado'],
  ['R.18','Responder mensajes de contacto','Funcional','Funcional de usuario','Administrador','El administrador puede responder desde el panel de conversaciones.','La respuesta se guarda en el hilo y queda visible para el paciente al consultarlo.','Completado'],
  ['R.19','Navegar mediante rutas de la aplicación','Funcional','Funcional de sistema','Visitante, Paciente, Administrador','La aplicación ofrece navegación entre las páginas implementadas mediante rutas de React.','Cada enlace lleva a su página correspondiente y las rutas protegidas respetan el rol.','Completado'],
  ['R.20','Usar componentes reutilizables','No funcional','No funcional de producto','Equipo de desarrollo','La interfaz organiza elementos reutilizables siguiendo Atomic Design y componentes React con TypeScript.','Los componentes compartidos reciben sus datos mediante props y se reutilizan en las vistas que corresponden.','Completado'],
  ['R.21','Persistir información en el navegador','No funcional','No funcional de producto','Paciente, Administrador','La versión frontend conserva cuentas, servicios, reservas y conversaciones mediante almacenamiento local del navegador.','Los datos siguen disponibles al recargar en el mismo navegador. La información no se sincroniza entre equipos.','Parcial: almacenamiento local; no se incluye backend ni base de datos remota.'],
  ['R.22','Validar formularios y comunicar errores','No funcional','No funcional de producto','Visitante, Paciente, Administrador','Los formularios indican campos obligatorios, formatos inválidos y acciones exitosas con mensajes comprensibles.','Cada error se asocia al campo o acción correspondiente y permite corregir la entrada.','Completado'],
  ['R.23','Visualizar la interfaz en distintos tamaños','No funcional','No funcional de producto','Visitante, Paciente, Administrador','Las páginas adaptan su distribución a dispositivos móviles y pantallas de escritorio.','Navegación, formularios y contenido siguen siendo utilizables en los tamaños contemplados por el proyecto.','Completado según revisión del equipo; no se adjunta matriz formal de dispositivos.'],
  ['R.24','Probar flujos principales del sistema','No funcional','No funcional de producto','Equipo de desarrollo','Las pruebas automatizadas cubren los flujos principales con Vitest y React Testing Library.','La ejecución termina con 15 pruebas aprobadas, distribuidas en seis archivos de prueba.','Completado; cobertura V8 registrada aparte, sin umbral mínimo especificado.'],
];

// Preserve the supplied instructions sheet and template, updating only the requirements sheet.
sheet.getRange('A2:H25').copyFrom(sheet.getRange('A2:H2'), 'all');
sheet.getRange('A1:H1').values = [[
  '[R-N°]',
  '[Nombre del Requerimiento]',
  'Tipo Requerimiento [Funcional, No Funcional]',
  'Clasificación',
  'Actores Relacionados',
  '[Descripción corta del requerimiento]',
  'Criterio de Aceptación',
  'Estado / alcance',
]];
sheet.getRange('A2:H25').values = reqs;
sheet.getRange('A1:H1').format.wrapText = true;
sheet.getRange('A1:H25').format.verticalAlignment = 'center';
sheet.getRange('A1:H25').format.wrapText = true;
sheet.getRange('A1:H1').format.rowHeight = 48;
sheet.getRange('A2:H25').format.rowHeight = 58;
sheet.getRange('A:A').format.columnWidth = 10;
sheet.getRange('B:B').format.columnWidth = 26;
sheet.getRange('C:C').format.columnWidth = 17;
sheet.getRange('D:D').format.columnWidth = 24;
sheet.getRange('E:E').format.columnWidth = 24;
sheet.getRange('F:F').format.columnWidth = 48;
sheet.getRange('G:G').format.columnWidth = 20;
sheet.getRange('H:H').format.columnWidth = 66;
sheet.freezePanes.freezeRows(1);
await workbook.recalculate();
const check = await workbook.inspect({ kind: 'region', sheetId: 'Requerimiento Inicial', range: 'A1:H4', maxChars: 2500 });
console.log(check.ndjson);
await fs.mkdir(outputDir, { recursive: true });
const file = await SpreadsheetFile.exportXlsx(workbook);
await file.save(outputPath);
console.log(`SAVED ${outputPath}`);
