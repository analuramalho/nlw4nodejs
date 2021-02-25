import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositores/SurveysRepository'
import { SurveysUsersRepository } from '../repositores/SurveysUsersRepository'
import { UsersRepository } from '../repositores/UsersRepository'
import SendMailService from '../services/SendMailService'

class SendMailController{
    async execute(req:Request,res:Response){
        const { email, survey_id }=req.body

        const usersRepository = getCustomRepository(UsersRepository)
        const surveysRepository=getCustomRepository(SurveysRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const usersAlreadyExists =await usersRepository.findOne({email})

        if(!usersAlreadyExists){
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

        const surveyUser=surveysUsersRepository.create({
            user_id:usersAlreadyExists.id,
            survey_id
        })
        await surveysUsersRepository.save(surveyUser)


        await SendMailService.execute( email, survey.title, survey.description )
        return res.json(surveyUser)

    }

}
export { SendMailController }