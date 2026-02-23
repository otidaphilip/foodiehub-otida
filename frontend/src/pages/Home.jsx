import { useQuery } from "@apollo/client/react";
import { SEARCH_PRODUCTS } from "../graphql/queries";
import { useState } from "react";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      input: { searchTerm },
    },
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <input
        placeholder="Search food..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid">
        {data?.searchProducts.map((product) => (
          <div key={product.id}>
            <img src={product.imageUrl} width="150" />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>{product.restaurant.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;