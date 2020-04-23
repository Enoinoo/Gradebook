import React, { forwardRef, useState, useEffect, useReducer } from "react";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

import MaterialTable, { Column, Icons } from "material-table";

interface Student {
  id: string;
  name: string;
  grade: number;
}

interface Action {
  type: "add" | "update" | "addToAll";
  value?: Student;
}

const NUMBEROFSTUDENTS = 10;
const ADDTOALLVALUE = 2;

const tableIcons: Icons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

function reducer(students: Student[], action: Action) {
  switch (action.type) {
    case "add":
      if (action.value) return [...students, action.value];
      else {
        throw new Error("Incorrect input for adding a student.");
      }
    case "update":
      if (action.value) {
        var updatedStudents: Student[] = [];
        students.forEach((student) => {
          if (student.id == action.value?.id) {
            updatedStudents.push({
              id: student.id,
              name: action.value.name,
              grade: action.value.grade,
            });
          } else updatedStudents.push(student);
        });
        //var foundIndex = students.findIndex((x) => x.id == action.value?.id);
        //students[foundIndex] = action.value;
        return updatedStudents;
      }
    default:
      return students;
  }
}

function StudentTable() {
  const [columns, setColumns] = useState<Array<Column<Student>>>([
    { title: "Student Name", field: "name", editable: "never" },
    { title: "Grade", field: "grade", type: "numeric" },
  ]);

  const [students, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=" + NUMBEROFSTUDENTS)
      .then((response) => response.json())
      .then((response) => {
        var results = response.results;
        results.forEach((result: any) => {
          var student: Student = {
            id: result.login.uuid,
            name: result.name.first + " " + result.name.last,
            grade: Math.floor(Math.random() * 101),
          };
          dispatch({ type: "add", value: student });
        });
      });
  }, []);

  return (
    <MaterialTable
      title="STUDENTS"
      icons={tableIcons}
      columns={columns}
      data={students}
      actions={[
        {
          icon: () => (<AddBox />) as React.ReactElement<SvgIconProps>,
          tooltip: "Add Scores to All",
          isFreeAction: true,
          onClick: () => {
            students.forEach((student) => {
              const updatedValue = {
                id: student.id,
                name: student.name,
                grade: student.grade + ADDTOALLVALUE,
              };
              dispatch({ type: "update", value: updatedValue });
            });
          },
        },
      ]}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                const updatedGrade: number =
                  typeof newData.grade === "number"
                    ? newData.grade
                    : typeof newData.grade === "string"
                    ? parseFloat(newData.grade)
                    : 0;
                const updatedStudent = {
                  id: oldData.id,
                  name: oldData.name,
                  grade: updatedGrade,
                };
                dispatch({ type: "update", value: updatedStudent });
              }
            }, 600);
          }),
      }}
      options={{ pageSize: NUMBEROFSTUDENTS }}
    />
  );
}

export default StudentTable;
