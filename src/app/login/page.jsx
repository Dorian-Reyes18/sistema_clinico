import Login from "../components/login";
const LoginPage = () => {
  return (
    <div className="login">
      <div className="card-login">
        <div className="col-lf">
          <div className="content">
            <strong>
              <h1 style={{ color: "#fff" }}>Bienvenido</h1>
            </strong>
            <strong>
              <p style={{ color: "#fff" }}>
                Sistema Gestor <br />
                base de cirugías
              </p>
            </strong>
          </div>
        </div>
        <div className="col-rg">
          <div className="cont-login">
            <Login />
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
