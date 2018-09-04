
/**
 * 
 *  Javascript handler for validating events pertaining to index / startup
 * 
 */


$('.join-chat').click(function(e) {

    $("#chatform").validate(
        {
            rules: 
                {
                name: 
                {
                    required: true,
                    minlength: 4,
                    maxlength: 10
                },
                chatroom: 
                {
                    required: true,
                    minlength: 4,
                    maxlength: 10
                }
            }
        });


    $("#username").val($.trim($("#username").val()));
    $("#chatroom").val($.trim($("#chatroom").val()));

});

	