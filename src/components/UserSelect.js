import React from "react";
import Select from "react-select";

const UserSelect = ({ register, style, value = "", name = "", usersArray, users, setUsers }) => {
  return (
    <div className="form-group user-select">
      <label>Usuarios</label>
      <Select
        style={{ ...style, borderColor: "#e5e5ea" }}
        onChange={(a) => setUsers(a)}
        value={users}
        isMulti
        options={usersArray.map((a) => ({ label: a.username, value: a.sub }))}
      />
    </div>
  );
};

export default UserSelect;
