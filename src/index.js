import style from './sass/style.sass'
import {TweenLite, TimelineMax} from 'gsap'

let iteration = 0

document.querySelectorAll('.menuItem').forEach( (element, index, array) => {
    element.style.transform = `translateY(${iteration}em)`
    iteration += 2
})

enableWheel()
function wheel(e) {
    if(e.deltaY<0) {
        document.querySelectorAll('.menuItem').forEach( (element, index, array) => {           
            let style = window.getComputedStyle(element)
            let matrix = new WebKitCSSMatrix(style.webkitTransform)
            switch(matrix.m42) {
                case 0:
                    matrix.m42 = 144
                    break
                case 24:
                    matrix.m42 = 0
                    break
                case 48:
                    matrix.m42 = 24
                    break
                case 72:
                    matrix.m42 = 48
                    break
                case 96:
                    matrix.m42 = 72
                    break
                case 120:
                    matrix.m42 = 96
                    break
                case 144:
                    matrix.m42 = 120
                    break
            }
            if (matrix.m42%24 == 0) {
                if(matrix.m42==144) {
                    disableWheel()
                    TweenLite.fromTo(element, 0.5, {opacity: 0}, {opacity: 1, onComplete: enableWheel()})                    
                } else {
                    disableWheel()
                    TweenLite.to(element, 0.5, {y: matrix.m42, onComplete: enableWheel()})
                }        
            }
        })
    } else {
        document.querySelectorAll('.menuItem').forEach( (element, index, array) => {             
            let style = window.getComputedStyle(element)
            let matrix = new WebKitCSSMatrix(style.webkitTransform)
            switch(matrix.m42) {
                case 0:
                    matrix.m42 = 24
                    break
                case 24:
                    matrix.m42 = 48
                    break
                case 48:
                    matrix.m42 = 72
                    break
                case 72:
                    matrix.m42 = 96
                    break
                case 96:
                    matrix.m42 = 120
                    break
                case 120:
                    matrix.m42 = 144
                    break
                case 144:
                    matrix.m42 = 0
                    break
            }
            if (matrix.m42%24 == 0) {
                if (matrix.m42==0) {
                    disableWheel()
                    TweenLite.to(element, 0.5, {y: matrix.m42, onComplete: enableWheel()})
                } else {
                    disableWheel()
                    TweenLite.fromTo(element, 0.5, {opacity: 0}, {opacity: 1, onComplete: enableWheel()})
                }        
            }
        })
    }
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

