import React, { useState, useRef, useEffect } from 'react';
import './CreateTravelPlan.scss';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AddIcon from '@mui/icons-material/Add';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./DatePickerStyles.scss";
import { Link } from 'react-router-dom';

const CreateTravelPlan = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showInviteTripmates, setShowInviteTripmates] = useState(false);
  const [showInviteTripmatesIcon, setShowInviteTripmatesIcon] = useState(true);
  const dateInputRef = useRef(null);
  const datePickerRef = useRef(null);
  const inviteFriendRef = useRef(null);
  const whereToInputRef = useRef(null);
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleDateInputClick = () => {
    setShowDatePicker(true);
  };

  const handleInviteTripmates = () => {
    setShowInviteTripmates(true);
    setShowInviteTripmatesIcon(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateInputRef.current &&
        !dateInputRef.current.contains(event.target) &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }

      if (
        inviteFriendRef.current &&
        !inviteFriendRef.current.contains(event.target)
      ) {
        setShowInviteTripmates(false);
        setShowInviteTripmatesIcon(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(whereToInputRef.current);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          // Handle the selected place
          setLocation(place.formatted_address);
          setLat(place.geometry.location.lat());
          setLng(place.geometry.location.lng());
        }
      });
    }
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStartPlanning = () => {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    // Construct the URL with query parameters
    const queryParams = new URLSearchParams();
    if (formattedStartDate) queryParams.append('startDate', formattedStartDate);
    if (formattedEndDate) queryParams.append('endDate', formattedEndDate);
    if (location) queryParams.append('location', location);
    if (lat) queryParams.append('lat', lat);
    if (lng) queryParams.append('lng', lng);

    // Navigate to the next page with parameters
    window.location.href = `/travelplan/invite?${queryParams.toString()}`;
  };

  return (
    <div className='createTravelPlan'>
      <div className="container">
        <h1>Plan a new trip</h1>
        <div className="where-to">
          <span>Where to?</span>
          <input 
            type="text" 
            placeholder="Enter a city or destination" 
            ref={whereToInputRef}
          />
        </div>
        <div className="dates">
          <span className='date-heading'>Dates (optional)</span>
          <div className="select-date">
            <div className="date-inputs" ref={dateInputRef}>
              <div className="date-input-wrapper" onClick={handleDateInputClick}>
                <CalendarMonthOutlinedIcon sx={{ color: '#747474', fontSize: 17 }} />
                <input
                  type="text"
                  value={startDate ? formatDate(startDate) : ''}
                  placeholder="Start date"
                  readOnly
                  className="date-input"
                />
              </div>
              <div className="date-input-wrapper" onClick={handleDateInputClick}>
                <CalendarMonthOutlinedIcon sx={{ color: '#747474', fontSize: 17 }} />
                <input
                  type="text"
                  value={endDate ? formatDate(endDate) : ''}
                  placeholder="End date"
                  readOnly
                  className="date-input"
                />
              </div>
            </div>

            {showDatePicker && (
              <div ref={datePickerRef}>
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  monthsShown={2}
                  minDate={new Date()}
                  className="date-picker"
                />
              </div>
            )}
          </div>
        </div>
        {showInviteTripmatesIcon && (<div className="invite-trip" onClick={handleInviteTripmates}>
          <AddIcon sx={{ color: '#747474', fontSize: 18 }} />
          <span>Invite tripmates</span>
        </div>)}
        {showInviteTripmates && (<div className="where-to" ref={inviteFriendRef}>
          <span>Invite tripmates</span>
          <input type="text" placeholder="Enter an email address" />
        </div>)}
        <div className="btn-container">
          <button onClick={handleStartPlanning}>
            Start Planning
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTravelPlan;
