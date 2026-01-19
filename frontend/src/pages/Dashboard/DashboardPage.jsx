import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { format, addDays, startOfDay, isAfter, addMonths, isSameMonth, startOfMonth} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './DashboardPage.scss';
import Navbar from '../../components/Navbar/Navbar'

const DashboardPage = () => {
  // 0 - hoje, 1 - em 7 dias, 2 - em 1 mês
  const [activeTab, setActiveTab] = useState(1);
  const [visibleDays, setVisibleDays] = useState([]);

  // título do header do calendário
  const [currentHeaderTitle, setCurrentHeaderTitle] = useState('');

  const isLoading = useRef(false); // pra controlar o loading dos dias
  const bottomLoaderRef = useRef(null);

  // data limite para carregamento: 12 meses
  const maxDateRef = useRef(addMonths(startOfDay(new Date()), 12)); 

  // refs
  const containerRef = useRef(null);

  // inicializa os dias com seus dados relevantes (data completa, numero, etc)
  // obs: atualmente renderiza todos os dias do mês atual
  useEffect(() => {
    const startOfCurrentMonth = startOfMonth(new Date());

    // coloquei 35 pra garantir que vai carregar todos os dias possíveis de um
    // mês + o pedaacinho do próx.
    const initialDays = Array.from({ length: 35 }, (_, i) => {
      const date = addDays(startOfCurrentMonth, i);
      return createDayObject(date);
    });

    setVisibleDays(initialDays);
  }, []);

  const createDayObject = (date) => ({
    dateObj: date,
    dayName: format(date, 'EEE', { locale: ptBR }),
    dayNumber: format(date, 'd'),
    fullDate: format(date, 'yyyy-MM-dd')
  });

  // carrega mais dias do futuro (conforme demanda)
  const loadMoreFuture = () => {
    if (isLoading.current) return;

    // se já passou da data limite, não carrega
    const lastCurrentDate = visibleDays[visibleDays.length - 1]?.dateObj;
    if (lastCurrentDate && isAfter(lastCurrentDate, maxDateRef.current)) {
        return; 
    }

    isLoading.current = true;
    // console.log("carregando futuro...");

    setVisibleDays(prev => {
      const lastDate = prev[prev.length - 1].dateObj;
      
      // se já chegou no limite, só retorna o que tem
      if (isAfter(lastDate, maxDateRef.current)) {
          isLoading.current = false;
          return prev;
      }

      // gera os próximos dias
      const newDays = Array.from({ length: 20 }, (_, i) => 
        createDayObject(addDays(lastDate, i + 1))
      );
      
      // delay só pra garantir que o DOM carregou tudo mesmo
      setTimeout(() => { isLoading.current = false }, 240);

      return [...prev, ...newDays];
    });
  };


  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '800px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.isIntersecting && entry.target.id === 'bottom-sentinel') {
            loadMoreFuture();
          }
        }
      });
    }, options);

    const timeoutId = setTimeout(() => {
        if (bottomLoaderRef.current) observer.observe(bottomLoaderRef.current);
    }, 240);

    return () => {
        clearTimeout(timeoutId);
        observer.disconnect();
    }
  }, [visibleDays]);

  // se o último dia visível já for maior quue o limite, esconde o sentinela
  const lastDate = visibleDays.length > 0 ? visibleDays[visibleDays.length - 1].dateObj : new Date();
  const hasReachedLimit = isAfter(lastDate, maxDateRef.current);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // mock de tarefas
  const [myTasks, setMyTasks] = useState([
    { id: 1, done: false, title: 'Estudar React', date: '2026-01-19', color: 'purple' },
    { id: 2, done: true,  title: 'Estudar Ruby on Rails', date: '2026-01-19', color: 'green' },
    { id: 3, done: false,  title: 'Estudar Calculo II', date: '2026-01-19', color: 'purple' },
    { id: 4, done: true,  title: 'Cozinhar marmitas', date: '2026-01-19', color: 'green' },
    { id: 5, done: false,  title: 'Ler 10 páginas', date: '2026-01-19', color: 'purple' },
    { id: 6, done: false,  title: 'Jogar 2 partidas de Valorant', date: '2026-01-19', color: 'yellow' },
    { id: 7, done: false,  title: 'Passear com os cachorros', date: '2026-01-19', color: 'yellow' },
    { id: 8, done: false,  title: 'Organizar os compromissos da semana', date: '2026-01-19', color: 'green' },
    { id: 9, done: false,  title: 'Academia', date: '2026-01-20', color: 'green' }, 
    { id: 10, done: false,  title: 'Projeto Focus', date: '2026-01-19', color: 'yellow' },
  ]);


  // função temporária pra ver o efeito de check (modificar depois)
  const toggleTask = (id) => {
    setMyTasks(prevTasks => {
      return prevTasks.map(task => {
        
        if (task.id === id) {
          return { ...task, done: !task.done };
        }
        
        return task;
      });
    });
  };

  // pra deixar a primeira letra maiuscula
  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    // roda só quando os dias forem carregados pela primeira vez
    if (visibleDays.length > 0 && !isLoading.current) {
      // rola até o dia atual
      const todayCard = document.querySelector('.today_day_card');
      if (todayCard) {
        todayCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [visibleDays]);

  return (
    <>
    <Navbar login={false} signup={false}/>
    <div className="dashboard_container">      
      <section className="calendar_grid" ref={containerRef}>
        <div className="spook"></div>
        
        {visibleDays.map((day, index) => {
          // console.log("Dia gerado:", day.fullDate);
          const dayTasks = myTasks.filter(task => task.date === day.fullDate);
          const isToday = day.fullDate === todayStr;

          const previousDay = visibleDays[index - 1];
          const isNewMonth = index === 0 || !isSameMonth(day.dateObj, previousDay.dateObj);
          const elements = [];

          if (isNewMonth) {
            elements.push(
              <div key={`month-${day.fullDate}`} className="month_header sticky_header">
                {format(day.dateObj, 'MMMM yyyy', { locale: ptBR })}
              </div>
            );
          }

          elements.push(
            <div key={day.fullDate} className={`day_card ${isToday? 'today_day_card' : ''}`}>
              <h3 className="day_header">
                <span className="day_number_span">{day.dayNumber}</span>
                {capitalizeFirst(day.dayName)}
              </h3>
              
              <div className="day_tasks">
                {dayTasks.length > 0 ? (dayTasks.map(task => (
                  <div key={task.id} className={`mini_task ${task.color}`}>
                    <div className="bar"></div>
                    <span>{task.title}</span>
                    <div className="dot"></div>
                  </div>
                ))) : (null)}
              </div>
            </div>
          );

          return elements;
        })}

        {!hasReachedLimit && (<div id="bottom-sentinel" ref={bottomLoaderRef} className="loading-trigger bottom"></div>)}

      </section>

      <aside className="sidebar_tasks">
        <h2>Tarefas</h2>

        <div className="tabs_container">
          <button className={activeTab === 1 ? 'active' : ''} 
            onClick={() => setActiveTab(1)}> hoje </button>
          <button className={activeTab === 2 ? 'active' : ''} 
          onClick={() => setActiveTab(2)}> em 7 dias </button>
          <button className={activeTab === 3 ? 'active' : ''} 
          onClick={() => setActiveTab(3)}> em 1 mês </button>
        </div>

        <div className="task_list">
          {myTasks.map(item => {

            const isDone = item.done;
            
            return (
              <div key={item} className="sidebar_item" onClick={() => toggleTask(item.id)}>
                <div className={`check_circle ${isDone ? 'checked' : ''}`}>
                  <i className="bi bi-check-lg"></i>
                </div>
                <span style={{opacity: isDone ? 0.6 : 1, 
                  textDecoration: isDone ? 'line-through' : 'none'}}>{item.title}</span>
                <i className="bi bi-chevron-right"></i>
              </div>
              )})}
        </div>
      </aside>

    </div>
    </>
  );
}

export default DashboardPage;