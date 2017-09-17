!function() {

  var today = moment();
  moment().format('LLLL');

  function Calendar() {
    this.el = document.querySelector('#calendar');
    // this.events = events;
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

    // this.drawLegend();

    // this.drawFeriados();

  }

  var title_year;
  var ano, mes, mes_diferente;

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
    mes = this.current.format('MM');
    title_year.innerHTML = this.current.format('YYYY');
    ano = this.current.format('YYYY');
    
  }

  Calendar.prototype.drawMonth = function() {
    var self = this;
    
    // this.events.forEach(function(ev) {
    //  ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
    // });
    
    
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

    mes_diferente = mes-1;

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
    var outer = createElement('div', this.getDayClass(day)+" "+day.format('DD'));

    outer.addEventListener('click', function() {
      self.openDay(this, $(this).find(".day-number").html());
    });

    if(day.format('DD') == 01)
      mes_diferente++;

    //Day Number
    var number = createElement('div', 'day-number', day.format('DD'));

    //Events
    var events = createElement('div', 'day-events');

    outer.appendChild(number);
    outer.appendChild(events);
    this.week.appendChild(outer);

    var event_day = getEventos(day.format('DD'), mes_diferente, ano);
  
    if(event_day.length > 0){
      
        event_day.forEach(function(e){

          var categoria = getCategoria(e.categoria);

          var evSpan = createElement('span', categoria.color);
          events.appendChild(evSpan);

        });

    }

    // alert(event_day);

    // console.log($(".day.23").html());

    // var

  }

  // Calendar.prototype.drawEvents = function(day, element) {
  //   if(day.month() === this.current.month()) {
  //     var todaysEvents = this.events.reduce(function(memo, ev) {
  //       if(ev.date.isSame(day, 'day')) {
  //         memo.push(ev);
  //       }
  //       return memo;
  //     }, []);

  //     todaysEvents.forEach(function(ev) {
  //       var evSpan = createElement('span', ev.color);
  //       element.appendChild(evSpan);
  //     });
  //   }
  // }

  Calendar.prototype.getDayClass = function(day) {
    classes = ['day'];
    if(day.month() !== this.current.month()) {
      classes.push('other');
    } else if (today.isSame(day, 'day')) {
      classes.push('today');
    }else{
      classes.push('this');
    }
    return classes.join(' ');
  }

  var click_equal = null;

  Calendar.prototype.openDay = function(el, day_clicked) {
    
    if(click_equal != el){

      click_equal = el;

      $("#itens_evento").html("");

      var event_day

      if($(el).find(".day-number").css("color") == "rgb(195, 195, 195)"){

        var mes_send = 0;

        if(day_clicked > 15){
          mes_send = parseInt(mes)-1;
        }else{
          mes_send = parseInt(mes)+1;
        }
        
        event_day = getEventos(day_clicked, mes_send, ano);

      }else{

        event_day = getEventos(day_clicked, mes, ano);

      }

      if(event_day.length > 0){

          event_day.forEach(function(e){

              var categoria = getCategoria(e.categoria);

              var barra_evento = createElement('div', 'barra_evento');
              var hour_evento = createElement('p', 'hour_event', e.hour);
              var square = createElement('div', 'event-category ' + categoria.color);
              var descricao_evento = createElement('p', 'descricao_evento', e.descricao);

              barra_evento.appendChild(hour_evento);
              barra_evento.appendChild(square);
              barra_evento.appendChild(descricao_evento);
              $("#itens_evento").append(barra_evento);

          });

        }

        $("#cabecalho_evento h1").html(day_clicked);
        $("#calendar").css("height", "60%");

    }else{
         click_equal = null;
         $("#calendar").css("height", "100%");
    }

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

var eventos;

//eventos do mes
function criarEventos(){
  eventos = [

    { hour: '15:30', dia: 9, mes: 9, Ano: 2017, descricao: 'Pintar unha da Helo', categoria: 0 },
    { hour: '18:50', dia: 9, mes: 9, Ano: 2017, descricao: 'Fazer unha do José', categoria: 0 },
    { hour: '20:40', dia: 9, mes: 9, Ano: 2017, descricao: 'Cortar unha do gato da Sara', categoria: 0 },
    { hour: '11:30', dia: 31, mes: 8, Ano: 2017, descricao: 'Pintar de roxo unha da Luana', categoria: 0 },

    { hour: '11:00', dia: 5, mes: 5, Ano: 2017, descricao: 'Progressiva da Rute',  categoria: 1 },
    { hour: '21:30', dia: 6, mes: 6, Ano: 2017, descricao: 'Corte da Karol',  categoria: 1 },
    { hour: '10:10', dia: 7, mes: 7, Ano: 2017, descricao: 'Pintar cabelo da Lorem',  categoria: 1 },
    { hour: '03:20', dia: 8, mes: 8, Ano: 2017, descricao: 'Tosar João Nechine',  categoria: 1 },

    { hour: '16:40', dia: 9,  mes: 9,  Ano: 2017, descricao: 'Depilar Rose',  categoria: 2 },
    { hour: '18:20', dia: 10, mes: 10, Ano: 2017, descricao: 'Depilar Renata',  categoria: 2 },
    { hour: '16:30', dia: 11, mes: 11, Ano: 2017, descricao: 'Depilar Maria',  categoria: 2 },
    { hour: '15:50', dia: 12, mes: 12, Ano: 2017, descricao: 'Depilar Sonia',  categoria: 2 },

    { hour: '23:30', dia: 13, mes: 1, Ano: 2017, descricao: 'Maquiagem da Andreia',  categoria: 3 },
    { hour: '09:30', dia: 14, mes: 2, Ano: 2017, descricao: 'Maquiagem da João',  categoria: 3 },
    { hour: '08:30', dia: 15, mes: 3, Ano: 2017, descricao: 'Maquiagem da Luana',  categoria: 3 },
    { hour: '07:30', dia: 16, mes: 4, Ano: 2017, descricao: 'Maquiagem da Julia',  categoria: 3 },

     //janeiro
    { hour: '00:00', dia: 1, mes: 1, descricao: 'Ano novo', categoria: 7},
    { hour: '00:00', dia: 20, mes: 1, descricao: 'Dia de São Sebastião', categoria: 7},
    { hour: '00:00', dia: 25, mes: 1, descricao: 'Aniversário de São Paulo', categoria: 7},

    //Fevereiro
    { hour: '00:00', dia: 19, mes: 2, descricao: 'Término do Horário de Verão', categoria: 7},
    { hour: '00:00', dia: 28, mes: 2, descricao: 'Carnaval', categoria: 7},

     //Março
    { hour: '00:00', dia: 1, mes: 3, descricao: 'Aniversário do Rio de Janeiro', categoria: 7},
    { hour: '00:00', dia: 8, mes: 3, descricao: 'Dia Internacional da Mulher', categoria: 7},
    { hour: '00:00', dia: 12, mes: 3, descricao: 'Aniversário de Recife', categoria: 7},

    //Abril
    { hour: '00:00', dia: 14, mes: 4, descricao: 'Sexta-feira da Paixão', categoria: 7},
    { hour: '00:00', dia: 15, mes: 4, descricao: 'Sábado de Aleluia', categoria: 7},
    { hour: '00:00', dia: 21, mes: 4, descricao: 'Tiradentes', categoria: 7},
    { hour: '00:00', dia: 21, mes: 4, descricao: 'Aniversário de Brasília', categoria: 7},
    { hour: '00:00', dia: 22, mes: 4, descricao: 'Descobrimento do Brasil', categoria: 7},

    //Maio
    { hour: '00:00', dia: 1, mes: 5, descricao: 'Dia do Trabalhador', categoria: 7},

    //Junho
    { hour: '00:00', dia: 12, mes: 6, descricao: 'Dia dos Namorados', categoria: 7},
    { hour: '00:00', dia: 15, mes: 6, descricao: 'Corpus Christi', categoria: 7},
    { hour: '00:00', dia: 24, mes: 6, descricao: 'Dia de São João', categoria: 7},

    //Julho
    { hour: '00:00', dia: 9, mes: 7, descricao: 'Revolução Constitucionalista', categoria: 7},
    { hour: '00:00', dia: 20, mes: 7, descricao: 'Dia do Amigo e Internacional da Amizade', categoria: 7},   

    //Agosto
    { hour: '00:00', dia: 6, mes: 8, descricao: 'Dia de São Salvador do Mundo', categoria: 7},
    { hour: '00:00', dia: 15, mes: 8, descricao: 'Dia da Assunção de Nossa Senhora', categoria: 7},         

    //Setembro
    { hour: '00:00', dia: 7, mes: 9, descricao: 'Independência do Brasil', categoria: 7},

    //Outubro
    { hour: '00:00', dia: 12, mes: 10, descricao: 'Nossa Senhora Aparecida', categoria: 7},      
    { hour: '00:00', dia: 15, mes: 10, descricao: 'Dia do Professor', categoria: 7},
    { hour: '00:00', dia: 15, mes: 10, descricao: 'Horário de Verão', categoria: 7},

    //Novembro
    { hour: '00:00', dia: 2, mes: 11, descricao: 'Finados', categoria: 7},
    { hour: '00:00', dia: 15, mes: 11, descricao: 'Proclamação da República', categoria: 7},      
    { hour: '00:00', dia: 20, mes: 11, descricao: 'Dia Nacional da Consciência Negra', categoria: 7},

    //Dezembro
    { hour: '00:00', dia: 25, mes: 12, descricao: 'Natal', categoria: 7}

  ];

}

//faz as etiquetas de evento no dia
function getEventos(dia, mes, ano){

    var event_day = new Array();

    var cont = 0;

    eventos.forEach(function(e) {

      if(e.dia == dia && e.mes == mes){
        if(e.ano == ano && e.categoria < 7){
          event_day[cont] = e;
          cont++;
        }else{
          event_day[cont] = e;
          cont++;
      }

      // console.log(e.descricao);

    }

  });

    // for(var i=0; i<eventos.length; i++){

    //   // alert(eventos[i]);

    //   if(eventos[i].dia == dia && eventos[i].mes == mes)
    //     if(eventos[i].ano == ano && eventos[i].categoria < 7){
    //       event_day[cont] = eventos[i];
    //       cont++;
    //     }else{
    //       event_day[cont] = eventos[i];
    //       cont++;
    //     }
    // }

    return event_day;

}

function getCategoria(index){

   var legendas = [

    {categoria: 'Cabelo', color: 'red'},
    {categoria: 'Pé e Mão', color: 'blue'},
    {categoria: 'Depilação', color: 'green'},
    {categoria: 'Maquiagem', color: 'purple'},
    {categoria: 'Estética', color: 'orange'},
    {categoria: 'Sombrancelha', color: 'yellow'},
    {categoria: 'Pacote', color: 'greenwater'},
    {categoria: 'Feriado', color: 'gray'}

  ];

  return legendas[index];


}

!function(){
     criarEventos(); 
   var calendar = new Calendar();
}();