import { Link, Outlet } from 'react-router-dom';

function FrontendLayout() {
  return (
    <>
      <header>
        <nav className="nav">
          <Link className="nav-link active" aria-current="page" to="/home">
            首頁
          </Link>
          <Link className="nav-link" to="/products">
            產品列表
          </Link>
          <Link className="nav-link" to="/checkout">
            結帳
          </Link>
          <Link className="nav-link" to="/login">
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
