import  { v4 } from 'uuid'

export default class Chat {

    static key = "__chat__"

    constructor(username, message, type){
        this.username = username
        this.message = message
        this.type = type
        this.id = v4()
    }

    dump(){
        return JSON.stringify({
            "__type__": "__chat__",
            "username": this.username,
            "message": this.message,
        })
    }

    static fromJson(json){
        return new Chat(json["username"], json["message"], "external")
    }
}