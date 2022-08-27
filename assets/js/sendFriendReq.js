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
			
            console.log('Request sent');
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
		$('#accept_friend').on('click', function(){
			//e.preventDefault();
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
					if(typeof data == 'object'){
						console.log(data)
					}
				
					//When successfull reload the page
					window.location.reload();
					console.log('Request approved');
				},
				error: function(err) {
					console.log(err);
				}
			});
			$('#friends-reload').load(location.href + ' #friends-reload');
		    $('#reload').load(location.href + ' #reload');		
		});
		$('#cancel_friend').on('click', function(e){
			e.preventDefault();
			
			var user_Id= $('#user_Id').val();
				
			$.ajax({
				url: '/add-friend/',
				type: 'POST',
				data: {
					user_Id: user_Id
				},
				success: function(data) {
					if(typeof data == 'object'){
						console.log(data)
					}
					console.log('Request cancelled');
					//When successfull reload the page
					//window.location.reload();
				},error: function(err) {
					console.log(err);
				}
			});
		    $('#reload').load(location.href + ' #reload');
		});
});