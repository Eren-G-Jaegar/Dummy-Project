const asyncHandler = (requestHandler)=>{
  (req,res,next) => {
    Promise.resolve(requestHandler(req,res,next))
    .reject((err)=>next(err))
  }
}

// const asyncHandler = fn => (req, res, next) =>
//   Promise.resolve(fn(req, res, next)).catch(next);

export {asyncHandler};