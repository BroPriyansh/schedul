import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Eventcalendar, getJson, setOptions, Toast } from '@mobiscroll/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

setOptions({
  theme: 'ios',
  themeVariant: 'light'
});

function App() {
  const [myEvents, setMyEvents] = useState([]);
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [tempStart, setTempStart] = useState(null);
  const [tempEnd, setTempEnd] = useState(null);
  const [title, setTitle] = useState('');

  const myView = useMemo(() => ({
    schedule: { type: 'week' }
  }), []);

  const handleEventClick = useCallback((args) => {
    setToastText(args.event.title);
    setToastOpen(true);
  }, []);

  const handleEventCreate = (args) => {
    const { start, end } = args.event;
    setTempStart(start.toISOString().slice(0, 16));
    setTempEnd(end.toISOString().slice(0, 16));
    setTitle('');
    setModalOpen(true);
  };

  const addEvent = () => {
    setMyEvents([...myEvents, {
      title: title || 'Untitled Event',
      start: new Date(tempStart),
      end: new Date(tempEnd)
    }]);
    setModalOpen(false);
  };

  const handleCloseToast = useCallback(() => {
    setToastOpen(false);
  }, []);

  useEffect(() => {
    getJson(
      'https://trial.mobiscroll.com/events/?vers=5',
      (events) => {
        setMyEvents(events);
      },
      'jsonp',
    );
  }, []);

  return (
    <>
      <Eventcalendar
        clickToCreate={true}
        dragToCreate={true}
        dragToMove={true}
        dragToResize={true}
        eventDelete={true}
        data={myEvents}
        view={myView}
        onEventClick={handleEventClick}
        onEventCreate={handleEventCreate}
      />

      <Toast message={toastText} isOpen={isToastOpen} onClose={handleCloseToast} />

      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            minWidth: '300px'
          }}>
            <h2>Create Event</h2>

            <label>Title</label><br />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', marginBottom: '10px' }}
            /><br />

            <label>Start</label><br />
            <input
              type="datetime-local"
              value={tempStart}
              onChange={(e) => setTempStart(e.target.value)}
              style={{ width: '100%', marginBottom: '10px' }}
            /><br />

            <label>End</label><br />
            <input
              type="datetime-local"
              value={tempEnd}
              onChange={(e) => setTempEnd(e.target.value)}
              style={{ width: '100%', marginBottom: '20px' }}
            /><br />

            <button onClick={addEvent} style={{ marginRight: '10px' }}>Add Event</button>
            <button onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
