const customDate = () => {
  //eslint-disable-next-line no-extend-native
  Date.prototype.toOldString = Date.prototype.toISOString;

  //eslint-disable-next-line no-extend-native
  Date.prototype.toISOString = function () {
    return this.toOldString().split("T")[0];
  };

  //eslint-disable-next-line no-extend-native
  Date.prototype.format = function (separator = "-") {
    if (!this) return "";
    const [yy, mm, dd] = this.toISOString().split("-");

    return dd + separator + mm + separator + yy;
  };

  //eslint-disable-next-line no-extend-native
  Date.prototype.formatDB = function () {
    if (!this) return "";
    const [yy, mm, dd] = this.toISOString().split("-");

    return `${yy}-${mm}-${dd}`;
  };
};

export default customDate;
