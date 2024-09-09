import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Modal,
  Input,
  Select,
  TimePicker,
  Form,
} from "antd";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "tailwindcss/tailwind.css";
import moment from "moment";
import { DeleteOutlined } from '@ant-design/icons';
import { Helmet } from "react-helmet-async";

const { Option } = Select;

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date()),
  getDay,
  locales,
});

const AgendaPage = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), color: "Normal" });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setNewEvent({ title: "", start, end: start, color: "Normal" });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent(event);
    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    if (selectedEvent) {
      setEvents(events.map(event => (event === selectedEvent ? newEvent : event)));
      setSelectedEvent(null);
    } else {
      setEvents([...events, { ...newEvent, color: newEvent.color === "Important" ? "red" : "green" }]);
    }
    setIsModalOpen(false);
    setNewEvent({ title: "", start: new Date(), end: new Date(), color: "Normal" });
  };

  const handleRemoveEvent = () => {
    setEvents(events.filter(event => event !== selectedEvent));
    setIsModalOpen(false);
    setNewEvent({ title: "", start: new Date(), end: new Date(), color: "Normal" });
    setSelectedEvent(null);
  };

  const eventPropGetter = (event) => {
    const backgroundColor = event.color === "red" ? "#FF6347" : "#32CD32";
    return { style: { backgroundColor } };
  };

  const handleTimeChange = (time, timeString, type) => {
    if (type === "start") {
      setNewEvent({
        ...newEvent,
        start: moment(selectedDate).set({ hour: time.hour(), minute: time.minute() }).toDate(),
      });
    } else {
      setNewEvent({
        ...newEvent,
        end: moment(selectedDate).set({ hour: time.hour(), minute: time.minute() }).toDate(),
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="min-h-screen bg-white p-6">
        <Typography variant="h3" component="h1" className="text-black mb-6">
          Calendar
        </Typography>
        <Card className="p-6 shadow-lg mb-6">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventPropGetter}
          />
        </Card>

        <Modal
          title={selectedEvent ? "Edit Event" : "Add Event"}
          visible={isModalOpen}
          onOk={handleAddEvent}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="back" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleAddEvent}>
              {selectedEvent ? "Save Changes" : "Add Event"}
            </Button>,
            selectedEvent && (
              <Button key="delete" type="primary" danger onClick={handleRemoveEvent} icon={<DeleteOutlined />}>
                Delete
              </Button>
            ),
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Event Title" required>
              <Input
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Start Time" required>
              <TimePicker
                format="HH:mm"
                value={moment(newEvent.start)}
                onChange={(time, timeString) => handleTimeChange(time, timeString, "start")}
              />
            </Form.Item>
            <Form.Item label="End Time" required>
              <TimePicker
                format="HH:mm"
                value={moment(newEvent.end)}
                onChange={(time, timeString) => handleTimeChange(time, timeString, "end")}
              />
            </Form.Item>
            <Form.Item label="Event Importance" required>
              <Select
                value={newEvent.color}
                onChange={(value) => setNewEvent({ ...newEvent, color: value })}
              >
                <Option value="Normal">Normal (Green)</Option>
                <Option value="Important">Important (Red)</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default AgendaPage;
//  lhamdullilah done .. .. .. 