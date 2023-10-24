const DEFAULT_OPTIONS = {
    value: new Date().getTime(),
    onChange: () => { },
    onSelect: true,
    widgets: true,
    appendElement: null
}

export default function Calendar(options) {
    let todayDate = new Date();
    let changedDate = new Date();
    let selectedDate = new Date(DEFAULT_OPTIONS.value);
    const detectDayMonth = (date) => {
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();
        let firstDayofMonth = new Date(currentYear, currentMonth, 1).getDay(), // getting first day of month
            lastDateofMonth = new Date(currentYear, currentMonth + 1, 0).getDate(), // getting last date of month
            lastDayofMonth = new Date(currentYear, currentMonth, lastDateofMonth).getDay(), // getting last day of month
            lastDateofPreviousMonth = new Date(currentYear, currentMonth, 0).getDate(); // getting last date of previous month
        return { currentMonth, currentYear, firstDayofMonth, lastDateofMonth, lastDayofMonth, lastDateofPreviousMonth }
    }
    let isActive = todayDate === selectedDate;
    const selectCalendar = function (e) {
        if (e.target.id && !isNaN(parseInt(e.target.id))) {
            selectedDate = new Date(parseInt(e.target.id));
            e.target.className = "active";
            isActive = selectedDate === todayDate;
            if (!DEFAULT_OPTIONS.onSelect) options.onChange(selectedDate.getTime());
            renderCalendar();
        }
    }
    const selectToday = function () {
        const currentDate = new Date().getTime();
        selectCalendar({ target: { id: currentDate } });
        options.onChange(currentDate);
    }
    const nextMonth = function () {
        const { currentMonth, currentYear } = detectDayMonth(changedDate);
        const newCurrentMonth = currentMonth + 1;
        changedDate = new Date(currentYear, newCurrentMonth, new Date().getDate());
        renderCalendar();
    }
    const previousMonth = function () {
        const { currentMonth, currentYear } = detectDayMonth(changedDate);
        const newCurrentMonth = currentMonth - 1;
        changedDate = new Date(currentYear, newCurrentMonth, new Date().getDate());
        renderCalendar();
    }
    const createHeader = function () {
        const header = document.getElementsByClassName('calendar-header')[0] || document.createElement('div');
        header.className = 'calendar-header';
        header.innerHTML = '';
        const showMonthYear = document.getElementsByClassName('calendar-month-year')[0] || document.createElement('div');
        showMonthYear.className = 'calendar-month-year';
        showMonthYear.innerHTML = '';
        const showMonth = document.getElementsByClassName('calendar-month')[0] || document.createElement('div');
        showMonth.className = 'calendar-month';
        showMonth.innerHTML = '';
        const showYear = document.getElementsByClassName('calendar-year')[0] || document.createElement('div');
        showYear.className = 'calendar-year';
        showYear.innerHTML = '';
        showMonth.append(changedDate.toLocaleString('default', { month: 'long' }));
        showYear.append(changedDate.getFullYear());
        showMonthYear.append(showMonth);
        showMonthYear.append(showYear);
        const changeAction = document.getElementsByClassName('change-action')[0] || document.createElement('div');
        changeAction.className = 'change-action';
        changeAction.innerHTML = '';
        const nextAction = document.getElementsByClassName('next-calendar-action')[0] || document.createElement('button');
        nextAction.id = 'next-calendar-action';
        nextAction.className = 'btn';
        nextAction.addEventListener('click', nextMonth);
        nextAction.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-3 h-3 bi bi-chevron-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>';
        const previousAction = document.getElementsByClassName('previous-calendar-action')[0] || document.createElement('button');
        previousAction.id = 'previous-calendar-action';
        previousAction.className = 'btn';
        previousAction.addEventListener('click', previousMonth);
        previousAction.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-3 h-3 bi bi-chevron-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>';
        header.append(previousAction);
        header.append(showMonthYear);
        header.append(nextAction);
        return header;
    }
    const createWeeks = function () {
        const weeks = document.getElementsByClassName('calendar-weeks')[0] || document.createElement('ul');
        if (!document.getElementsByClassName('calendar-weeks')[0]) {
            weeks.className = 'calendar-weeks';
            Array.from(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], weekName => weeks.innerHTML += `<li class="calendar-week">${weekName}</li>`);
        }
        return weeks;
    }
    const createDays = function () {
        let days = document.getElementsByClassName('calendar-days')[0] || document.createElement('ul');
        days.className = 'calendar-days';
        days.innerHTML = '';
        const { currentMonth, currentYear, firstDayofMonth, lastDateofMonth, lastDayofMonth, lastDateofPreviousMonth } = detectDayMonth(changedDate);

        // creating day-dates of previous month last days if present current month left any
        for (let index = firstDayofMonth; index > 0; index--) {
            let liEl = document.createElement('li');
            liEl.id = new Date(`${String(currentMonth).padStart(2, '0')}/${lastDateofPreviousMonth - index + 1}/${todayDate.getFullYear()} 00:00:00`).getTime();
            liEl.className = 'inactive';
            if (options.minDate && options.maxDate) {
                if (Number(options.minDate) < liEl.id && Number(options.maxDate) > liEl.id) liEl.addEventListener('click', selectCalendar);
                else liEl.ariaDisabled = true;
            } else {
                liEl.addEventListener('click', selectCalendar);
            }
            liEl.append(lastDateofPreviousMonth - index + 1);
            days.append(liEl);
        }
        // creating day-dates of all days of current month
        for (let index = 1; index <= lastDateofMonth; index++) {
            // adding active class to li if the current day, month, and year matched
            let liEl = document.createElement('li');
            if (
                index === selectedDate.getDate() &&
                selectedDate.getMonth() === changedDate.getMonth() &&
                selectedDate.getFullYear() === changedDate.getFullYear()
            ) {
                liEl.className = "active";
            }
            liEl.id = new Date(`${String(currentMonth + 1).padStart(2, '0')}/${index}/${currentYear} 00:00:00`).getTime();
            if (options.minDate && options.maxDate) {
                if (Number(options.minDate) < liEl.id && Number(options.maxDate) > liEl.id) liEl.addEventListener('click', selectCalendar);
                else {
                    liEl.ariaDisabled = true;
                    liEl.className += ' inactive';
                }
            } else {
                liEl.addEventListener('click', selectCalendar);
            }
            liEl.append(index);
            days.append(liEl);
        }
        // creating day-dates of next month last days if present current month left any
        for (let index = lastDayofMonth; index < 6; index++) {
            let liEl = document.createElement('li');
            liEl.id = new Date(`${String(currentMonth + 2).padStart(2, '0')}/${index - lastDayofMonth + 1}/${todayDate.getFullYear()} 00:00:00`).getTime();
            liEl.className = 'inactive';
            if (options.minDate && options.maxDate) {
                if (Number(options.minDate) < liEl.id && Number(options.maxDate) > liEl.id) liEl.addEventListener('click', selectCalendar);
                else liEl.ariaDisabled = true;
            } else {
                liEl.addEventListener('click', selectCalendar);
            }
            liEl.append(index - lastDayofMonth + 1);
            days.append(liEl);
        }
        return days;
    }
    const createWidgets = function () {
        const widgets = document.getElementsByClassName('calendar-widgets')[0] || document.createElement('div');
        if (!document.getElementsByClassName('calendar-widgets')[0]) {
            widgets.className = 'calendar-widgets';
            const today = document.createElement('span');
            today.textContent = 'Today';
            today.addEventListener('click', selectToday);
            widgets.append(today);
            if (DEFAULT_OPTIONS.onSelect) {
                const select = document.createElement('span');
                select.textContent = 'Select';
                select.addEventListener('click', () => options.onChange(selectedDate.getTime()));
                widgets.append(select);
            }
        }
        return widgets;
    }
    const renderCalendar = function () {
        const container = document.getElementsByClassName('calendar-container')[0];
        container.append(createHeader());
        container.append(createWeeks());
        container.append(createDays());
        if (DEFAULT_OPTIONS.widgets) container.append(createWidgets());
        if (DEFAULT_OPTIONS.appendElement) DEFAULT_OPTIONS.appendElement.append(container);
    }
    renderCalendar();
    Object.defineProperty(this, 'output', {
        get() {
            return selectedDate ? selectedDate : todayDate;
        }
    });
}
