import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <footer className="footer py-4  ">
        <div className="container-fluid">
          <div className="row align-items-center justify-content-lg-between">
            <div className="col-lg-6 mb-lg-0 mb-4">
              <div className="copyright text-center text-sm text-muted text-lg-start">
                © <script>document.write(new Date().getFullYear())</script>,
                made with <i className="fa fa-heart"></i> by
                <Link to="#" className="font-weight-bold" target="_blank">
                  Neeraj Kashyap
                </Link>
                for a better web.
              </div>
            </div>
            <div className="col-lg-6">
              <ul className="nav nav-footer justify-content-center justify-content-lg-end">
                <li className="nav-item">
                  <Link to="#" className="nav-link text-muted" target="_blank">
                    Creative Tim
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/about"
                    className="nav-link text-muted"
                    target="_blank"
                  >
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <a to="#" className="nav-link text-muted" target="_blank">
                    Blog
                  </a>
                </li>
                <li className="nav-item">
                  <Link
                    to=""
                    className="nav-link pe-0 text-muted"
                    target="_blank"
                  >
                    License
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
