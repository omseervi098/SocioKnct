{
    function filePreview(input){
        console.log(input.files);
        if(input.files && input.files[0]){
            var reader = new FileReader();
            reader.onload = function(e){
                $('#avatar-form-container+ img').remove();
                $('#avatar-form-container').after('<img id="preview" src="'+e.target.result.toString()+'" width="100" height="100" />');
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#input-file").change(function(){
        console.log(this);
        filePreview(this);
    })
    let addFriend=function(){
        let connect=$('#connect-form');
        connect.submit((e)=>{
            e.preventDefault();
            $.ajax({
                type:"POST",
                url:"/connect",
                data:connect.serialize(),
                success:function(data){
                    if(data.data.delete){
                        //Change value of conntect-btn
                        $('#connect-btn').val('Connect');
                    }else{
                        //Change value of conntect-btn
                        $('#connect-btn').val('Disconnect');   
                    }
                    console.log(data.message);
                    
                },error:function(err){
                    console.log(err)
                }
            })
        });
    }
    let removefriend=function(){
        let remove=$('#remove-form');
        remove.submit((e)=>{
            e.preventDefault();
            //console.log(e);
            $.ajax({
                type:'POST',
                url:'/remove-friend',
                data:remove.serialize(),
                success:function(data){
                    console.log(data);
                    console.log('Removed as Friend');
                },error:function(err){
                    console.log(err);
                }
            })
        })
    }
    addFriend();
    
}