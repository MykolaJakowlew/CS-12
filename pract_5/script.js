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

    // [ 'c1', 'c2', 'c1', 'c3' ]
    const allCategories = data.map(el => el.category)

    // {
    //    c1: 1,
    //    c2: 1,
    //    c3: 1,
    //    ...
    // }
    const allCategoriesSet = new Set(allCategories)
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
    const uniqueExtraFunctions = [
        ...new Set(allExtraFunctions)
    ]

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

    // const filterItems = (text, priceMin, priceMax, rarting, category) => { /* ... */ }
    // const filterItems = (params) => { 
    //     const { text, priceMin, priceMax, rarting, category } = params
    // }

    const filterItems = (params) => {
        const { text, price: { min, max }, rating, category, extraFuncions } = params

        data.forEach(el => {
            const id = el.id
            const item = document.querySelector(`.item[item-id="${id}"]`)
            if (!item) {
                return;
            }

            const conditions = []

            if (text.length) {
                const name = el.name.toLowerCase()
                const shortDescription = el.shortDescription.toLowerCase()
                // if (name.indexOf(text) !== -1) {
                //     conditions.push(true)
                // } else if (shortDescription.indexOf(text) !== -1) {
                //     conditions.push(true)
                // } else {
                //     conditions.push(false)
                // }

                // if (name.indexOf(text) !== -1 || shortDescription.indexOf(text) !== -1) {
                //     conditions.push(true)
                // } else {
                //     conditions.push(false)
                // }

                conditions.push(
                    name.indexOf(text) !== -1 || shortDescription.indexOf(text) !== -1
                )
            }

            if (min >= 0 && max >= 0) {
                // const price = el.price
                const { price } = el
                conditions.push(price >= min && price <= max)
            } else if (max >= 0) {
                // const price = el.price
                const { price } = el
                conditions.push(price <= max)
            } else if (min >= 0) {
                // const price = el.price
                const { price } = el
                conditions.push(price <= min)
            }

            if (extraFuncions.length) {
                conditions.push(
                    extraFuncions.every(extra => el.extraFunctions.includes(extra))
                )
            }

            if (conditions.length === 0) {
                document.querySelectorAll('.item.hide')
                    .forEach(el => el.classList.remove('hide'))
                return
            }

            if (conditions.some(el => el === false)) {
                item.classList.add('hide')
            } else {
                item.classList.remove('hide')
            }
        })
    }

    const searchInput = document.querySelector('#search-input')
    const priceMinInput = document.querySelector('#price-min')
    const priceMaxInput = document.querySelector('#price-max')
    const extraFunctionCheckboxes = document.querySelectorAll(
        '.extra-functions-container input[type="checkbox"]'
    )

    extraFunctionCheckboxes.forEach(el => {
        el.addEventListener('change', () => {
            const text = searchInput.value.trim().toLowerCase()
            const priceMin = parseInt(priceMinInput.value)
            const priceMax = parseInt(priceMaxInput.value)
            filterItems({
                text,
                extraFuncions: getExtraFunctions(),
                price: { min: priceMin, max: priceMax }
            })
        })
    })

    const getExtraFunctions = () => {
        const selectedFunctions = []
        extraFunctionCheckboxes.forEach(el => {
            if (el.checked) {
                selectedFunctions.push(el.getAttribute('data'))
            }
        })

        return selectedFunctions
    }

    searchInput.addEventListener('keyup', (event) => {
        const text = event.target.value.trim().toLowerCase()
        const priceMin = parseInt(priceMinInput.value)
        const priceMax = parseInt(priceMaxInput.value)
        filterItems({
            text,
            extraFuncions: getExtraFunctions(),
            price: { min: priceMin, max: priceMax }
        })
    })
    priceMinInput.addEventListener('keyup', (event) => {

        const text = searchInput.value.trim().toLowerCase()
        const priceMin = parseInt(event.target.value)
        const priceMax = parseInt(priceMaxInput.value)
        filterItems({
            text,
            price: { min: priceMin, max: priceMax },
            extraFuncions: getExtraFunctions(),
        })
    })
    priceMaxInput.addEventListener('keyup', (event) => {
        const text = searchInput.value.trim().toLowerCase()
        const priceMin = parseInt(priceMinInput.value)
        const priceMax = parseInt(event.target.value)
        filterItems({
            extraFuncions: getExtraFunctions(),
            text,
            price: { min: priceMin, max: priceMax }
        })
    })




    // document.querySelector('#search-input').addEventListener(
    //     'keyup', (event) => {
    //         const text = event.target.value.trim().toLowerCase()
    //         if (text.length === 0) {
    //             document.querySelectorAll('.item.hide')
    //                 .forEach(el => el.classList.remove('hide'))
    //             return;
    //         }

    //         data.forEach(el => {
    //             // /// Option 1
    //             // {
    //             //     const name = el.name.toLowerCase()
    //             //     if (name.indexOf(text) !== -1) {
    //             //         // elem => remove .hide
    //             //     } else {
    //             //         // elem => add .hide
    //             //     }
    //             //     const shortDescription = el.shortDescription.toLowerCase()
    //             //     if (shortDescription.indexOf(text) !== -1) {
    //             //         // elem => remove .hide
    //             //     } else {
    //             //         // elem => add .hide
    //             //     }
    //             // }
    //             // /// Option 2
    //             // {
    //             //     const name = el.name.toLowerCase()
    //             //     const shortDescription = el.shortDescription.toLowerCase()
    //             //     if (name.indexOf(text) !== -1 || shortDescription.indexOf(text) !== -1) {
    //             //         // elem => remove .hide
    //             //     } else {
    //             //         // elem => add .hide
    //             //     }
    //             // }

    //             // Option 3
    //             const id = el.id
    //             const item = document.querySelector(`.item[item-id="${id}"]`)
    //             if (!item) {
    //                 return;
    //             }
    //             const name = el.name.toLowerCase()
    //             if (name.indexOf(text) !== -1) {
    //                 // elem => remove .hide
    //                 item.classList.remove('hide')
    //                 return;
    //             }

    //             const shortDescription = el.shortDescription.toLowerCase()
    //             if (shortDescription.indexOf(text) !== -1) {
    //                 // elem => remove .hide
    //                 item.classList.remove('hide')
    //                 return;
    //             }
    //             // elem => add .hide
    //             item.classList.add('hide')
    //         })
    //     }
    // )
    // // price-max
    // document.querySelector('#price-min').addEventListener(
    //     'keyup',
    //     (event) => {
    //         // const priceMin = +event.target.value
    //         const priceMin = parseInt(event.target.value)

    //         // is not a number
    //         if (isNaN(priceMin)) {
    //             return;
    //         }

    //         data.forEach(el => {
    //             const id = el.id
    //             const item = document.querySelector(`.item[item-id="${id}"]`)
    //             if (!item) {
    //                 return;
    //             }

    //             // const price = el.price
    //             const { price } = el

    //             if (price >= priceMin) {
    //                 // elem => remove .hide
    //                 item.classList.remove('hide')
    //                 return;
    //             }

    //             // elem => add .hide
    //             item.classList.add('hide')
    //         })
    //     }
    // )

    document.querySelector('.loader')
        .classList.add('hide')
})