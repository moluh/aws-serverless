import { TEMPLATE_FINISH_HTML } from "./template-finish";
import { TEMPLATE_INIT_HTML } from "./template-init";

/**
 * @param {Array} emails
 * @param {String} user
 * @param {String} processType
 * @param {String} link
 * @returns Objeto template para pasar al sengrid
 */
const templateLink = (emails: any, user: any, processType: any, link = null) => ({
  from: process.env.SYSTEM_EMAIL || "noreply@moluh.com",
  to: emails,
  html: TEMPLATE_FINISH_HTML(user, processType, link).html,
  subject: TEMPLATE_FINISH_HTML(user, processType, link).subject,
});

/**
 * @param {Array} emails
 * @param {String} user
 * @param {String} processType
 * @returns Objeto template para pasar al sengrid
 */
const templateInit = (emails: any, user: any, processType: any) => ({
  from: process.env.SYSTEM_EMAIL || "noreply@moluh.com",
  to: emails,
  html: TEMPLATE_INIT_HTML(user, processType).html,
  subject: TEMPLATE_INIT_HTML(user, processType).subject,
});

export { templateInit, templateLink };
