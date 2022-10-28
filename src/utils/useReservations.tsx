import useSWR from "swr";
import { useAxios } from "./AxiosUtil";
import { FetchedReservation, Reservation } from "./booking.types";

export const useReservations = (
  currentDate: Date
): {
  allReservations: Reservation[];
  reservationError: any;
  mutateReservations(mutatedReservations: Reservation[]): void;
} => {
  const { axios, fetcher } = useAxios();

  const {
    data: allReservations,
    error: reservationError,
    mutate: mutateReservations,
  } = useSWR<FetchedReservation[]>(
    !!axios ? "/reservation/all/?date=" + currentDate.toISOString() : null,
    fetcher,
    { fallbackData: [] }
  );

  return {
    allReservations: allReservations!.map((reservation) => ({
      ...reservation,
      createDate: new Date(reservation.createDate),
      updateDate: new Date(reservation.updateDate),
      reservationStart: new Date(reservation.reservationStart),
      reservationEnd: new Date(reservation.reservationEnd),
    })),
    reservationError,
    mutateReservations: (mutatedReservations: Reservation[]) => {
      mutateReservations(mutatedReservations as any as FetchedReservation[]);
    },
  };
};
