import React, { useState, useEffect } from 'react';
import { Calendar, X, Plus, Trash2 } from 'lucide-react';

const ThaiCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [leaveData, setLeaveData] = useState({});
  const [saturdayWork, setSaturdayWork] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [inputName, setInputName] = useState('');
  const [inputType, setInputType] = useState('');
  const [inputNote, setInputNote] = useState('');
  const [people, setPeople] = useState(['สมชาย', 'สมหญิง', 'สมศรี']);
  const [newPerson, setNewPerson] = useState('');
  const [showPeopleManager, setShowPeopleManager] = useState(false);

  // โหลดข้อมูลจาก localStorage ตอนเริ่มต้น
  useEffect(() => {
    try {
      const savedLeave = localStorage.getItem('calendarLeave');
      const savedSaturday = localStorage.getItem('calendarSaturday');
      const savedPeople = localStorage.getItem('calendarPeople');
      
      if (savedLeave) setLeaveData(JSON.parse(savedLeave));
      if (savedSaturday) setSaturdayWork(JSON.parse(savedSaturday));
      if (savedPeople) setPeople(JSON.parse(savedPeople));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // บันทึกข้อมูลอัตโนมัติ
  useEffect(() => {
    localStorage.setItem('calendarLeave', JSON.stringify(leaveData));
  }, [leaveData]);

  useEffect(() => {
    localStorage.setItem('calendarSaturday', JSON.stringify(saturdayWork));
  }, [saturdayWork]);

  useEffect(() => {
    localStorage.setItem('calendarPeople', JSON.stringify(people));
  }, [people]);

  const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day, dayOfWeek) => {
    if (!day) return;
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    setSelectedDate({ day, dayOfWeek, dateKey });
    setInputName('');
    setInputType('');
    setInputNote('');
  };

  const handleSave = () => {
    if (!inputName.trim() || !selectedDate) return;
    
    const entryData = {
      name: inputName.trim(),
      note: inputNote.trim()
    };
    
    if (inputType === 'leave') {
      const currentLeave = leaveData[selectedDate.dateKey] || [];
      const updatedLeave = Array.isArray(currentLeave) ? currentLeave : [currentLeave];
      if (!updatedLeave.some(entry => entry.name === inputName.trim())) {
        setLeaveData({ ...leaveData, [selectedDate.dateKey]: [...updatedLeave, entryData] });
      }
    } else if (inputType === 'saturday') {
      const currentSaturday = saturdayWork[selectedDate.dateKey] || [];
      const updatedSaturday = Array.isArray(currentSaturday) ? currentSaturday : [currentSaturday];
      if (!updatedSaturday.some(entry => entry.name === inputName.trim())) {
        setSaturdayWork({ ...saturdayWork, [selectedDate.dateKey]: [...updatedSaturday, entryData] });
      }
    }
    
    setInputName('');
    setInputNote('');
    setInputType('');
  };

  const handleDeletePerson = (dateKey, personName, type) => {
    if (type === 'leave') {
      const currentLeave = leaveData[dateKey] || [];
      const updatedLeave = Array.isArray(currentLeave) 
        ? currentLeave.filter(entry => entry.name !== personName)
        : [];
      if (updatedLeave.length > 0) {
        setLeaveData({ ...leaveData, [dateKey]: updatedLeave });
      } else {
        const newLeaveData = { ...leaveData };
        delete newLeaveData[dateKey];
        setLeaveData(newLeaveData);
      }
    } else if (type === 'saturday') {
      const currentSaturday = saturdayWork[dateKey] || [];
      const updatedSaturday = Array.isArray(currentSaturday)
        ? currentSaturday.filter(entry => entry.name !== personName)
        : [];
      if (updatedSaturday.length > 0) {
        setSaturdayWork({ ...saturdayWork, [dateKey]: updatedSaturday });
      } else {
        const newSaturdayWork = { ...saturdayWork };
        delete newSaturdayWork[dateKey];
        setSaturdayWork(newSaturdayWork);
      }
    }
  };

  const addPerson = () => {
    if (newPerson.trim() && !people.includes(newPerson.trim())) {
      setPeople([...people, newPerson.trim()]);
      setNewPerson('');
    }
  };

  const removePerson = (personToRemove) => {
    setPeople(people.filter(p => p !== personToRemove));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];
    
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    const remainingDays = 35 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  };

  const weeks = renderCalendar();
  const { year, month } = getDaysInMonth(currentDate);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">
            {thaiMonths[month]} {year + 543}
          </h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowPeopleManager(!showPeopleManager)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center gap-2"
          >
            <Plus size={20} />
            จัดการคน
          </button>
          <button
            onClick={handlePrevMonth}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            ← เดือนก่อน
          </button>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            เดือนถัดไป →
          </button>
        </div>
      </div>

      {showPeopleManager && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
          <h3 className="text-lg font-bold mb-3">จัดการรายชื่อคน</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newPerson}
              onChange={(e) => setNewPerson(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPerson()}
              placeholder="ชื่อคนใหม่"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={addPerson}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              เพิ่ม
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {people.map((person, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-gray-300">
                <span>{person}</span>
                <button
                  onClick={() => removePerson(person)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-7 bg-gray-200">
          {thaiDays.map((day, idx) => (
            <div
              key={idx}
              className={`py-3 text-center font-bold text-sm ${
                idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 border-t border-gray-300">
            {week.map((dayObj, dayIdx) => {
              const dateKey = `${year}-${month}-${dayObj.day}`;
              const leaveList = leaveData[dateKey] || [];
              const saturdayList = saturdayWork[dateKey] || [];
              const hasLeave = Array.isArray(leaveList) ? leaveList.length > 0 : !!leaveList;
              const hasSaturday = Array.isArray(saturdayList) ? saturdayList.length > 0 : !!saturdayList;
              const isSaturdayDay = dayIdx === 6;
              const isSundayDay = dayIdx === 0;

              const leaveArray = Array.isArray(leaveList) ? leaveList : (leaveList ? [leaveList] : []);
              const saturdayArray = Array.isArray(saturdayList) ? saturdayList : (saturdayList ? [saturdayList] : []);

              return (
                <div
                  key={dayIdx}
                  onClick={() => dayObj.isCurrentMonth && handleDateClick(dayObj.day, dayIdx)}
                  className={`min-h-[100px] border-r border-gray-300 p-2 cursor-pointer transition ${
                    !dayObj.isCurrentMonth
                      ? 'bg-gray-100 text-gray-400'
                      : hasLeave
                      ? 'bg-gray-400 text-white hover:bg-gray-500'
                      : hasSaturday && isSaturdayDay
                      ? 'bg-green-400 text-white hover:bg-green-500'
                      : isSundayDay
                      ? 'bg-red-50 hover:bg-red-100'
                      : isSaturdayDay
                      ? 'bg-blue-50 hover:bg-blue-100'
                      : 'bg-white hover:bg-gray-50'
                  } ${dayIdx === 6 ? 'border-r-0' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-semibold ${
                      !dayObj.isCurrentMonth
                        ? 'text-gray-400'
                        : isSundayDay
                        ? 'text-red-600'
                        : isSaturdayDay
                        ? 'text-blue-600'
                        : 'text-gray-700'
                    }`}>
                      {dayObj.day}
                    </span>
                  </div>
                  {leaveArray.map((entry, idx) => {
                    const name = typeof entry === 'string' ? entry : entry.name;
                    const note = typeof entry === 'object' ? entry.note : '';
                    return (
                      <div key={idx} className="text-xs font-medium mb-1">
                        <div className="flex items-center justify-between">
                          <span>ลา: {name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePerson(dateKey, name, 'leave');
                            }}
                            className="text-red-600 hover:text-red-800 ml-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        {note && <div className="text-xs text-gray-200 italic">({note})</div>}
                      </div>
                    );
                  })}
                  {saturdayArray.map((entry, idx) => {
                    const name = typeof entry === 'string' ? entry : entry.name;
                    const note = typeof entry === 'object' ? entry.note : '';
                    return (
                      isSaturdayDay && (
                        <div key={idx} className="text-xs font-medium mb-1">
                          <div className="flex items-center justify-between">
                            <span>ทำงาน: {name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePerson(dateKey, name, 'saturday');
                              }}
                              className="text-red-600 hover:text-red-800 ml-1"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          {note && <div className="text-xs text-gray-200 italic">({note})</div>}
                        </div>
                      )
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              เพิ่มข้อมูล - วันที่ {selectedDate.day} {thaiMonths[month]}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">ประเภท:</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="leave"
                    checked={inputType === 'leave'}
                    onChange={(e) => setInputType(e.target.value)}
                    className="mr-2"
                  />
                  วันลา
                </label>
                {selectedDate.dayOfWeek === 6 && (
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="saturday"
                      checked={inputType === 'saturday'}
                      onChange={(e) => setInputType(e.target.value)}
                      className="mr-2"
                    />
                    ทำงานวันเสาร์
                  </label>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">เลือกคน:</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {people.map((person, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputName(person)}
                    className={`px-3 py-2 rounded border transition ${
                      inputName === person
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {person}
                  </button>
                ))}
              </div>
              <label className="block text-sm font-medium mb-2">หรือกรอกชื่อเอง:</label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอกชื่อ"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">หมายเหตุ (ถ้ามี):</label>
              <input
                type="text"
                value={inputNote}
                onChange={(e) => setInputNote(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="เช่น ลากิจ, ลาป่วย, OT"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSelectedDate(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                ปิด
              </button>
              <button
                onClick={handleSave}
                disabled={!inputName.trim() || !inputType}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                เพิ่ม
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-6 justify-center text-sm flex-wrap pb-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
          <span>วันลา</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-400 rounded"></div>
          <span>ทำงานวันเสาร์</span>
        </div>
      </div>
    </div>
  );
};

export default ThaiCalendar;