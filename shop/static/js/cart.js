///////////// jQuery Ajax requests \\\\\\\\\\\\\

ajax_remove_product = function (product_id) {
    $.ajax({
        url: '/api/remove/' + product_id + '/',
        type: 'post',
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (responce) {
            if (products.length > 1) {
                document.getElementById(`${product_id}`).style.height = '0';
                document.getElementById(`${product_id}`).ontransitionend = () => afterTransit(product_id, responce);
            } else {
                afterTransit(product_id, responce)
            }

        }
    });
}

afterTransit = function (product_id, responce) {
    document.getElementById(`${product_id}`).remove()
    ajax_check_count_products(responce)
    products = document.querySelectorAll('.product')
    check_count_products_style()
    replace_backcolor_products_in_cart()
    check_total_block_styles()
}

ajax_update_counter = function (product_id, quantity, price) {
    $.ajax({
        url: '/api/add/' + product_id + '/',
        type: 'post',
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            quantity: quantity,
            price: price
        },

        success: function (responce) {
            ajax_check_count_products(responce)
        }
    });
}


///////////// Js Vanilla \\\\\\\\\\\\\
const isNumeric = n => !!Number(n);
const buttons_minus = document.querySelectorAll('.button-minus-the-product')
const buttons_plus = document.querySelectorAll('.button-plus-the-product')
const input_fields = document.querySelectorAll('.field-quantity-current-product')
let products = document.querySelectorAll('.product')
const delete_buttons = document.querySelectorAll('.delete-button')
let total_price_discount = document.querySelector('.total-price-discount .discount')
let total_price_without_discount = document.querySelector('.total-price-without-discount .price')
let total_price_with_discount = document.querySelector('.total-price-with-discount .price')
let total_quantity_products = document.querySelector('.total-quantity .quantity')
let current_discount = parseInt(total_price_without_discount.innerHTML) - parseInt(total_price_with_discount.innerHTML)
let total_price_block = document.querySelector(".total-price-block")
total_price_discount.innerHTML = String(current_discount)

let check_count_products_style = function () {
    if (!products.length) {
        let title_cart = document.querySelector('.title-cart')
        title_cart.style.borderBottom = '2px solid #efe8e8'
        document.querySelector('.cart-block').innerHTML += '<div class="no-products-found">Корзина пуста</div>'
        document.querySelector('.cart-block').insertBefore(document.querySelector('.no-products-found'), document.querySelector('.total-price-block'))
        document.querySelector('.submit-create-order .button').classList.add('non-active')
        document.querySelector('.submit-create-order .button').title = 'В корзине нет товаров'
        total_price_block = document.querySelector('.total-price-block')
    } else {
        if (document.querySelector('.no-products-found')) {
            document.querySelector('.no-products-found').remove()
        }
    }
}

const replace_backcolor_products_in_cart = function () {
    if (products.length) {
        for (let i = 0; i < products.length; i++) {
            if (i % 2) {
                products[i].style.backgroundColor = "transparent";
            } else {
                products[i].style.backgroundColor = "#efe8e8";
            }
        }
    }
}

check_count_products_style()

for (let i = 0; i < products.length; i++) {
    const change_price = function (action = 'nothing') {
        if (action === 'nothing') {
            input_fields[i].value = parseInt(input_fields[i].value)
        } else if (action === 'plus') {
            if (!buttons_plus[i].classList.contains('locked')) {
                input_fields[i].value = parseInt(input_fields[i].value) + 1
                if (input_fields[i].value === '500') {
                    buttons_plus[i].classList.add('locked')
                    clearTimeout(timeout)
                    clearInterval(interval)
                }
                if (buttons_minus[i].classList.contains('locked')) {
                    buttons_minus[i].classList.remove('locked')
                }
            }

        } else if (action === 'minus') {
            if (!buttons_minus[i].classList.contains('locked')) {
                input_fields[i].value = parseInt(input_fields[i].value) - 1
                if (input_fields[i].value === '1') {
                    buttons_minus[i].classList.add('locked')
                }
                if (buttons_plus[i].classList.contains('locked')) {
                    buttons_plus[i].classList.remove('locked')
                }
            }
        }

        let price_current_product = parseInt(document.querySelectorAll('.product-price .price')[i].innerHTML)
        document.querySelectorAll('.total-price .price')[i].innerHTML =
            String(input_fields[i].value * price_current_product)
    }

    input_fields[i].addEventListener('change', function () {
        if (!isNumeric(input_fields[i].value)) {
            input_fields[i].value = '1'
            change_price()
        } else {
            if (parseInt(input_fields[i].value) > 500) {
                input_fields[i].value = '500'
            }

            change_price()
        }

        if (input_fields[i].value === '1') {
            buttons_minus[i].classList.add('locked')
            buttons_plus[i].classList.remove('locked')
        }

        if (input_fields[i].value === '500') {
            buttons_plus[i].classList.add('locked')
            buttons_minus[i].classList.remove('locked')
        }

    });

    let timeout;
    let interval;
    buttons_plus[i].addEventListener('mousedown', function () {
        timeout = setTimeout(function () {
            interval = setInterval(change_price, 50, 'plus')
        }, 700);
    });

    buttons_minus[i].addEventListener('mousedown', function () {
        timeout = setTimeout(function () {
            interval = setInterval(change_price, 50, 'minus')
        }, 700);
    });

    ['mouseup', 'mouseleave'].forEach(event => {
        buttons_plus[i].addEventListener(event, function () {
            clearTimeout(timeout)
            clearInterval(interval)
            ajax_update_counter(input_field_jquery, input_fields[i].value, price_text)
        })

        buttons_minus[i].addEventListener(event, function () {
            clearTimeout(timeout)
            clearInterval(interval)
            ajax_update_counter(input_field_jquery, input_fields[i].value, price_text)
        })
    })

    let input_field_jquery = products[i].getAttribute('id')
    let price_text = document.querySelectorAll('.price')[i].text

    // handler click to button minus-the-product
    buttons_minus[i].addEventListener('click', function () {
        if (isNumeric(input_fields[i].value) && parseInt(input_fields[i].value) > 1) {
            change_price('minus')
            ajax_update_counter(input_field_jquery, input_fields[i].value, price_text)
        }
    });

    // handler click to button plus-the-product
    buttons_plus[i].addEventListener('click', function () {
        change_price('plus')
        ajax_update_counter(input_field_jquery, input_fields[i].value, price_text)
    });

    // handler click delete product
    delete_buttons[i].addEventListener('click', function () {
        ajax_remove_product(delete_buttons[i].closest('.product').getAttribute('id'))
    })
}

const check_total_block_styles = function () {
    if (products.length % 2) {
        total_price_block.style.borderColor = "transparent"
    } else {
        total_price_block.style.borderColor = "rgba(42, 41, 41, 0.15)"
    }
}

const ajax_check_count_products = function (responce) {
    $.ajax({
        url: '/api/count_products_in_cart/',
        type: 'get',
        cache: true,
        success: function (responce) {
            $('.count-elements').text(responce.count_products)
        }
    })

    total_price_without_discount.innerHTML = responce.total_price_without_discount
    total_price_with_discount.innerHTML = responce.total_price_with_discount
    total_quantity_products.innerHTML = responce.total_quantity_products
    total_price_discount.innerHTML = String(responce.total_price_without_discount - responce.total_price_with_discount)
}

check_total_block_styles();
