import { Link, Outlet } from 'react-router-dom';

function FrontendLayout() {
  return (
    <>
      <header>
        <nav className="nav">
          <Link className="nav-link active" aria-current="page" to="/">
            首頁
          </Link>
          <Link className="nav-link" to="/products">
            產品列表
          </Link>
          <Link className="nav-link" to="/Checkout">
            結帳
          </Link>
          <Link className="nav-link" to="/Login">
            登入
          </Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
      <footer>@2026 我的網站</footer>
    </>
  );
}

export default FrontendLayout;
