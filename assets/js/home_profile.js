{
    function filePreview(input){
        
        if(input.files && input.files[0]){
            var reader = new FileReader();
            reader.onload = function(e){
                $('#avatar-form-container+div >img').remove();
                $('#avatar-form-container+div').append('<img id="preview" src="'+e.target.result.toString()+'" width="100" height="100" />');
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#input-file").change(function(){
       
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
                    
                    window.location.reload();
                },error:function(err){
                    console.log(err)
                }
            })
            $('#friends-reload').load(location.href + ' #friends-reload');
        });
    } 
    addfriend();
    
}