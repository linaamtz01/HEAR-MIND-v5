document.addEventListener('DOMContentLoaded', function () {
    // Sistema de notificaciones para mensajes de error/éxito
    function showNotification(message, type = 'error') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-cerrar después de 5 segundos
        const timeout = setTimeout(() => {
            closeNotification(notification);
        }, 5000);
        
        // Permitir cerrar manualmente
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timeout);
            closeNotification(notification);
        });
    }
    
    function closeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    /* =======================
       Funciones de LocalStorage con manejo de errores
    ======================= */
    function getSavedEvents() {
        try {
            const savedEvents = localStorage.getItem('calendarEvents');
            if (!savedEvents) return [];
            
            const events = JSON.parse(savedEvents);
            if (!Array.isArray(events)) {
                throw new Error('El formato de eventos guardados es inválido');
            }
            return events;
        } catch (error) {
            console.error('Error al cargar eventos:', error);
            showNotification('No se pudieron cargar los eventos guardados. Se iniciará con un calendario vacío.', 'error');
            // Crear backup de los datos corruptos
            if (localStorage.getItem('calendarEvents')) {
                localStorage.setItem('calendarEvents_backup', localStorage.getItem('calendarEvents'));
                localStorage.removeItem('calendarEvents');
            }
            return [];
        }
    }

    function saveEvents(events) {
        try {
            if (!Array.isArray(events)) {
                throw new Error('Los eventos deben ser un array');
            }
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            return true;
        } catch (error) {
            console.error('Error al guardar eventos:', error);
            
            if (error.name === 'QuotaExceededError') {
                showNotification('No hay espacio suficiente para guardar más eventos. Intente borrar algunos eventos antiguos.', 'error');
            } else {
                showNotification('No se pudieron guardar los cambios.', 'error');
            }
            return false;
        }
    }

    /* =======================
       Validación de formularios
    ======================= */
    function validateEventForm() {
        const title = document.getElementById('event-name').value.trim();
        const start = document.getElementById('event-start').value;
        const end = document.getElementById('event-end').value;
        
        // Validar título
        if (!title) {
            showNotification('Debe ingresar un título para el evento', 'error');
            document.getElementById('event-name').focus();
            return false;
        }
        
        // Validar fecha de inicio
        if (!start) {
            showNotification('Debe seleccionar una fecha de inicio', 'error');
            document.getElementById('event-start').focus();
            return false;
        }
        
        // Validar que la fecha de fin sea después de la de inicio
        if (end && new Date(end) <= new Date(start)) {
            showNotification('La fecha de fin debe ser posterior a la fecha de inicio', 'error');
            document.getElementById('event-end').focus();
            return false;
        }
        
        return true;
    }

    /* =======================
       Inicializar Calendario con manejo de errores
    ======================= */
    let calendar;
    try {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) {
            throw new Error('No se encontró el elemento del calendario');
        }
        
        calendar = new FullCalendar.Calendar(calendarEl, {
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
            // Configuración para mostrar horas con AM/PM en todas las vistas
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short',
                hour12: true
            },
            // Configuración específica para vistas de día y semana
            views: {
                timeGridDay: {
                    slotLabelFormat: {
                        hour: '2-digit',
                        minute: '2-digit',
                        omitZeroMinute: false,
                        meridiem: 'short',
                        hour12: true
                    }
                },
                timeGridWeek: {
                    slotLabelFormat: {
                        hour: '2-digit',
                        minute: '2-digit',
                        omitZeroMinute: false,
                        meridiem: 'short',
                        hour12: true
                    }
                }
            },
            dateClick: function (info) {
                const startDate = new Date(info.date);
                startDate.setHours(12, 0);
                document.getElementById('event-start').value = formatDateTimeLocal(startDate);
                
                // Limpiar el formulario
                document.getElementById('event-form').reset();
                document.getElementById('event-start').value = formatDateTimeLocal(startDate);
                
                // Seleccionar el primer color por defecto
                const firstColor = document.querySelector('.color-circle');
                if (firstColor) {
                    const colorValue = firstColor.getAttribute('value') || firstColor.style.backgroundColor;
                    document.getElementById('event-color').value = colorValue;
                    firstColor.classList.add('selected');
                }
                
                document.getElementById('new-event-modal').style.display = 'block';
            },
            eventClick: function (info) {
                openEventModal(info.event);
            },
            // Reemplaza la función eventDidMount en la configuración del calendario
eventDidMount: function (info) {
    // Aplicar color de evento
    if (info.event.backgroundColor) {
        info.el.style.backgroundColor = info.event.backgroundColor;
        info.el.style.borderLeft = `4px solid ${info.event.backgroundColor}`;
    }
    
    // Asegurar que las propiedades extendidas estén disponibles
    if (!info.event.extendedProps) {
        info.event.setExtendedProp('description', '');
        info.event.setExtendedProp('location', '');
    }
    
    // Verificar si hay datos faltantes en el evento
    const savedEvents = getSavedEvents();
    const savedEvent = savedEvents.find(e => e.id === info.event.id);
    
    if (savedEvent && savedEvent.extendedProps) {
        // Asegurar que todas las propiedades estén presentes
        if (savedEvent.extendedProps.description) {
            info.event.setExtendedProp('description', savedEvent.extendedProps.description);
        }
        if (savedEvent.extendedProps.location) {
            info.event.setExtendedProp('location', savedEvent.extendedProps.location);
        }
    }
},
            eventDrop: function(info) {
                // Actualizar eventos en localStorage cuando se arrastra un evento
                try {
                    const events = getSavedEvents();
                    const eventIndex = events.findIndex(e => e.id === info.event.id);
                    
                    if (eventIndex > -1) {
                        events[eventIndex].start = info.event.start.toISOString();
                        if (info.event.end) {
                            events[eventIndex].end = info.event.end.toISOString();
                        }
                        saveEvents(events);
                        showNotification('Evento actualizado correctamente', 'success');
                    }
                } catch (error) {
                    console.error('Error al actualizar el evento:', error);
                    info.revert();
                    showNotification('No se pudo actualizar el evento', 'error');
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
    } catch (error) {
        console.error('Error al inicializar el calendario:', error);
        const calendarContainer = document.querySelector('.calendar-container');
        if (calendarContainer) {
            calendarContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>No se pudo cargar el calendario</h3>
                    <p>Ha ocurrido un error al inicializar el calendario. Intente recargar la página.</p>
                    <button onclick="location.reload()">Recargar página</button>
                </div>
            `;
        }
    }

    /* =======================
       Funciones de Formato de Fecha
    ======================= */
    function formatDateTimeLocal(date) {
        try {
            const d = new Date(date);
            if (isNaN(d.getTime())) {
                throw new Error('Fecha inválida');
            }
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            return d.toISOString().slice(0, 16);
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return '';
        }
    }

    /* =======================
       Funciones de Interfaz
    ======================= */
    function updateMonthYear(calendar) {
        try {
            const view = calendar.view;
            const title = view.title;
            const monthYearElement = document.getElementById('month-year');
            if (monthYearElement) {
                monthYearElement.textContent = title;
            }
        } catch (error) {
            console.error('Error al actualizar mes y año:', error);
        }
    }

    function setActiveView(view) {
        try {
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            const viewBtn = document.getElementById(`${view}-view`);
            if (viewBtn) {
                viewBtn.classList.add('active');
            }
        } catch (error) {
            console.error('Error al cambiar vista:', error);
        }
    }
    // Busca la función renderMonthlyEvents y reemplázala con esta versión corregida
function renderMonthlyEvents() {
    try {
        const container = document.getElementById('event-list');
        if (!container) return;
        
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
            const color = event.backgroundColor || '#3eb489';

            eventEl.style.borderLeft = `4px solid ${color}`;
            eventEl.style.backgroundColor = '#ffffff';

            const date = event.start.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            const time = event.allDay ? 'Todo el día' :
                event.start.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true
                });

            // Acceso correcto a la ubicación y descripción
            const location = event.extendedProps && event.extendedProps.location ? event.extendedProps.location : '';
            const description = event.extendedProps && event.extendedProps.description ? event.extendedProps.description : '';

            eventEl.innerHTML = `
                <div class="text-xs text-gray-500">${date} ${time}</div>
                <div class="font-semibold" style="color: ${color}">${event.title}</div>
                ${location ? `<div class="text-sm text-gray-600"><i class="fas fa-map-marker-alt"></i> ${location}</div>` : ''}
                ${description ? `<div class="text-sm text-gray-600">${description}</div>` : ''}
            `;

            eventEl.addEventListener('click', () => {
                openEventModal(event);
            });

            container.appendChild(eventEl);
        });
    } catch (error) {
        console.error('Error al renderizar eventos mensuales:', error);
        const container = document.getElementById('event-list');
        if (container) {
            container.innerHTML = '<p class="text-red-500">No se pudieron cargar los eventos. Intente recargar la página.</p>';
        }
    }
}
    /* =======================
       Funciones de Modal de Evento
    ======================= */
    function openEventModal(event) {
        try {
            const titleEl = document.getElementById('event-title');
            const dateEl = document.getElementById('event-date');
            const locationEl = document.getElementById('event-location');
            const descriptionEl = document.getElementById('event-description-text');
            
            if (!titleEl || !dateEl || !locationEl || !descriptionEl) {
                throw new Error('Elementos del modal no encontrados');
            }
            
            titleEl.textContent = event.title || 'Sin título';
    
            // Modificar el formato de fecha para incluir AM/PM
            const startDate = event.start ? event.start.toLocaleString('es-ES', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
            }) : '';
    
            const endDate = event.end ? event.end.toLocaleTimeString('es-ES', {
                hour: '2-digit', minute: '2-digit', hour12: true
            }) : '';
    
            let dateStr = startDate;
            if (endDate) {
                dateStr += ` - ${endDate}`;
            }
            dateEl.textContent = dateStr;
    
            // Corrección para mostrar la ubicación correctamente
            locationEl.textContent = (event.extendedProps && event.extendedProps.location) 
                                 ? event.extendedProps.location 
                                 : 'Sin ubicación';
            
            // Corrección similar para la descripción
            descriptionEl.textContent = (event.extendedProps && event.extendedProps.description) 
                                    ? event.extendedProps.description 
                                    : 'Sin descripción';
    
            document.getElementById('delete-event').onclick = function () {
                if (confirm('¿Quieres eliminar este evento?')) {
                    try {
                        const savedEvents = getSavedEvents();
                        const updatedEvents = savedEvents.filter(e => e.id !== event.id);
                        if (saveEvents(updatedEvents)) {
                            event.remove();
                            showNotification('Evento eliminado correctamente', 'success');
                            document.getElementById('event-modal').style.display = 'none';
                            renderMonthlyEvents();
                        }
                    } catch (error) {
                        console.error('Error al eliminar evento:', error);
                        showNotification('No se pudo eliminar el evento', 'error');
                    }
                }
            };
    
            document.getElementById('event-modal').style.display = 'block';
        } catch (error) {
            console.error('Error al abrir modal de evento:', error);
            showNotification('No se pudo abrir el detalle del evento', 'error');
        }
    }

    /* =======================
       Botones de Navegación
    ======================= */
    function addButtonListeners() {
        try {
            // Botón de hoy
            const todayBtn = document.getElementById('today-btn');
            if (todayBtn) {
                todayBtn.addEventListener('click', function () {
                    calendar.today();
                    updateMonthYear(calendar);
                });
            }
            
            // Botón anterior
            const prevBtn = document.getElementById('prev-btn');
            if (prevBtn) {
                prevBtn.addEventListener('click', function () {
                    calendar.prev();
                    updateMonthYear(calendar);
                });
            }
            
            // Botón siguiente
            const nextBtn = document.getElementById('next-btn');
            if (nextBtn) {
                nextBtn.addEventListener('click', function () {
                    calendar.next();
                    updateMonthYear(calendar);
                });
            }
            
            // Botones de vista
            const dayViewBtn = document.getElementById('day-view');
            if (dayViewBtn) {
                dayViewBtn.addEventListener('click', function () {
                    calendar.changeView('timeGridDay');
                    setActiveView('day');
                });
            }
            
            const weekViewBtn = document.getElementById('week-view');
            if (weekViewBtn) {
                weekViewBtn.addEventListener('click', function () {
                    calendar.changeView('timeGridWeek');
                    setActiveView('week');
                });
            }
            
            const monthViewBtn = document.getElementById('month-view');
            if (monthViewBtn) {
                monthViewBtn.addEventListener('click', function () {
                    calendar.changeView('dayGridMonth');
                    setActiveView('month');
                });
            }
        } catch (error) {
            console.error('Error al agregar listeners a botones:', error);
        }
    }

    addButtonListeners();

    /* =======================
       Nuevo Evento
    ======================= */
    const newEventBtn = document.getElementById('new-event-btn');
    if (newEventBtn) {
        newEventBtn.addEventListener('click', function () {
            try {
                const now = new Date();
                
                // Limpiar el formulario
                const eventForm = document.getElementById('event-form');
                if (eventForm) eventForm.reset();
                
                // Establecer valores por defecto
                document.getElementById('event-start').value = formatDateTimeLocal(now);
                
                // Seleccionar el primer color por defecto
                document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
                const firstColor = document.querySelector('.color-circle');
                if (firstColor) {
                    firstColor.classList.add('selected');
                    document.getElementById('event-color').value = firstColor.getAttribute('value');
                }
                
                document.getElementById('new-event-modal').style.display = 'block';
            } catch (error) {
                console.error('Error al abrir formulario de nuevo evento:', error);
                showNotification('No se pudo abrir el formulario de nuevo evento', 'error');
            }
        });
    }

    /* =======================
       Evento de guardado de formulario - CORREGIDO
    ======================= */
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            try {
                // Validar formulario
                if (!validateEventForm()) {
                    return;
                }
                
                const title = document.getElementById('event-name').value.trim();
                const start = document.getElementById('event-start').value;
                const end = document.getElementById('event-end').value;
                const description = document.getElementById('event-description').value;
                const location = document.getElementById('event-location').value;
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
                
                if (saveEvents(savedEvents)) {
                    calendar.addEvent(newEvent);
                    showNotification('Evento guardado correctamente', 'success');
                    document.getElementById('new-event-modal').style.display = 'none';
                    renderMonthlyEvents();
                    this.reset();
                }
            } catch (error) {
                console.error('Error al guardar evento:', error);
                showNotification('No se pudo guardar el evento. Intente nuevamente.', 'error');
            }
        });
    }

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
       Color Selector (en Modal) - CORREGIDO
    ======================= */
    const colorCircles = document.querySelectorAll('.color-circle');
    const colorInput = document.getElementById('event-color');

    colorCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            colorCircles.forEach(c => c.classList.remove('selected'));
            circle.classList.add('selected');
            // Usar el atributo 'value' en lugar de data-color
            const colorValue = circle.getAttribute('value') || circle.style.backgroundColor;
            colorInput.value = colorValue;
        });
    });

    // Seleccionar el primer color por defecto al cargar
    if (colorCircles.length > 0 && colorInput) {
        colorCircles[0].classList.add('selected');
        colorInput.value = colorCircles[0].getAttribute('value') || colorCircles[0].style.backgroundColor;
    }
});

