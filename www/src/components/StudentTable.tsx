import React, { forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
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
  name: string;
  grade: number;
}

interface IState {
  columns: Array<Column<Student>>;
  students: Student[];
}

interface IProps {}

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
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

/*
const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});*/

/*
function createData(name: string, grade: number) {
  return { name, grade };
}

const rows = [
  createData("Enoch Lin", 90),
  createData("Andy Kay", 100),
  createData("Bill Gates", 67)
];*/

class StudentTable extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      columns: [
        { title: "Student Name", field: "name", editable: "never" },
        { title: "Grade", field: "grade", type: "numeric" }
      ],
      students: [
        {
          name: "",
          grade: 0
        }
      ]
    };
  }

  componentDidMount() {
    fetch("https://randomuser.me/api/?results=1000")
      .then(response => response.json())
      .then(response => {
        var results = response.results;
        var students: Student[] = [];
        results.forEach((result: any) => {
          var student: Student = {
            name: result.name.first + " " + result.name.last,
            grade: Math.floor(Math.random() * 101)
          };
          students.push(student);
        });
        this.setState({
          students
        });
        //console.log(response.results);
        //console.log(this.state.students);
      });
  }

  render() {
    return (
      <MaterialTable
        title="STUDENTS"
        icons={tableIcons}
        columns={this.state.columns}
        data={this.state.students}
        actions={[
          {
            icon: () => (<AddBox />) as React.ReactElement<SvgIconProps>,
            tooltip: "Add Scores to All",
            isFreeAction: true,
            onClick: () => {
              const students = this.state.students;
              students.forEach(student => {
                student.grade += 2;
              });
              this.setState({ students });
            }
          }
        ]}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                if (oldData) {
                  this.setState(prevState => {
                    const students = [...prevState.students];
                    students[students.indexOf(oldData)] = newData;
                    return { ...prevState, students };
                  });
                }
              }, 600);
            })
        }}
        options={{ pageSize: 10 }}
      />
    );
  }
}

export default StudentTable;
