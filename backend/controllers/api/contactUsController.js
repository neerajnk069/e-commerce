const ContactUS = require("../../../../../DineSafe/models/contactus");
const { Validator } = require("node-input-validator");
module.exports = {
  ContactUs: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        name: "required|minLength:2",
        email: "required|email",
        phone: "required|numeric|minLength:10",
        description: "required",
      });

      const matched = await validator.check();
      if (!matched) {
        return res
          .status(422)
          .json({ success: false, statusCode: 422, errors: validator.errors });
      }
      const { name, email, phone, description } = req.body;
      let result = await ContactUS.create({
        name: name,
        email: email,
        phone: phone,
        description: description,
      });

      if (!result) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: `Something went wrong`,
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: `ContactUs created successfull`,
        body: result,
      });
    } catch (error) {
      console.log(error, "errror");
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Errror",
      });
    }
  },
};
