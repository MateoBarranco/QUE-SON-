/*=============== INTERACTIVE BEFORE/AFTER SLIDER ===============*/
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.comparison-slider');
    const divider = document.querySelector('.comparison-slider__divider');
    const rightImage = document.querySelector('.comparison-slider__figure--right');

    let isDragging = false;

    const startDrag = (e) => {
        isDragging = true;
        slider.classList.add('dragging');
    };

    const stopDrag = () => {
        isDragging = false;
        slider.classList.remove('dragging');
    };

    const onDrag = (e) => {
        if (!isDragging) return;

        const rect = slider.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        if (e.touches) {
            offsetX = e.touches[0].clientX - rect.left;
        }

        let percentage = (offsetX / rect.width) * 100;

        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        divider.style.left = `${percentage}%`;
        rightImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
    };

    divider.addEventListener('mousedown', startDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('mousemove', onDrag);

    divider.addEventListener('touchstart', startDrag, { passive: true });
    document.addEventListener('touchend', stopDrag);
    document.addEventListener('touchmove', onDrag, { passive: true });

});


/*=============== ABOUT US BIO TOGGLE ===============*/
function toggleBio(memberId) {
    const bio = document.getElementById(memberId + '-bio');
    bio.classList.toggle('active');
}


/*=============== PORTFOLIO MIXITUP FILTER ===============*/
let mixerPortfolio = mixitup('.portfolio__container', {
    selectors: {
        target: '.portfolio__content'
    },
    animation: {
        duration: 300
    }
});

/* Link active portfolio */
const linkPortfolio = document.querySelectorAll('.portfolio__filter-item')

function activePortfolio(){
    if(linkPortfolio){
        linkPortfolio.forEach(l => l.classList.remove('active-filter'))
        this.classList.add('active-filter')
    }
}
linkPortfolio.forEach(l => l.addEventListener('click', activePortfolio))


/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        let sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)


/*=============== BUDGET CALCULATOR LOGIC ===============*/
const steps = Array.from(document.querySelectorAll('.form__step'));
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const form = document.getElementById('budget-form');
const resultDiv = document.getElementById('result');

let currentStep = 0;

const baseCost = {
    argentina: 600, // Costo base por m² en USD (actualizar desde Strapi)
    italy: 1500,    // Costo base por m² en EUR (actualizar desde Strapi)
};

const updateButtons = () => {
    prevBtn.style.display = currentStep > 0 ? 'inline-block' : 'none';
    if (currentStep === steps.length - 1) {
        nextBtn.textContent = 'Calcular';
    } else {
        nextBtn.textContent = 'Siguiente';
    }
};

const showStep = (stepIndex) => {
    steps.forEach((step, index) => {
        step.classList.toggle('active', index === stepIndex);
    });
};

nextBtn.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
        updateButtons();
    } else {
        // Calculate budget
        calculateBudget();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
        updateButtons();
    }
});

function calculateBudget() {
    const country = document.getElementById('country').value;
    const propertyType = parseFloat(document.getElementById('property-type').value);
    const finishes = parseFloat(document.querySelector('input[name="finishes"]:checked').value);
    const area = parseFloat(document.getElementById('area').value);

    if (country === 'other') {
        alert('Para otros países, por favor contáctanos directamente para un presupuesto personalizado.');
        return;
    }
    
    if (isNaN(area) || area <= 0) {
        alert('Por favor, ingresa una superficie válida.');
        return;
    }

    const costPerSqm = baseCost[country];
    const estimatedCost = area * costPerSqm * propertyType * finishes;
    
    const currency = country === 'argentina' ? 'USD' : 'EUR';
    
    document.getElementById('estimated-cost').textContent = `~ ${estimatedCost.toLocaleString('es-AR', { style: 'currency', currency: currency, minimumFractionDigits: 0 })}`;
    
    resultDiv.style.display = 'block';
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userEmail = document.getElementById('user-email').value;
    alert(`El presupuesto detallado ha sido enviado a ${userEmail}. ¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.`);
    // Aquí iría la lógica para enviar el email a través de tu backend (Strapi)
});

// Initialize form
showStep(currentStep);
updateButtons();