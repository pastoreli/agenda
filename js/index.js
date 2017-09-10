!function() {

  var today = moment();
  moment().format('LLLL');

  function Calendar(selector, events) {
    this.el = document.querySelector(selector);
    this.events = events;
    this.current = moment().date(1);
    this.draw();
    var current = document.querySelector('.today');
    if(current) {
      var self = this;
      window.setTimeout(function() {
        // self.openDay(current);
      }, 500);
    }
  }

  Calendar.prototype.draw = function() {
    //Create Header
    this.drawHeader();

    //Draw Month
    this.drawMonth();

    this.drawLegend();
  }

  var title_year

  Calendar.prototype.drawHeader = function() {
    var self = this;
    if(!this.header) {
      //Create the header elements
      this.header = createElement('div', 'header');
      this.header.className = 'header';

      this.title = createElement('h1');
      title_year = createElement('h1');

      var right = createElement('div', 'right');
      right.addEventListener('click', function() { self.nextMonth(); });

      var left = createElement('div', 'left');
      left.addEventListener('click', function() { self.prevMonth(); });

      //Append the Elements
      this.header.appendChild(this.title);
      this.header.appendChild(title_year); 
      this.header.appendChild(right);
      this.header.appendChild(left);
      this.el.appendChild(this.header);

    }

    this.title.innerHTML = this.current.format('MMMM');
    title_year.innerHTML = this.current.format('YYYY');


    
  }

  Calendar.prototype.drawMonth = function() {
    var self = this;
    
    this.events.forEach(function(ev) {
     ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
    });
    
    
    if(this.month) {
      this.oldMonth = this.month;
      this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
      this.oldMonth.addEventListener('webkitAnimationEnd', function() {
        self.oldMonth.parentNode.removeChild(self.oldMonth);
        self.month = createElement('div', 'month');

        var week_bar = createElement('div', 'week_bar');

        var dom = createElement('p');
        dom.innerHTML = "D";
        var seg = createElement('p');
        seg.innerHTML = "S";
        var ter = createElement('p');
        ter.innerHTML = "T";
        var qua = createElement('p');
        qua.innerHTML = "Q";
        var qui = createElement('p');
        qui.innerHTML = "Q";
        var sex = createElement('p');
        sex.innerHTML = "S";
        var sab = createElement('p');
        sab.innerHTML = "S";

        week_bar.appendChild(dom);
        week_bar.appendChild(seg);
        week_bar.appendChild(ter);
        week_bar.appendChild(qua);
        week_bar.appendChild(qui);
        week_bar.appendChild(sex);
        week_bar.appendChild(sab);

        self.month.appendChild(week_bar);
        self.backFill();
        self.currentMonth();
        self.fowardFill();
        self.el.appendChild(self.month);
        window.setTimeout(function() {
          self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
        }, 16);
      });
    } else {
        this.month = createElement('div', 'month');

        var week_bar = createElement('div', 'week_bar');
    
        var dom = createElement('p');
        dom.innerHTML = "D";
        var seg = createElement('p');
        seg.innerHTML = "S";
        var ter = createElement('p');
        ter.innerHTML = "T";
        var qua = createElement('p');
        qua.innerHTML = "Q";
        var qui = createElement('p');
        qui.innerHTML = "Q";
        var sex = createElement('p');
        sex.innerHTML = "S";
        var sab = createElement('p');
        sab.innerHTML = "S";

        week_bar.appendChild(dom);
        week_bar.appendChild(seg);
        week_bar.appendChild(ter);
        week_bar.appendChild(qua);
        week_bar.appendChild(qui);
        week_bar.appendChild(sex);
        week_bar.appendChild(sab);

        this.month.appendChild(week_bar);


        this.el.appendChild(this.month);
        this.backFill();
        this.currentMonth();
        this.fowardFill();
        this.month.className = 'month new';

    }
  }

  Calendar.prototype.backFill = function() {
    var clone = this.current.clone();
    var dayOfWeek = clone.day();

    if(!dayOfWeek) { return; }

    clone.subtract('days', dayOfWeek+1);

    for(var i = dayOfWeek; i > 0 ; i--) {
      this.drawDay(clone.add('days', 1));
    }
  }

  Calendar.prototype.fowardFill = function() {
    var clone = this.current.clone().add('months', 1).subtract('days', 1);
    var dayOfWeek = clone.day();

    if(dayOfWeek === 6) { return; }

    for(var i = dayOfWeek; i < 6 ; i++) {
      this.drawDay(clone.add('days', 1));
    }
  }

  Calendar.prototype.currentMonth = function() {
    var clone = this.current.clone();

    while(clone.month() === this.current.month()) {
      this.drawDay(clone);
      clone.add('days', 1);
    }
  }

  Calendar.prototype.getWeek = function(day) {
    if(!this.week || day.day() === 0) {
      this.week = createElement('div', 'week');
      this.month.appendChild(this.week);
    }
  }

  Calendar.prototype.drawDay = function(day) {
    var self = this;
    this.getWeek(day);

    //Outer Day
    var outer = createElement('div', this.getDayClass(day));

    outer.addEventListener('click', function() {
      self.openDay(this);
    });

    //Day Name
    // var name = createElement('div', 'day-name', day.format('ddd'));

    //Day Number
    var number = createElement('div', 'day-number', day.format('DD'));


    //Events
    var events = createElement('div', 'day-events');
    this.drawEvents(day, events);

    // outer.appendChild(name);
    outer.appendChild(number);
    outer.appendChild(events);
    this.week.appendChild(outer);
  }

  Calendar.prototype.drawEvents = function(day, element) {
    if(day.month() === this.current.month()) {
      var todaysEvents = this.events.reduce(function(memo, ev) {
        if(ev.date.isSame(day, 'day')) {
          memo.push(ev);
        }
        return memo;
      }, []);

      todaysEvents.forEach(function(ev) {
        var evSpan = createElement('span', ev.color);
        element.appendChild(evSpan);
      });
    }
  }

  Calendar.prototype.getDayClass = function(day) {
    classes = ['day'];
    if(day.month() !== this.current.month()) {
      classes.push('other');
    } else if (today.isSame(day, 'day')) {
      classes.push('today');
    }
    return classes.join(' ');
  }

  var click_equal = null;

  Calendar.prototype.openDay = function(el) {
    var details, arrow;
    var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
    
    if(dayNumber == click_equal){
        var currentOpened = document.querySelector('.details');
        currentOpened.addEventListener('webkitAnimationEnd', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('oanimationend', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('msAnimationEnd', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('animationend', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.className = 'details out';
        click_equal = null;
    }else{
        click_equal = dayNumber;
        var day = this.current.clone().date(dayNumber);

        var currentOpened = document.querySelector('.details');

        //Check to see if there is an open detais box on the current row
        if(currentOpened && currentOpened.parentNode === el.parentNode) {
          details = currentOpened;
          arrow = document.querySelector('.arrow');
        } else {
          //Close the open events on differnt week row
          //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
          if(currentOpened) {
            currentOpened.addEventListener('webkitAnimationEnd', function() {
              currentOpened.parentNode.removeChild(currentOpened);
            });
            currentOpened.addEventListener('oanimationend', function() {
              currentOpened.parentNode.removeChild(currentOpened);
            });
            currentOpened.addEventListener('msAnimationEnd', function() {
              currentOpened.parentNode.removeChild(currentOpened);
            });
            currentOpened.addEventListener('animationend', function() {
              currentOpened.parentNode.removeChild(currentOpened);
            });
            currentOpened.className = 'details out';
          }

          //Create the Details Container
          details = createElement('div', 'details in');

          //Create the arrow
          var arrow = createElement('div', 'arrow');

          //Create the event wrapper

          details.appendChild(arrow);
          
          var title_detail = createElement('h1');
          title_detail.innerHTML = "Eventos";
          details.appendChild(title_detail);
          
          el.parentNode.appendChild(details);
        }

        var todaysEvents = this.events.reduce(function(memo, ev) {
          if(ev.date.isSame(day, 'day')) {
            memo.push(ev);
          }
          return memo;
        }, []);

        this.renderEvents(todaysEvents, details);

        // alert($(".day").css("width"));
        var width = parseInt($(".day").css("width"));
        arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + ((width/2)-8) + 'px';

    }

  }

  Calendar.prototype.renderEvents = function(events, ele) {
    //Remove any events in the current details element
    var currentWrapper = ele.querySelector('.events');
    var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

    events.forEach(function(ev) {

      var feriado = feriado();

      // feriado.forEach(function(evF)){



      //     var div = createElement('div', 'event');
      //     var event_bar = createElement('div', 'event_bar');
      //     var hour_event = createElement('p', 'hour_event');
      //     var square = createElement('div', 'event-category ' + evF.color);
      //     var span = createElement('span', '', evF.eventName);

      //     hour_event.innerHTML = evF.hour;

      //     event_bar.appendChild(hour_event);
      //     event_bar.appendChild(square);
      //     event_bar.appendChild(span);
      //     div.appendChild(event_bar)
      //     wrapper.appendChild(div);

      // });

      var div = createElement('div', 'event');
      var event_bar = createElement('div', 'event_bar');
      var hour_event = createElement('p', 'hour_event');
      var square = createElement('div', 'event-category ' + ev.color);
      var span = createElement('span', '', ev.eventName);

      hour_event.innerHTML = ev.hour;

      event_bar.appendChild(hour_event);
      event_bar.appendChild(square);
      event_bar.appendChild(span);
      div.appendChild(event_bar)
      wrapper.appendChild(div);
    });

    if(!events.length) {
      var div = createElement('div', 'event empty');
      var span = createElement('span', '', 'No Events');

      div.appendChild(span);
      wrapper.appendChild(div);
    }

    if(currentWrapper) {
      currentWrapper.className = 'events out';
      currentWrapper.addEventListener('webkitAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('oanimationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('msAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('animationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
    } else {
      ele.appendChild(wrapper);
    }
  }

  Calendar.prototype.drawLegend = function() {
    var legend = createElement('div', 'legend');
    var calendars = this.events.map(function(e) {
      return e.category + '|' + e.color;
    }).reduce(function(memo, e) {
      if(memo.indexOf(e) === -1) {
        memo.push(e);
      }
      return memo;
    }, []).forEach(function(e) {
      var parts = e.split('|');
      var entry = createElement('span', 'entry ' +  parts[1], parts[0]);
      legend.appendChild(entry);
    });
    this.el.appendChild(legend);
  }

  Calendar.prototype.nextMonth = function() {
    this.current.add('months', 1);
    this.next = true;
    this.draw();
  }

  Calendar.prototype.prevMonth = function() {
    this.current.subtract('months', 1);
    this.next = false;
    this.draw();
  }

  window.Calendar = Calendar;

  function createElement(tagName, className, innerText) {
    var ele = document.createElement(tagName);
    if(className) {
      ele.className = className;
    }
    if(innerText) {
      ele.innderText = ele.textContent = innerText;
    }
    return ele;
  }
}();

!function() {
  var data = [
    { hour: '15:30', eventName: 'Pintar unha da Helo', category: 'Pé e Mão', color: 'red' },
    { hour: '18:50', eventName: 'Fazer unha do José', category: 'Pé e Mão', color: 'red' },
    { hour: '20:40', eventName: 'Cortar unha do gato da Sara', category: 'Pé e Mão', color: 'red' },
    { hour: '11:30', eventName: 'Pintar de roxo unha da Luana', category: 'Pé e Mão', color: 'red' },

    { hour: '11:00', eventName: 'Progressiva da Rute', category: 'Cabelo', color: 'blue' },
    { hour: '21:30', eventName: 'Corte da Karol', category: 'Cabelo', color: 'blue' },
    { hour: '10:10', eventName: 'Pintar cabelo da Lorem', category: 'Cabelo', color: 'blue' },
    { hour: '03:20', eventName: 'Tosar João Nechine', category: 'Cabelo', color: 'blue' },

    { hour: '16:40', eventName: 'Depilar Rose', category: 'Depilação', color: 'green' },
    { hour: '18:20', eventName: 'Depilar Renata', category: 'Depilação', color: 'green' },
    { hour: '16:30', eventName: 'Depilar Maria', category: 'Depilação', color: 'green' },
    { hour: '15:50', eventName: 'Depilar Sonia', category: 'Depilação', color: 'green' },

    { hour: '23:30', eventName: 'Maquiagem da Andreia', category: 'Maquiagem', color: 'purple' },
    { hour: '09:30', eventName: 'Maquiagem da João', category: 'Maquiagem', color: 'purple' },
    { hour: '08:30', eventName: 'Maquiagem da Luana', category: 'Maquiagem', color: 'purple' },
    { hour: '07:30', eventName: 'Maquiagem da Julia', category: 'Maquiagem', color: 'purple' },
  ];

  

  function addDate(ev) {
    
  }

  var calendar = new Calendar('#calendar', data);

}();

function feriado(){

  var feriado = [

      //janeiro
      { hour: '00:00', dia: 1, mes: 1, eventName: 'Ano novo', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 20, mes: 1, eventName: 'Dia de São Sebastião', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 25, mes: 1, eventName: 'Aniversário de São Paulo', category: 'Feriado', color: 'gray'},

      //Fevereiro
      { hour: '00:00', dia: 19, mes: 2, eventName: 'Término do Horário de Verão', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 28, mes: 2, eventName: 'Carnaval', category: 'Feriado', color: 'gray'},

      //Março
      { hour: '00:00', dia: 1, mes: 3, eventName: 'Aniversário do Rio de Janeiro', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 8, mes: 3, eventName: 'Dia Internacional da Mulher', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 12, mes: 3, eventName: 'Aniversário de Recife', category: 'Feriado', color: 'gray'},

      //Abril
      { hour: '00:00', dia: 14, mes: 4, eventName: 'Sexta-feira da Paixão', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 15, mes: 4, eventName: 'Sábado de Aleluia', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 21, mes: 4, eventName: 'Tiradentes', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 21, mes: 4, eventName: 'Aniversário de Brasília', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 22, mes: 4, eventName: 'Descobrimento do Brasil', category: 'Feriado', color: 'gray'},

      //Maio
      { hour: '00:00', dia: 1, mes: 5, eventName: 'Dia do Trabalhador', category: 'Feriado', color: 'gray'},

      //Junho
      { hour: '00:00', dia: 12, mes: 6, eventName: 'Dia dos Namorados', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 15, mes: 6, eventName: 'Corpus Christi', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 24, mes: 6, eventName: 'Dia de São João', category: 'Feriado', color: 'gray'},

      //Julho
      { hour: '00:00', dia: 9, mes: 7, eventName: 'Revolução Constitucionalista', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 20, mes: 7, eventName: 'Dia do Amigo e Internacional da Amizade', category: 'Feriado', color: 'gray'},   

      //Agosto
      { hour: '00:00', dia: 6, mes: 8, eventName: 'Dia de São Salvador do Mundo', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 15, mes: 8, eventName: 'Dia da Assunção de Nossa Senhora', category: 'Feriado', color: 'gray'},         

      //Setembro
      { hour: '00:00', dia: 7, mes: 9, eventName: 'Independência do Brasil', category: 'Feriado', color: 'gray'},

      //Outubro
      { hour: '00:00', dia: 12, mes: 10, eventName: 'Dia das Crianças', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 12, mes: 10, eventName: 'Nossa Senhora Aparecida', category: 'Feriado', color: 'gray'},      
      { hour: '00:00', dia: 15, mes: 10, eventName: 'Dia do Professor', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 15, mes: 10, eventName: 'Horário de Verão', category: 'Feriado', color: 'gray'},

      //Novembro
      { hour: '00:00', dia: 2, mes: 11, eventName: 'Finados', category: 'Feriado', color: 'gray'},
      { hour: '00:00', dia: 15, mes: 11, eventName: 'Proclamação da República', category: 'Feriado', color: 'gray'},      
      { hour: '00:00', dia: 20, mes: 11, eventName: 'Dia Nacional da Consciência Negra', category: 'Feriado', color: 'gray'},

      //Novembro
      { hour: '00:00', dia: 25, mes: 12, eventName: 'Finados', category: 'Feriado', color: 'gray'},

      //pascoa
      //dia das mães
      //dia dos pais

  ];

  return feriado;

}