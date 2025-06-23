import { useParams } from "react-router-dom";

function ProductDetails() {
  let { id } = useParams();
  console.log("ID-ul produsului este:", id); // Afișează ID-ul în consolă

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Detalii Produs</h1>
      <p>Aici vor fi detaliile produsului cu ID-ul: {id}</p>
    </div>
  );
}

export default ProductDetails;
