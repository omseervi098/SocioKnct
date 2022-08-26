//var socket = io();
var sender = $('#currentuser').val();
var receiverName;

function addFriend(name) {
	console.log(name);
	
      $.ajax({
        url: '/add-friend',
        type: 'POST',
        data: {
          receiverName: name        
        },
        success: function(data) {
			//console.log(data);
            console.log('Added as Friend');
        },
		error: function(err) {
			console.log(err);
		}
      })
}

$(document).ready(function(){
		$('.friend-add').on('click', function(e){
			e.preventDefault();
		});
		$('#accept_friend').on('click', function(e){
			e.preventDefault();
			var senderId= $('#senderId').val();
			var senderName= $('#senderName').val();
			
			$.ajax({
				url: '/add-friend/',
				type: 'POST',
				data: {
					senderId:senderId,
					senderName: senderName
				},
				success: function(data) {
					console.log(data);
					$(this).parent().eq(1).remove();
				},
				error: function(err) {
					console.log(err);
				}
			});
		$('#reload').load(location.href + ' #reload');		
		});
		$('#cancel_friend').on('click', function(e){
			e.preventDefault();
			var user_Id= $('#user_Id').val();
			//console.log(user_Id);
			// console.log(user_Id);	
			$.ajax({
				url: '/add-friend',
				type: 'POST',
				data: {
					user_Id: user_Id
				},
				success: function(data) {
					console.log(data);
					$(this).parent().eq(1).remove();
				},error: function(err) {
					console.log(err);
				}
			});
		$('#reload').load(location.href + ' #reload');		
		});
});