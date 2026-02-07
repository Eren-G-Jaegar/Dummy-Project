class ApiResponse{
  constructor(stastuCode , data , message="Success"){
    this.stastuCode=stastuCode,
    this.data=data,
    this.message=message,
    this.success=stastuCode < 400
  }
}

export {ApiResponse}