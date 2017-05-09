const request = require('request-promise-native');
module.exports = (uuid) => {
  // console.log(uuid);
    /*request.get(`https://api.mojang.com/user/profiles/${uuid}/names`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const obj = JSON.parse(body);
            const current_name = obj[obj.length-1].name;
            // console.log(uuid);
            console.log(current_name);
        } else {
          const current_name = "Sorry, that UUID does not exist!"
          console.log(current_name);
        }
    }).then(() => {
      // return current_name;
      // console.log(current_name);
    });*/
    let current_name = "";
    return new Promise(function(resolve, reject) {
    /*request.get(`https://api.mojang.com/user/profiles/${uuid}/names`).then((error, body) => {
      if (!error && response.statusCode == 200) {
        const obj = JSON.parse(body);
        current_name = obj[obj.length-1].name;
      } else {
        current_name = "Sorry, that UUID does not exist!"
      }
    }).catch((err) => {
      current_name = "Sorry, that UUID does not exist!"
    })*/
    resolve(current_name);
  })
};

exports.help = {};
exports.help.name = "uuidtoname";
exports.help.type = "functions";
exports.help.description = "Converts a UUID to a name.";
exports.conf = {};
exports.conf.requiredModules = ["request"];
