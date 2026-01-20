export const DayCard = React.memo(({ day, dayTasks, isToday, isNewMonth, categories }) => {
  return (
    <>
      {isNewMonth && (
        <div key={`month-${day.fullDate}`} className="month_header sticky_header">
          {format(day.dateObj, 'MMMM yyyy', { locale: ptBR })}
        </div>
      )}

      <div className={`day_card ${isToday ? 'today_day_card' : ''}`}>
        <h3 className="day_header">
          <span className="day_number_span">{day.dayNumber}</span>
          {day.dayName.charAt(0).toUpperCase() + day.dayName.slice(1)}
        </h3>

        <div className="day_tasks">
          {dayTasks.length > 0 ? (dayTasks.map(task => {
            const category = categories.find(c => c.id === task.category_id);
            const categoryColor = category ? "#" + category.color : '#ccc';

            return (
              <div key={task.id} className={`mini_task`}>
                <div className="bar" style={{ backgroundColor: categoryColor }}></div>
                <span>{task.title}</span>
                <div className={`dot priority${task.priority}`} style={{backgroundColor: categoryColor}}></div>
              </div>
            );
          })) : (null)}
        </div>
      </div>
    </>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.day.fullDate === nextProps.day.fullDate &&
    prevProps.dayTasks.length === nextProps.dayTasks.length &&
    prevProps.isToday === nextProps.isToday &&
    prevProps.categories === nextProps.categories
  );
});