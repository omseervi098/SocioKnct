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
}