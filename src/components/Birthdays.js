import React, { useEffect, useState } from "react";
import { FiGift } from "react-icons/fi";
import authFetch from "../helpers/authFetch";

const Birthdays = () => {
  const [birthdays, setBithdays] = useState([]);

  useEffect(() => {
    authFetch("/bottom/birthdays")
      .then((data) => setBithdays(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <ul style={{ padding: "5px 0", position: "relative", margin: 0, display: "grid" }}>
      {birthdays.map((birthday, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 20px",
            borderBottom: "1px solid #e5e7eb",
            width: "100%",
          }}
        >
          <h4 style={{ margin: 0, color: "#575757", fontSize: 13 }}>{birthday.Descripcion}</h4>
          <div
            style={{
              textAlign: "right",
              color: "hsl(220, 10%, 65%)",
              display: "flex",
              justifyContent: "space-between",
              width: 160,
            }}
          >
            <h5
              style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "space-between", width: 63 }}
            >
              <FiGift style={{ marginRight: 5 }} />
              {parseInt(
                (new Date().getTime() - new Date(birthday.FechaNacimiento).getTime()) / 1000 / 60 / 60 / 24 / 365
              )}{" "}
              años
            </h5>
            <h5 style={{ margin: 0 }}>{new Date(birthday.FechaNacimiento).format()}</h5>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Birthdays;
