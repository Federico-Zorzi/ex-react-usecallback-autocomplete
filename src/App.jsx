import { useState, useEffect, useCallback, memo } from "react";

function debounce(callback, delay) {
  let timer;
  return (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(value);
    }, delay);
  };
}

const ProductCard = memo((product) => {
  /* console.log("productCard", product); */

  return (
    <div className="card">
      <figure className="card-image">
        <img src={product.image} alt={product.name} />
      </figure>
      <div className="card-content">
        <h3>{product.name}</h3>
        <span>{product.price} €</span>
        <p>{product.description}</p>
      </div>
    </div>
  );
});

function App() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [prodSelected, setProdSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(
    debounce((query) => {
      fetch(
        `https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${query}`
      )
        .then((res) => res.json())
        .then((data) => {
          /* console.log("data", data) */
          query ? setSuggestions(data) : setSuggestions([]);
        })
        .catch((err) => console.error(err));
    }, 500),
    []
  );

  useEffect(() => {
    handleSearch(search);
  }, [search]);

  const handleSelectProduct = (product) => {
    /* console.log("product", product); */
    setIsLoading(true);

    fetch(
      `https://boolean-spec-frontend.vercel.app/freetestapi/products/${product.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        /* console.log("data", data); */
        const { image, name, description, price } = data;
        setProdSelected({ image, name, description, price });
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));

    setSuggestions([]);
  };

  return (
    <main>
      <h1>Campo di ricerca intelligente</h1>
      <section>
        <div id="searchbar">
          <input type="text" onChange={(e) => setSearch(e.target.value)} />
          <div className="suggestions-list">
            {suggestions &&
              suggestions.map((s, i) => (
                <button
                  key={i}
                  className="suggestion-btn"
                  onClick={() => handleSelectProduct(s)}
                >
                  {s.name}
                </button>
              ))}
          </div>
        </div>

        {!isLoading ? (
          prodSelected && <ProductCard {...prodSelected} />
        ) : (
          <div className="is-loading-product">
            <p>Sto caricando il prodotto...</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
