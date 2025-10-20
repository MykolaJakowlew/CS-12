const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dotsContainer = document.querySelector('.dots');
const slider = document.getElementById('slider');

for (let i = 0; i < slides.length; i += 1) {
    const dot = document.createElement('div');
    dot.classList.add('dot')
    dotsContainer.appendChild(dot)
}

const dots = document.querySelectorAll('.dot')

let sliderIndex = 0;
slides[0].classList.add('slide-active')
dots[0].classList.add('dot-active')

const createInteval = (time) => {
    return setInterval(() => {
        nextbtnFunc()
    }, time)
}

let autoChangeInterval = createInteval(5 * 1000 /* 5s */)

const nextSlide = (index) => {
    document.querySelector('.slide-active').classList.remove('slide-active');
    document.querySelector('.dot-active').classList.remove('dot-active');

    slides[index].classList.add('slide-active')
    dots[index].classList.add('dot-active')

    clearInterval(autoChangeInterval)
    autoChangeInterval = createInteval(5 * 1000 /* 5s */)

}
const nextbtnFunc = () => {
    sliderIndex += 1;
    if (sliderIndex === slides.length) {
        sliderIndex = 0;
    }

    nextSlide(sliderIndex)
}

nextBtn.addEventListener('click', nextbtnFunc)
// nextBtn.addEventListener('click', () => nextbtnFunc())
// nextBtn.addEventListener('click', () => { 
//     nextbtnFunc()
// })

prevBtn.addEventListener('click', () => {
    sliderIndex -= 1;
    if (sliderIndex === -1) {
        sliderIndex = slides.length - 1;
    }

    nextSlide(sliderIndex)
})
