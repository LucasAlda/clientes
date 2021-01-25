const customDate = () => {
  Date.prototype.toOldString = Date.prototype.toISOString;

  Date.prototype.toISOString = function () {
    return this.toOldString().split("T")[0];
  };

  Date.prototype.format = function (separator = "-") {
    if (!this) return "";
    const [yy, mm, dd] = this.toISOString().split("-");

    return dd + separator + mm + separator + yy;
  };

  Date.prototype.formatDB = function () {
    if (!this) return "";
    const [yy, mm, dd] = this.toISOString().split("-");

    return `${yy}-${mm}-${dd}`;
  };
};

export default customDate;
