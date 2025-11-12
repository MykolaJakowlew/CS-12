// [
//  { id: 1, name, shortDescription, ... },
//  { id: 1, name, shortDescription, ... },
//  { id: 2, name, shortDescription, ... },
//  { id: 2, name, shortDescription, ... },
// ]

// [
//  { id: 1, name, shortDescription, ..., count: 1 },
//  { id: 2, name, shortDescription, ..., count: 2 },
// ]
const cart = []

const addCart = (item) => {
    const cartCounter = document.querySelector('#cart-counter')
    const existedItem = cart.find(el => el.id == item.id)
    if (existedItem) {
        existedItem.count += 1
    } else {
        cart.push({ ...item, count: 1 });
    }
    cartCounter.classList.remove('hide')

    // let sum = 0;
    // for (const el of cart) {
    //     sum += el.count
    // }

    const sum = cart.reduce((acc, cur) => {
        return acc + cur.count;
    }, 0)

    if (sum > 9) {
        cartCounter.textContent = "+9"
    } else {
        cartCounter.textContent = sum
    }
}

const createItem = (item) => {
    //  <div class="item"></div>
    const div = document.createElement('div')
    div.classList.add('item');
    div.setAttribute('item-id', item.id)

    // <div class="item-image" style="--bgURL:url(${item.imageUrl})"></div>
    const image = document.createElement('div')
    image.classList.add('item-image')
    image.style = `--bgURL:url(${item.imageUrl})`

    // <div class="item-title">${item.name}</div>
    const title = document.createElement('div')
    title.classList.add('item-title')
    title.textContent = item.name

    // <div class="item-short-description">${item.shortDescription}</div>
    const description = document.createElement('div')
    description.classList.add('item-short-description')
    description.textContent = item.shortDescription

    // <div class="item-rating"></div>
    const bottom = document.createElement('div')
    bottom.classList.add('item-bottom')

    // <div class="item-rating"></div>
    const rating = document.createElement('div')
    rating.classList.add('item-rating')
    rating.textContent = `Rating: ${item.rating}`

    // <div class="item-rating"></div>
    const availableCount = document.createElement('div')
    availableCount.classList.add('item-available-count')
    availableCount.textContent = `Count: ${item.availableCount}`

    // <div class="item-price"></div>
    const price = document.createElement('div')
    price.classList.add('item-price')
    price.textContent = `${item.price} ${item.currency}`

    const add = document.createElement('div')
    add.classList.add('item-add')
    add.textContent = `Add to cart`
    add.addEventListener('click', () => {

        // item.availableCount = item.availableCount - 1
        // item.availableCount--;
        if (item.availableCount == 0) {
            return;
        }

        addCart(item)

        item.availableCount -= 1
        availableCount.textContent = `Count: ${item.availableCount}`

        if (item.availableCount == 0) {
            add.classList.add('disabled')
        }
    })

    bottom.append(rating)
    bottom.append(availableCount)
    bottom.append(price)
    bottom.append(add)

    div.appendChild(image)
    div.appendChild(title)
    div.appendChild(description)
    div.appendChild(bottom)


    return div
}

const setCategoryValues = (data) => {
    // [ 'c1', 'c2', 'c3' ]
    // const allCategories = data.map(el => {
    //     if (allCategories.includes(el)) {
    //         return null;
    //     }
    //     return el.category
    // }).filter(el => el != null)

    // allCategories => [ 'c1', 'c2', 'c1', 'c3' ]
    const allCategories = data.map(el => el.category)

    // allCategoriesSet => {
    //    c1: 1,
    //    c2: 1,
    //    c3: 1,
    //    ...
    // }
    const allCategoriesSet = new Set(allCategories)
    // uniqueCategories => [ 'c1', 'c2', 'c3' ]
    const uniqueCategories = [...allCategoriesSet]

    const categoryNode = document.querySelector('.category select')

    uniqueCategories.forEach(category => {
        const option = document.createElement('option')
        option.textContent = category
        option.value = category

        categoryNode.appendChild(option)
    })
}

const setExtraFunctions = (data) => {

    // [
    //   ['f1', 'f2', 'f3', ...],
    //   ['f1', 'f2', 'f3', ...],
    //   ['f1', 'f2', 'f3', ...]
    //   ...
    // ]
    // const extraFunctions = data.map(el => el.extraFunctions)

    // [
    //  'f1', 'f2', 'f3', ...,
    //  'f1', 'f2', 'f3', ...,
    //  'f1', 'f2', 'f3', ...,
    //   ...
    // ]
    // const extraFunctions = data.map(el => el.extraFunctions).flat()

    // [
    //  'f1', 'f2', 'f3', ...,
    //  'f1', 'f2', 'f3', ...,
    //  'f1', 'f2', 'f3', ...,
    //   ...
    // ]
    const allExtraFunctions = data.flatMap(el => el.extraFunctions)
    const uniqueExtraFunctions = [...new Set(allExtraFunctions)]

    const container = document.querySelector('.extra-functions-container')

    uniqueExtraFunctions.forEach(extra => {
        const label = document.createElement('label')
        const span = document.createElement('span')
        span.textContent = extra;

        const input = document.createElement('input')
        input.type = 'checkbox'
        input.setAttribute('data', extra)

        label.appendChild(input)
        label.appendChild(span)

        container.appendChild(label)
    })
}

const getAllSelectedExtraFunctions = () => {
    const selectedCheckbox = document.querySelectorAll(
        '.extra-functions-container input[type="checkbox"]:checked'
    )
    const extraFunctions = []
    selectedCheckbox.forEach(checkbox => {
        extraFunctions.push(
            checkbox.getAttribute('data')
        )
    })
    return extraFunctions
}

const filterItems = (data, params) => {
    const {
        searchText,
        priceMin,
        priceMax,
        category,
        rating,
        extraFunctions
    } = params;

    data.forEach(el => {
        const item = document.querySelector(`.item[item-id="${el.id}"]`);

        if (searchText.length) {
            const isTextInName = el.name.toLowerCase()
                .indexOf(searchText.toLowerCase()) !== -1
            const isTextInShorDescription = el.shortDescription.toLowerCase()
                .indexOf(searchText.toLowerCase()) !== -1
            if (!isTextInName && !isTextInShorDescription) {
                // el => add hide
                item.classList.add('hide');
                return;
            }
        }

        // if (priceMin >= 0) {
        //     if (el.price < priceMin) {
        //         // el => add hide
        //         item.classList.add('hide');
        //         return;
        //     }
        // }

        if (priceMin >= 0 && el.price < priceMin) {
            // el => add hide
            item.classList.add('hide');
            return;
        }

        if (priceMax >= 0 && el.price > priceMax) {
            // el => add hide
            item.classList.add('hide');
            return;
        }

        if (extraFunctions && extraFunctions.length) {
            const result = extraFunctions
                .every(extra => el.extraFunctions.includes(extra))
            if (!result) {
                // el => add hide
                item.classList.add('hide');
                return;
            }
        }


        item.classList.remove('hide');
    })
}

const setupFilters = (data) => {
    const searchInput = document.querySelector('#search-input')
    const priceMinInput = document.querySelector('#price-min')
    const priceMaxInput = document.querySelector('#price-max')

    searchInput.addEventListener('keyup', (event) => {
        const text = event.target.value.trim().toLowerCase()
        filterItems(data, {
            searchText: text,
            priceMin: parseInt(priceMinInput.value),
            priceMax: parseInt(priceMaxInput.value),
            extraFunctions: getAllSelectedExtraFunctions()
        })

    })

    priceMinInput.addEventListener('keyup', (event) => {
        filterItems(data, {
            searchText: searchInput.value.trim().toLowerCase(),
            priceMin: parseInt(event.target.value),
            priceMax: parseInt(priceMaxInput.value),
            extraFunctions: getAllSelectedExtraFunctions()
        })
    })

    priceMaxInput.addEventListener('keyup', (event) => {
        filterItems(data, {
            searchText: searchInput.value.trim().toLowerCase(),
            priceMin: parseInt(priceMinInput.value),
            priceMax: parseInt(event.target.value),
            extraFunctions: getAllSelectedExtraFunctions()
        })
    })

    document.querySelectorAll(
        '.extra-functions-container input[type="checkbox"]'
    ).forEach(checkboxInput => {
        checkboxInput.addEventListener(
            'change',
            () => {
                const extraFunctions = getAllSelectedExtraFunctions()
                filterItems(data, {
                    searchText: searchInput.value.trim(),
                    priceMin: parseInt(priceMinInput.value),
                    priceMax: parseInt(priceMaxInput.value),
                    extraFunctions,
                })
            }
        )
    })
}

const updateItemAvailabeCount = (id, count) => {
    document.querySelector(
        `.item[item-id="${id}"] .item-available-count`
    ).textContent = `Count: ${count}`
}

const createViewItem = (item, data) => {
    const cartViewItem = document.createElement('div')
    cartViewItem.classList.add('cart-view-item')

    const cartViewItemImage = document.createElement('div')
    cartViewItemImage.classList.add('image')
    cartViewItemImage.style = `--bgImg: url('${item.imageUrl}')`

    const cartViewItemName = document.createElement('div')
    cartViewItemName.classList.add('name')
    cartViewItemName.textContent = item.name

    const cartViewItemPrice = document.createElement('div')
    cartViewItemPrice.classList.add('price')
    cartViewItemPrice.textContent = item.price

    const itemCount = item.count
    const cartViewItemCount = document.createElement('div')
    cartViewItemCount.classList.add('count')
    const cartViewItemCountDec = document.createElement('div')
    cartViewItemCountDec.classList.add('decrease-count')
    cartViewItemCountDec.textContent = "-"
    const cartViewItemCountValue = document.createElement('div')
    cartViewItemCountValue.classList.add('count-value')
    cartViewItemCountValue.textContent = itemCount
    const cartViewItemCountInc = document.createElement('div')
    cartViewItemCountInc.classList.add('increase-count')
    cartViewItemCountInc.textContent = "+"
    cartViewItemCount.append(
        cartViewItemCountDec,
        cartViewItemCountValue,
        cartViewItemCountInc
    )

    const cartViewItemTotalItemPrice = document.createElement('div')
    cartViewItemTotalItemPrice.classList.add("total-item-price")
    cartViewItemTotalItemPrice.textContent = (itemCount * item.price).toFixed(2)

    const cartViewItemRemoveItem = document.createElement('div')
    cartViewItemRemoveItem.classList.add('remove-item')
    const cartViewItemRemoveItemImg = document.createElement('img')
    cartViewItemRemoveItemImg.src = "./imgs/delete.png"
    cartViewItemRemoveItemImg.addEventListener('click', () => {
        const index = cart.findIndex(el => el.id === item.id)
        cart.splice(index, 1)
        setTotalPrice()
        // item.availableCount += item.count
        const renderItem = data.find(el => el.id === item.id)
        renderItem.availableCount += item.count;
        updateItemAvailabeCount(item.id, renderItem.availableCount)
        cartViewItem.remove()
    })
    cartViewItemRemoveItem.appendChild(cartViewItemRemoveItemImg)

    cartViewItem.append(
        cartViewItemImage,
        cartViewItemName,
        cartViewItemPrice,
        cartViewItemCount,
        cartViewItemTotalItemPrice,
        cartViewItemRemoveItem,
    )
    return cartViewItem
}

const setTotalPrice = () => {
    let totalPrice = 0
    for (const el of cart) {
        totalPrice += el.count * el.price
    }

    document.querySelector('#total-price-value')
        .textContent = totalPrice.toFixed(2)
}

document.addEventListener('DOMContentLoaded', async () => {

    const response = await fetch('./electronic_items_dataset.json')
    const data = await response.json()
    const items = document.querySelector('.items')
    data.forEach(el => {
        const div = createItem(el)
        items.appendChild(div)
    })

    setCategoryValues(data)
    setExtraFunctions(data)

    setupFilters(data)

    const cartViewWrapper = document.querySelector('.cart-view-wrapper')
    const cartViewList = document.querySelector('.cart-view-list')

    const closeCart = () => {
        cartViewWrapper.classList.add('hide')
    }

    const openCart = () => {
        cartViewWrapper.classList.remove('hide')
    }

    document.querySelector('.blur')
        .addEventListener('click', () => {
            closeCart()
        })

    document.querySelector('#cart-view-close')
        .addEventListener('click', () => {
            closeCart()
        })

    document.querySelector('.cart > div')
        .addEventListener('click', () => {
            // Option A
            cartViewList.innerHTML = ''
            // Option B
            // document.querySelectorAll('.cart-view-item')
            //     .forEach(elem => elem.remove())

            const cartViewItems = cart.map(item => {
                return createViewItem(item, data)
            })
            cartViewList.append(...cartViewItems)

            setTotalPrice()

            openCart()
        })

    // setTimeout(() => {
    document.querySelector('.loader')
        .classList.add('hide')
    // }, 2500)
})