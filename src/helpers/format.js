/* eslint-disable no-plusplus */

module.exports = {
  cleanString: (string) => {
    if (!string || typeof (string) !== 'string') {
      return '';
    }

    const rep = '_';
    let str = string;

    str = str.toLowerCase()
      .replace(/\s+/g, rep);

    const from = 'àáäâãèéëêìíïîòóöôùúüûñç';
    const to = 'aaaaaeeeeiiiioooouuuunc';
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(
        new RegExp(from.charAt(i), 'g'),
        to.charAt(i),
      );
    }

    str = str.replace(new RegExp(`[^a-z0-9${rep}]`, 'g'), '')
      .replace(/-+/g, rep);

    return str;
  },
  removeSpaces: (string) => string.replace(/\s+/g, ' ').trim(),

  companyIdValidate: (string) => {
    let companyId = string;
    companyId = companyId.replace(/[^\d]+/g, '');

    if (companyId === '') return false;

    if (companyId.length !== 14) return false;

    if (companyId === '00000000000000'
        || companyId === '11111111111111'
        || companyId === '22222222222222'
        || companyId === '33333333333333'
        || companyId === '44444444444444'
        || companyId === '55555555555555'
        || companyId === '66666666666666'
        || companyId === '77777777777777'
        || companyId === '88888888888888'
        || companyId === '99999999999999') return false;

    let size = companyId.length - 2;
    let numbers = companyId.substring(0, size);
    const digits = companyId.substring(size);
    let sum = 0;
    let position = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += numbers.charAt(size - i) * position--;
      if (position < 2) position = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== digits.charAt(0)) return false;

    size += 1;
    numbers = companyId.substring(0, size);
    sum = 0;
    position = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += numbers.charAt(size - i) * position--;
      if (position < 2) position = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== digits.charAt(1)) return false;

    return true;
  },
};
