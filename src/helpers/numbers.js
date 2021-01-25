const customNumber = function () {
  Number.prototype.format = function () {
    if (this.valueOf() === 0) return "";
    let formattedNumber = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      this
    );

    return formattedNumber;
  };
};

export default customNumber;
