const customDate = () => {
  //eslint-disable-next-line no-extend-native
  Date.prototype.toOldString = Date.prototype.toISOString;

  Date = class extends Date {
    constructor(options, a, b) {
      if (a && b) {
        super(options + "-" + a + "-" + b + "T00:00:00");
      } else if (typeof options === "number") {
        super(options);
      } else if (typeof options === "string") {
        if (options.split("T").length > 1) {
          super(options);
        } else {
          super(options + "T00:00:00");
        }
      } else {
        super(Date.now());
      }
    }
  };
  //eslint-disable-next-line no-extend-native
  Date.prototype.toISOString = function () {
    return this.toOldString().split("T")[0];
  };

  //eslint-disable-next-line no-extend-native
  Date.prototype.format = function (separator = "-") {
    if (!this) return "";
    const [dd, mm, yy] = this.toLocaleDateString("en-GB").split("/");

    return dd + separator + mm + separator + yy;
  };

  //eslint-disable-next-line no-extend-native
  Date.prototype.formatFull = function (separator = "/") {
    if (!this) return "";
    const [dd, mm, yy] = this.toLocaleDateString("en-GB").split("/");

    return dd + separator + mm + separator + yy + " " + this.toLocaleTimeString("en-GB");
  };

  //eslint-disable-next-line no-extend-native
  Date.prototype.formatDB = function (separator = "-") {
    if (!this) return "";
    const [dd, mm, yy] = this.toLocaleDateString("en-GB").split("/");

    return yy + separator + mm + separator + dd;
  };
};

export default customDate;
