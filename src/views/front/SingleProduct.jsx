import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProduct = async (id) => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        setProduct(response.data.product);
      } catch (error) {
        console.log(error.response);
      }
    };

    getProduct(id);
  }, [id]);

  const addCart = async (id, num = 1) => {
    const data = { product_id: id, qty: num };
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      await axios.post(url, { data });
      console.log('加入購物車成功');
    } catch (error) {
      console.log(error.response);
    }
  };

  if (!product) {
    return <h2 className="mt-3">查無產品</h2>;
  }

  return (
    <div className="container mt-3">
      <div className="card" style={{ width: '18rem' }}>
        <img
          src={product.imageUrl}
          className="card-img-top"
          alt={product.title}
        />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text">價格: {product.price}</p>
          <p className="card-text">
            <small className="text-body-secondary">單位: {product.unit}</small>
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              addCart(product.id);
            }}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
