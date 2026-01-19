import React, { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './DashboardPage.scss';
import Navbar from '../../components/Navbar/Navbar'

const DashboardPage = () => {
  // 0 - hoje, 1 - em 7 dias, 2 - em 1 mês
  const [activeTab, setActiveTab] = useState(1);

  const qtDaysToRender = 12;

  const today = format(new Date(), 'yyyy-MM-dd');

  console.log("data meu pc:" + today);

  const calendarDays = Array.from({ length: qtDaysToRender }, (_, index) => {
    const currentDay = addDays(today,index);

    return {
      dateObj: currentDay,
      dayName: format(currentDay, 'EEE', {locale: ptBR}),
      dayNumber: format(currentDay, 'd'),
      fullDate: format(currentDay, 'yyyy-MM-dd')
    }
  });

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // mock de tarefas
  const myTasks = [
    { id: 1, title: 'Estudar React', date: '2026-01-19', color: 'purple' },
    { id: 2, title: 'Estudar Ruby on Rails', date: '2026-01-19', color: 'green' },
    { id: 3, title: 'Estudar Calculo II', date: '2026-01-19', color: 'purple' },
    { id: 4, title: 'Cozinhar marmitas', date: '2026-01-19', color: 'green' },
    { id: 5, title: 'Ler 10 páginas', date: '2026-01-19', color: 'purple' },
    { id: 6, title: 'Jogar 2 partidas de Valorant', date: '2026-01-19', color: 'yellow' },
    { id: 7, title: 'Passear com os cachorros', date: '2026-01-19', color: 'yellow' },
    { id: 8, title: 'Organizar os compromissos da semana', date: '2026-01-19', color: 'green' },
    { id: 9, title: 'Academia', date: '2026-01-20', color: 'green' }, 
    { id: 10, title: 'Projeto Focus', date: '2026-01-19', color: 'yellow' },
  ];

  return (
    <>
    <Navbar login={false} signup={false}/>
    <div className="dashboard_container">
      <section className="calendar_grid">
        {calendarDays.map((day, index) => {
          console.log("Dia gerado:", day.fullDate);
          const dayTasks = myTasks.filter(task => task.date === day.fullDate);
          const isToday = index == 0;
          
          return (
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
        })}
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
          {[1, 2, 3, 4, 5].map(item => (
            <div key={item} className="sidebar-item">
              <div className="check_circle"></div>
              <span>Nome da tarefa</span>
              <i class="bi bi-chevron-right"></i>
            </div>
          ))}
        </div>
      </aside>

    </div>
    </>
  );
}

export default DashboardPage;