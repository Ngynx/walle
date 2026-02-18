import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Timestamp } from 'bson';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema({
    _id: true,
    id: true,
    timestamps: true
})
export class User {

    @Prop({
        type: String,
        required: false
    })
    user_name?: string;

    @Prop({
        type: String,
        required: false
    })
    user_lastname?: string;

    @Prop({
        type: Number,
        required: false
    })
    user_dni?: number;

    @Prop({
        type: Number,
        required: false
    })
    user_cellphone?: number;

    @Prop({
        type: String,
        required: false
    })
    user_username?: string;

    @Prop({
        type: String,
        required: false
    })
    user_password: string;

    @Prop({
        type: String,
        required: false
    })
    user_email: string;

    @Prop({
        type: String,
        default: 'Operador'
    })
    user_role?: string;

    @Prop({
        type: String,
        default: 'Empleado'
    })
    user_position?: string;

    @Prop({
        type: Timestamp,
        default: Date.now
    })
    user_creation_date?: Date;

    @Prop({
        type: Timestamp,
    })
    user_latest_update?: Date;

    @Prop({
        type: Boolean,
        required: false,
        default: true
    })
    user_state: Boolean;

    @Prop({
        type: String,
        required: false
    })
    workgroup_name?: string

    @Prop({
        type: String,
    })
    user_color?: string;

    @Prop({
        type: String,
    })
    user_photo?: string;

    @Prop({
        type: String,
        required: false
    })
    user_fullname?: string;

    @Prop({
        type: Boolean,
        required: false
    })
    user_isroot: boolean;

    @Prop({
        type: Boolean,
        required: false
    })
    user_admin?: boolean;

    //catastro
    @Prop({
        type: Boolean,
        required: false
    })
    user_is_inspector?: boolean;

    @Prop({
        type: Number,
        unique: false
    })
    user_code?: number;

    //
    @Prop({
        type: Boolean,
    })
    web_seguridad_ciudadana?: boolean;

    @Prop({
        type: Boolean,
    })
    web_catastro?: boolean;

    @Prop({
        type: Boolean,
    })
    web_rentas?: boolean;

    @Prop({
        type: Boolean,
    })
    web_inspecciones?: boolean;

    @Prop({
        type: Boolean,
    })
    fichas?: boolean;

    @Prop({
        type: String,
        required: false,
    })
    notification_token?: string;

    @Prop({
        type: [],
        required: false,
    })
    user_true_incidents?: Array<any>;

    @Prop({
        type: [],
        required: false,
    })
    user_false_incidents?: Array<any>;

    @Prop({
        type: Date,
        required: false
    })
    user_date_deactivation?: string;

    @Prop({
        type: String,
        required: false
    })
    usuario_correo_recuperacion?: string;

    @Prop({
        type: Boolean,
        required: false,
        default: true
    })
    user_available?: boolean;

    @Prop({
        type: Object,
        required: false
    })
    user_profile?: Object;

    @Prop({
        type: String,
        required: false
    })
    user_invitation_code?: string;

    @Prop({
        type: [],
        required: false
    })
    user_list_attributions?: Array<any>;

    @Prop({
        type: Object,
        required: false
    })
    user_attribution_code?: Object;

    @Prop({
        type: String,
        required: false,
    })
    user_number_ticket_assigned?: string;

    @Prop({
        type: Object,
        required: false,
    })
    user_ticket_id_assigned?: object;

    @Prop({
        type: Date,
        required: false,
    })
    user_ticket_time_assigned?: string;

    @Prop({
        type: Boolean,
        required: false,
        default: false
    })
    user_certificated?: boolean;

    @Prop({
        type: Boolean,
        required: false,
        default: false
    })
    user_sipcop?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
