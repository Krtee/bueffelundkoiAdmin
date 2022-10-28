import { AxiosInstance } from "axios";
import { Interval, isValid } from "date-fns";
import areIntervalsOverlapping from "date-fns/areIntervalsOverlapping";
import { Reservation } from "./booking.types";

export const emptyReservation: Reservation = {
  createDate: new Date(),
  reservationEnd: new Date(),
  reservationStart: new Date(),
  updateDate: new Date(),
  emailOfReservator: "",
  confirmed: false,
  tableNumbers: [],
  personCount: 0,
};

export const checkIfReservationTimeOverlaps = (
  reservationToCheck: Reservation,
  allReservations: Reservation[]
): boolean => {
  let isOverlapping: boolean = false;
  allReservations
    .filter(
      ({ tableNumbers, id }) =>
        tableNumbers.filter(
          (tableNumber) =>
            reservationToCheck.tableNumbers.indexOf(tableNumber) !== -1
        ).length > 0 && id !== reservationToCheck.id
    )
    .forEach((reservation) => {
      const firstReservationInterval: Interval = {
        start: new Date(reservation.reservationStart),
        end: new Date(reservation.reservationEnd),
      };
      const secondReservationInterval: Interval = {
        start: new Date(reservationToCheck.reservationStart),
        end: new Date(reservationToCheck.reservationEnd),
      };

      try {
        if (
          areIntervalsOverlapping(
            firstReservationInterval,
            secondReservationInterval
          )
        ) {
          isOverlapping = true;
        }
      } catch (e) {
        console.log(e);
      }
    });
  return isOverlapping;
};

export const checkIfReservationTimeOverlapsWithTable = (
  reservationToCheck: Reservation,
  allReservations: Reservation[],
  tableNumber: string
): boolean => {
  let isOverlapping: boolean = false;

  if (
    allReservations.length <= 1 ||
    !isValid(reservationToCheck.reservationStart)
  ) {
    return isOverlapping;
  }

  allReservations
    .filter(
      ({ tableNumbers }) =>
        tableNumbers.filter(
          (tableNumberToCheck) => tableNumberToCheck === tableNumber
        ).length > 0
    )
    .forEach((reservation) => {
      const firstReservationInterval: Interval = {
        start: new Date(reservation.reservationStart),
        end: new Date(reservation.reservationEnd),
      };
      const secondReservationInterval: Interval = {
        start: new Date(reservationToCheck.reservationStart),
        end: new Date(reservationToCheck.reservationEnd),
      };

      if (
        areIntervalsOverlapping(
          firstReservationInterval,
          secondReservationInterval
        )
      ) {
        isOverlapping = true;
      }
    });
  return isOverlapping;
};

export const updateReservation = (
  axios: AxiosInstance,
  reservation: Reservation
): Promise<Reservation | undefined> => {
  return axios
    .post("/reservation/admin/update/", reservation)
    .then((response) => response.data);
};

export const createReservation = (
  axios: AxiosInstance,
  reservation: Reservation
): Promise<Reservation | undefined> => {
  return axios
    .post("/reservation/admin/new/", reservation)
    .then((response) => response.data);
};

export const deleteReservation = (
  axios: AxiosInstance,
  id: string
): Promise<boolean> => {
  return axios
    .post(`/reservation/admin/delete/${id}`)
    .then(() => true)
    .catch(() => false);
};
