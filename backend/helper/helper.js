const path = require("path");
var uuid = require("uuid").v4;

module.exports={
      fileUpload: async (file, folder) => {
    if (file) {
      var extension = path.extname(file.name);
      var filename = uuid() + extension;
      file.mv(
        process.cwd() + `/public/images/` + filename,
        function (err) {
          if (err) return err;
        }
      );
    }
 
    let fullpath = `/public/images/` + filename;
    return fullpath;
  },
 
}