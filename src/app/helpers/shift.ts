import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Shift } from '../interfaces/shift.interface';

export const parsedSelectedDatesInForm = (
  weekDays: any,
  selectedIds: Array<number>
) => {
  return weekDays.filter((weekDay: any) =>
    selectedIds.some((selectedDayInForm) => selectedDayInForm === weekDay.id)
  );
};

export const formatConfirmShift = (shift: Shift) =>
  format(new Date(shift.day), 'EEEE dd MMMM - HH:mm aaa', { locale: es });

export const formatShift = (shift: Shift) =>
  format(new Date(shift.day), 'HH:mm aaa');

export const formatShiftGroup = (shift: Shift) =>
  format(new Date(shift.day), 'EEEE dd MMMM', { locale: es });

export const groupShiftsByDates = (items: Shift[]) => {
  return items.reduce((acc: any, cur: any) => {
    const date = formatShiftGroup(cur);

    if (acc[date]) {
      acc[date].push(cur);
    } else {
      acc[date] = [cur];
    }

    return acc;
  }, {});
};
