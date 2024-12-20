// JQuery Code

$(document).ready(function () {

    $(window).scroll(function () {
        if ($(this).scrollTop() > 15) {
            $('#logo').attr({ 'src': './images/wlogo.png', });
            $('#nav').css('background-color', '#1C2D46aa');
            $('.nav-link').css('color', '#ffffff');

        }
        else if ($(this).scrollTop() < 15) {
            $('#logo').attr({ 'src': './images/logo.png', });
            $('#nav').css('background-color', '#ffffffcc');
            $('.nav-link').css('color', '#000000');

        }
    })
});

// ovelayEffect

document.addEventListener('DOMContentLoaded', function () {
    const openButtons = document.querySelectorAll('.open-button');

    openButtons.forEach(button => {
        const targetId = button.getAttribute('data-target');
        const innerBox = document.getElementById(targetId);
        const overlayBox = innerBox.querySelector('.overlay-box');

        button.addEventListener('mouseenter', function () {
            overlayBox.style.opacity = '1';
            overlayBox.style.transform = 'perspective(400px) rotateX(0deg)';
        });

        button.addEventListener('mouseleave', function () {
            overlayBox.style.opacity = '0';
            overlayBox.style.transform = 'perspective(400px) rotateX(-90deg)';
        });
    });
});

// Arrow in Button

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll('.toolBtn');

    buttons.forEach(button => {
        const img = document.createElement('img');
        img.setAttribute('src', './images/arrow.svg');
        img.setAttribute('width', '8');
        img.setAttribute('height', '15');
        img.setAttribute('alt', 'Arrow');

        button.appendChild(img);
    });
});

// Tool Access

permission(false);

function permission(granted) {
    const openButtons = document.querySelectorAll('.open-button');

    if (granted) {
        openButtons.forEach(button => {
            button.style.display = 'block';
        });
        loginToggle(true);
    } else {
        openButtons.forEach(button => {
            button.style.display = 'none';
        });
        loginToggle(false);
    }
}

// JS Button Toggle Code

document.getElementById('navSignOut').addEventListener('click', () => {
    loginToggle(false);
});

function loginToggle(login) {
    if (login) {
        document.getElementById("navLogin").style.display = "none";
        document.getElementById("navSignOut").style.display = "inline-block";
    } else {
        document.getElementById("navLogin").style.display = "inline-block";
        document.getElementById("navSignOut").style.display = "none";
    }
}

// Tool Connentions

document.addEventListener("DOMContentLoaded", function () {
    const tools = document.querySelectorAll('.tool');
    const toolButtons = document.querySelectorAll('.toolBtn');
    const toolColumns = document.querySelectorAll('.sidebarBtn');

    // Hide all tool elements initially
    tools.forEach(tool => {
        tool.style.display = 'none';
    });

    // Show corresponding tool when tool button is clicked
    toolButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            // Hide all tools
            tools.forEach(tool => {
                tool.style.display = 'none';
            });
            // Show the corresponding tool
            tools[index].style.display = 'block';
        });
    });

    // Show corresponding tool when column is clicked
    toolColumns.forEach((column, index) => {
        column.addEventListener('click', function () {
            // Hide all tools
            tools.forEach(tool => {
                tool.style.display = 'none';
            });
            // Show the corresponding tool
            tools[index].style.display = 'block';
        });
    });
});


// Get all elements with the class 'clickButton'
const clickButtons = document.querySelectorAll('.highlight');

// Add click event listener to each button
clickButtons.forEach(function (button) {
    button.addEventListener('click', function () {

        const elementId = button.getAttribute('data-key');

        const highlightedElement = document.getElementById(elementId);

        highlightedElement.classList.add('highlighted');

        // Remove the 'highlighted' class after a short delay (e.g., 1 second)
        setTimeout(() => {
            highlightedElement.classList.remove('highlighted');
        }, 1000); // 1000 milliseconds = 1 second
    });
});
