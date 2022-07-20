export const TEMPLATE_FINISH_HTML = (user: any, processType: any, link: null) => ({
  subject: `Exportación de ${processType}`,
  html: `El resultado de la exportación de ${processType} se encuentra en el siguiente Link: ${link}`,
});
