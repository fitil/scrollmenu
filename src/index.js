import style from './sass/style.sass'
import {TimelineMax} from 'gsap'
import cover from 'ccimage'

let iteration = 0

document.querySelectorAll('.menuItem').forEach( (element, index, array) => {
    element.style.transform = `translateY(${iteration}em)`
    iteration += 2
})

enableWheel()
function wheel(e) {
    disableWheel();
    if(e.deltaY<0) {
        scrollItemDown().then(res=>enableWheel())
    } else {
        scrollItemUp().then(res=>enableWheel())
    }
}

function changePosUp(pos, element, resolve) {
    let matrix ={
        '0': is0,
        '24': is24
        //'192': is192
    }
    let tl = new TimelineMax()
    
    // function is192() {
    //     tl.to(element, 0.5, {y: 120, opacity: 1, ease: Power3.easeOut})
    // }

    function is0() {
        tl.to(element, 0.5, {y: -48, opacity: 0, ease: Power3.easeOut})
            .set(element, {opacity: 0, y: 144, onComplete: ()=>resolve()})
    }
    function is24() {
        tl.to(element, 0.5, {opacity: 1, y: pos-24})
    }

    return (matrix[pos] || matrix[24])()    
}

function changePosDown(pos, element, resolve) {
    let matrix ={
        '144': isInvis,
        //'-48': isUvisible,
        '24': isMiddle
    }
    let tl = new TimelineMax()
    function isInvis() {
        tl.to(element, 0.5, {opacity: 0, y: 192})
            .set(element, {opacity: 0, y: 0, onComplete: ()=>resolve()})
    }
    // function isUvisible() {
    //     tl.to(element, 0.5, {opacity: 1, y: 24, ease: Power3.easeOut})
    // }
    function isMiddle() {
        tl.to(element, 0.5, {opacity: 1, y: pos+24})
    }

    return (matrix[pos] || matrix[24])()    
}

function scrollItemUp(){
    return new Promise((resolve, reject) => {
        document.querySelectorAll('.menuItem').forEach( (element, index, array) => {
            let style = window.getComputedStyle(element)
            let matrix = new WebKitCSSMatrix(style.webkitTransform)
            changePosUp(matrix.m42, element, resolve)
        })
    })
}

function scrollItemDown() {
    return new Promise((resolve, reject) => {
        document.querySelectorAll('.menuItem').forEach( (element, index, array) => {
            let style = window.getComputedStyle(element)
            let matrix = new WebKitCSSMatrix(style.webkitTransform)
            changePosDown(matrix.m42, element, resolve)
        })
    })
}

function disableWheel() {
    document.removeEventListener('mousewheel', wheel);
    document.removeEventListener('DOMMouseScroll', wheel);
}

function enableWheel() {
    document.addEventListener('mousewheel', wheel);
    document.addEventListener('DOMMouseScroll', wheel);
}

let canvas = document.getElementById('bg'),
    ctx = canvas.getContext("2d")

window.addEventListener('resize', resize)
function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    cover(image, 0, 0, window.innerWidth, window.innerHeight).render(ctx)
    console.log('resized')
}

let image = new Image;
image.src = '../img/header-image.jpg'

function render() {
    cover(image, 0, 0, canvas.width, canvas.height).render(ctx)
}

draw()
function draw() {
    render()
    window.requestAnimationFrame(draw)
}