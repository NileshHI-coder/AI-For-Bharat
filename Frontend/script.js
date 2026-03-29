class SmartMentorAI {
    constructor() {
        this.currentCareer = null;
        this.chatMessages = [];
        this.init();
    }

    init() {
        this.loadCareers();
        this.bindEvents();
        this.animateElements();
    }

    async loadCareers() {
        try {
            const response = await fetch('http://localhost:5000/api/careers');
            const careers = await response.json();
            this.populateDropdown(careers);
        } catch (error) {
            console.warn('Backend not available, using fallback careers');
            this.loadFallbackCareers();
        }
    }

    loadFallbackCareers() {
        const fallbackCareers = [
            {id: 1, name: "Software Engineer"},
            {id: 2, name: "Data Scientist"},
            {id: 3, name: "AI/ML Engineer"},
            {id: 4, name: "Doctor (MBBS)"},
            {id: 5, name: "Lawyer"},
            {id: 6, name: "Civil Engineer"},
            {id: 7, name: "Chartered Accountant"},
            {id: 8, name: "Digital Marketer"},
            {id: 9, name: "UI/UX Designer"},
            {id: 10, name: "Cybersecurity Analyst"}
        ];
        this.populateDropdown(fallbackCareers);
    }

    populateDropdown(careers) {
        const select = document.getElementById('careerSelect');
        careers.forEach(career => {
            const option = document.createElement('option');
            option.value = career.id;
            option.textContent = career.name;
            select.appendChild(option);
        });
        
        // Add animation to dropdown
        select.addEventListener('change', () => {
            document.getElementById('getGuidanceBtn').style.transform = 'scale(1.02)';
            setTimeout(() => {
                document.getElementById('getGuidanceBtn').style.transform = 'scale(1)';
            }, 150);
        });
    }

    bindEvents() {
        // Career selection
        document.getElementById('getGuidanceBtn').addEventListener('click', () => this.getCareerGuidance());
        document.getElementById('backBtn').addEventListener('click', () => this.showSelection());
        
        // Chat functionality
        document.getElementById('sendBtn').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });

        // Animate button on hover
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
            btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
        });
    }

    animateElements() {
        // Animate cards on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    async getCareerGuidance() {
        const careerId = document.getElementById('careerSelect').value;
        const btn = document.getElementById('getGuidanceBtn');
        
        if (!careerId) {
            this.showNotification('Please select a career first!', 'warning');
            return;
        }

        // Loading state
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        btn.disabled = true;

        try {
            const response = await fetch(`http://localhost:5000/api/career/${careerId}`);
            
            if (!response.ok) {
                throw new Error('Career data not found');
            }
            
            const careerData = await response.json();
            this.currentCareer = careerData;
            this.displayCareerGuidance(careerData);
            this.showResults();
            
        } catch (error) {
            console.error('Error fetching career data:', error);
            this.showNotification('Please start the backend server (python app.py) or select from available careers!', 'error');
            this.loadFallbackCareerData(careerId);
        } finally {
            btn.innerHTML = '<i class="fas fa-rocket"></i> Get Career Guidance';
            btn.disabled = false;
        }
    }

    loadFallbackCareerData(careerId) {
    // Fallback demo data
    const demoData = {
        1: {
            career_name: "Software Engineer",
            description: "Design and develop software applications. High demand career with excellent growth opportunities.",
            required_skills: ["JavaScript", "Python", "React", "Node.js", "SQL", "Git"],
            recommended_courses: [
                {title: "The Web Developer Bootcamp", platform: "Udemy"},
                {title: "CS50", platform: "Harvard"}
            ],
            roadmap_steps: [
                "Learn HTML/CSS/JS (2 months)",
                "Master React/Node.js (3 months)",
                "Build projects (3 months)",
                "Get internship"
            ],
            average_salary: {min: 500000, max: 3000000},
            future_scope: "Excellent growth with AI and cloud computing boom."
        },

        2: {
            career_name: "Data Scientist",
            description: "Analyze data and build machine learning models to solve real-world problems.",
            required_skills: ["Python", "Pandas", "Statistics", "SQL", "Machine Learning"],
            recommended_courses: [
                {title: "Data Science Professional Certificate", platform: "Coursera"}
            ],
            roadmap_steps: [
                "Learn Python & Pandas (2 months)",
                "Study Statistics (2 months)",
                "Learn ML algorithms (3 months)",
                "Build projects"
            ],
            average_salary: {min: 700000, max: 3500000},
            future_scope: "High demand across industries like finance, healthcare, and tech."
        },

        3: {
            career_name: "AI/ML Engineer",
            description: "Develop and deploy intelligent systems using machine learning and deep learning.",
            required_skills: ["Python", "TensorFlow", "Deep Learning", "MLOps"],
            recommended_courses: [
                {title: "Deep Learning Specialization", platform: "Coursera"}
            ],
            roadmap_steps: [
                "Learn Python & ML basics (2 months)",
                "Deep Learning (3 months)",
                "Build AI projects",
                "Deploy models"
            ],
            average_salary: {min: 800000, max: 4500000},
            future_scope: "One of the fastest growing and future-proof careers."
        },

        4: {
            career_name: "Doctor",
            description: "Diagnose and treat patients in the healthcare sector.",
            required_skills: ["Medical Knowledge", "Communication", "Decision Making"],
            recommended_courses: [],
            roadmap_steps: [
                "Complete 12th PCB",
                "Crack NEET exam",
                "Complete MBBS",
                "Do specialization (PG)"
            ],
            average_salary: {min: 800000, max: 5000000},
            future_scope: "Always in demand with strong job security."
        },

        5: {
            career_name: "Lawyer",
            description: "Provide legal advice and represent clients in court.",
            required_skills: ["Legal Research", "Argumentation", "Drafting"],
            recommended_courses: [],
            roadmap_steps: [
                "Complete 12th",
                "Clear CLAT exam",
                "Complete LLB",
                "Start practice"
            ],
            average_salary: {min: 400000, max: 3000000},
            future_scope: "Stable career with growth in corporate and litigation sectors."
        }
    };

    if (demoData[careerId]) {
        this.currentCareer = demoData[careerId];
        this.displayCareerGuidance(this.currentCareer);
        this.showResults();
    }
}
        
        if (demoData[careerId]) {
            this.currentCareer = demoData[careerId];
            this.displayCareerGuidance(this.currentCareer);
            this.showResults();
        }
    }

    displayCareerGuidance(data) {
        // Career Title
        document.getElementById('careerTitle').textContent = data.career_name;

        // Description
        document.getElementById('careerDescription').textContent = data.description;

        // Salary
        document.getElementById('salaryRange').innerHTML = 
            `<strong>₹${(data.average_salary.min/1000).toFixed(0)}L - ₹${(data.average_salary.max/1000).toFixed(0)}L</strong><br>
             <small>Average Annual Salary (India)</small>`;

        // Future Scope
        document.getElementById('futureScope').textContent = data.future_scope;

        // Skills
        const skillsList = document.getElementById('requiredSkills');
        skillsList.innerHTML = '';
        data.required_skills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = `• ${skill}`;
            skillsList.appendChild(li);
        });

        // Courses
        const coursesList = document.getElementById('recommendedCourses');
        coursesList.innerHTML = '';
        data.recommended_courses.forEach(course => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${course.title}</strong><br><small>${course.platform}</small>`;
            coursesList.appendChild(li);
        });

        // Roadmap
        const roadmapList = document.getElementById('roadmapSteps');
        roadmapList.innerHTML = '';
        data.roadmap_steps.forEach((step, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${index + 1}.</strong> ${step}`;
            roadmapList.appendChild(li);
        });
    }

    showResults() {
        document.getElementById('selectionSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        document.body.scrollTo({top: 0, behavior: 'smooth'});
    }

    showSelection() {
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('selectionSection').style.display = 'block';
    }

    async sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message || !this.currentCareer) {
            input.focus();
            return;
        }

        // Add user message
        this.addChatMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.addChatMessage('AI Mentor is typing...', 'ai', true);

        try {
            // Try backend AI first
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    career_name: this.currentCareer.career_name
                })
            });
            
            const data = await response.json();
            this.removeTypingIndicator();
            this.addChatMessage(data.response, 'ai');
            
        } catch (error) {
            // Fallback AI responses
            this.removeTypingIndicator();
            const fallbackResponse = this.generateFallbackAIResponse(message);
            this.addChatMessage(fallbackResponse, 'ai');
        }

        // Auto-scroll to bottom
        this.scrollChatToBottom();
    }

    generateFallbackAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        const careerName = this.currentCareer.career_name.toLowerCase();

        if (lowerMessage.includes('salary') || lowerMessage.includes('pay')) {
            return `💰 For ${this.currentCareer.career_name}, expect ₹${(this.currentCareer.average_salary.min/100000).toFixed(1)}L - ₹${(this.currentCareer.average_salary.max/100000).toFixed(1)}L per year. Freshers start at ₹4-8LPA.`;
        }
        
        if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
            return `🎯 Key skills: ${this.currentCareer.required_skills.slice(0, 3).join(', ')}... Focus on building projects and getting certifications!`;
        }
        
        if (lowerMessage.includes('time') || lowerMessage.includes('how long')) {
            return `⏱️ Typically 6-24 months to become job-ready, depending on your dedication and prior knowledge. Follow the roadmap!`;
        }
        
        if (lowerMessage.includes('course') || lowerMessage.includes('certification')) {
            return `📚 Start with: ${this.currentCareer.recommended_courses[0].title} on ${this.currentCareer.recommended_courses[0].platform}`;
        }

        return `🤖 Great question about ${this.currentCareer.career_name}! Follow the roadmap, build projects, and practice consistently. Need specific advice? Ask me anything! 🚀`;
    }

    addChatMessage(message, sender, isTyping = false) {
        const messages = document.getElementById('chatMessages');
        const messageEl = document.createElement('div');
        
        if (isTyping) {
            messageEl.id = 'typing-indicator';
        }
        
        messageEl.className = `chat-message ${sender}`;
        messageEl.textContent = message;
        messages.appendChild(messageEl);
        
        if (!isTyping) {
            this.chatMessages.push({ sender, message });
        }
    }

    removeTypingIndicator() {
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }

    scrollChatToBottom() {
        const messages = document.getElementById('chatMessages');
        messages.scrollTop = messages.scrollHeight;
    }

    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Animate
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmartMentorAI();
});

// Add notification styles to existing CSS (will be auto-applied)
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-30px);
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 350px;
    }
    .notification-info { background: linear-gradient(45deg, #667eea, #764ba2); }
    .notification-warning { background: linear-gradient(45deg, #f39c12, #e67e22); }
    .notification-error { background: linear-gradient(45deg, #e74c3c, #c0392b); }
    @media (max-width: 480px) {
        .notification { right: 10px; left: 10px; max-width: none; }
    }
`;
document.head.appendChild(notificationStyle);

// PWA-like offline support
window.addEventListener('offline', () => {
    const mentor = window.smartMentorAI;
    if (mentor) {
        mentor.showNotification('Working offline - using demo data', 'warning');
    }
});