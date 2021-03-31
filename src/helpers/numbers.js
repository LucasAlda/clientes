const customNumber = function () {
  //eslint-disable-next-line no-extend-native
  Number.prototype.format = function ({ decimal = 2 } = {}) {
    if (this.valueOf() === 0) return "-";
    let formattedNumber = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
    }).format(this);

    return formattedNumber;
  };
};

export default customNumber;
