import style from './sass/style.sass'
import {TweenLite, TimelineMax} from 'gsap'

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
        '0': isInvis,
        '24': isMiddle
    }
    let tl = new TimelineMax()
    
    function isInvis() {
        tl.to(element, 0.5, {y: -48, opacity: 0, ease: Power3.easeOut})
            .set(element, {opacity: 0, y: 144, onComplete: ()=>resolve()})
    }

    function isMiddle() {
        tl.to(element, 0.5, {opacity: 1, y: pos-24})
    }

    return (matrix[pos] || matrix[24])()    
}

function changePosDown(pos, element, resolve) {
    let matrix ={
        '144': isInvis,
        '24': isMiddle
    }
    let tl = new TimelineMax()
    
    function isInvis() {
        tl.to(element, 0.5, {opacity: 0, y: 192})
            .set(element, {y: 0, onComplete: ()=>resolve()})
    }

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
    console.log('removed')
}

function enableWheel() {
    document.addEventListener('mousewheel', wheel);
    document.addEventListener('DOMMouseScroll', wheel);
    console.log('added')
}

