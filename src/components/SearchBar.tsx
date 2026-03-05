import { Search, MapPin } from 'lucide-react';
import { useJobStore } from '../store/jobStore';

export default function SearchBar() {
  const { filters, setSearch, setZipCode } = useJobStore();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="flex items-center flex-1 px-4 py-3 gap-2 border-b sm:border-b-0 sm:border-r border-gray-200">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="What kind of work?"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-navy placeholder-gray-400 text-base bg-transparent"
          />
        </div>
        <div className="flex items-center px-4 py-3 gap-2 sm:w-48">
          <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Zip code"
            value={filters.zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full outline-none text-navy placeholder-gray-400 text-base bg-transparent"
            maxLength={5}
          />
        </div>
        <button className="bg-orange hover:bg-orange-dark text-white px-6 py-3 font-semibold transition-colors text-base cursor-pointer border-none">
          Search
        </button>
      </div>
    </div>
  );
}
