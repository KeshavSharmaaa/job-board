import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    navigate(`/jobs?keyword=${keyword}&location=${location}`);
  };

  return (
    <div className="max-w-6xl mx-auto -mt-16 px-6">
      <div className="bg-white shadow-xl rounded-xl p-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Find Job
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
