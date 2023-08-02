import React from "react";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Pagination } from "@mui/material";

const pageSize = 10;
const Footer = ({tableData,handlePageChange,handleDeleteSeleted}) => {
    return (
        <Box>
            <Grid id="footer" container spacing={2}>
                <Grid item xs={6} md={4}>
                    <item>
                        <button
                            id="Delete-Selected"
                            type="button"
                            onClick={handleDeleteSeleted}
                        >
                            Delete Selected
                        </button>
                    </item>
                </Grid>
                <Grid item xs={6} md={8}>
                    <item>
                        {tableData ? (
                             <Pagination 
                                tableData={tableData}
                                count={Math.ceil(tableData.length/pageSize)}
                                onChange={handlePageChange}
                             />
                        ):(
                            <div className="loading">
                                Loading...
                            </div>
                        )}
                    </item>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Footer;