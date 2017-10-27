const crypto = require('crypto');

const secret = 'abcdefg';



const login = (app) => async (user, pass)  => {
	const hash = crypto.createHmac('sha256', pass)
   .update('I love cupcakes')
   .digest('hex');
	const admin = await app.models.Admin.findOne({login : user}).exec()
	return hash == admin.pass 
	? {
		success : true,
		token : admin.token
	}
	: {
		success : false
	}
}
const auth = (app) => (token) =>{

}

module.exports = (app) => ({
	login : login(app),
	auth : auth(app)
})