jQuery(document).ready(function($){
    var hasAjax = (typeof starRatingAjax !== 'undefined' && starRatingAjax);

    var isEn = hasAjax && parseInt(starRatingAjax.is_en, 10) === 1;

    var txtAvg  = hasAjax && starRatingAjax.txt_avg
        ? starRatingAjax.txt_avg
        : (isEn ? 'Average rating: ' : 'متوسط التقييم: ');

    var txtErr  = hasAjax && starRatingAjax.txt_err
        ? starRatingAjax.txt_err
        : (isEn ? 'Something went wrong!' : 'حدث خطأ ما!');

    var txtFail = hasAjax && starRatingAjax.txt_fail
        ? starRatingAjax.txt_fail
        : (isEn ? 'Could not submit rating. Please try again later.' : 'تعذّر إرسال التقييم. حاول مرة أخرى لاحقًا.');

    $('.star-rating-wrapper').each(function(){
        var $wrapper = $(this);
        var average = parseFloat($wrapper.data('average')) || 0;
        highlightStars($wrapper, average);
    });

    $('.star-rating-wrapper .star').hover(
        function(){
            var $star = $(this);
            var value = parseFloat($star.data('value'));
            var $wrapper = $star.closest('.star-rating-wrapper');
            highlightStars($wrapper, value);
        },
        function(){
            var $wrapper = $(this).closest('.star-rating-wrapper');
            var average = parseFloat($wrapper.data('average')) || 0;
            highlightStars($wrapper, average);
        }
    );

    $('.star-rating-wrapper .star').on('click', function(){
        var $star = $(this);
        var rating = parseFloat($star.data('value'));
        var $wrapper = $star.closest('.star-rating-wrapper');
        var postId = $wrapper.data('post-id');

      $.ajax({
    url: starRatingAjax.ajax_url,
    method: 'POST',
    data: {
        action: 'submit_star_rating',
        nonce: starRatingAjax.nonce,
        post_id: postId,
        rating: rating,
        is_en: (starRatingAjax && starRatingAjax.is_en) ? starRatingAjax.is_en : 0
    },
    success: function(response){
        if(response.success) {
            var data = response.data;

            $wrapper.find('.total-rating-display')
                    .text(txtAvg + data.average_rating + ' / 5');

            $wrapper.attr('data-average', data.average_rating);

            highlightStars($wrapper, parseFloat(data.average_rating));
        } else {
            alert((response.data && response.data.message) ? response.data.message : txtErr);
        }
    },
    error: function(){
        alert(txtFail);
    }
});
    });

    function highlightStars($wrapper, rating) {
        var $stars = $wrapper.find('.star');
        $stars.each(function(){
            var starValue = parseFloat($(this).data('value'));
            if(starValue <= rating) {
                $(this).css('color', 'orange');
            } else {
                $(this).css('color', '#ccc');
            }
        });
    }
});