import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';


@Entity('diaries')
class Diary {

    constructor() {

    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('boolean')
    smellLoss: boolean;

    @Column('boolean')
    tasteLoss: boolean;

    @Column('boolean')
    appetiteLoss: boolean;

    @Column('boolean')
    fatigue: boolean;

    @Column('boolean')
    fever: boolean;

    @Column('boolean')
    cough: boolean;

    @Column('boolean')
    diarrhea: boolean;

    @Column('boolean')
    delirium: boolean;

    @Column('boolean')
    soreThroat: boolean;

    @Column('boolean')
    shortnessOfBreath: boolean;

    @Column('boolean')
    abdominalPain: boolean;

    @Column('boolean')
    chestPain: boolean;

    @Column('boolean')
    coryza: boolean;

    @Column('boolean')
    hadContactWithInfected: boolean;

    @Column('boolean')
    approved: boolean;

    @Column()
    userId: string;

    @CreateDateColumn({type: "timestamp without time zone", })
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Diary;
