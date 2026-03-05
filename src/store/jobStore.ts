import { create } from 'zustand';

interface JobFilters {
  search: string;
  zipCode: string;
  hiringNow: boolean;
  noDegree: boolean;
  spanishFriendly: boolean;
  trades: boolean;
  warehouse: boolean;
  healthcare: boolean;
  restaurant: boolean;
  pay15Plus: boolean;
  pay20Plus: boolean;
  secondShift: boolean;
  thirdShift: boolean;
}

interface JobStore {
  filters: JobFilters;
  setSearch: (search: string) => void;
  setZipCode: (zipCode: string) => void;
  toggleFilter: (key: keyof Omit<JobFilters, 'search' | 'zipCode'>) => void;
  resetFilters: () => void;
}

const defaultFilters: JobFilters = {
  search: '',
  zipCode: '',
  hiringNow: false,
  noDegree: false,
  spanishFriendly: false,
  trades: false,
  warehouse: false,
  healthcare: false,
  restaurant: false,
  pay15Plus: false,
  pay20Plus: false,
  secondShift: false,
  thirdShift: false,
};

export const useJobStore = create<JobStore>((set) => ({
  filters: { ...defaultFilters },
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setZipCode: (zipCode) => set((state) => ({ filters: { ...state.filters, zipCode } })),
  toggleFilter: (key) =>
    set((state) => ({
      filters: { ...state.filters, [key]: !state.filters[key] },
    })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
}));
