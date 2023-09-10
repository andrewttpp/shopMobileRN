///////////// jQuery Ajax requests \\\\\\\\\\\\\
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

$('.add-to-cart').click(function () {
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    const relative_element = this
    const a_title = $('.add-to-cart .title')
    const load_element = $('.load')
    const current_select_color = $('.colors .checked')
    let price = parseInt(current_select_color.attr('product-price'))
    a_title.css({'style.display': 'none'});
    load_element.css({'style.display': 'block'});
    $.ajax({
        url: '/api/add/' + current_select_color.attr('product-id') + '/',
        type: 'post',
        data: {
            csrfmiddlewaretoken: csrf,
            quantity: parseInt(input_field.value),
            price: price
        },

        success: function () {
            ajax_check_count_product()
            relative_element.style.backgroundColor = 'green'
            a_title.attr('href', '/cart')
            a_title.css({'style.display': 'flex'})
            a_title.html('Уже в корзине')
            load_element.css({'style.display': 'none'})
        }
    });
});

///////////// Js Vanilla \\\\\\\\\\\\\

if (!document.querySelector('.main-product-photo').getAttribute('src')) {
    const current_open_image = document.querySelector('.photos-carousel .is-open').getAttribute('src')
    document.querySelector('.main-product-photo').setAttribute('src', current_open_image)
}

ajax_check_product(document.querySelector('.colors .checked').getAttribute('product-id'));

// listener click selector photo
let photos = document.querySelectorAll('.product-photo')
photos.forEach(photo => photo.addEventListener('click', function () {
    if (!photo.classList.contains('is-open')) {
        if (document.querySelector('.photos-carousel .is-open')) {
            document.querySelector('.photos-carousel .is-open').classList.remove('is-open')
        }
        photo.classList.add('is-open')
        document.querySelector('.main-product-photo').src = photo.getAttribute('src')
    }
}));

// listener click carousel button
if (photos.length > 5) {
    let current_first_image = 0
    let current_last_image = 5

    let prev_carousel_button = document.querySelector('.prev-button-carousel')
    let next_carousel_button = document.querySelector('.next-button-carousel')

    prev_carousel_button.style.display = 'flex'
    next_carousel_button.style.display = 'flex'

    prev_carousel_button.addEventListener('click', function () {
        let difference = current_first_image - 5 >= 0 ? 5 : current_first_image
        if (current_first_image) {
            current_first_image -= difference
            current_last_image -= difference
            photos[current_first_image].scrollIntoView(false);
            next_carousel_button.querySelector("#next-slide").style.borderColor = 'rgba(42, 41, 41)'
            if (current_first_image === 0) {
                prev_carousel_button.querySelector("#prev-slide").style.borderColor = 'gray'
            }
        }

    })

    next_carousel_button.addEventListener('click', function () {
        if (current_last_image < photos.length) {
            let difference = photos.length - current_last_image - 6 >= 0 ? 5 : photos.length - 1 - current_last_image
            current_first_image += difference
            current_last_image += difference
            photos[current_last_image].scrollIntoView(false);
            prev_carousel_button.querySelector("#prev-slide").style.borderColor = 'rgba(42, 41, 41)'
            if (current_last_image === photos.length - 1) {
                next_carousel_button.querySelector("#next-slide").style.borderColor = 'gray'
            }
        }
    })
}

// listener click selector color
let select_color = document.querySelectorAll('.color')
select_color.forEach(color => color.addEventListener('click', function () {
    let current_select_color = document.querySelector('.checked')
    current_select_color.classList.remove('checked')
    color.classList.add('checked')
    let first_photo_current_select_color = document.querySelectorAll(`.product-photo[data-value="${color.getAttribute('product-id')}"]`)
    if (first_photo_current_select_color) {
        let current_open_photo = document.querySelector('.photos-carousel .is-open')
        if (current_open_photo) {
            current_open_photo.classList.remove('is-open')
            first_photo_current_select_color[0].classList.add('is-open')
            document.querySelector('.main-product-photo').src = first_photo_current_select_color[0].getAttribute('src')
            first_photo_current_select_color[0].scrollIntoView(false)
        }
    }

    ajax_check_product(color.getAttribute('product-id'))
    let currency = color.getAttribute('product-currency')
    const products_quantity = parseInt(input_field.value);
    let old_price_block = document.querySelector('.old-product-price')
    if (color.getAttribute('product-old-price')) {
        const old_price = parseInt(color.getAttribute('product-old-price'));
        old_price_block.innerHTML = old_price * products_quantity + ' ' + currency
        if (old_price_block.style.display === 'none') {
            old_price_block.style.display = 'block'
        }
    } else {
        old_price_block.style.display = 'none'
    }

    let current_price = parseInt(color.getAttribute('product-price')) * products_quantity
    document.querySelector('.current-product-price').innerHTML = current_price + ' ' + currency

    document.querySelector('.current-color').innerHTML = color.title
}));

// handler change textbox
const isNumeric = n => !!Number(n);
let button_minus = document.querySelector('.button-minus-the-product')
let button_plus = document.querySelector('.button-plus-the-product')
let input_field = document.querySelector('.field-quantity-current-product')
const change_price = function (action = 'nothing') {
    if (action === 'nothing') {
        input_field.value = parseInt(input_field.value)
        if (input_field.value === '500') {
            button_plus.classList.add('locked')
            if (button_minus.classList.contains('locked')) {
                button_minus.classList.remove('locked')
            }
        } else if (input_field.value === '1') {
            button_minus.classList.add('locked')
            if (button_plus.classList.contains('locked')) {
                button_plus.classList.remove('locked')
            }
        } else {
            if (button_minus.classList.contains('locked')) {
                button_minus.classList.remove('locked')
            }
            if (button_plus.classList.contains('locked')) {
                button_plus.classList.remove('locked')
            }
        }
    } else if (action === 'plus') {
        input_field.value = parseInt(input_field.value) + 1
        if (button_minus.classList.contains('locked')) {
            button_minus.classList.remove('locked')
        }
        if (input_field.value === '500') {
            button_plus.classList.add('locked')
        }
    } else if (action === 'minus') {
        input_field.value = parseInt(input_field.value) - 1
        if (input_field.value === '1') {
            button_minus.classList.add('locked')
        }
        if (button_plus.classList.contains('locked')) {
            button_plus.classList.remove('locked')
        }
    }

    const product_currency = document.querySelector('.colors .checked').getAttribute('product-currency')

    let old_price_current_product = document.querySelector('.colors .checked').getAttribute('product-old-price')
    if (old_price_current_product) {
        old_price_current_product = parseInt(old_price_current_product)
        document.querySelector('.old-product-price').innerHTML = String(input_field.value * old_price_current_product) + ' ' + product_currency
    }

    let price_current_product = parseInt(document.querySelector('.colors .checked').getAttribute('product-price'))
    document.querySelector('.current-product-price').innerHTML = String(input_field.value * price_current_product) + ' ' + product_currency
}

input_field.addEventListener('change', function () {
    if (!isNumeric(input_field.value)) {
        input_field.value = '1'
        change_price()
    } else {
        if (parseInt(input_field.value) > 500) {
            input_field.value = '500'
        }

        change_price()
    }

    if (input_field.value === '1') {
        button_minus.classList.add('locked')
    }

});

// handler click to button minus-the-product
button_minus.addEventListener('click', function () {
    if (isNumeric(input_field.value) && parseInt(input_field.value) > 1) {
        change_price('minus')
    }
});

// handler click to button plus-the-product
button_plus.addEventListener('click', function () {
    change_price("plus")
})

let timeout;
let interval;
button_plus.addEventListener('mousedown', function () {
    timeout = setTimeout(function () {
        interval = setInterval(change_price, 50, 'plus')
    }, 700);
});

button_minus.addEventListener('mousedown', function () {
    timeout = setTimeout(function () {
        interval = setInterval(change_price, 50, 'minus')
    }, 700);
});

['mouseup', 'mouseleave'].forEach(event => {
    button_plus.addEventListener(event, function () {
        clearTimeout(timeout)
        clearInterval(interval)
    })

    button_minus.addEventListener(event, function () {
        clearTimeout(timeout)
        clearInterval(interval)
    })
})