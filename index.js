import express from 'express'
import axios from 'axios'
import {readFile, writeFile} from 'fs/promises'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash'
import chalk from 'chalk';


const app = express()
const PORT = process.env.PORT || 3000
const __dirname = import.meta.dirname 
const publicPath = __dirname+'/public/'
const usersDataPath = __dirname+'/data/usuarios.json'

// middleware
app.use(express.static('public'))


// controladores
const createUsuario = async(req,res) => {
    const newUser = 
    await axios
      .get('https://randomuser.me/api')
      .then(data => data.data.results[0])
      .then( result => {
          const ID = uuidv4().slice(0,6)
          const nombre = result.name.first
          const apellido = result.name.last
          const gender = result.gender
          const timeStamp = moment().toISOString()
          const newUser = {ID,gender,nombre,apellido,timeStamp}
          console.log(newUser)
          return newUser
      });

    const users = await readUsuarios()
    users.push(newUser)
    await writeFile(usersDataPath,JSON.stringify(users) )
    const usersDivision = await getUsersDivideByGender()
    logUsers()
    return res.json({'msg':'usuario creado',...usersDivision})

}

const readUsuarios = async() =>{
    try{
        const buffer = await readFile(usersDataPath,"utf-8")
        const users = await JSON.parse(buffer)
        return users
    } catch(err){
        console.log(err)
    }
}


const getUsuarios = async(req,res)=>{
    const users = await readUsuarios()
    const usersByGender = await getUsersDivideByGender()
    logUsers()
    res.json(usersByGender)
}

const getUsersDivideByGender = async(req,res)=>{
    let users = await readUsuarios()
    const [HOMBRES,MUJERES] = _.partition(users, user => user.gender==="male")
    return {HOMBRES,MUJERES}
}

const logUsers= async(req,res)=> {
    let users = await readUsuarios()
    for(let user of users){
        console.log(chalk.bgWhite.blue(JSON.stringify(user)))
    }
}


// rutas
app.get('/', (req,res)=>{
    send.file( __dirname+'/data/usuar'  )
} )

app.get("/usuarios", getUsuarios )
app.post("/nuevo-usuario", createUsuario)


app.listen(PORT, console.log(`listening on port ${PORT}`))