import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { getInitials } from "../../utils/get-initials";

export const CustomerListResults = ({ customers: agents, ...rest }) => {
  const [selectedAgentIds, setSelectedAgentIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = agents.map((agent) => agent.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedAgentIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedAgentIds.indexOf(id);
    let newSelectedAgentIds = [];

    if (selectedIndex === -1) {
      newSelectedAgentIds = newSelectedAgentIds.concat(selectedAgentIds, id);
    } else if (selectedIndex === 0) {
      newSelectedAgentIds = newSelectedAgentIds.concat(selectedAgentIds.slice(1));
    } else if (selectedIndex === selectedAgentIds.length - 1) {
      newSelectedAgentIds = newSelectedAgentIds.concat(selectedAgentIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedAgentIds = newSelectedAgentIds.concat(
        selectedAgentIds.slice(0, selectedIndex),
        selectedAgentIds.slice(selectedIndex + 1)
      );
    }

    setSelectedAgentIds(newSelectedAgentIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAgentIds.length === agents.length}
                    color="primary"
                    indeterminate={
                      selectedAgentIds.length > 0 && selectedAgentIds.length < agents.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Registrations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.slice(0, limit).map((agent) => (
                <TableRow hover key={agent.id} selected={selectedAgentIds.indexOf(agent.id) !== -1}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAgentIds.indexOf(agent.id) !== -1}
                      onChange={(event) => handleSelectOne(event, agent.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Avatar src={agent.avatarUrl} sx={{ mr: 2 }}>
                        {getInitials(agent.name)}
                      </Avatar>
                      <Typography color="textPrimary" variant="body1">
                        {agent.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{agent.email}</TableCell>
                  <TableCell>
                    {`${agent.address.city}, ${agent.address.state}, ${agent.address.country}`}
                  </TableCell>
                  <TableCell>{agent.phone}</TableCell>
                  <TableCell>{format(agent.createdAt, "dd/MM/yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={agents.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CustomerListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
