/*
* DILLU SHAKEEB PORTFOLIO
* Designer / Architect Portfolio Website
*/

$(document).ready(function() {
    // Initialize custom cursor
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    const cursorFollower = document.createElement('div');
    cursorFollower.classList.add('cursor-follower');
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
    });
    
    // Custom cursor interactions
    $('a, button, .project-card, .filter-button, .social-icon-container a').on('mouseenter', function() {
        cursor.classList.add('cursor-active');
        cursorFollower.classList.add('cursor-active');
    }).on('mouseleave', function() {
        cursor.classList.remove('cursor-active');
        cursorFollower.classList.remove('cursor-active');
    });
    
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Mobile navigation toggle
    $('.mobile-nav-toggle').on('click', function() {
        $('.side-nav').toggleClass('active');
        $(this).find('i').toggleClass('fa-bars fa-times');
    });
    
    // Close mobile menu when clicking on a nav link
    $('.side-nav .nav-link').on('click', function() {
        if (window.innerWidth < 992) {
            $('.side-nav').removeClass('active');
            $('.mobile-nav-toggle i').removeClass('fa-times').addClass('fa-bars');
        }
    });
    
    // Smooth scrolling for navigation links with offset for side nav
    $('.side-nav .nav-link').on('click', function(e) {
        if (this.hash !== '') {
            e.preventDefault();
            
            const hash = this.hash;
            
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, 'easeInOutExpo');
            
            // Add active class to clicked link
            $('.nav-link').removeClass('active');
            $(this).addClass('active');
        }
    });
    
    // Update active navigation link on scroll
    $(window).on('scroll', function() {
        let position = $(this).scrollTop();
        
        $('section').each(function() {
            let target = $(this).offset().top;
            let id = $(this).attr('id');
            
            if (position >= target - 200) {
                $('.nav-link').removeClass('active');
                $(`.nav-link[href="#${id}"]`).addClass('active');
            }
        });
    });
    
    // Initialize project filtering with Isotope
    let $grid = $('#project-grid').isotope({
        itemSelector: '.project-item',
        layoutMode: 'fitRows',
        transitionDuration: '0.8s',
        stagger: 100,
        originLeft: true
    });
    
    // Filter items on button click
    $('.filter-button-group').on('click', '.filter-button', function() {
        let filterValue = $(this).attr('data-filter');
        $grid.isotope({ 
            filter: filterValue,
            // Add animation when filtering
            hiddenStyle: {
                opacity: 0,
                transform: 'scale(0.8)'
            },
            visibleStyle: {
                opacity: 1,
                transform: 'scale(1)'
            }
        });
        
        // Change active class
        $('.filter-button-group .filter-button').removeClass('active');
        $(this).addClass('active');
    });
    
    // Layout Isotope after images have loaded
    $grid.imagesLoaded().progress(function() {
        $grid.isotope('layout');
    });
    
    // Contact form handling with animations
    $('#contact-form').submit(function(e) {
        // Don't prevent default - we want the form to submit to Formspree
        
        // Form validation
        let valid = true;
        $(this).find('input, textarea').each(function() {
            if ($(this).val().trim() === '') {
                valid = false;
                $(this).addClass('is-invalid');
                e.preventDefault(); // Only prevent if validation fails
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        
        if (!valid) {
            return false;
        }
        
        // Show sending animation
        const submitButton = $(this).find('button[type="submit"]');
        submitButton.html('<i class="fas fa-circle-notch fa-spin"></i> Sending...');
        submitButton.prop('disabled', true);
        
        // The form will be handled by Formspree
        // We don't need to handle success/error manually
    });
    
    // Initialize WebGL background for hero section
    function initHeroBackground() {
        if (!$('.hero-background').length) return;
    
        // Simple canvas gradient animation as placeholder for WebGL
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        $('.hero-background').append(canvas);
        
        const ctx = canvas.getContext('2d');
        let time = 0;
        
        function animate() {
            time += 0.008;
            
            // Create a dark gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#0a0a0a');
            gradient.addColorStop(1, '#121212');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw animated circles
            for (let i = 0; i < 5; i++) {
                const x = canvas.width / 2 + Math.sin(time + i * 0.5) * 100;
                const y = canvas.height / 2 + Math.cos(time + i * 0.3) * 100;
                const radius = 50 + Math.sin(time * 0.4) * 20;
                
                const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                circleGradient.addColorStop(0, 'rgba(0, 191, 165, 0.2)');
                circleGradient.addColorStop(1, 'rgba(0, 77, 64, 0)');
                
                ctx.fillStyle = circleGradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Resize canvas on window resize
        $(window).resize(function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    // Initialize WebGL hero background
    initHeroBackground();
    
    // Parallax effect for project images
    $(window).scroll(function() {
        const scrollTop = $(this).scrollTop();
        
        $('.project-img').each(function() {
            const offset = $(this).offset().top;
            const distance = offset - scrollTop;
            
            if (distance < window.innerHeight && distance > -$(this).height()) {
                $(this).css('background-position', `center ${distance * 0.05}px`);
            }
        });
    });
    
    // Auto-update copyright year
    const currentYear = new Date().getFullYear();
    $('footer p').html(`© ${currentYear} Dillu Shakeeb. All Rights Reserved.`);
});

// Preloader
$(window).on('load', function() {
    $('#preloader').fadeOut('slow', function() {
        $(this).remove();
    });
});