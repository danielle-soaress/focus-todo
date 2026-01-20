import React, { useState, useEffect, useRef} from 'react';
import {format, addDays, startOfDay, isAfter, addMonths, isSameMonth, startOfMonth} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './DashboardPage.scss';
import Navbar from '../../components/Navbar/Navbar'
import TaskDialog from '../../components/TaskDialog/TaskDialog';
import { getAllTasks, createTask, updateTask} from '../../services/taskService';
import { getAllCategories } from '../../services/categoryService';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadTasks = async () => {
    const [data, error] = await getAllTasks();
    if (data) setTasks(data);
    if (error != null) error.status == 401 ? handleSignOutSubmit() : null;
  };

  const loadCategories = async () => {
    const [data, error] = await getAllCategories();
    if (data) setCategories(data);
    if (error != null) error.status == 401 ? handleSignOutSubmit() : null;
  };

  const handleSignOutSubmit = async () => {
    await signOutApi();
    localStorage.removeItem('user_token');
    navigate('/login');
  };

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  /* CALENDAR & SIDEBAR */
  
  // 0 - hoje, 1 - em 7 dias, 2 - em 1 mês
  const [activeTab, setActiveTab] = useState(1);

  // dias carregados para visualização
  const [visibleDays, setVisibleDays] = useState([]);

  const isLoading = useRef(false); // pra controlar o loading dos dias
  const bottomLoaderRef = useRef(null);

  // data limite para carregamento: 12 meses
  const maxDateRef = useRef(addMonths(startOfDay(new Date()), 12)); 
  // referência do calendar grid
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

  /* TASKS */

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isViewMode, setViewMode] = useState(false);

  const openCreateModal = () => {
    setSelectedTask(null);
    setViewMode(false);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setViewMode(false);
    setModalOpen(true);
  };

  const openViewModal = (task) => {
    setSelectedTask(task);
    setViewMode(true);
    setModalOpen(true);
  };

  const handleSaveTask = async (formData) => {
    const payload = { task: formData };

    if (selectedTask) {
      const [updated, error] = await updateTask(selectedTask.id, payload);
      if (updated) {
        setTasks(tasks.map(t => t.id === updated.id ? updated : t));
        setModalOpen(false);
      }
      loadTasks();
    } else {
      const [created, error] = await createTask(payload);
      if (created) {
        setTasks([...tasks, created]);
        setModalOpen(false);
      }
    }
  };

  const toggleTask = async (id) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    const newStatus = !taskToToggle.done;

    setTasks(prevTasks => {
        return prevTasks.map(task => {
            if (task.id === id) {
                return { ...task, done: newStatus };
            }
            return task;
        });
    });

    const [data, error] = await updateTask(id, {task: { status: newStatus} });

    if (error) {
        setTasks(prevTasks => prevTasks.map(task => 
            task.id === id ? { ...task, done: !newStatus } : task
        ));
        alert("Não foi possível salvar a alteração.");
    }
  };

  /* CATEGORIES */

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredGlobalTasks = tasks.filter(task => {
    if (selectedCategory === 'all') return true;

    return String(task.category_id) === String(selectedCategory);
  });

  const sidebarTasks = filteredGlobalTasks.filter(task => {
    if (!task.due_date) return false;

    const taskDateStr = task.due_date.toString().split('T')[0];
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    if (activeTab === 1) { // hoje
      return taskDateStr <= todayStr;
    }
    
    if (activeTab === 2) { // em 1 semana
      const nextWeekStr = format(addDays(today, 7), 'yyyy-MM-dd');
      return taskDateStr >= todayStr && taskDateStr <= nextWeekStr;
    }

    if (activeTab === 3) {// em 1 mês
      const nextMonthStr = format(addDays(today, 30), 'yyyy-MM-dd');
      return taskDateStr >= todayStr && taskDateStr <= nextMonthStr;
    }
    
    return true;
  });

  return (
    <>
    <Navbar login={false} signup={false} logged={true}/>
    <div className="dashboard_container">      
      <section className="calendar_grid" ref={containerRef}>
        <div className="spook"></div>
        
        {visibleDays.map((day, index) => {
          // console.log("Dia gerado:", day.fullDate);
          const dayTasks = tasks.filter(task => {
              if (!task.due_date) return false;
              const taskDateOnly = task.due_date.toString().split('T')[0];
              return taskDateOnly === day.fullDate;
          });

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
                {dayTasks.length > 0 ? (dayTasks.map(task => {
                  const category = categories.find(c => c.id === task.category_id);
                  const categoryColor = category ? "#" + category.color : '#ccc';

                  console.log(categories);

                  return (<div key={task.id} className={`mini_task`}>
                    <div className="bar" style={{backgroundColor: categoryColor}}></div>
                    <span>{task.title}</span>
                    <div className={`dot ${"priority" + task.priority}`} ></div>
                  </div>);
                })) : (null)}
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
        
        <div className="filters_bar" style={{ padding: '10px 20px', background: '#f8f9fa' }}>
          <label>Filtrar por Lista: </label>
          <select value={selectedCategory}  onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '5px', borderRadius: '4px' }}>
            <option value="all">Todas as Listas</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="task_list">
          
          {sidebarTasks.length > 0 ? sidebarTasks.map(item => {
            const isDone = item.done;
            
            return (
              <div key={item} className="sidebar_item" >
                <div className={`check_circle ${isDone ? 'checked' : ''}`} onClick={() => toggleTask(item.id)}>
                  <i className="bi bi-check-lg"></i>
                </div>
                <span style={{opacity: isDone ? 0.6 : 1, 
                  textDecoration: isDone ? 'line-through' : 'none'}}>{item.title}</span>
                <i className="bi bi-chevron-right" onClick={() => openEditModal(item)}></i>
              </div>
              );}) : (
                <p >Nenhuma tarefa para este período.</p>
              )}
        </div>

        <button onClick={openCreateModal}>Adicionar task</button>
      </aside>
      <TaskDialog isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveTask}
                  taskToEdit={selectedTask} isViewMode={isViewMode}/>

    </div>
    </>
  );
}

export default DashboardPage;