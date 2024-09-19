(function (exports) {
    'use strict';

    var extend,
        createElements,
        createCountdownElt,
        simplyCountdown;

    // Функция объединяет параметры пользователя с параметрами по умолчанию
    extend = function (out) {
        var i, obj, key;
        out = out || {};

        for (i = 1; i < arguments.length; i++) {
            obj = arguments[i];

            if (obj) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object') {
                            extend(out[key], obj[key]);
                        } else {
                            out[key] = obj[key];
                        }
                    }
                }
            }
        }
        return out;
    };

    // Функция для получения правильной формы слова в зависимости от числа
    function getWordForm(number, wordForms) {
        number = Math.abs(number) % 100;
        var lastDigit = number % 10;

        if (number > 10 && number < 20) {
            return wordForms[2]; // Например: дней
        }
        if (lastDigit > 1 && lastDigit < 5) {
            return wordForms[1]; // Например: дня
        }
        if (lastDigit == 1) {
            return wordForms[0]; // Например: день
        }
        return wordForms[2]; // Например: дней
    }

    // Функция создаёт элемент для обратного отсчёта
    createCountdownElt = function (countdown, parameters, typeClass) {
        var sectionTag = document.createElement('div'),
            amountTag = document.createElement('span'),
            wordTag = document.createElement('span'),
            innerSectionTag = document.createElement('div');

        innerSectionTag.appendChild(amountTag);
        innerSectionTag.appendChild(wordTag);
        sectionTag.appendChild(innerSectionTag);

        sectionTag.classList.add(parameters.sectionClass);
        sectionTag.classList.add(typeClass);
        amountTag.classList.add(parameters.amountClass);
        wordTag.classList.add(parameters.wordClass);

        countdown.appendChild(sectionTag);

        return {
            full: sectionTag,
            amount: amountTag,
            word: wordTag
        };
    };

    // Функция создаёт DOM элементы для отсчёта
    createElements = function (parameters, countdown) {
        if (!parameters.inline) {
            return {
                days: createCountdownElt(countdown, parameters, 'simply-days-section'),
                hours: createCountdownElt(countdown, parameters, 'simply-hours-section'),
                minutes: createCountdownElt(countdown, parameters, 'simply-minutes-section'),
                seconds: createCountdownElt(countdown, parameters, 'simply-seconds-section')
            };
        }

        var spanTag = document.createElement('span');
        spanTag.classList.add(parameters.inlineClass);
        return spanTag;
    };

    // Основная функция для обратного отсчёта
    simplyCountdown = function (elt, args) {
        var parameters = extend({
                year: 2024,  // Установлена дата на 19 октября 2024 года
                month: 10,
                day: 19,
                hours: 0,
                minutes: 0,
                seconds: 0,
                words: {
                    days: ['день', 'дня', 'дней'],
                    hours: ['час', 'часа', 'часов'],
                    minutes: ['минута', 'минуты', 'минут'],
                    seconds: ['секунда', 'секунды', 'секунд']
                },
                plural: true,
                inline: false,
                enableUtc: false,  // Локальное время
                onEnd: function () {
                    return;
                },
                refresh: 1000,
                inlineClass: 'simply-countdown-inline',
                sectionClass: 'simply-section',
                amountClass: 'simply-amount',
                wordClass: 'simply-word',
                zeroPad: false
            }, args),
            interval,
            targetDate = new Date(parameters.year, parameters.month - 1, parameters.day,
                parameters.hours, parameters.minutes, parameters.seconds),
            now,
            secondsLeft,
            days, hours, minutes, seconds,
            cd = document.querySelectorAll(elt);

        Array.prototype.forEach.call(cd, function (countdown) {
            var fullCountDown = createElements(parameters, countdown),
                refresh;

            refresh = function () {
                now = new Date();
                secondsLeft = (targetDate - now.getTime()) / 1000;

                if (secondsLeft > 0) {
                    days = parseInt(secondsLeft / 86400, 10);
                    secondsLeft = secondsLeft % 86400;

                    hours = parseInt(secondsLeft / 3600, 10);
                    secondsLeft = secondsLeft % 3600;

                    minutes = parseInt(secondsLeft / 60, 10);
                    seconds = parseInt(secondsLeft % 60, 10);
                } else {
                    days = 0;
                    hours = 0;
                    minutes = 0;
                    seconds = 0;
                    window.clearInterval(interval);
                    parameters.onEnd();
                }

                if (parameters.plural) {
                    var dayWord = getWordForm(days, parameters.words.days);
                    var hourWord = getWordForm(hours, parameters.words.hours);
                    var minuteWord = getWordForm(minutes, parameters.words.minutes);
                    var secondWord = getWordForm(seconds, parameters.words.seconds);

                    if (parameters.inline) {
                        countdown.innerHTML = days + ' ' + dayWord + ', ' + hours + ' ' + hourWord + ', ' +
                            minutes + ' ' + minuteWord + ', ' + seconds + ' ' + secondWord + '.';
                    } else {
                        fullCountDown.days.amount.textContent = (parameters.zeroPad && days.toString().length < 2 ? '0' : '') + days;
                        fullCountDown.days.word.textContent = dayWord;

                        fullCountDown.hours.amount.textContent = (parameters.zeroPad && hours.toString().length < 2 ? '0' : '') + hours;
                        fullCountDown.hours.word.textContent = hourWord;

                        fullCountDown.minutes.amount.textContent = (parameters.zeroPad && minutes.toString().length < 2 ? '0' : '') + minutes;
                        fullCountDown.minutes.word.textContent = minuteWord;

                        fullCountDown.seconds.amount.textContent = (parameters.zeroPad && seconds.toString().length < 2 ? '0' : '') + seconds;
                        fullCountDown.seconds.word.textContent = secondWord;
                    }
                }
            };

            refresh();
            interval = window.setInterval(refresh, parameters.refresh);
        });
    };

    exports.simplyCountdown = simplyCountdown;
}(window));

// Инициализация обратного отсчёта
simplyCountdown('.my-countdown', {});
