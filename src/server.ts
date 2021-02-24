import 'reflect-metadata'
import express from 'express'
import "./database"

const app  = express()

app.get("/users", (req,res) =>{
    return res.send("Hello o/")
})

app.post("/users",(req,res)=>{
    return res.json({message:"Dados recebidos"})
})

app.listen(3000,()=>console.log("Server is running"))
