import React, { useEffect, useRef, useState } from "react";
import "../assets/styles/Input.css";

const Input = (props) => {
  const {
    type,
    label,
    disabled = false,
    onChange,
    style,
    errors = {},
    placeholder,
    min,
    max,
    errMsg,
    children,
    name,
    autoFocus,
    defaultChecked,
    value,
    register,
    checked,
    tabIndex,
  } = props;

  return (
    <div className={`form-group ${errors[name] ? " error" : ""}${type === "checkbox" ? " checkbox" : ""}`}>
      <label>
        {label}
        <input
          type={type || "text"}
          disabled={disabled}
          onChange={onChange}
          name={name}
          defaultValue={value}
          ref={register}
          placeholder={placeholder}
          autoComplete="off"
          autoFocus={autoFocus}
          checked={checked}
          defaultChecked={defaultChecked}
          style={style}
          min={min}
          max={max}
          tabIndex={tabIndex}
        />
      </label>
      {errors[name] && <span className="error">{errMsg}</span>}
      {children}
    </div>
  );
};

export const DateInput = (props) => {
  const {
    label,
    disabled = false,
    style,
    errors = {},
    autoComplete = {},
    errMsg,
    children,
    name,
    autoFocus,
    value,
    register,
  } = props;

  const [date, setDate] = useState({ dd: "", mm: "", yyyy: "" });

  const ddInput = useRef(null);
  const mmInput = useRef(null);
  const yyyyInput = useRef(null);

  useEffect(() => {
    const destructured = (value || "").split("-");
    const d = new Date().formatDB().split("-");

    setDate({
      dd: destructured[2]
        ? destructured[2]
        : autoComplete.dd
        ? typeof autoComplete.dd === "boolean"
          ? d[2]
          : autoComplete.dd
        : "",
      mm: destructured[1]
        ? destructured[1]
        : autoComplete.mm
        ? typeof autoComplete.mm === "boolean"
          ? d[1]
          : autoComplete.mm
        : "",
      yyyy: destructured[0]
        ? destructured[0]
        : autoComplete.yyyy
        ? typeof autoComplete.yyyy === "boolean"
          ? d[0]
          : autoComplete.yyyy
        : "",
    });

    //eslint-disable-next-line
  }, [value]);

  const handleDate = (e) => {
    const prevDate = { ...date };
    let { name, value } = e.target;
    value = parseInt(value || 0).toString();
    if (name === "dd") {
      if (value * 10 > 31) {
        mmInput.current.focus();
        mmInput.current.select();
      }
      if (parseInt(value) > 31) value = "31";
      prevDate.dd = value.length > 1 ? value : "0" + value;
    } else if (name === "mm") {
      if (value * 10 > 12) {
        yyyyInput.current.focus();
        yyyyInput.current.select();
      }
      if (parseInt(value) > 12) value = "12";
      prevDate.mm = value.length > 1 ? value : "0" + value;
    } else if (name === "yyyy") {
      let ceros = "";
      if (value.length < 4) [...new Array(4 - value.length)].forEach((a) => (ceros += "0"));
      if (value.length > 4) value = "9999";
      prevDate.yyyy = ceros + value;
    }
    setDate(prevDate);
  };

  let realValue = "";

  if (
    parseInt(date.dd) > 0 &&
    parseInt(date.dd) <= 31 &&
    parseInt(date.mm) > 0 &&
    parseInt(date.mm) <= 12 &&
    parseInt(date.yyyy) > 1899 &&
    parseInt(date.yyyy) <= 3000
  ) {
    realValue = new Date(date.yyyy, date.mm - 1, date.dd).formatDB();
  }

  return (
    <div className={`form-group date${errors[name] ? " error" : ""}`}>
      <label>
        {label}
        <div>
          <input
            ref={ddInput}
            type="number"
            disabled={disabled}
            onChange={handleDate}
            placeholder="dd"
            autoComplete="off"
            name="dd"
            autoFocus={autoFocus}
            value={date.dd}
            style={style}
            step={1}
          />
          <span>/</span>
          <input
            ref={mmInput}
            type="number"
            disabled={disabled}
            onChange={handleDate}
            placeholder="mm"
            name="mm"
            autoComplete="off"
            value={date.mm}
            style={style}
            step={1}
          />
          <span>/</span>
          <input
            ref={yyyyInput}
            type="number"
            disabled={disabled}
            onChange={handleDate}
            placeholder="aaaa"
            name="yyyy"
            autoComplete="off"
            value={date.yyyy}
            style={style}
            step={1}
          />
        </div>
      </label>
      <input type="text" style={{ display: "none" }} ref={register} name={name} onChange={() => {}} value={realValue} />
      {errors[name] && <span className="error">{errMsg}</span>}
      {children}
    </div>
  );
};
export const NumberInput = (props) => {
  const { label, disabled = false, errors = {}, errMsg, children, name, value, register, autoFocus } = props;

  const resolver = (numbers, operators) => {
    for (let i = 0; i < operators.length; i++) {
      if (operators[i] === "/" || operators[i] === "*") {
        numbers.splice(
          i,
          2,
          operators[i] === "/"
            ? parseFloat(numbers[i]) / parseFloat(numbers[i + 1])
            : parseFloat(numbers[i]) * parseFloat(numbers[i + 1])
        );
        operators.splice(i, 1);
        i--;
      }
    }
    for (let i = 0; i < operators.length; i++) {
      if (operators[i] === "+" || operators[i] === "-") {
        numbers.splice(
          i,
          2,
          operators[i] === "+"
            ? parseFloat(numbers[i]) + parseFloat(numbers[i + 1])
            : parseFloat(numbers[i]) - parseFloat(numbers[i + 1])
        );
        operators.splice(i, 1);
        i--;
      }
    }

    return parseFloat(numbers[0]);
  };

  const handleNumber = (value, input) => {
    const enter = value.includes("=");
    if (!enter) return;
    const account = value.replace("=", "").replace(/ /gi, "");
    let paraOperators = [];
    const para = account
      .split(/[()]/)
      .filter((term) => term)
      .map((pa) => {
        let newPara = pa;
        if (pa.split("")[0] === "*" || pa.split("")[0] === "/" || pa.split("")[0] === "-" || pa.split("")[0] === "+") {
          paraOperators.push(pa.split("")[0]);
          newPara = newPara.substring(1, newPara.length);
        }
        if (
          newPara.split("")[newPara.length - 1] === "*" ||
          newPara.split("")[newPara.length - 1] === "/" ||
          newPara.split("")[newPara.length - 1] === "-" ||
          newPara.split("")[newPara.length - 1] === "+"
        ) {
          paraOperators.push(newPara.split("")[newPara.length - 1]);
          newPara = newPara.substring(0, newPara.length - 1);
        }
        return newPara;
      })
      .filter((para, i) => para !== "");
    const paraRes = para.map((pa) => {
      let numbers = pa.split(/\+|-|\*|\//g);
      let operators = pa.replace(/[0-9]|\./g, "").split("");

      return resolver(numbers, operators);
    });
    const result = resolver(paraRes, paraOperators);
    input.value = result;
  };

  return (
    <div className={`form-group${errors[name] ? " error" : ""}`}>
      <label>{label}</label>
      <input
        name={name}
        disabled={disabled}
        onChange={(e) => handleNumber(e.target.value, e.target)}
        defaultValue={value}
        ref={register}
        autoFocus={autoFocus}
        autoComplete="off"
        step="0.01"
      />
      {errors[name] && <span className="error">{errMsg}</span>}
      {children}
    </div>
  );
};

export const SelectInput = (props) => {
  const {
    label,
    disabled = false,
    errors = {},
    errMsg,
    children,
    onChange,
    name,
    value,
    register,
    data,
    autoFocus,
  } = props;

  return (
    <div className={`form-group${errors[name] ? " error" : ""}`}>
      <label>{label}</label>
      <select
        name={name}
        disabled={disabled}
        defaultValue={value}
        onChange={onChange}
        ref={register}
        autoComplete="off"
        autoFocus={autoFocus}
      >
        <option value="">------</option>
        {data.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors[name] && <span className="error">{errMsg}</span>}
      {children}
    </div>
  );
};

export default Input;
