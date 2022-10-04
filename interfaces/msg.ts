import { ChatUsersInfo } from "../components/ChatContext"

export interface MsgType {
    sender: string
    created_at: number 
    contents: string
    message_type : number
}

export interface ChatInfo {
    history : MsgType[],
    users: ChatUsersInfo
}

