import React, { createContext, useState, ReactNode, FC } from 'react';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateContextType {
  dates: DateRange;
  setDates: (dates: DateRange) => void;
}

export const DateContext = createContext<DateContextType | undefined>(undefined);

interface DateProviderProps {
  children: ReactNode;
}

export const DateProvider: FC<DateProviderProps> = ({ children }) => {
  const [dates, setDates] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });

  return (
    <DateContext.Provider value={{ dates, setDates }}>
      {children}
    </DateContext.Provider>
  );
};
