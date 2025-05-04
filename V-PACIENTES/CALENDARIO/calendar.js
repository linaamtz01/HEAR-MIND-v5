document.addEventListener('DOMContentLoaded', function () {

    /* =======================
       Funciones de LocalStorage
    ======================= */
    function getSavedEvents() {
        const savedEvents = localStorage.getItem('calendarEvents');
        return savedEvents ? JSON.parse(savedEvents) : [];
    }

    function saveEvents(events) {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }

    /* =======================
       Funciones de Formato de Fecha
    ======================= */
    function formatDateTimeLocal(date) {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    }

    /* =======================
       Funciones de Interfaz
    ======================= */
    function updateMonthYear(calendar) {
        const view = calendar.view;
        const title = view.title;
        document.getElementById('month-year').textContent = title;
    }

    function setActiveView(view) {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${view}-view`).classList.add('active');
    }

    function renderMonthlyEvents() {
        const container = document.getElementById('event-list');
        container.innerHTML = '';

        const currentViewEvents = calendar.getEvents();
        const visibleRange = calendar.view.activeStart;
        const endRange = calendar.view.activeEnd;

        const filteredEvents = currentViewEvents.filter(event => {
            return event.start >= visibleRange && event.start < endRange;
        });

        if (filteredEvents.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">No hay eventos este mes.</p>';
            return;
        }

        filteredEvents.sort((a, b) => a.start - b.start);

        filteredEvents.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = 'event-card p-3 rounded-lg shadow-md mb-2 border-l-4 cursor-pointer transition-all hover:bg-gray-100';
            const color = event.backgroundColor || event.extendedProps?.backgroundColor || '#3eb489';

            eventEl.style.borderLeft = `4px solid ${color}`;
            eventEl.style.backgroundColor = '#ffffff';

            const date = event.start.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            const time = event.allDay ? 'Todo el día' :
                event.start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            eventEl.innerHTML = `
                <div class="text-xs text-gray-500">${date} ${time}</div>
                <div class="font-semibold" style="color: ${color}">${event.title}</div>
                <div class="text-sm text-gray-600">${event.extendedProps?.description || ''}</div>
            `;

            eventEl.addEventListener('click', () => {
                openEventModal(event);
            });

            container.appendChild(eventEl);
        });
    }

    /* =======================
       Funciones de Modal de Evento
    ======================= */
    function openEventModal(event) {
        document.getElementById('event-title').textContent = event.title || 'Sin título';

        const startDate = event.start ? event.start.toLocaleString('es-ES', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }) : '';

        const endDate = event.end ? event.end.toLocaleTimeString('es-ES', {
            hour: '2-digit', minute: '2-digit'
        }) : '';

        let dateStr = startDate;
        if (endDate) {
            dateStr += ` - ${endDate}`;
        }
        document.getElementById('event-date').textContent = dateStr;

        document.getElementById('event-location').textContent = event.extendedProps?.location || 'Sin ubicación';
        document.getElementById('event-description-text').textContent = event.extendedProps?.description || 'Sin descripción';

        document.getElementById('delete-event').onclick = function () {
            if (confirm('¿Quieres eliminar este evento?')) {
                const savedEvents = getSavedEvents();
                const updatedEvents = savedEvents.filter(e => e.id !== event.id);
                saveEvents(updatedEvents);
                event.remove();
                document.getElementById('event-modal').style.display = 'none';
            }
        };

        document.getElementById('event-modal').style.display = 'block';
    }

    /* =======================
       Inicializar Calendario
    ======================= */
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'es',
        initialView: 'dayGridMonth',
        headerToolbar: false,
        firstDay: 1,
        events: getSavedEvents(),
        eventDisplay: 'block',
        eventColor: '#3eb489',
        eventTextColor: '#333',
        editable: true,
        fixedWeekCount: false,
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        },
        dateClick: function (info) {
            const startDate = new Date(info.date);
            startDate.setHours(12, 0);
            document.getElementById('event-start').value = formatDateTimeLocal(startDate);
            document.getElementById('new-event-modal').style.display = 'block';
        },
        eventClick: function (info) {
            openEventModal(info.event);
        },
        eventDidMount: function (info) {
            if (info.event.backgroundColor) {
                info.el.style.backgroundColor = info.event.backgroundColor;
                info.el.style.borderLeft = `4px solid ${info.event.backgroundColor}`;
            }
        }
    });

    calendar.on('viewDidMount', function (viewInfo) {
        if (viewInfo.view.type === 'dayGridMonth') {
            calendarEl.style.overflowY = 'auto';
            calendarEl.style.maxHeight = '500px';
        } else {
            calendarEl.style.overflowY = 'hidden';
            calendarEl.style.maxHeight = 'none';
        }
    });

    calendar.on('datesSet', function () {
        updateMonthYear(calendar);
        renderMonthlyEvents();
    });

    calendar.render();
    updateMonthYear(calendar);
    renderMonthlyEvents();

    /* =======================
       Botones de Navegación
    ======================= */
    document.getElementById('today-btn').addEventListener('click', function () {
        calendar.today();
        updateMonthYear(calendar);
    });

    document.getElementById('prev-btn').addEventListener('click', function () {
        calendar.prev();
        updateMonthYear(calendar);
    });

    document.getElementById('next-btn').addEventListener('click', function () {
        calendar.next();
        updateMonthYear(calendar);
    });

    /* =======================
       Cambio de Vista
    ======================= */
    document.getElementById('day-view').addEventListener('click', function () {
        calendar.changeView('timeGridDay');
        setActiveView('day');
    });

    document.getElementById('week-view').addEventListener('click', function () {
        calendar.changeView('timeGridWeek');
        setActiveView('week');
    });

    document.getElementById('month-view').addEventListener('click', function () {
        calendar.changeView('dayGridMonth');
        setActiveView('month');
    });

    /* =======================
       Nuevo Evento
    ======================= */
    document.getElementById('new-event-btn').addEventListener('click', function () {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

        document.getElementById('event-start').value = formatDateTimeLocal(now);
        document.getElementById('event-end').value = '';
        document.getElementById('event-name').value = '';
        document.getElementById('event-description').value = '';
        document.getElementById('event-location-input').value = ''; // Agrega este input en tu HTML
        document.getElementById('event-color').value = '#3eb489';

        document.getElementById('new-event-modal').style.display = 'block';
    });

    document.getElementById('event-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('event-name').value;
        const start = document.getElementById('event-start').value;
        const end = document.getElementById('event-end').value;
        const description = document.getElementById('event-description').value;
        const location = document.getElementById('event-location-input').value;
        const color = document.getElementById('event-color').value || '#3eb489';

        const newEvent = {
            id: 'event_' + Date.now(),
            title: title,
            start: start,
            end: end || undefined,
            backgroundColor: color,
            borderColor: color,
            extendedProps: {
                description: description,
                location: location
            }
        };

        const savedEvents = getSavedEvents();
        savedEvents.push(newEvent);
        saveEvents(savedEvents);

        calendar.addEvent(newEvent);

        document.getElementById('new-event-modal').style.display = 'none';
        this.reset();
    });

    /* =======================
       Cerrar Modales
    ======================= */
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', function () {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function (event) {
        if (event.target.className === 'modal') {
            event.target.style.display = 'none';
        }
    });

    /* =======================
       Color Selector (en Modal)
    ======================= */
    const colorCircles = document.querySelectorAll('.color-circle');
    const colorInput = document.getElementById('event-color');

    colorCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            colorCircles.forEach(c => c.classList.remove('selected'));
            circle.classList.add('selected');
            colorInput.value = circle.getAttribute('data-color');
        });
    });

});

