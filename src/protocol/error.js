import Vue from 'vue'


export default class ErrorResponse{
    constructor(message, code){
        this.message = message
        this.code = code
    }

    static fromJson(json){
        return new ErrorResponse(json["__error_response_message__"], json["__error_response_code__"])
    }

    notify(){
        Vue.notify({
            title: this.message,
            type: "error"
          })
    }
}