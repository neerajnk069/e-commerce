const Contact = () => {
  return (
    <div className="container contact-container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg contact-card">
            <h3 className="text-center mb-4">Contact Us</h3>

            <form>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Write your message..."
                ></textarea>
              </div>

              <div className="row">
                <div className="col-sm-6 d-grid">
                  <button type="submit" className="btn btn-primary text-white">
                    Submit
                  </button>
                </div>

                <div className="col-sm-6 d-grid">
                  <button type="reset" className="btn btn-warning text-white">
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
