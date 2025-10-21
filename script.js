// PDF Download functionality
document.getElementById('downloadBtn').addEventListener('click', function() {
    const element = document.getElementById('pdfContent');
    
    // Clone the element to modify it for PDF
    const clone = element.cloneNode(true);
    
    // Remove all buttons and no-print elements from the clone
    const noPrintElements = clone.querySelectorAll('.no-print, .button-group');
    noPrintElements.forEach(el => el.remove());
    
    // Get current date for filename
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const filename = `Arbeitsblatt_Schutzhandschuhe_${dateStr}.pdf`;
    
    // Configure PDF options to avoid blank pages
    const opt = {
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false,
            scrollY: 0,
            scrollX: 0,
            backgroundColor: '#ffffff'
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { 
            mode: ['avoid-all', 'css', 'legacy'],
            avoid: '.question-item'
        }
    };
    
    // Generate and download PDF
    html2pdf().set(opt).from(clone).save().then(() => {
        alert('PDF wurde erfolgreich heruntergeladen!');
    }).catch(err => {
        console.error('Fehler beim Erstellen des PDFs:', err);
        alert('Es gab einen Fehler beim Erstellen des PDFs. Bitte versuchen Sie es erneut.');
    });
});

// Form validation
document.getElementById('quizForm').addEventListener('submit', function(e) {
    e.preventDefault();
});

// Handle checkbox mutual exclusivity (only one can be checked per question)
document.querySelectorAll('.checkbox-group').forEach(group => {
    const checkboxes = group.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                checkboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            }
        });
    });
});

// Auto-save to localStorage (optional feature)
const formElements = document.querySelectorAll('input, textarea');
formElements.forEach(element => {
    // Load saved data
    const savedValue = localStorage.getItem(element.name);
    if (savedValue && element.type !== 'checkbox') {
        element.value = savedValue;
    } else if (savedValue && element.type === 'checkbox') {
        element.checked = savedValue === 'true';
    }
    
    // Save on change
    element.addEventListener('change', function() {
        if (this.type === 'checkbox') {
            localStorage.setItem(this.name, this.checked);
        } else {
            localStorage.setItem(this.name, this.value);
        }
    });
    
    element.addEventListener('input', function() {
        if (this.type !== 'checkbox') {
            localStorage.setItem(this.name, this.value);
        }
    });
});

// Clear localStorage on reset
document.querySelector('button[type="reset"]').addEventListener('click', function() {
    if (confirm('Möchten Sie wirklich alle Eingaben zurücksetzen?')) {
        localStorage.clear();
        setTimeout(() => {
            location.reload();
        }, 100);
    }
});
