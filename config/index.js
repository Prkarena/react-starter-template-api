/**
 * main configuration file
 */
const config = {
    production :{
        SECRET : 'SUPERSECRETPASSWORD123',
        DATABASE : 'mongodb+srv://prakash:Prakash@123@cluster0-yxfup.mongodb.net/sagar?retryWrites=true&w=majority'
    },
    development : {
        SECRET : 'SUPERSECRETPASSWORD123',
        DATABASE : process.env.API_URL
    }
 }
 
 exports.get = function get(env){
    return config[env] || config.development
 }