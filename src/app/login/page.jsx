import Login from "../components/login";
const LoginPage = () => {
  return (
    <div className="login">
      <div className="card-login">
        <div className="col-lf"></div>
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
