import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_RESTAURANT } from "../graphql/queries";

function RestaurantDetail() {
  const { id } = useParams();

  const { data, loading } = useQuery(GET_RESTAURANT, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>{data.restaurant.name}</h1>
      <p>{data.restaurant.description}</p>

      {data.restaurant.products.map((product) => (
        <div key={product.id}>
          <img src={product.imageUrl} width="120" />
          <p>{product.name} - ${product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default RestaurantDetail;