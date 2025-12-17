/* ============================================
   CV BUILDER MODULE
   Interactive Resume Creator
   ============================================ */

window.CVBuilder = (function () {

    const state = {
        primaryColor: '#333333',
        fontFamily: "'Inter', sans-serif"
    };

    function init() {
        console.log('📄 CV Builder Initialized');

        // Render Initial View if not present
        if (!document.getElementById('cv-builder-view')) {
            renderCVBuilderView();
        }

        setupEventListeners();
        setupDragAndDrop();
    }

    function renderCVBuilderView() {
        // This container will be injected into .content-wrapper
        const container = document.createElement('section');
        container.id = 'cv-builder-view';
        container.className = 'view-section';
        container.innerHTML = `
            <div class="page-header" style="margin-bottom:1rem;">
                <div class="page-title">Interactive CV Builder</div>
                <div class="header-actions">
                    <button class="btn btn-secondary" onclick="CVBuilder.resetCV()">Reset</button>
                    <button class="btn btn-primary" onclick="window.print()">🖨️ Download PDF</button>
                </div>
            </div>

            <div class="cv-builder-container">
                <!-- CONTROLS -->
                <aside class="cv-controls">
                    <div class="control-group">
                        <h3>🎨 Design</h3>
                        <label>Accent Color</label>
                        <div class="color-picker-wrapper">
                            <div class="color-swatch active" style="background:#333;" onclick="CVBuilder.setColor('#333', this)"></div>
                            <div class="color-swatch" style="background:#6366f1;" onclick="CVBuilder.setColor('#6366f1', this)"></div>
                            <div class="color-swatch" style="background:#10b981;" onclick="CVBuilder.setColor('#10b981', this)"></div>
                            <div class="color-swatch" style="background:#ef4444;" onclick="CVBuilder.setColor('#ef4444', this)"></div>
                            <div class="color-swatch" style="background:#0ea5e9;" onclick="CVBuilder.setColor('#0ea5e9', this)"></div>
                        </div>
                        <div style="height:10px;"></div>
                        <label>Font</label>
                        <select class="input-field font-selector" onchange="CVBuilder.setFont(this.value)">
                            <option value="'Inter', sans-serif">Modern (Inter)</option>
                            <option value="'Times New Roman', serif">Classic (Serif)</option>
                            <option value="'Courier New', monospace">Technical (Mono)</option>
                        </select>
                    </div>

                    <div class="control-group">
                        <h3>↕️ Sections (Drag to Reorder)</h3>
                        <div class="draggable-sections" id="draggable-sections">
                            <div class="draggable-item" draggable="true" data-section="summary">
                                <span>📝 Summary</span> <span class="drag-handle">☰</span>
                            </div>
                            <div class="draggable-item" draggable="true" data-section="experience">
                                <span>💼 Experience</span> <span class="drag-handle">☰</span>
                            </div>
                            <div class="draggable-item" draggable="true" data-section="education">
                                <span>🎓 Education</span> <span class="drag-handle">☰</span>
                            </div>
                            <div class="draggable-item" draggable="true" data-section="skills">
                                <span>🛠️ Skills</span> <span class="drag-handle">☰</span>
                            </div>
                        </div>
                    </div>

                    <div class="control-group">
                        <h3>💡 Tips</h3>
                        <ul style="font-size:0.85rem; color:var(--text-secondary); padding-left:1rem;">
                            <li>Click any text in the preview to edit.</li>
                            <li>Click the photo circle to upload an image.</li>
                            <li>Use "Download PDF" to save.</li>
                        </ul>
                    </div>
                </aside>

                <!-- PREVIEW -->
                <main class="cv-preview-area">
                    <div class="cv-page" id="cv-page">
                        <!-- HEADER -->
                        <div class="cv-header">
                            <div class="cv-photo-container" onclick="document.getElementById('cv-photo-input').click()">
                                <div class="cv-photo-placeholder" id="cv-photo-placeholder">Click to<br>Upload</div>
                                <img id="cv-photo-img" src="" style="display:none;" alt="Profile">
                                <input type="file" id="cv-photo-input" accept="image/*" style="display:none" onchange="CVBuilder.handleImageUpload(this)">
                            </div>
                            <div class="cv-header-info">
                                <h1 class="cv-name" contenteditable="true">Achraf Dev</h1>
                                <p class="cv-job-title" contenteditable="true">Full Stack Web Developer</p>
                                <div class="cv-contact-info">
                                    <span contenteditable="true">📧 email@example.com</span>
                                    <span contenteditable="true">📱 +123 456 7890</span>
                                    <span contenteditable="true">📍 City, Country</span>
                                </div>
                            </div>
                        </div>

                        <!-- CONTENT SECTIONS CONTAINER -->
                        <div id="cv-sections-container">
                            <!-- SUMMARY -->
                            <div class="cv-section" id="sec-summary">
                                <div class="cv-section-title">Professional Summary</div>
                                <p class="cv-item-desc" contenteditable="true">
                                    Experienced developer with a passion for building scalable web applications. 
                                    Proven track record of delivering high-quality code and optimizing performance.
                                    Adept at collaborating with cross-functional teams to drive project success.
                                </p>
                            </div>

                            <!-- EXPERIENCE -->
                            <div class="cv-section" id="sec-experience">
                                <div class="cv-section-title">
                                    <span>Experience</span>
                                    <button class="cv-btn-add" onclick="CVBuilder.addItem('experience')" title="Add Item">+</button>
                                </div>
                                <div class="cv-items-list" id="list-experience">
                                    <div class="cv-item">
                                        <div class="cv-item-title" contenteditable="true">Senior Developer</div>
                                        <div class="cv-item-subtitle" contenteditable="true">Tech Solutions Inc.</div>
                                        <div class="cv-item-date" contenteditable="true">2020 - Present</div>
                                        <div class="cv-item-desc" contenteditable="true">
                                            • Led a team of 5 developers used React and Node.js.<br>
                                            • Improved site performance by 40%.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- EDUCATION -->
                            <div class="cv-section" id="sec-education">
                                <div class="cv-section-title">
                                    <span>Education</span>
                                    <button class="cv-btn-add" onclick="CVBuilder.addItem('education')" title="Add Item">+</button>
                                </div>
                                <div class="cv-items-list" id="list-education">
                                    <div class="cv-item">
                                        <div class="cv-item-title" contenteditable="true">BSc Computer Science</div>
                                        <div class="cv-item-subtitle" contenteditable="true">University of Technology</div>
                                        <div class="cv-item-date" contenteditable="true">2016 - 2020</div>
                                    </div>
                                </div>
                            </div>

                            <!-- SKILLS -->
                            <div class="cv-section" id="sec-skills">
                                <div class="cv-section-title">Skills</div>
                                <p class="cv-item-desc" contenteditable="true">
                                    <strong>Languages:</strong> JavaScript, Python, PHP, Java<br>
                                    <strong>Frameworks:</strong> React, Vue, Laravel, Django<br>
                                    <strong>Tools:</strong> Git, Docker, AWS, Figma
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;

        // Append to content wrapper
        document.querySelector('.content-wrapper').appendChild(container);
    }

    function setColor(color, el) {
        state.primaryColor = color;
        document.documentElement.style.setProperty('--cv-color', color);

        // Update active swatch
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        if (el) el.classList.add('active');
    }

    function setFont(font) {
        state.fontFamily = font;
        document.getElementById('cv-page').style.fontFamily = font;
    }

    function handleImageUpload(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.getElementById('cv-photo-img');
                const placeholder = document.getElementById('cv-photo-placeholder');
                img.src = e.target.result;
                img.style.display = 'block';
                placeholder.style.display = 'none';
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    function addItem(type) {
        const list = document.getElementById(`list-${type}`);
        const item = document.createElement('div');
        item.className = 'cv-item';

        if (type === 'experience') {
            item.innerHTML = `
                <div class="cv-item-title" contenteditable="true">Job Title</div>
                <div class="cv-item-subtitle" contenteditable="true">Company Name</div>
                <div class="cv-item-date" contenteditable="true">Year - Year</div>
                <div class="cv-item-desc" contenteditable="true">• Accomplishment...</div>
                <div class="cv-item-controls">
                    <button class="cv-btn-remove" onclick="this.parentElement.parentElement.remove()">-</button>
                </div>
            `;
        } else if (type === 'education') {
            item.innerHTML = `
                <div class="cv-item-title" contenteditable="true">Degree / Certificate</div>
                <div class="cv-item-subtitle" contenteditable="true">Institution</div>
                <div class="cv-item-date" contenteditable="true">Year</div>
                <div class="cv-item-controls">
                    <button class="cv-btn-remove" onclick="this.parentElement.parentElement.remove()">-</button>
                </div>
            `;
        }

        list.appendChild(item);
    }

    function setupDragAndDrop() {
        const draggables = document.querySelectorAll('.draggable-item');
        const sectionsContainer = document.getElementById('cv-sections-container');

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging');
            });

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
                reorderCVSections();
            });
        });

        // Add dragover to sections container (optional logic for swapping)
        // For simplicity, we assume the list order in controls dictates the CV order
        const controlsContainer = document.getElementById('draggable-sections');
        controlsContainer.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(controlsContainer, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                controlsContainer.appendChild(draggable);
            } else {
                controlsContainer.insertBefore(draggable, afterElement);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function reorderCVSections() {
        const order = [];
        document.querySelectorAll('.draggable-item').forEach(item => {
            order.push(item.dataset.section);
        });

        const container = document.getElementById('cv-sections-container');
        const sections = {
            'summary': document.getElementById('sec-summary'),
            'experience': document.getElementById('sec-experience'),
            'education': document.getElementById('sec-education'),
            'skills': document.getElementById('sec-skills')
        };

        // Clear and Re-append in order
        order.forEach(id => {
            if (sections[id]) {
                container.appendChild(sections[id]);
            }
        });
    }

    function resetCV() {
        if (confirm('Are you sure you want to reset your CV? All changes will be lost.')) {
            // Simple reload for now, or re-render
            document.getElementById('cv-builder-view').innerHTML = ''; // clear
            renderCVBuilderView(); // re-render
            setupDragAndDrop(); // re-init events
        }
    }

    // Auto-fill from User Profile (if available) since the user asked for it
    function autoFillFromProfile() {
        // Placeholder for user data logic
        // if(window.Store && window.Store.user) { ... }
    }

    function setupEventListeners() {
        // Any other global listeners
    }

    return {
        init,
        setColor,
        setFont,
        handleImageUpload,
        addItem,
        resetCV
    };

})();

// Initialize when valid
document.addEventListener('DOMContentLoaded', () => {
    // We defer initialization until the view is actually needed or requested
});
