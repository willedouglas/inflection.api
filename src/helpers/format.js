module.exports = {
  cleanString: string => {
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
        to.charAt(i)
      );
    }

    str = str.replace(new RegExp(`[^a-z0-9${rep}]`, 'g'), '')
      .replace(/-+/g, rep);

    return str;
  },
  removeSpaces: string => string.replace(/\s+/g, ' ').trim(),
};