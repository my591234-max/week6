import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cart, setCart] = useState({ carts: [], final_total: 0 });

  // 取得購物車
  const getCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  //  刪除單一品項
  const deleteCartItem = async (id) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${id}`;
      await axios.delete(url);
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  //  清空購物車
  const clearCart = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/carts`;
      await axios.delete(url);
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  //  更新購物車數量
  const updateCart = async (cartItemId, productId, qty) => {
    const data = {
      product_id: productId,
      qty,
    };

    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${cartItemId}`;
      await axios.put(url, { data });
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="container">
      <h2>購物車列表</h2>

      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={clearCart}
        >
          清空購物車
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th>數量/單位</th>
            <th className="text-end">小計</th>
          </tr>
        </thead>

        <tbody>
          {cart.carts.map((cartItem) => (
            <tr key={cartItem.id}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => deleteCartItem(cartItem.id)}
                >
                  刪除
                </button>
              </td>

              <th scope="row">{cartItem.product.title}</th>

              <td>
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={cartItem.qty}
                    onChange={(e) =>
                      updateCart(
                        cartItem.id,
                        cartItem.product_id,
                        Number(e.target.value),
                      )
                    }
                  />
                  <span className="input-group-text">
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>

              <td className="text-end">{cartItem.final_total}</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan="3" className="text-end">
              總計
            </td>
            <td className="text-end">{cart.final_total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Cart;
