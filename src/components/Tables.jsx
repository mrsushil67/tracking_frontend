import React, { useState, useEffect, useMemo, useCallback } from "react";
import DataTable from "react-data-table-component";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const Tables = () => {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // Dummy data
  useEffect(() => {
    setUsers([
      { id: 1, first_name: "John", last_name: "Doe", role: "student", contact_info: "john.doe@example.com" },
      { id: 2, first_name: "Jane", last_name: "Smith", role: "teacher", contact_info: "jane.smith@example.com" },
      { id: 3, first_name: "Alice", last_name: "Brown", role: "professional", contact_info: "alice.brown@example.com" },
    ]);
  }, []);

  const columns = useMemo(() => {
    return [
      { name: "First Name", selector: (row) => row.first_name, sortable: true },
      { name: "Last Name", selector: (row) => row.last_name, sortable: true },
      { name: "Role", selector: (row) => row.role, sortable: true },
      { name: "Contact Info", selector: (row) => row.contact_info, sortable: true },
      {
        name: "Actions",
        cell: (row) => (
          <div style={{ display: "flex", gap: "5px" }}>
            {isEditing && editingRow?.id === row.id ? (
              <>
                <CheckIcon fontSize="small" color="primary" onClick={saveUpdatedRow} />
                <CloseIcon fontSize="small" color="secondary" onClick={cancelEdit} />
              </>
            ) : (
              <>
                <CreateIcon fontSize="small" color="primary" onClick={() => editRow(row)} />
                <DeleteForeverIcon fontSize="small" color="secondary" onClick={() => deleteRow(row)} />
              </>
            )}
          </div>
        ),
        sortable: false,
      },
    ];
  }, [isEditing, editingRow]);

  const editRow = (row) => {
    setIsEditing(true);
    setEditingRow({ ...row });
  };

  const saveUpdatedRow = () => {
    setIsEditing(false);
    setEditingRow(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingRow(null);
  };

  const deleteRow = (row) => {
    setUsers(users.filter((user) => user.id !== row.id));
  };

  return (
    <Box sx={{ backgroundColor: "#fff", p: 2, borderRadius: 1.5, border: "black" }}>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        {/* <FormGroup row>
          {["students", "teachers", "professionals"].map((role) => (
            <FormControlLabel
              key={role}
              control={<Checkbox checked={roleFilters[role]} onChange={() => {}} name={role} />}
              label={role.charAt(0).toUpperCase() + role.slice(1)}
            />
          ))}
        </FormGroup> */}
      </FormControl>
      <DataTable columns={columns} data={users} pagination dense />
    </Box>
  );
};

export default Tables;
