/*
* DILLU SHAKEEB PORTFOLIO
* Designer / Architect Portfolio Website
*/

// Make sure jQuery is properly loaded
jQuery(document).ready(function($) {
    // Initialize custom cursor
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    const cursorFollower = document.createElement('div');
    cursorFollower.classList.add('cursor-follower');
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    
    // Variables to track mouse position
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smoother animation using requestAnimationFrame
    function updateCursor() {
        // Main cursor follows mouse directly
        cursorX = mouseX;
        cursorY = mouseY;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Follower cursor has smoother, delayed movement
        // Using lerp (linear interpolation) for smooth following
        const speed = 0.15; // Adjust for smoother or quicker following
        followerX = followerX + (mouseX - followerX) * speed;
        followerY = followerY + (mouseY - followerY) * speed;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    
    // Start the cursor animation
    updateCursor();
    
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
    
    // Filtering functionality moved to inline script at the end of the HTML file
    // to ensure it runs after all other scripts are loaded
    
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
    
    // Initialize advanced THREE.js background for hero section
    function initHeroBackground() {
        // Check if THREE.js is available
        if (typeof THREE === 'undefined') {
            console.warn('THREE.js is not available. Background animation disabled.');
            return;
        }
        
        // Check for WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            console.warn('WebGL not supported. Background animation disabled.');
            return;
        }
        
        // Check if hero section exists
        if (!$('.hero-section').length) {
            return;
        }
        
        // Create a background container if not already present
        let container = $('.hero-background');
        if (!container.length) {
            container = $('<div class="hero-background"></div>');
            $('.hero-section').prepend(container);
        }
        
        // Variables to store THREE.js objects for cleanup
        let animationFrameId;
        let mouseMoveListener;
        let resizeListener;
        
        try {
            // THREE.js setup
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true,
                powerPreference: 'high-performance'
            });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
            container.append(renderer.domElement);
            
            // Set camera position
            camera.position.z = 30;
            
            // Create particle system - use fewer particles for better performance
            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth < 992 && window.innerWidth >= 768;
            const particlesCount = isMobile ? 150 : (isTablet ? 300 : 600);
            const particleGeometry = new THREE.BufferGeometry();
            const particlesData = [];
            
            const positions = new Float32Array(particlesCount * 3);
            const colors = new Float32Array(particlesCount * 3);
            
            // Define colors based on the website's palette
            const accentColor = new THREE.Color('#FF4D12'); // Orange accent
            const primaryColor = new THREE.Color('#000000'); // Black
            const secondaryColor = new THREE.Color('#ffffff'); // White
            
            // Create particles with varied positions and colors
            for (let i = 0; i < particlesCount; i++) {
                // Position particles in a sphere
                const x = (Math.random() - 0.5) * 50;
                const y = (Math.random() - 0.5) * 50;
                const z = (Math.random() - 0.5) * 30;
                
                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;
                
                // Store initial positions and velocities for animation
                particlesData.push({
                    velocity: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.05,
                        (Math.random() - 0.5) * 0.05,
                        (Math.random() - 0.5) * 0.02
                    ),
                    numConnections: 0,
                    position: new THREE.Vector3(x, y, z)
                });
                
                // Assign colors with slight variation
                const colorChoice = Math.random();
                let color;
                
                if (colorChoice < 0.7) {
                    // 70% white-ish particles
                    color = secondaryColor.clone().lerp(accentColor, Math.random() * 0.2);
                } else if (colorChoice < 0.9) {
                    // 20% accent-ish particles
                    color = accentColor.clone().lerp(secondaryColor, Math.random() * 0.5);
                } else {
                    // 10% dark particles for contrast
                    color = primaryColor.clone().lerp(accentColor, Math.random() * 0.3);
                }
                
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
            }
            
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            // Create point material for particles
            const particleMaterial = new THREE.PointsMaterial({
                size: isMobile ? 0.8 : 0.4,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true
            });
            
            // Create the particle system
            const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particleSystem);
            
            // Add ambient light
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            // Create connections between particles - use fixed buffer size
            const MAX_CONNECTIONS = Math.min(particlesCount * 10, 5000); // Limit max connections
            const lineGeometry = new THREE.BufferGeometry();
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.15,
                blending: THREE.AdditiveBlending
            });
            
            // More memory-efficient array size
            const linePositions = new Float32Array(MAX_CONNECTIONS * 6); // 2 points per line * 3 coords per point
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
            
            const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
            scene.add(lines);
            
            // Mouse interaction
            const mousePosition = new THREE.Vector3(0, 0, 0);
            
            // Add mouse move listener
            mouseMoveListener = (event) => {
                // Normalized mouse position
                mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
                mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
            };
            document.addEventListener('mousemove', mouseMoveListener);
            
            // Animation setup
            let time = 0;
            let frame = 0;
            let lastFrameTime = 0;
            const FPS_LIMIT = 60;
            const FRAME_MIN_TIME = 1000 / FPS_LIMIT;
            
            function animate(timestamp) {
                // Limit FPS
                const deltaTime = timestamp - lastFrameTime;
                if (deltaTime < FRAME_MIN_TIME) {
                    animationFrameId = requestAnimationFrame(animate);
                    return;
                }
                lastFrameTime = timestamp - (deltaTime % FRAME_MIN_TIME);
                
                // Start animation frame
                animationFrameId = requestAnimationFrame(animate);
                time = performance.now() * 0.001;
                frame++;
                
                // Determine which frame to update connections - less frequent updates for better performance
                const updateInterval = isMobile ? 15 : (isTablet ? 10 : 5);
                const shouldUpdateConnections = frame % updateInterval === 0;
                
                // Reset connections
                if (shouldUpdateConnections) {
                    for (let i = 0; i < particlesCount; i++) {
                        particlesData[i].numConnections = 0;
                    }
                }
                
                // Update particle positions
                for (let i = 0; i < particlesCount; i++) {
                    const particleData = particlesData[i];
                    
                    // Apply some natural movement - slower on mobile
                    const movementScale = isMobile ? 0.01 : 0.02;
                    particleData.position.x += Math.sin(time * 0.1 + i * 0.01) * movementScale;
                    particleData.position.y += Math.cos(time * 0.1 + i * 0.01) * movementScale;
                    
                    // Mouse attraction/repulsion - only if mouse has moved
                    if (mousePosition.x !== 0 || mousePosition.y !== 0) {
                        const mouseVector = new THREE.Vector3(
                            mousePosition.x * 30,
                            mousePosition.y * 30,
                            camera.position.z * 0.5 // Add z-coordinate based on camera
                        );
                        
                        const direction = new THREE.Vector3().subVectors(mouseVector, particleData.position);
                        const distance = direction.length();
                        
                        if (distance < 15) { // Increased radius of effect
                            direction.normalize().multiplyScalar(0.02 / Math.max(0.3, distance * 0.1));
                            particleData.velocity.add(direction);
                        }
                    }
                    
                    // Apply velocity with damping
                    particleData.position.add(particleData.velocity);
                    particleData.velocity.multiplyScalar(0.96); // Slightly stronger damping
                    
                    // Contain particles within bounds with soft boundary
                    const limit = 25;
                    if (Math.abs(particleData.position.x) > limit) {
                        particleData.velocity.x = -particleData.velocity.x * 0.5;
                        particleData.position.x = limit * Math.sign(particleData.position.x) * 0.95;
                    }
                    
                    if (Math.abs(particleData.position.y) > limit) {
                        particleData.velocity.y = -particleData.velocity.y * 0.5;
                        particleData.position.y = limit * Math.sign(particleData.position.y) * 0.95;
                    }
                    
                    if (Math.abs(particleData.position.z) > 15) {
                        particleData.velocity.z = -particleData.velocity.z * 0.5;
                        particleData.position.z = 15 * Math.sign(particleData.position.z) * 0.95;
                    }
                    
                    // Update actual particle position in geometry
                    positions[i * 3] = particleData.position.x;
                    positions[i * 3 + 1] = particleData.position.y;
                    positions[i * 3 + 2] = particleData.position.z;
                }
                
                // Update line connections - optimized version
                if (shouldUpdateConnections) {
                    let vertexIndex = 0;
                    let connectionCount = 0;
                    
                    // Use spatial partitioning for more efficient connection checks
                    // Group particles into cells for faster neighbor finding
                    const cellSize = 5; // Match the connection distance
                    const cells = {};
                    
                    // Place particles into cells
                    for (let i = 0; i < particlesCount; i++) {
                        const p = particlesData[i].position;
                        const cellX = Math.floor(p.x / cellSize);
                        const cellY = Math.floor(p.y / cellSize);
                        const cellZ = Math.floor(p.z / cellSize);
                        const cellKey = `${cellX},${cellY},${cellZ}`;
                        
                        if (!cells[cellKey]) {
                            cells[cellKey] = [];
                        }
                        cells[cellKey].push(i);
                    }
                    
                    // For each cell, check neighboring cells
                    for (const cellKey in cells) {
                        const indices = cells[cellKey];
                        
                        // Neighboring cell keys
                        const [cx, cy, cz] = cellKey.split(',').map(Number);
                        const neighborCells = [];
                        
                        // Add current and adjacent cells
                        for (let nx = cx - 1; nx <= cx + 1; nx++) {
                            for (let ny = cy - 1; ny <= cy + 1; ny++) {
                                for (let nz = cz - 1; nz <= cz + 1; nz++) {
                                    const neighborKey = `${nx},${ny},${nz}`;
                                    if (cells[neighborKey]) {
                                        neighborCells.push(...cells[neighborKey]);
                                    }
                                }
                            }
                        }
                        
                        // Check connections between particles in this cell and neighbor cells
                        for (let i = 0; i < indices.length; i++) {
                            const idx1 = indices[i];
                            const p1 = particlesData[idx1].position;
                            
                            for (let j = 0; j < neighborCells.length; j++) {
                                const idx2 = neighborCells[j];
                                
                                // Skip if it's the same particle or already checked
                                if (idx1 >= idx2) continue;
                                
                                const p2 = particlesData[idx2].position;
                                const distance = p1.distanceTo(p2);
                                
                                // Only connect particles that are close enough
                                if (distance < 5 && connectionCount < MAX_CONNECTIONS) {
                                    // Add line vertices
                                    linePositions[vertexIndex++] = p1.x;
                                    linePositions[vertexIndex++] = p1.y;
                                    linePositions[vertexIndex++] = p1.z;
                                    
                                    linePositions[vertexIndex++] = p2.x;
                                    linePositions[vertexIndex++] = p2.y;
                                    linePositions[vertexIndex++] = p2.z;
                                    
                                    connectionCount++;
                                }
                            }
                        }
                    }
                    
                    // Show only the segments that contain vertices
                    lineGeometry.setDrawRange(0, vertexIndex / 3);
                    lines.geometry.attributes.position.needsUpdate = true;
                }
                
                // Update all positions
                particleSystem.geometry.attributes.position.needsUpdate = true;
                
                // Gentle rotation of the entire system - slower on mobile
                const rotationSpeed = isMobile ? 0.02 : 0.05;
                particleSystem.rotation.y = time * rotationSpeed;
                lines.rotation.y = time * rotationSpeed;
                
                // Render the scene
                renderer.render(scene, camera);
            }
            
            // Start animation
            lastFrameTime = performance.now();
            animate(lastFrameTime);
            
            // Handle window resize
            resizeListener = function() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };
            window.addEventListener('resize', resizeListener);
            
            // Cleanup function for when the component unmounts
            const cleanup = () => {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                
                if (mouseMoveListener) {
                    document.removeEventListener('mousemove', mouseMoveListener);
                }
                
                if (resizeListener) {
                    window.removeEventListener('resize', resizeListener);
                }
                
                // Dispose of THREE.js objects to free memory
                if (particleGeometry) particleGeometry.dispose();
                if (particleMaterial) particleMaterial.dispose();
                if (lineGeometry) lineGeometry.dispose();
                if (lineMaterial) lineMaterial.dispose();
                if (renderer) renderer.dispose();
                
                // Remove canvas from DOM
                container.empty();
            };
            
            // Add cleanup method to window for potential use
            window.cleanupHeroBackground = cleanup;
            
            // Clean up when page is unloaded
            window.addEventListener('beforeunload', cleanup);
            
        } catch (error) {
            console.error('Error initializing THREE.js background:', error);
            // Provide a fallback if the animation fails
            container.html('<div class="hero-background-fallback"></div>');
        }
    }
    
    // Initialize THREE.js hero background - defer to ensure DOM is ready
    setTimeout(initHeroBackground, 100);
    
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