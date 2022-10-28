import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { TransitionProps } from "@mui/material/transitions";
import { visuallyHidden } from "@mui/utils";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { addSeconds } from "date-fns";
import { de } from "date-fns/locale";
import * as React from "react";
import useSWR from "swr";
import { useAxios } from "../utils/AxiosUtil";
import { Reservation, RestaurantConfig } from "../utils/booking.types";
import {
  checkIfReservationTimeOverlaps,
  checkIfReservationTimeOverlapsWithTable,
  createReservation,
  deleteReservation,
  emptyReservation,
  updateReservation,
} from "../utils/BookingUtils";
import { useReservations } from "../utils/useReservations";
import "./../styles/ReservationOverviewStyles.scss";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Reservation;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "lastNameOfReservator",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "reservationStart",
    numeric: true,
    disablePadding: false,
    label: "Uhrzeit",
  },
  {
    id: "personCount",
    numeric: false,
    disablePadding: false,
    label: "Personen",
  },
  {
    id: "phoneOfReservator",
    numeric: false,
    disablePadding: false,
    label: "Telefon",
  },
  {
    id: "emailOfReservator",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "tableNumbers",
    numeric: false,
    disablePadding: false,
    label: "Tische",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Reservation
  ) => void;
  order: Order;
  orderBy: string | number;
  rowCount: number;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Reservation) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "left" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

interface DialogReservation {
  reservation: Reservation;
  editType?: "new" | "edit";
}

export const ReservationOverview: React.FC = () => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] =
    React.useState<keyof Reservation>("reservationStart");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const { axios, fetcher } = useAxios();

  const [open, setOpen] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [reservationToEdit, setReservationToEdit] =
    React.useState<DialogReservation>();

  const { allReservations, mutateReservations } = useReservations(currentDate);

  const { data: restaurant } = useSWR<RestaurantConfig>(
    !!axios
      ? "/table/id/?restaurantId=" + process.env.REACT_APP_RESTAURANT_ID
      : null,
    fetcher
  );

  const handleClose = () => {
    setOpen(false);
    setReservationToEdit(undefined);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Reservation
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string): void => {
    const foundReservation = allReservations!.find(
      (reservation) => reservation.id === id
    );
    if (!foundReservation) return;

    setOpen(true);
    setReservationToEdit({
      reservation: foundReservation,
      editType: "edit",
    });
  };

  const handleClickNewReservation = () => {
    setOpen(true);
    setReservationToEdit({
      reservation: emptyReservation,
      editType: "new",
    });
  };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReservationSend = () => {
    if (!reservationToEdit) return;
    if (reservationToEdit?.editType === "edit") {
      updateReservation(axios, reservationToEdit.reservation).then(
        (updatedReservation) => {
          if (!updatedReservation) {
            return;
          }
          mutateReservations(
            allReservations.map((prevReservation) =>
              prevReservation.id === updatedReservation.id
                ? updatedReservation
                : prevReservation
            )
          );
        }
      );
    } else {
      createReservation(axios, reservationToEdit.reservation).then(
        (newReservation) => {
          if (!newReservation) {
            return;
          }
          mutateReservations([...allReservations!, newReservation]);
        }
      );
    }
    handleClose();
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - allReservations!.length)
      : 0;

  return restaurant ? (
    <Box sx={{ width: "100%", padding: "20px" }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <Paper sx={{ mb: 2, padding: "20px" }}>
          <div className={"table__header"}>
            <DatePicker
              label="Datum"
              value={currentDate}
              onChange={(newValue) => {
                if (newValue) {
                  setCurrentDate(newValue);
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />

            <Button className="add-button">
              <AddCircleOutlineRoundedIcon
                onClick={handleClickNewReservation}
              />
            </Button>
          </div>

          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={allReservations!.length}
              />
              <TableBody>
                {allReservations!
                  .slice()
                  .sort(getComparator(order, orderBy))
                  .map((reservation: Reservation, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, reservation.id!)}
                        role="checkbox"
                        tabIndex={-1}
                        key={reservation.lastNameOfReservator}
                        className={`${
                          checkIfReservationTimeOverlaps(
                            reservation,
                            allReservations!
                          )
                            ? "table__item__warning"
                            : ""
                        } ${
                          reservation.confirmed
                            ? ""
                            : "table__item__not-confirmed"
                        }`}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {reservation.firstNameOfReservator +
                            " " +
                            reservation.lastNameOfReservator}
                        </TableCell>
                        <TableCell>
                          {reservation.reservationStart.toLocaleTimeString(
                            "de-DE",
                            {
                              timeZone: "Europe/Berlin",
                              timeStyle: "short",
                            }
                          )}
                        </TableCell>
                        <TableCell>{reservation.personCount}</TableCell>
                        <TableCell>{reservation.phoneOfReservator}</TableCell>
                        <TableCell>{reservation.emailOfReservator}</TableCell>
                        <TableCell>
                          {reservation.tableNumbers.toString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[15, 30, 45]}
            component="div"
            count={allReservations!.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          {reservationToEdit ? (
            <div className={"dialog__wrapper"}>
              <div className={"dialog__header"}>
                <CloseRoundedIcon onClick={handleClose} />
              </div>
              <TextField
                placeholder="Vorname"
                label="Vorname"
                value={reservationToEdit?.reservation.firstNameOfReservator}
                onChange={({ target }) =>
                  setReservationToEdit({
                    ...reservationToEdit,
                    reservation: {
                      ...reservationToEdit!.reservation,
                      firstNameOfReservator: target.value,
                    },
                  })
                }
              />
              <TextField
                placeholder="Nachname"
                label="Nachname"
                value={reservationToEdit?.reservation.lastNameOfReservator}
                onChange={({ target }) =>
                  setReservationToEdit({
                    ...reservationToEdit,
                    reservation: {
                      ...reservationToEdit!.reservation,
                      lastNameOfReservator: target.value,
                    },
                  })
                }
              />

              <TextField
                placeholder="Personenanzahl"
                label="Personenanzahl"
                type="number"
                value={reservationToEdit?.reservation.personCount}
                onChange={({ target }) =>
                  setReservationToEdit({
                    ...reservationToEdit,
                    reservation: {
                      ...reservationToEdit!.reservation,
                      personCount: parseInt(target.value),
                    },
                  })
                }
              />
              <DateTimePicker
                label="Uhrzeit"
                value={reservationToEdit?.reservation.reservationStart}
                minutesStep={15}
                ampm={false}
                onChange={(newDate) => {
                  if (!newDate) return;
                  setReservationToEdit({
                    ...reservationToEdit,
                    reservation: {
                      ...reservationToEdit!.reservation,
                      reservationStart: newDate,
                      reservationEnd: addSeconds(
                        newDate,
                        restaurant!.defaultReservationLength!
                      ),
                    },
                  });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <FormControl>
                <InputLabel id="multiple-table-label">Tischnummer</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={reservationToEdit?.reservation.tableNumbers}
                  onChange={({ target }) =>
                    setReservationToEdit({
                      ...reservationToEdit,
                      reservation: {
                        ...reservationToEdit!.reservation,
                        tableNumbers:
                          typeof target.value === "string"
                            ? target.value.split(",")
                            : target.value,
                      },
                    })
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  input={<OutlinedInput label="Name" />}
                >
                  {restaurant!.tables!.map((table) => (
                    <MenuItem
                      key={table.tableNumber}
                      value={table.tableNumber}
                      className={`${
                        checkIfReservationTimeOverlapsWithTable(
                          reservationToEdit!.reservation,
                          allReservations!,
                          table.tableNumber
                        )
                          ? "table-number__chip__warning"
                          : ""
                      }`}
                    >
                      {table.tableNumber}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                placeholder="Email"
                label="Email"
                value={reservationToEdit?.reservation.emailOfReservator}
                onChange={({ target }) =>
                  setReservationToEdit({
                    ...reservationToEdit,
                    reservation: {
                      ...reservationToEdit!.reservation,
                      emailOfReservator: target.value,
                    },
                  })
                }
              />
              <TextField
                placeholder="Telefon"
                label="Telefon"
                value={reservationToEdit?.reservation.phoneOfReservator}
                onChange={({ target }) =>
                  setReservationToEdit({
                    ...reservationToEdit,
                    reservation: {
                      ...reservationToEdit!.reservation,
                      phoneOfReservator: target.value,
                    },
                  })
                }
              />
              <div className="dialog__buttons">
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    deleteReservation(
                      axios,
                      reservationToEdit.reservation.id!
                    ).then((resp) => {
                      if (resp) {
                        mutateReservations(
                          allReservations!.filter(
                            (reservationToFiler) =>
                              reservationToFiler.id !==
                              reservationToEdit?.reservation.id
                          )
                        );
                      }
                      handleClose();
                    });
                  }}
                >
                  Löschen
                </Button>
                {!reservationToEdit?.reservation.confirmed &&
                  reservationToEdit?.editType === "edit" && (
                    <Button
                      color="secondary"
                      onClick={() => {
                        axios
                          .post("/reservation/admin/update/", {
                            ...reservationToEdit?.reservation,
                            confirmed: true,
                          })
                          .then(
                            (resp) =>
                              resp.data &&
                              mutateReservations(
                                allReservations!.map((prevReservation) => {
                                  if (
                                    prevReservation.id ===
                                    reservationToEdit?.reservation.id
                                  ) {
                                    return reservationToEdit?.reservation;
                                  } else {
                                    return prevReservation;
                                  }
                                })
                              )
                          );
                      }}
                    >
                      Buchung bestätigen
                    </Button>
                  )}
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleReservationSend}
                >
                  Speichern
                </Button>
              </div>
            </div>
          ) : (
            <CircularProgress />
          )}
        </Dialog>
      </LocalizationProvider>
    </Box>
  ) : (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  );
};
