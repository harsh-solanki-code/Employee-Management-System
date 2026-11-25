import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AlertMessage from '../../components/AlertMessage/AlertMessage';
import {
  clearAuthError,
  fetchCompanies,
  loginUserThunk,
  registerUserThunk
} from '../../store/slices/authSlice';

function AuthPage({ mode = 'login' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, companies, loading, error } = useSelector((state) => state.auth);

  const isRegister = mode === 'register';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company_id: 'COMP_A'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  useEffect(() => {
    setErrors({});
    dispatch(clearAuthError());
  }, [mode, dispatch]);

  if (user && token) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    if (error) {
      dispatch(clearAuthError());
    }
  }

  function validateForm() {
    const nextErrors = {};

    if (isRegister && !formData.name.trim()) {
      nextErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    } else if (isRegister && formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    if (isRegister && !formData.company_id) {
      nextErrors.company_id = 'Please select a company';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading || !validateForm()) {
      return;
    }

    const action = isRegister
      ? registerUserThunk({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          company_id: formData.company_id
        })
      : loginUserThunk({
          email: formData.email.trim(),
          password: formData.password
        });

    const result = await dispatch(action);
    if (!result.error) {
      navigate('/dashboard', { replace: true });
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>
        <p className="auth-subtitle">
          {isRegister
            ? 'Register a user account for one of the four organization companies'
            : 'Login to manage employees of your company'}
        </p>

        <AlertMessage
          type="error"
          message={error}
          onClose={() => dispatch(clearAuthError())}
        />

        <form onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="company_id">Company</label>
              <select
                id="company_id"
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
              >
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {errors.company_id && <span className="field-error">{errors.company_id}</span>}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
          <Link to={isRegister ? '/login' : '/register'} className="link-button">
            {isRegister ? 'Sign In' : 'Register'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

