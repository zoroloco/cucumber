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
    public setAuditFields(createdBy: number){
        this.createdBy = createdBy;
        this.createdTime = new Date();
    }

    @IsNotEmpty()
    @Column({type: 'timestamp'})
    public createdTime!: Date;

    @IsNotEmpty()
    @Column({type: 'bigint'})
    public createdBy!: number;

    @Column({type: 'timestamp'})
    public modifiedTime!: Date;

    @Column({type: 'bigint'})
    public modifiedBy!: number;

    @Column({type: 'timestamp'})
    public inactivatedTime!: Date;

    @Column({type: 'bigint'})
    public inactivatedBy!: number;
}