let slideIndex = 0
const slides = document.querySelectorAll(".slide")
slides.forEach(element => {
    element.style.display = 'none' 
    element.classList.add('animate__animated')
    element.classList.add('animate__fadeIn')
    element.classList.add('animate__slow')
    });
slides.item(slideIndex).style.display = 'block'
const cantSlides = slides.length


function loopSlide(){
    console.log("loop")
    slides.item(slideIndex).style.display = 'none'
    slideIndex = (slideIndex + 1) % cantSlides
    slides.item(slideIndex).style.display = 'block'
}

setInterval(loopSlide, 10000)