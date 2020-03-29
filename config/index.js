/**
 * main configuration file
 */
const config = {
    production :{
        SECRET : 'SUPERSECRETPASSWORD123',
        DATABASE : process.env.API_URL_PRODUCTION
    },
    development : {
        SECRET : 'SUPERSECRETPASSWORD123',
        DATABASE : process.env.API_URL
    }
 }
 
 exports.get = function get(env){
    return config[env] || config.development
 }