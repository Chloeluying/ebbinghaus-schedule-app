import { useState, useEffect } from "react";
import { format, addDays, parseISO } from "date-fns";

export default function Home() {
  const [topics, setTopics] = useState([{ topic: "", startDate: "" }]);
  const [schedule, setSchedule] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [completed, setCompleted] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ebbinghaus-completed");
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem("ebbinghaus-completed", JSON.stringify(completed));
  }, [completed]);

  const reviewOffsets = [0, 1, 4, 7, 15];

  const handleInputChange = (index, field, value) => {
    const newTopics = [...topics];
    newTopics[index][field] = value;
    setTopics(newTopics);
  };

  const addTopic = () => {
    setTopics([...topics, { topic: "", startDate: "" }]);
  };

  const toggleComplete = (key) => {
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const generateSchedule = () => {
    const allReviews = [];
    topics.forEach(({ topic, startDate }) => {
      if (topic && startDate) {
        reviewOffsets.forEach((offset, idx) => {
          const reviewDate = format(addDays(parseISO(startDate), offset), "yyyy-MM-dd");
          allReviews.push({ date: reviewDate, topic, round: `第${idx + 1}轮` });
        });
      }
    });
    allReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
    setSchedule(allReviews);

    const todayStr = format(new Date(), "yyyy-MM-dd");
    const tasksForToday = allReviews.filter((item) => item.date === todayStr);
    setTodayTasks(tasksForToday);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>艾宾浩斯复习计划生成器</h1>

      {topics.map((item, index) => (
        <div key={index} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <input
            placeholder="复习内容（如：消化系统-病理）"
            value={item.topic}
            onChange={(e) => handleInputChange(index, "topic", e.target.value)}
            style={{ flex: 1, padding: '0.5rem' }}
          />
          <input
            type="date"
            value={item.startDate}
            onChange={(e) => handleInputChange(index, "startDate", e.target.value)}
            style={{ padding: '0.5rem' }}
          />
        </div>
      ))}

      <div style={{ marginTop: '1rem' }}>
        <button onClick={addTopic} style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>添加内容</button>
        <button onClick={generateSchedule} style={{ padding: '0.5rem 1rem' }}>生成复习计划</button>
      </div>

      {todayTasks.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>📌 今天需要复习的内容：</h2>
          {todayTasks.map((item, index) => {
            const key = `${item.date}-${item.topic}-${item.round}`;
            return (
              <div key={index} style={{ marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={!!completed[key]}
                  onChange={() => toggleComplete(key)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ textDecoration: completed[key] ? 'line-through' : 'none', color: completed[key] ? '#999' : '#000' }}>
                  📘 {item.topic} | 🔁 {item.round}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {schedule.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>📅 所有复习计划：</h2>
          {schedule.map((item, index) => {
            const key = `${item.date}-${item.topic}-${item.round}`;
            return (
              <div key={index} style={{ marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={!!completed[key]}
                  onChange={() => toggleComplete(key)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ textDecoration: completed[key] ? 'line-through' : 'none', color: completed[key] ? '#999' : '#000' }}>
                  📅 {item.date} | 📘 {item.topic} | 🔁 {item.round}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
/* Placeholder: 代码已在 Canvas 中实现，将在实际上传时替换此处 */
