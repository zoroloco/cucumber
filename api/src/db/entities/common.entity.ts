import { IsNotEmpty } from "class-validator";
import { Column, PrimaryGeneratedColumn } from "typeorm";

/**
 * Base class for all entities that has common fields found
 * in all tables.
 */
export class CommonEntity {
    @PrimaryGeneratedColumn() id!: number;

    /**
     * Sets the entity's createdTime and createdBy fields.
     */
    public setAuditFields(createdBy: string){
        this.createdBy = createdBy;
        this.createdTime = new Date();
    }

    @IsNotEmpty()
    @Column({type: 'timestamp'})
    public createdTime!: Date;

    @IsNotEmpty()
    @Column({type: 'varchar', length: 32})
    public createdBy!: string;

    @Column({type: 'timestamp'})
    public modifiedTime!: Date;

    @Column({type: 'varchar', length: 32})
    public modifiedBy!: string;

    @Column({type: 'timestamp'})
    public inactivatedTime!: Date;

    @Column({type: 'varchar', length: 32})
    public inactivatedBy!: Date;
}