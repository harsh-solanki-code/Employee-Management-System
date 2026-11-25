function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h1>Employee Management System</h1>
      </div>
      <div className="navbar-user">
        <span className="company-badge">{user.company_name || user.company_id}</span>
        <span className="user-name">{user.name}</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;

