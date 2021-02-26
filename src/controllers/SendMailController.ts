import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositores/SurveysRepository'
import { SurveysUsersRepository } from '../repositores/SurveysUsersRepository'
import { UsersRepository } from '../repositores/UsersRepository'
import SendMailService from '../services/SendMailService'
import {resolve} from 'path'

class SendMailController{
    async execute(req:Request,res:Response){
        const { email, survey_id }=req.body

        const usersRepository = getCustomRepository(UsersRepository)
        const surveysRepository=getCustomRepository(SurveysRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const users =await usersRepository.findOne({email})

        if(!users){
            return res.status(400).json({
                error:"User does not exists"
            })
        }

        const survey = await surveysRepository.findOne({id:survey_id})

        if(!survey){
            return res.status(400).json({
                error :"Survey does not exists!"
            })
        }

        

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: {user_id:users.id, value:null},
            relations:["user","survey"]
        })

        const npsPath = resolve(__dirname,"..","view","emails","npsMail.hbs")
        const variables = {
            name:users.name,
            title:survey.title,
            description:survey.description,
            id:"",
            link:process.env.URL_MAIL
        }
        if (surveyUserAlreadyExists){
            variables.id=surveyUserAlreadyExists.id
            await SendMailService.execute( email, survey.title, variables, npsPath )
            return res.json(surveyUserAlreadyExists)
        }

        
        const surveyUser=surveysUsersRepository.create({
            user_id:users.id,
            survey_id
        })
        await surveysUsersRepository.save(surveyUser)

        variables.id=surveyUser.id
        
        await SendMailService.execute( email, survey.title, variables, npsPath )
        return res.json(surveyUser)

    }

}
export { SendMailController }