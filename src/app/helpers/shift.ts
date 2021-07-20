import { format } from 'date-fns';
import { Shift } from '../interfaces/shift.interface';

export const parsedSelectedDatesInForm = (
  weekDays: any,
  selectedIds: Array<number>
) => {
  return weekDays.filter((weekDay: any) =>
    selectedIds.some((selectedDayInForm) => selectedDayInForm === weekDay.id)
  );
};

export const formatShift = (shift: Shift) =>
  format(new Date(shift.day), 'EEE dd - HH:mm');
