import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface JobSearchProps {
  onSearch: (params: { search: string; zip: string }) => void;
  initialSearch?: string;
  initialZip?: string;
}

export default function JobSearch({ onSearch, initialSearch = '', initialZip = '' }: JobSearchProps) {
  const [search, setSearch] = useState(initialSearch);
  const [zip, setZip] = useState(initialZip);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ search: search.trim(), zip: zip.trim() });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <Input
          placeholder="What kind of work?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="relative sm:w-40">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <Input
          placeholder="Zip code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          maxLength={5}
          inputMode="numeric"
          className="pl-10"
        />
      </div>
      <Button type="submit" size="md">
        Search
      </Button>
    </form>
  );
}
