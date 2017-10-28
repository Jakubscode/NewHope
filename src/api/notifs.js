var gcm = require('node-gcm');
 
// Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
//var sender = new gcm.Sender('AAAAqwUmPZw:APA91bEpOUCLp_DQIe9qXszOhKyI1pKy3z2IrbSOuHQft1iANGqze_rG2X1-11lQVIU5qIi1vNkoHDVojnHFRSh0I3yds7mSvM4gcoSVffZSRCXxYv0IEmzAuwmmC-WElgAZv-l0lHFS');
var sender = new gcm.Sender('AIzaSyDPyIcEI30QEjfjk7IuPhFJz1-PZGXnIRQ');
 
const send = (regTokens, notification, data) => {
	notification.icon = 'hopeit_logo.png'
	var message = new gcm.Message({
	    data,
	    notification
	});
	 
	// Specify which registration IDs to deliver the message to
	//var regTokens = ["c_Atq8_Dagw:APA91bEzn3RInIfksZgFlb4TdCq0JFQjGxVi0CBmf_TOQdULhQh1r2zoAA4Od3th6HJcGYf8wBjvIy_8ZZB_veVNuoH9M5x-g3ZA7ikUKjPacEgMSTOGUucI36skAkoGtQiu0Bamnp28"];
	 
	// Actually send the message
	sender.send(message, { registrationTokens: regTokens }, 10,function (err, response) {
	    if (err) console.error(err);
	    else console.log(response);
	});
}
// send(["f_uIn_VL88c:APA91bHb_pRRpaisXDajapMpHyh9BI91_RQP5R2W-y4QVUVOg6La7ZCFg8xFtBBn04kgHXTftG7veFgkodNbmP79njP_z36RevZmApmpUCtzKXBofyp6S7JF8cJzHPXSG_tZ0QFf5kww"], {
// 	title : "test",
// 	body : "test"
// })
module.exports =  {
	send,
}