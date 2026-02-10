import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { RotatingLines } from 'react-loader-spinner';
import * as bootstrap from 'bootstrap';
import SingleProductModel from '../../components/SingleProductModel';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [cart, setCart] = useState({ carts: [], final_total: 0 });
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const productModalRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

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
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products`,
        );
        setProducts(response.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();

    // const getCart = async () => {
    //   try {
    //     const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
    //     setCart(response.data.data);
    //   } catch (error) {
    //     console.log(error.response);
    //   }
    // };

    getCart();

    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    });

    // Modal 關閉時移除焦點
    document
      .querySelector('#productModal')
      .addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
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

  const addCart = async (id, num = 1) => {
    const data = { product_id: id, qty: num };
    setLoadingCartId(id);
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      await axios.post(url, { data });
      console.log('加入購物車成功');

      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response2.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingCartId(null);
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

  const onSubmit = async (formData) => {
    console.log(formData);
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data,
      });

      // 取得訂單清空購物車
      console.log(response.data);
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response2.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleView = async (id) => {
    setLoadingProductId(id);
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/product/${id}`,
      );
      setProduct(response.data.product);
      console.log(response.data.product);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingProductId(null);
    }
    // Add this line to open the modal after data is loaded
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };
  return (
    <div className="container">
      {/* 產品列表 */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: '200px' }}>
                <div
                  style={{
                    height: '100px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td> {product.title}</td>
              <td>
                <del className="h6">原價：{product.origin_price}</del>
                <div className="h5">特價：{product.price}</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleView(product.id)}
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? (
                      <RotatingLines
                        strokeColor="grey"
                        // width={20}
                        // height={16}
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="20"
                        visible={true}
                      />
                    ) : (
                      '查看更多'
                    )}
                    {/* <i className="fas fa-spinner fa-pulse"></i> */}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id)}
                    disabled={loadingCartId === product.id}
                  >
                    {/* <i className="fas fa-spinner fa-pulse"></i> */}
                    {loadingCartId === product.id ? (
                      <RotatingLines color="grey" width={80} height={16} />
                    ) : (
                      '加到購物車'
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
      {/* 結帳頁面 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              defaultValue="test@gmail.com"
              {...register('email', {
                required: '請輸入 Email',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Email 格式不正確',
                },
              })}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              defaultValue="小明"
              {...register('name', {
                required: '請輸入姓名',
                minLength: {
                  value: 2,
                  message: '姓名最少二個字',
                },
              })}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              defaultValue="0912345678"
              {...register('tel', {
                required: '請輸入電話',
                pattern: {
                  value: /^\d+$/,
                  message: '電話僅能輸入數字',
                },
                minLength: {
                  value: 8,
                  message: '電話最少八碼',
                },
              })}
            />
            {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              defaultValue="臺北市信義區信義路5段7號"
              {...register('address', {
                required: '輸入地址',
              })}
            />
            {errors.address && (
              <p className="text-danger">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register('message')}
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
      </div>
      <SingleProductModel
        product={product}
        addCart={addCart}
        closeModal={closeModal}
      />
    </div>
  );
}
export default Checkout;
