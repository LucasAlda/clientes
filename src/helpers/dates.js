const customDate = () => {
  //eslint-disable-next-line no-extend-native
  Date.prototype.toOldString = Date.prototype.toISOString;

  // Date = class extends Date {
  //   constructor(options) {
  //     console.log(options);

  //     if (typeof options === "number") {
  //       super(options);
  //     } else if (typeof options === "string") {
  //       if (options.split("T").length > 1) {
  //         super(options);
  //       } else {
  //         super(options + "T00:00:00");
  //       }
  //     } else {
  //       super(Date.now());
  //     }
  //   }
  // };
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
  Date.prototype.formatFull = function (separator = "/") {
    if (!this) return "";
    const [date, hour] = this.toOldString().split("T");
    const [yy, mm, dd] = date.split("-");
    let [hh, min, ss] = hour.split(":");
    ss = ss.split(".")[0];

    return dd + separator + mm + separator + yy + ` ${hh - 3}:${min}:${ss}`;
  };

  //eslint-disable-next-line no-extend-native
  Date.prototype.formatDB = function (separator = "-") {
    if (!this) return "";
    const [yy, mm, dd] = this.toISOString().split("-");

    return yy + separator + mm + separator + dd;
  };
};

export default customDate;
