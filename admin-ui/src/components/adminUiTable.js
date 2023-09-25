import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Box, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Footer from './footer';
import { ClassNames } from '@emotion/react';

const pageSize = 10;

const AdminUiTable = ({
    tableData,
    handleInputChange,
    handleSearch,
    handleTableDelete,
    resetTableDataState,
    resetDataState
}) => {
    const [searchString, setSearchString] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [checkboxes, setCheckBoxes] = useState([]);
    const [isAllChecked, setIsAllChecked] = useState(false)
    const [pageData, setPageData] = useState([]);
    const [toRow, setToRow] = useState(pageSize);
    const [fromRow, setFromRow] = useState(0);

    useEffect(() => {
        updateFromTwoAndToRow();
    }, [searchString])

    useEffect(() => {
        const handlePageData = async () => {
            const data = await calculatePageData();
        }
        handlePageData();
        setIsAllChecked(false);
        setCheckBoxes([]);
    }, [tableData, searchString, fromRow, toRow]);

    /**
     * helper fn to initailize the toRow and fromRow states 
     */
    const updateFromTwoAndToRow = () => {
        setFromRow(0);
        setToRow(10);
    }

    //===================Table page handlers start here===========
    /**
     * 
     * @returns the data to be shown on single page.
     */
    const calculatePageData = async () => {
        const data = tableData.slice(fromRow, toRow);
        setPageData(data);
        return data;
    }
    /**
     * 
     * @param {*} event : page change event
     * @param {*} pageNo : the page clicked.
     */
    const handlePageChange = (event, pageNo) => {
        setFromRow(pageSize * pageNo - 10);
        setToRow(pageSize * pageNo);
        calculatePageData();
    }
    //===================Table Page handlers end here=============

    //===================Table edit handlers start here===========
    /**
     * 
     * @param {*} rowId : id of the row clicked.
     * @function {handleTableDelete} : function to to be called whenever the edit icon is clicked.
     */
    const handleTableEdit = (rowId) => {
        console.log("Handle table edit is being called");
        console.log(rowId);
        setEditingId(rowId);
    }
    /**
     * 
     *@function {handleInputSave} : function to be called whenever the input field is called off focus. 
     */
    const handleInputSave = (rowId) => {
        console.log("handle input save is called");
        setEditingId(null);
    }
    //===================Table edit handlers end here============

    //===================Search Handlers Start here==============
    const searchOnChangeHandler = (value) => {
        setSearchString(value);
    }

    //checkbox handlers starts here
    /**
     * @function to be called whenever a row is checked
     * @param {*} event 
     */
    const handleCheckboxChange = (event) => {
        const checkedRowId = event.target.value;
        console.log(checkedRowId);
        if (event.target.checked) {
            setCheckBoxes([...checkboxes, checkedRowId]);
        } else {
            setCheckBoxes(checkboxes.filter((item) => item !== checkedRowId));
        }
        console.log(checkboxes);

    };
    /**
     * function to handle to check all checkboxes on a page.
     * @param {*} event 
     */
    const handleCheckAllCheckboxes = (event) => {
        if (event.target.checked) {
            const allValues = pageData.map((checkbox) => checkbox.id);
            setCheckBoxes(allValues);
            setIsAllChecked(true);
        }
        else {
            setCheckBoxes([]);
            setIsAllChecked(false);
        }
    }

    /**
     * @function to handle the deletion of multiple selected rows.
     */
    const handleDeleteSeleted = async () => {
        console.log("handle delete selected is being called");
        const dataAfterDeletion = await calculateRowDataAfterDeletion();
        resetTableDataState(dataAfterDeletion);
        resetDataState(dataAfterDeletion);
        setIsAllChecked(false);
    }
    /**
     * @function {calculateRowDataAfterDeletion} : helper function to calculate the table data after multiple rows deletion
     * @returns data filtering out the deleted rows.
     */
    const calculateRowDataAfterDeletion = async () => {
        console.log("calculate row data after delete is being called");
        const newData = tableData.filter((row) => {
            return (checkboxes.includes(row.id) === false)
        })
        return newData;
    }


    return (
        <div>
            <Grid
                data-testid='admin-ui-grid'
                container
                spacing={1}
                id="AdminUiSearchBar"
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={10}>
                    <item>
                        <TextField
                            fullWidth
                            label="Search with name, email or role"
                            value={searchString}
                            onChange={(e) => searchOnChangeHandler(e.target.value)}
                        />
                    </item>
                </Grid>
                <Grid item xs={1}>
                    <item>
                        <button
                            data-testid="search-button"
                            onClick={() => handleSearch(searchString)}
                        >
                            <SearchIcon size="large" />
                        </button>
                    </item>
                </Grid>
            </Grid>
            <Box className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>
                                {
                                    <label>
                                        <input
                                            type="checkbox"
                                            onChange={handleCheckAllCheckboxes}
                                            checked={isAllChecked}
                                        />
                                    </label>
                                }
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pageData.map((row) => {
                                return (
                                    <tr key={row.id}
                                        id="row"
                                        className={(checkboxes.includes(row.id) ? "highlight" : "")}
                                    >
                                        <td>
                                            {
                                                <label key={row.id}>
                                                    <input
                                                        type="checkbox"
                                                        value={row.id}
                                                        checked={checkboxes.includes(row.id)}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                </label>
                                            }
                                        </td>
                                        <td>
                                            {editingId === row.id ? (
                                                <input
                                                    type="text"
                                                    value={row.name}
                                                    onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
                                                    onBlur={(e) => handleInputSave(row.id)}
                                                />
                                            ) :
                                                (row.name)
                                            }
                                        </td>
                                        <td>
                                            {editingId === row.id ? (
                                                <input
                                                    type="text"
                                                    value={row.email}
                                                    onChange={(e) => handleInputChange(row.id, 'email', e.target.value)}
                                                    onBlur={(e) => handleInputSave(row.id)}
                                                />
                                            ) :
                                                (row.email)
                                            }
                                        </td>
                                        <td>
                                            {editingId === row.id ? (
                                                <input
                                                    type="text"
                                                    value={row.role}
                                                    onChange={(e) => handleInputChange(row.id, 'role', e.target.value)}
                                                    onBlur={(e) => handleInputSave(row.id)}
                                                />
                                            ) :
                                                (row.role)
                                            }
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleTableEdit(row.id)}
                                            >
                                                <EditIcon size="small"></EditIcon>
                                            </button>
                                            <button
                                                onClick={() => handleTableDelete(row.id)}
                                            >
                                                <DeleteIcon size="small"></DeleteIcon>
                                            </button>

                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </Box>
            <Footer
                tableData={tableData}
                handlePageChange={handlePageChange}
                handleDeleteSeleted={handleDeleteSeleted}
            />
        </div>
    )
}

export default AdminUiTable;