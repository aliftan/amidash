'use strict'; 

document.addEventListener('DOMContentLoaded', function() {

    // Functions

    function getAll(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
    }

    // Toggles

    var $burgers = getAll('.burger');

    if ($burgers.length > 0) {
        $burgers.forEach(function($el) {
            $el.addEventListener('click', function() {
                var target = $el.dataset.target;
                var $target = document.getElementById(target);
                $el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }

    // Modals

    var rootEl = document.documentElement;
    var $modals = getAll('.modal');
    var $modalButtons = getAll('.modal-button');
    var $modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');

    if ($modalButtons.length > 0) {
        $modalButtons.forEach(function($el) {
            $el.addEventListener('click', function() {
                var target = $el.dataset.target;
                var $target = document.getElementById(target);
                rootEl.classList.add('is-clipped');
                $target.classList.add('is-active');
            });
        });
    }

    if ($modalCloses.length > 0) {
        $modalCloses.forEach(function($el) {
            $el.addEventListener('click', function() {
                closeModals();
            });
        });
    }

    document.addEventListener('keydown', function(event) {
        var e = event || window.event;
        if (e.keyCode === 27) {
            closeModals();
            closeDropdowns();
        }
    });

    function closeModals() {
        rootEl.classList.remove('is-clipped');
        $modals.forEach(function($el) {
            $el.classList.remove('is-active');
        });
    }


    // Carousel

    class Carousel {
        constructor(element) {
            this.element = element;

            this.init();
        }

        init() {
            this.carouselContent = this.element.querySelector('.carousel-content');
            this.items = this.carouselContent.querySelectorAll('.carousel-item');

            this.element.querySelector('.carousel-nav-left').addEventListener('click', (e) => {
                this.prevSlide();
            }, false);
            this.element.querySelector('.carousel-nav-right').addEventListener('click', (e) => {
                this.nextSlide();
            }, false);

            this.setOrder();
        }

        setOrder(direction) {
            // initialize direction to change order
            if (direction === 'previous') {
                direction = 1;
            } else if (direction === 'next') {
                direction = -1;
            }

            let nbItems = this.items.length;
            if (nbItems) {
                this.items.forEach((item, index) => {
                    let newValue;
                    if (item.style.order) {
                        newValue = (parseInt(item.style.order, 10) + direction) % nbItems;
                    } else {
                        newValue = ((index + 2) % nbItems);
                    }
                    if (!newValue || newValue !== 2) {
                        item.style['z-index'] = '0';
                        item.classList.remove('is-active');
                    } else {
                        item.style['z-index'] = '1';
                        item.classList.add('is-active');
                    }
                    item.style.order = newValue ? newValue : nbItems;
                });
            }
        }

        prevSlide(evt) {
            // add reverse
            this.carouselContent.classList.add('carousel-reverse');
            // Disable transition to instant change order
            this.carouselContent.classList.toggle('carousel-animate');
            // Change order of element
            // Current order 2 visible become order 1
            this.setOrder('previous');

            // Enable transition to animate order 1 to order 2
            setTimeout(() => {
                this.carouselContent.classList.toggle('carousel-animate');
            }, 50);
        }

        nextSlide(evt) {
            // remove reverse
            this.carouselContent.classList.remove('carousel-reverse');

            // Disable transition to instant change order
            this.carouselContent.classList.toggle('carousel-animate');
            // Change order of element
            // Current order 2 visible become order 3
            this.setOrder('next');
            // Enable transition to animate order 3 to order 2
            setTimeout(() => {
                this.carouselContent.classList.toggle('carousel-animate');
            }, 50);
        };
    }

    window.onload = function() {
        let carousels = document.querySelectorAll('.carousel, .hero-carousel');
        if (carousels) {
            carousels.forEach(element => {
                new Carousel(element);
            })
        }
    };

});