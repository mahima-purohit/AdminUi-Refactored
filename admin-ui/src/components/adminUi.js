import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminUiTable from "./adminUiTable";
import "./adminUi.css";


const AdminUi = (props) => {
    const adminUiApiEndPoint = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        const onLoadHandler = async () => {
            await performGetApiCall();
        }
        onLoadHandler();
    }, []);
    
    /**
     * @function {resetTableDataState} and {resetDataState}:helper function to update the state of {data} and {table data}
     * @param {*} newData : incoming data to update the state of tableData and Data with.
     */
    const resetTableDataState = (newData) => {
        setTableData(newData);
    }
    const resetDataState = (newData) => {
        setData(newData);
    }

    /**
     * performGetApiCall() fn to make the get Api call from the given endpoint
     * @returns the response from he get Api call 
     */
    const performGetApiCall = async () => {
        try {
            const response = await axios.get(`${adminUiApiEndPoint}`);
            console.log(response.data);
            setData(response.data);
            setTableData(response.data);
            return response.data;
        } catch (err) {
            console.log(err.message);
            return null;
        }
    }

    /**
     * @function to handle the updation of table and update the previous table data with the new edited data.
     * @param {*} rowId the rowId of the row clicked for being edited , eg. 1,2,3,4...
     * @param {*} field the field which is being edited inside the row, eg. name, role, email..
     * @param {*} value the edited/new value of the field.
     */
    const handleInputChange = (rowId, field, value) => {
        console.log("Handle input change is being called");
        const updatedTableData = tableData.map((row) =>
            row.id === rowId ? { ...row, [field]: value } : row
        );
        const updatedData = data.map((row) => row.id === rowId ? { ...row, [field]: value } : row);

        setTableData(updatedTableData);
        console.log(tableData);
        setData(updatedData);
    };
    
    /**
     * @function {handleSearch}: a function to handle the search operation when provided with email, name, and role.
     * @param {} searchString : the value of the search word.
     */
    const handleSearch = (searchString) => {
        console.log("handle Search have been called");
        if (searchString) {
            if (data.length === 0) {
                alert("No Data found");
            }
            else {
                const tableDataAfterSearch = data.filter((row) => {
                    return (row.id === searchString ||
                        row.name.toLowerCase() === searchString.toLowerCase() ||
                        row.email.toLowerCase() === searchString.toLowerCase() ||
                        row.role.toLowerCase() === searchString.toLowerCase())
                });
                if(tableDataAfterSearch.length === 0){
                    alert(`No record present for ${searchString}`);
                }
                else setTableData(tableDataAfterSearch);
            }
        }
        else {
            setTableData(data);
        }
    }

    /**
     * @function {handleTableDelete}: function to handle the deletion of any single record from the table.
     * @param {*} rowId : value of the id of the row being selected to delete.
     */
    const handleTableDelete = (rowId) => {
        console.log("handle table delete is being called");
        const newTableData = tableData.filter((row) => {
            return (row.id !== rowId);
        })
        const newData = data.filter((row) => {
            return (row.id !== rowId);
        });
        // setData(newTableData);
        setTableData(newTableData);
        setData(newData);
    }

    return (
        <div>
            <AdminUiTable
                tableData={tableData}
                handleInputChange={handleInputChange}
                handleSearch={handleSearch}
                handleTableDelete={handleTableDelete}
                resetTableDataState={resetTableDataState}
                resetDataState={resetDataState}
            />
        </div>
    )
}
export default AdminUi;