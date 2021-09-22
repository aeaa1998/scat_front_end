export default class Registration {
    constructor(username, roomId){
        this.username = username
        this.roomId = roomId
    }

    dump(){
        return JSON.stringify(
            {
            "__registration__":    {
              "username": this.username,  
              "room_id": this.roomId,
            }
        }
        )
    }
}