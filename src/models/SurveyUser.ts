import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn,JoinColumn } from "typeorm"
import { v4 as uuid } from 'uuid' 
import { User } from "./User"
import { Survey } from "./Survey"


@Entity("surveys_users")
class SurveyUser{

    @PrimaryColumn()
    readonly id:string

    @Column()
    readonly user_id:string

    @ManyToOne(()=>User)
    @JoinColumn({name:"user_id"})
    user:User

    @Column()
    readonly survey_id:string

    @ManyToOne(()=>Survey)
    @JoinColumn({name:"survey_id"})
    survey:Survey


    @Column()
    value:number

    @CreateDateColumn()
    created_at:Date

    constructor(){
        if(!this.id){
            this.id = uuid()
        }
    }

}

export { SurveyUser }