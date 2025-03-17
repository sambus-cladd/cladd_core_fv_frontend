import axios from 'axios'

 
    const getAPI = async ( ) => {
    const peticion = await axios.get('http://192.168.40.95:4500/infotintBSAS')
    return (peticion.data)
   
}

export {
    getAPI
}

