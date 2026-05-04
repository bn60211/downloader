jQuery(document).ready(function($) {
    $(document).on('keyup', '#search-input', function() {
        let searchQuery = $(this).val();

        if (searchQuery.length > 2) {  
            $('.elementor-posts-container').hide(); 
            $('.elementor-pagination').hide(); 
            $.ajax({
                type: 'POST',
                url: ajax_obj.ajaxurl, 
                data: {
                    action: 'custom_search',
                    query: searchQuery
                },
                success: function(response) {
                    $('#search-results').html(response);
                }
            });
        } else {
            $('#search-results').html('');
            $('.elementor-posts-container').show(); 
            $('.elementor-pagination').show();
        }
    });
});
