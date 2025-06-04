import {NoteDocument } from "../types";
import {model, Schema} from "mongoose"
const NoteSchema = new Schema<NoteDocument>({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: false
    },
    important: {
        type: Boolean,
        required: true
    },
    userID:{
        type: Schema.Types.ObjectId, ref: "Users"
    }
})
export const NoteModel = model<NoteDocument>("Notes", NoteSchema)