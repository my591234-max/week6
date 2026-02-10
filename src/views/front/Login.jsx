import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE;

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, {
        username: formData.username,
        password: formData.password,
      });

      const { token, expired } = res.data;

      // 儲存 token
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;

      // 登入成功提示
      alert('登入成功！');

      // 導向後台或首頁
      navigate('/');
    } catch (error) {
      alert('登入失敗，請確認帳號密碼');
      console.log('Error:', error.response?.data);
    }
  };

  return (
    <div className="container login" style={{ maxWidth: '500px' }}>
      <h1 className="text-center my-4">請先登入</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="form-floating mb-3">
          <input
            type="email"
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            placeholder="name@example.com"
            {...register('username', {
              required: '請輸入 Email',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Email 格式不正確',
              },
            })}
          />
          <label>Email</label>
          {errors.username && (
            <p className="text-danger mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="form-floating mb-3">
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Password"
            {...register('password', {
              required: '請輸入密碼',
              minLength: {
                value: 6,
                message: '密碼長度至少需 6 碼',
              },
            })}
          />
          <label>Password</label>
          {errors.password && (
            <p className="text-danger mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          className="btn btn-primary w-100 py-2"
          type="submit"
          disabled={!isValid}
        >
          登入
        </button>
      </form>

      <p className="mt-5 mb-3 text-muted text-center">© 2026~∞ - 六角學院</p>
    </div>
  );
}

export default Login;
