const parser = require('string-template-parser');
const moment = require('moment');
const _ = require('lodash');
const parseAngularStringTemplate = parser.parseStringTemplateGenerator({
  VARIABLE_START: /^\{\{\s*/,
  VARIABLE_END: /^\s*\}\}/
});

module.exports = (template, parametros) => {
  try {
    parametros = JSON.parse(JSON.stringify(parametros));
    dateToFormatString(parametros);
    let parsedString = parseAngularStringTemplate(template);
    parsedString.variables = formatSpecialCharacters(parsedString.variables);
    return parser.evaluateParsedString(
      parsedString,
      parametros
    )
  } catch (error) {
    console.log(error);
  }
}

function dateToFormatString(parametros) {
  _.map(parametros, (value, key) => {
    if (_.isPlainObject(value)) {
      dateToFormatString(parametros[key])

    } else if (moment(value, moment.ISO_8601).isValid() && typeof value === 'string' && value.indexOf('-') > 0) {
      // Este if asegura que el valor que se formatea es una fecha y no un número de 7 o 8 digitos
      // que probablemente pueda interpretarse como fecha válida. Ejemplo: 2100234 se formatea a 22/08/2100
      // Ver doc de moment: 2100234 # Basic (short) ordinal date (year + day-of-year)
      parametros[key] = formatDate(value)
    }
  })
}

function formatDate(date) {
  return moment(date).format("DD/MM/YYYY")
}

/*
 * Esta función sirve para cambiar los cáracteres especiales en los keys de los campos de perfil
 * string-template-parser no los parsea bien, y en esta función se tomaron en cuenta todos los cáracteres que pueden estar
 * en los campos de perfil
 * */
function formatSpecialCharacters(variables) {
  const result = [];
  const map = {
    "&Aacute;": "Á",
    "&aacute;": "á",
    "&Eacute;": "É",
    "&eacute;": "é",
    "&Iacute;": "Í",
    "&iacute;": "í",
    "&Ntilde;": "Ñ",
    "&ntilde;": "ñ",
    "&Oacute;": "Ó",
    "&oacute;": "ó"
  };

  variables.map((variable) => {
    const item = { pipes: variable.pipes, name: variable.name };
    for (const key in map) {
      if (variable.name.indexOf(key) !== -1) {
        item.name = variable.name.replace(key, map[key]);
      }
    }
    result.push(item);
  });
  return result;
}