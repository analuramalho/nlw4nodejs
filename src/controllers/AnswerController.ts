import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysUsersRepository } from '../repositores/SurveysUsersRepository'

class AnswerController{

    //http://server-ana:3000/answers/3?u=c91ae3db-e8f9-4ac7-a6d1-e5627e1604bb
    async execute(req:Request,res:Response) {
        const { value }=req.params
        const { u }=req.query

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const surveyUser = await surveysUsersRepository.findOne({
            id:String(u)
        })

        if(!surveyUser){
            return res.status(400).json({
                error: "Survey User does not exists!"
            })
        }

        surveyUser.value = Number(value)
        await surveysUsersRepository.save(surveyUser)
        return res.json(surveyUser)
    }
}

export {AnswerController}