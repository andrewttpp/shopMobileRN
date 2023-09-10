ajax_check_count_product = function (){$.ajax({
    url: '/api/count_products_in_cart/',
    cache: true,
    type: 'get',

    success: function (responce) {
        $('.count-elements').text(responce.count_products)
    }
})}

ajax_check_count_product()

const search_field_activation_button = $('.search-activate')
const search_button_request = $('.search-button')
const search_block = $('.search-block')
const search_field = $('#site-search')
const block_search_result = $('.search-result-articles')
const hide_search_block_button = $('.hide-img')

search_field_activation_button.on('click', function () {
    if (search_block.height() > 0) {
        search_block.css({'height': '0'})
    } else {
        search_block.css({'height': '60px'})
    }
})

hide_search_block_button.on('click', function () {
    search_block.css({'height': '0'})
})

search_field.on('input paste', function () {
    setTimeout(check_search, 200)
})

search_button_request.on('click', function () {
    window.location = '/market/search/?search_content=' + search_field.val();
});

const check_search = function () {
    if (search_field.val()) {
        $.ajax({
            url: '/api/search_products/',
            type: 'get',
            cache: true,
            data: {
                search_content: search_field.val()
            },

            success: function (responce) {
                if (responce.length) {
                    let articles_html = ''
                    for (let i = 0; i < responce.length; i++) {
                        articles_html +=
                            `<div class="found-item-number"> 
                                <a class="found-item-number-image" href="/market/${responce[i]['id']}/${responce[i]['slug']}/">
                                    <img src=${responce[i]['image']['image']}>
                                </a>
                                 <a class="found-item-number-parameters-name" href="/market/${responce[i]['id']}/${responce[i]['slug']}/">${responce[i]['name']}</a>
                               </div>`
                    }

                    block_search_result.html(articles_html)
                } else {
                    block_search_result.text(`По запросу "${search_field.val()}" ничего не найдено`)
                }
                block_search_result.css({'display': 'flex'})
            }
        });
    } else {
        block_search_result.css({'display': 'none'})
    }
}


