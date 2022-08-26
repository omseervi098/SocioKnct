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
    let addfriend=function(){
        let connect=$('#connect-form');
        connect.submit((e)=>{
            e.preventDefault();
            $.ajax({
                type:"POST",
                url:"/remove",
                data:connect.serialize(),
                success:function(data){
                    console.log(data);
                    $('#connect-form').trigger('reset');
                    $('.form-for-adding-friend').html(
                        `
                        <form action="" method="get" class="add_friend">
                        <input type="hidden" name="receiverName" class="receiverName" value="${data.data.to_user.username}">
                        <input type="hidden" name="sender-name" class="sender-name" value="${data.data.from_user.username}">
                        
                        <button type="submit" id="" onclick="addFriend('${data.data.from_user.username}')"
                                        class=" accept friend-add"><i class="fa fa-user"></i> Add Friend</button>
                    </form>
                        `
                    )
                    
                    
                },error:function(err){
                    console.log(err)
                }
            })
        });
    } 
    addfriend();
    
}