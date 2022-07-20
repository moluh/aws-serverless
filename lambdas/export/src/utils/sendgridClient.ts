import moment from "moment-timezone";
import mongodb from "src/clients/mongodb/connect.mongodb";
import maskError from "./maskError";
const format = require(`./templateParser`);
const fs = require("fs");
const _ = require("lodash");

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
module.exports = {
  /* A function that sends an email. */
  send: async (
    email:
      | {
          to: any[];
          cc: any[];
          bcc: any[];
          pathToAttachment: any;
          attachments: {
            content: any;
            filename: any;
            type: any;
            disposition: string;
          }[];
          attachmentName: any;
          attachmentType: any;
        }
      | any
  ) => {
    if (typeof email.to == "string") email.to = [email.to];
    if (typeof email.cc == "string") email.cc = [email.cc];
    if (typeof email.bcc == "string") email.bcc = [email.bcc];
    // Antes de agregar un attachment a un mail la función que termina llamando al send debe tener creado el archivo
    /* Reading a file and converting it to base64. */
    if (email.pathToAttachment) {
      try {
        const attachment = fs
          .readFileSync(email.pathToAttachment)
          .toString("base64");
        email.attachments = [
          {
            content: attachment,
            filename: email.attachmentName,
            type: email.attachmentType,
            disposition: "attachment",
          },
        ];
      } catch (error) {
        console.log("ERROR AL LEER UN ARCHIVO PARA ADJUNTAR A UN EMAIL");
        console.log(error);
      }
    }
    if (_.isEmpty(email.cc)) delete email.cc;
    if (_.isEmpty(email.bcc)) delete email.bcc;
    removerDuplicados(email);
    /* Trying to send an email. */
    try {
      await sgMail.send(email);
    } catch (e: any) {
      const error = maskError(
        e,
        "Ocurrió un error al enviar el mail, revise que este bien configurado."
      );
      console.error(e);
      throw error;
    }
    /* Inserting the email into a mongoDB collection. */
    return mongodb
      .collection("historialemails")
      .insert({ ...email, fecha: moment.utc().toDate() });
    /* return await HistorialEmail.create({
      ...email,
      fecha: moment.utc().toDate()
    })*/
  },
  /* A function that is returning an object. */
  format: (
    { template, asunto, destinatario, from, cc, bcc }: any,
    parametros: any
  ) => {
    const html = format(template, parametros);
    const subject = format(asunto.toString(), parametros);
    return {
      from: from || "noreply@moluh.com",
      cc,
      bcc,
      to: destinatario,
      subject: subject,
      html: html,
    };
  },
};

/**
 * Remove duplicates from the to, cc, and bcc fields, and move any duplicates from the cc and bcc
 * fields to the to field.
 * @param email - The email object that you want to remove duplicates from.
 */
function removerDuplicados(email: { to: any; cc: any; bcc: any }) {
  email.to = _.uniq(email.to);
  email.cc = _.uniq(email.cc);
  email.bcc = _.uniq(email.bcc);

  const duplicadosCC = _.intersection(email.to, email.cc);
  email.cc = _.difference(email.cc, duplicadosCC);

  const duplicadosBCC = _.intersection(email.to, email.bcc).concat(
    _.intersection(email.cc, email.bcc)
  );
  email.bcc = _.difference(email.bcc, duplicadosBCC);
}
