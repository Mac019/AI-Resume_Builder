// src/components/DomainSelection.jsx
'use client'
import React, { useState } from "react";

const DomainSelection = ({ setRole }) => {
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = () => {
    setRole(selectedRole);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Choose Your Interview Domain</h2>
      <select
        value={selectedRole}
        onChange={handleRoleChange}
        className="border p-2 rounded mb-4"
      >
        <option value="">Select a Role</option>
        <option value="React Developer">React Developer</option>
        <option value="Backend Developer">Backend Developer</option>
        <option value="Product Manager">Product Manager</option>
        <option value="Data Scientist">Data Scientist</option>
        <option value="UI/UX Designer">UI/UX Designer</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!selectedRole}
      >
        Start Interview
      </button>
    </div>
  );
};

export default DomainSelection;
