import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSearch = (query) => {
    fetch(
      `https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${query}`
    )
      .then((res) => res.json())
      .then((data) => {
        /* console.log("data", data) */
        query ? setSuggestions(data) : setSuggestions([]);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchSearch(search);
  }, [search]);

  return (
    <main>
      <h1>Campo di ricerca intelligente</h1>
      <section>
        <div id="searchbar">
          <input type="text" onChange={(e) => setSearch(e.target.value)} />
          {suggestions &&
            suggestions.map((s, i) => (
              <div key={i}>
                <button className="suggestion-btn">{s.name}</button>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}

export default App;
