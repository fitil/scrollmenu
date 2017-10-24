import style from './sass/style.sass'
import {TimelineMax, TweenMax} from 'gsap'
import cover from 'canvas-image-cover'
import node from './js/node.json'
//import ScrollMagic from 'scrollmagic'
//import 'animation.gsap'
//import 'debug.addIndicators'

let iteration = 2
// Canvas init
let canvas = document.getElementById('bg'),
ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let curentImage = new Image
let prevImage = new Image
let tl = new TimelineMax()

TweenMax.fromTo(`.headerItem.item${node.active}`, 1, {y: 200}, {y: 0, opacity: 1})
TweenMax.set(`.menuItem.item${node.active}`, {opacity: 0, y: 168})
TweenMax.fromTo('.content', 1, {opacity: 0, y: 200}, {opacity: 1, y: 0})

let content = document.createTextNode(node.item[node.active].body)
document.getElementById('content').appendChild(content)

document.querySelectorAll('.menuItem').forEach( (element, index, array) => {
    if(index!=0) {
        element.style.transform = `translateY(${iteration}em)`
        iteration += 2    
    }
})

enableWheel()

function wheel(e) {
    node.prevActive = node.active
    if(e.deltaY<0) {
        console.log('wheel scrolled up')
        if (node.active === 0) {
            node.active = node.item.length-1    
        } else {
            node.active -= 1
        }
        document.getElementById('content').removeChild(content)
        content = document.createTextNode(node.item[node.active].body)
        document.getElementById('content').appendChild(content)
        animateImageUp()
        changePageUp()
        disableWheel()
        scrollItemDown().then(res=>enableWheel())
    } else {
        console.log('wheel scrolled down')
        if (node.active === node.item.length-1) {
            node.active = 0    
        } else {
            node.active += 1
        }
        document.getElementById('content').removeChild(content)
        content = document.createTextNode(node.item[node.active].body)
        document.getElementById('content').appendChild(content)
        animateImageUp()
        changePageDown()
        disableWheel()
        scrollItemUp().then(res=>enableWheel())
    }
    console.log(node.active)
}

function changePageDown() {
    TweenMax.fromTo(`.headerItem.item${node.active}`, 1, {y: 200}, {y: 0, opacity: 1})
    TweenMax.to(`.headerItem.item${node.prevActive}`, 1, {y: -50, opacity: 0})
    TweenMax.set('.container', {className: `+=${node.item[node.active].title}`})
    TweenMax.set('.container', {className: `-=${node.item[node.prevActive].title}`})
    TweenMax.fromTo('.content', 1, {opacity: 0, y: 200}, {opacity: 1, y: 0})
}
function changePageUp() {
    TweenMax.fromTo(`.headerItem.item${node.active}`, 1, {y: -200}, {y: 0, opacity: 1})
    TweenMax.to(`.headerItem.item${node.prevActive}`, 1, {y: 50, opacity: 0})
    TweenMax.set('.container', {className: `+=${node.item[node.active].title}`})
    TweenMax.set('.container', {className: `-=${node.item[node.prevActive].title}`})
    TweenMax.fromTo('.content', 1, {opacity: 0, y: 200}, {opacity: 1, y: 0})
}

function changePosUp(pos, element, resolve) {
    let matrix ={
        '24': is0,
        'default': is24
    }
    let tl1 = new TimelineMax()
    function is0() {
        tl1.to(element, 0.5, {y: -50, opacity: 0, ease: Power3.easeOut})
            .set(element, {opacity: 0, y: 168, onComplete: ()=>resolve()})
    }
    function is24() {
        tl1.to(element, 0.5, {opacity: 1, y: pos-24})
    }
    return (matrix[pos] || matrix['default'])()    
}

function changePosDown(pos, element, resolve) {
    let matrix ={
        '144': isInvis,
        '168': isVisible,
        'default': isMiddle
    }
    let tl2 = new TimelineMax()
    function isInvis() {
        tl2.to(element, 0.5, {opacity: 0, y: 168, onComplete: ()=>resolve()})
    }
    function isVisible() {
        tl2.fromTo(element, 0.5, {opacity: 0, y: -50}, {opacity: 1, y: 24})
    }
    function isMiddle() {
        tl2.to(element, 0.5, {opacity: 1, y: pos+24})
    }
    return (matrix[pos] || matrix['default'])()    
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

window.addEventListener('resize', resize)
function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    animateImageUp()
}

function animateImageUp() {
    curentImage.src = node.item[node.active].img
    curentImage.globalAlpha = 0
    curentImage.DX = canvas.height
    prevImage.src = node.item[node.prevActive].img
    prevImage.globalAlpha = 1
    TweenMax.ticker.addEventListener('tick', ()=>{
        render(curentImage.DX)
    })
    let tl = new TimelineMax()
    tl.to(curentImage, 1, { globalAlpha:1, DX: 0})
        .to(prevImage, 1, { globalAlpha:0}, "-=1")
}

function render(curentDX) {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.globalAlpha = prevImage.globalAlpha
    cover(prevImage, 0, 0, canvas.width, canvas.height).render(ctx)
    ctx.globalAlpha = curentImage.globalAlpha
    cover(curentImage, 0, curentDX, canvas.width, canvas.height).render(ctx)
    
}

animateImageUp()
