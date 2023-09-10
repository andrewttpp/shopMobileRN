const ajax_check_product = function (product_id) {
    $.ajax({
        url: '/api/check/' + product_id + '/',
        type: 'get',
        cache: true,

        success: function (responce) {
            const button = $('.add-to-cart')
            const button_title = $('.add-to-cart .title')
            button_title.css({'style.display': 'flex'})
            if (responce.product_in_the_cart === true) {
                button.css({'backgroundColor': 'green'})
                button_title.html('Уже в корзине')
                button_title.attr('href', '/cart')
            } else {
                button.css({'backgroundColor': '#2a2929fc'})
                button_title.html('Добавить в корзину')
                button_title.removeAttr('href')
            }
        }
    });
}

if (document.querySelector('.colors .checked')) {
    ajax_check_product(document.querySelector('.colors .checked').getAttribute('product-id'));

}

$('.add-to-cart').click(function () {
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    const relative_element = this
    const a_title = $('.add-to-cart .title')
    const load_element = $('.load')
    a_title.css({'style.display': 'none'});
    load_element.css({'style.display': 'block'});
    $.ajax({
        url: '/api/add/' + document.querySelector('.colors .checked').getAttribute('product-id') + '/',
        type: 'post',
        data: {
            csrfmiddlewaretoken: csrf,
            quantity: 1,
            price: $('.colors .checked').attr('product-price'),
        },

        success: function (responce) {
            ajax_check_count_product();
            relative_element.style.backgroundColor = 'green'
            a_title.attr('href', '/cart')
            a_title.css({'style.display': 'flex'})
            a_title.text('Уже в корзине')
            load_element.css({'style.display': 'none'})
        }
    });
});

const check_price = function (color_selector) {
    let old_price_selector = document.querySelector('.product-price .old-product-price')
    let current_price_selector = document.querySelector('.product-price .current-product-price')
    let currency = color_selector.getAttribute('product-currency')
    if (color_selector.getAttribute('product-old-price')) {
        old_price_selector.style.display = 'block'
        old_price_selector.innerHTML = color_selector.getAttribute('product-old-price') + ' ' + currency
    } else {
        old_price_selector.style.display = 'none'
    }

    current_price_selector.innerHTML = color_selector.getAttribute('product-price') + ' ' + currency
}

// listener click selector color
const photos = document.querySelectorAll('.photo')
if (photos.length) {
    photos[0].classList.add('is-open')
}

let select_photo = document.querySelector('.photos .is-open')
let select_color = document.querySelectorAll('.color')
select_color.forEach(color => color.addEventListener('click', function () {
    let current_select_color = document.querySelector('.checked')
    current_select_color.classList.remove('checked')
    select_photo.classList.remove('is-open')
    let product_id_color = color.getAttribute('product-id')
    select_photo = document.querySelector(`.photos [id='${product_id_color}']`)
    select_photo.classList.add('is-open')
    color.classList.add('checked')
    check_price(color)
    ajax_check_product(color.getAttribute('product-id'))
}));

// listener open filters
const button_open_filters = document.querySelector('.button-open-filter')
let filters_block = document.querySelector('.filters-main')
let current_selection_button_sort = document.querySelector('input[name="sorting"]:checked')
let button_submit_filters = document.querySelector('.button-submit')

button_open_filters.addEventListener('click', function () {
    if (filters_block.clientHeight) {
        filters_block.style.height = '0px'
    } else {
        filters_block.style.height = '270px'
    }
})

button_submit_filters.addEventListener('click', function () {
    const sorting = current_selection_button_sort.getAttribute('data-value')
    const initial_price = document.querySelector('.price-filter-block #initial-price').value
    const final_price = document.querySelector('.price-filter-block #final-price').value
    window.location.href = `/market/miagkaia-mebel/?sorting=${sorting}&initial_price=${initial_price}&final_price=${final_price}`
})

