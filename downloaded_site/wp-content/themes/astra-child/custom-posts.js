jQuery(document).ready(function($){
    function checkParents(selector){
        $(selector).each(function(){
            if(cp_ajax_object.current_cat_slugs.indexOf($(this).val())!==-1){
                $(this).prop('checked',true);
            }
        });
    }
    function filterSubcategories(){
        var selected=[];
        $('.category-checkbox:checked').each(function(){selected.push($(this).val());});
        $.ajax({
            url:cp_ajax_object.ajax_url,
            type:'POST',
            data:{
                action:'filter_subcategories',
                cats:selected,
                current_slugs:cp_ajax_object.current_cat_slugs,
                is_en:cp_ajax_object.is_en
            },
            success:function(data){
                $('#subcategory-container').html(data);
                checkParents('.subcategory-checkbox');
                $('.subcategory-checkbox').on('change',function(){
                    filterSubSubcategories();
                    filterPosts(1);
                });
                filterSubSubcategories();
                filterPosts(1);
            }
        });
    }
    function filterSubSubcategories(){
        var selected=[];
        $('.subcategory-checkbox:checked').each(function(){selected.push($(this).val());});
        $.ajax({
            url:cp_ajax_object.ajax_url,
            type:'POST',
            data:{
                action:'filter_sub_subcategories',
                subcats:selected,
                current_slugs:cp_ajax_object.current_cat_slugs,
                is_en:cp_ajax_object.is_en
            },
            success:function(data){
                $('#sub-subcategory-container').html(data);
                checkParents('.sub-subcategory-checkbox');
                $('.sub-subcategory-checkbox').on('change',function(){
                    filterPosts(1);
                });
                filterPosts(1);
            }
        });
    }
    function filterPosts(paged){
        var selectedCats=[];
        var selectedSubs=[];
        var selectedSubs2=[];
        $('.category-checkbox:checked').each(function(){selectedCats.push($(this).val());});
        $('.subcategory-checkbox:checked').each(function(){selectedSubs.push($(this).val());});
        $('.sub-subcategory-checkbox:checked').each(function(){selectedSubs2.push($(this).val());});
        var orderVal=$('#order').val();
        var page=paged?paged:1;
        $.ajax({
            url:cp_ajax_object.ajax_url,
            type:'POST',
            data:{
                action:'filter_custom_posts',
                cats:selectedCats,
                subcats:selectedSubs,
                subsubcats:selectedSubs2,
                order:orderVal,
                paged:page,
                is_en:cp_ajax_object.is_en
            },
            success:function(res){
                $('#custom-posts-results').html(res);
                $('#custom-posts-results .pagination a').on('click',function(e){
                    e.preventDefault();
                    var newPage=$(this).attr('href').split('paged=')[1];
                    filterPosts(newPage);
                });
            }
        });
    }
    checkParents('.category-checkbox');
    $('.category-checkbox').on('change',function(){
        filterSubcategories();
    });
    $('#order').on('change',function(){
        filterPosts(1);
    });
    filterSubcategories();
});
