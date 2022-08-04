const express=require('express');
const app=express();
const port=3000;
app.listen(port,(err)=>{
    if(err){
        console.log(`Error : ${err}`);  
        return; 
    }
    console.log(`Server is running on port ${port}`);
})