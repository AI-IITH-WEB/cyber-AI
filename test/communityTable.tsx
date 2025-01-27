"use client";

import React, { useEffect, useState } from "react";
import CommonTable from "@/components/common/CommonTable";
import {
  Box,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ActionCommunity from "@/components/admin/CommunityMangement/actionCommunity";
import { CommunityTableListProps, results } from "@/types/community";
import dateFormat from "@/utils/dateFormat";
import { Column } from "@/types/table";
import useDebounce from "@/hooks/useDebounce";

const CommunityTableList = ({
  forumList,
  deleteFourm,
  forumDetails,
  loading,
}: CommunityTableListProps) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState<string>("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [openUserActionMenu, setOpenUserActionMenu] =
    useState<HTMLElement | null>(null);
  const [currentRow, setCurrentRow] = useState<results | null>(null);

  const handleOpenUserActionMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: results,
  ) => {
    setOpenUserActionMenu(event.currentTarget);
    setCurrentRow(row);
  };

  const handleCloseUserActionMenu = () => {
    setOpenUserActionMenu(null);
    setCurrentRow(null);
  };

  const handlePageChange = (event: React.MouseEvent | null, newPage: number) =>
    setPage(newPage + 1);

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  useEffect(() => {
    forumList({
      page: page,
      rowsPerPage: rowsPerPage,
      searchText: debouncedSearchText,
    });
  }, [page, rowsPerPage, debouncedSearchText]);

  const statusCol = (status: "inactive" | "active" | "deleted") => {
    if (status === "inactive") {
      return <Chip label="Inactive" color="default" size="small" />;
    } else if (status === "deleted") {
      return <Chip label="Delete" color="error" size="small" />;
    } else {
      return <Chip label="Active" color="primary" size="small" />;
    }
  };

  const columns: Column[] = [
    {
      field: "topic_title",
      label: "Title",
      align: "left",
    },
    {
      field: "user_name",
      label: "Created By",
      align: "left",
    },
    {
      field: "created_at",
      label: "Created Date",
      align: "left",
      render: (value: string) => <div>{dateFormat(value)}</div>,
    },
    {
      field: "status",
      label: "Status",
      align: "left",
      render: (value: "inactive" | "active" | "deleted") => statusCol(value),
    },
    {
      field: "actions",
      label: "Actions",
      align: "center",
      render: (value: string, row: results) => (
        <div>
          <IconButton
            id={`user-action-long-button-${row.forum_id}`}
            aria-controls={openUserActionMenu ? "basic-menu" : undefined}
            aria-expanded={openUserActionMenu ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => handleOpenUserActionMenu(event, row)}
          >
            <MoreVertIcon />
          </IconButton>
          <ActionCommunity
            openUserActionMenu={openUserActionMenu}
            handleCloseUserActionMenu={handleCloseUserActionMenu}
            row={currentRow as results}
            deleteFourm={deleteFourm}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Box className="align-center mb-5 flex ">
        <TextField
          id="outlined-basic"
          placeholder="Search"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      <CommonTable
        columns={columns}
        data={forumDetails && 'results' in forumDetails ? forumDetails.results : []}
        rowsPerPage={rowsPerPage}
        page={page}
        totalRows={forumDetails && "count" in forumDetails ? forumDetails.count : 0}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        loading={loading}
      />
    </>
  );
};

export default CommunityTableList;
